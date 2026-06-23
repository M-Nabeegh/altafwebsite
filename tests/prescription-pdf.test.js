import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import {
  formatPrescriptionDate,
  generatePrescriptionPdf,
  makePrescriptionFilename,
  normalizeWhatsAppNumber,
} from '../src/utils/prescriptionPdf.js';

test('normalizes the appointment phone for a WhatsApp chat', () => {
  assert.equal(normalizeWhatsAppNumber('0300 3068775'), '923003068775');
  assert.equal(normalizeWhatsAppNumber('+923003068775'), '923003068775');
  assert.equal(normalizeWhatsAppNumber('923003068775'), '923003068775');
  assert.throws(() => normalizeWhatsAppNumber('12345'), /valid Pakistani mobile/);
});

test('formats prescription dates without timezone drift', () => {
  assert.equal(formatPrescriptionDate('2026-06-27'), '27 Jun 2026');
});

test('creates a safe patient-specific PDF filename', () => {
  assert.equal(
    makePrescriptionFilename('Muhammad Nabeegh Jat', '2026-06-27'),
    'Prescription_Muhammad_Nabeegh_Jat_2026-06-27.pdf',
  );
});

test('generates a valid prescription PDF from the supplied letterhead', async () => {
  const templateBytes = await readFile(new URL('../public/prescription-letterhead.pdf', import.meta.url));
  const bytes = await generatePrescriptionPdf({
    patientName: 'Test Patient',
    appointmentDate: '2026-06-27',
    medicines: 'Tab. Example 500 mg - one tablet twice daily for 5 days.',
    advice: 'Drink plenty of water and follow up after one week.',
    templateBytes,
  });
  const document = await PDFDocument.load(bytes);

  assert.ok(bytes.length > 10_000);
  assert.equal(document.getPageCount(), 1);
});

test('continues a long prescription onto additional letterhead pages', async () => {
  const templateBytes = await readFile(new URL('../public/prescription-letterhead.pdf', import.meta.url));
  const bytes = await generatePrescriptionPdf({
    patientName: 'Test Patient',
    appointmentDate: '2026-06-27',
    medicines: Array.from({ length: 90 }, (_, index) => (
      `${index + 1}. Medicine ${index + 1} - one tablet twice daily for five days.`
    )).join('\n'),
    templateBytes,
  });
  const document = await PDFDocument.load(bytes);

  assert.ok(document.getPageCount() > 1);
});
