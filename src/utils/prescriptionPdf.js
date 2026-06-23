import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const TEMPLATE_URL = '/prescription-letterhead.pdf';
const BLUE = rgb(0.06, 0.2, 0.5);
const FOOTER_BLUE = rgb(15 / 255, 52 / 255, 146 / 255);
const TEXT = rgb(0.08, 0.12, 0.2);
const MUTED = rgb(0.36, 0.42, 0.5);

export function normalizeWhatsAppNumber(value) {
  const compact = String(value || '').replace(/[\s()-]/g, '');

  if (/^03\d{9}$/.test(compact)) return `92${compact.slice(1)}`;
  if (/^\+923\d{9}$/.test(compact)) return compact.slice(1);
  if (/^923\d{9}$/.test(compact)) return compact;

  throw new Error('The patient phone number is not a valid Pakistani mobile number.');
}

export function formatPrescriptionDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00+05:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  }).format(date);
}

export function makePrescriptionFilename(patientName, date) {
  const safeName = String(patientName || 'Patient')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48) || 'Patient';
  return `Prescription_${safeName}_${date || 'consultation'}.pdf`;
}

function splitLongWord(word, font, size, maxWidth) {
  const chunks = [];
  let current = '';

  for (const character of word) {
    const candidate = `${current}${character}`;
    if (current && font.widthOfTextAtSize(candidate, size) > maxWidth) {
      chunks.push(current);
      current = character;
    } else {
      current = candidate;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

function wrapText(text, font, size, maxWidth) {
  const lines = [];
  const paragraphs = String(text || '').replace(/\r/g, '').split('\n');

  paragraphs.forEach((paragraph, paragraphIndex) => {
    if (!paragraph.trim()) {
      lines.push('');
      return;
    }

    const words = paragraph.trim().split(/\s+/).flatMap(word => (
      font.widthOfTextAtSize(word, size) > maxWidth
        ? splitLongWord(word, font, size, maxWidth)
        : [word]
    ));
    let current = '';

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (current && font.widthOfTextAtSize(candidate, size) > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }

    if (current) lines.push(current);
    if (paragraphIndex < paragraphs.length - 1 && paragraphs[paragraphIndex + 1].trim()) {
      lines.push('');
    }
  });

  return lines;
}

function drawFooterEmail(page, regularFont) {
  // The supplied letterhead contains an older address. Replace only that line
  // in generated prescriptions while leaving the source template untouched.
  page.drawRectangle({ x: 239, y: 22, width: 187, height: 18, color: FOOTER_BLUE });
  page.drawText('Email: contact@javedaltaf.com', {
    x: 246,
    y: 28,
    size: 6.2,
    font: regularFont,
    color: rgb(1, 1, 1),
  });
}

export async function generatePrescriptionPdf({
  patientName,
  appointmentDate,
  medicines,
  advice = '',
  templateBytes,
}) {
  if (!patientName?.trim()) throw new Error('Patient name is required.');
  if (!medicines?.trim()) throw new Error('Please enter the prescribed medicines.');

  let sourceBytes = templateBytes;
  if (!sourceBytes) {
    const response = await fetch(TEMPLATE_URL, { cache: 'force-cache' });
    if (!response.ok) throw new Error('Could not load the prescription letterhead.');
    sourceBytes = await response.arrayBuffer();
  }

  const templateDocument = await PDFDocument.load(sourceBytes);
  const templatePage = templateDocument.getPages()[0];
  const { width, height } = templatePage.getSize();

  const outputDocument = await PDFDocument.create();
  const embeddedTemplate = await outputDocument.embedPage(templatePage);
  const regularFont = await outputDocument.embedFont(StandardFonts.Helvetica);
  const boldFont = await outputDocument.embedFont(StandardFonts.HelveticaBold);

  const addLetterheadPage = () => {
    const page = outputDocument.addPage([width, height]);
    page.drawPage(embeddedTemplate, { x: 0, y: 0, width, height });
    drawFooterEmail(page, regularFont);
    return page;
  };

  let page = addLetterheadPage();
  const left = 58;
  const right = 58;
  const maxWidth = width - left - right;
  const bodySize = 11;
  const lineHeight = 17;
  const bottomLimit = 88;
  let y = 650;

  const issuedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Karachi',
  }).format(new Date());

  page.drawText(`Patient: ${patientName.trim()}`, {
    x: left, y, size: 11.5, font: boldFont, color: TEXT,
  });
  page.drawText(`Issued: ${issuedDate}`, {
    x: width - right - 105, y, size: 9.5, font: regularFont, color: MUTED,
  });
  y -= 24;
  page.drawText(`Consultation date: ${formatPrescriptionDate(appointmentDate)}`, {
    x: left, y, size: 9.5, font: regularFont, color: MUTED,
  });
  y -= 42;
  page.drawText('Rx', { x: left, y, size: 24, font: boldFont, color: BLUE });
  y -= 30;

  const sections = [
    { label: 'Medicines and directions', text: medicines.trim() },
    ...(advice.trim() ? [{ label: 'Additional advice', text: advice.trim() }] : []),
  ];

  sections.forEach((section, sectionIndex) => {
    if (sectionIndex > 0) y -= 12;
    const lines = wrapText(section.text, regularFont, bodySize, maxWidth - 8);

    if (y < bottomLimit + 48) {
      page = addLetterheadPage();
      y = 650;
      page.drawText('Prescription - continued', {
        x: left, y, size: 11, font: boldFont, color: BLUE,
      });
      y -= 30;
    }

    page.drawText(section.label, {
      x: left, y, size: 10, font: boldFont, color: BLUE,
    });
    y -= 20;

    lines.forEach(line => {
      if (y < bottomLimit) {
        page = addLetterheadPage();
        y = 650;
        page.drawText('Prescription - continued', {
          x: left, y, size: 11, font: boldFont, color: BLUE,
        });
        y -= 30;
      }

      if (line) {
        page.drawText(line, {
          x: left + 8, y, size: bodySize, font: regularFont, color: TEXT,
        });
      }
      y -= lineHeight;
    });
  });

  return outputDocument.save();
}
