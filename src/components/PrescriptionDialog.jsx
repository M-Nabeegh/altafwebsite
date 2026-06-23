import { useMemo, useState } from 'react';
import { FaDownload, FaFilePrescription, FaSpinner, FaWhatsapp } from 'react-icons/fa';
import {
  downloadPrescription,
  generatePrescriptionPdf,
  makePrescriptionFilename,
  normalizeWhatsAppNumber,
} from '../utils/prescriptionPdf';

const PrescriptionDialog = ({ appointment, onClose }) => {
  const [medicines, setMedicines] = useState('');
  const [advice, setAdvice] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const whatsappNumber = useMemo(() => {
    try {
      return normalizeWhatsAppNumber(appointment.patient_phone);
    } catch {
      return '';
    }
  }, [appointment.patient_phone]);

  const handleGenerate = async () => {
    if (!medicines.trim()) {
      setError('Please enter the medicines and directions.');
      return;
    }
    if (!whatsappNumber) {
      setError('This patient does not have a valid Pakistani WhatsApp number.');
      return;
    }

    setGenerating(true);
    setError('');

    // Open the destination during the tap event so mobile browsers do not
    // block it after the asynchronous PDF generation completes.
    const whatsappWindow = window.open('about:blank', '_blank');

    try {
      const pdfBytes = await generatePrescriptionPdf({
        patientName: appointment.patient_name,
        appointmentDate: appointment.slot_date,
        medicines,
        advice,
      });
      const filename = makePrescriptionFilename(appointment.patient_name, appointment.slot_date);
      downloadPrescription(pdfBytes, filename);

      const message = encodeURIComponent(
        `Dear ${appointment.patient_name.trim().split(/\s+/)[0]},\n\nPlease find your prescription from Prof. Dr. Javed Altaf attached.`,
      );
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      if (whatsappWindow) {
        whatsappWindow.opener = null;
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }

      setMedicines('');
      setAdvice('');
      onClose();
    } catch (generationError) {
      if (whatsappWindow) whatsappWindow.close();
      setError(generationError.message || 'Could not generate the prescription PDF.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="da-modal-overlay da-prescription-overlay" onClick={onClose}>
      <section
        className="da-modal da-prescription-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prescription-title"
        onClick={event => event.stopPropagation()}
      >
        <div className="da-modal-header da-prescription-header">
          <div>
            <span className="da-prescription-kicker"><FaFilePrescription /> Prescription</span>
            <h3 id="prescription-title">{appointment.patient_name}</h3>
          </div>
          <button className="da-modal-close" onClick={onClose} aria-label="Close prescription dialog">✕</button>
        </div>

        <div className="da-prescription-body">
          <div className="da-prescription-patient">
            <span>{appointment.slot_date}</span>
            <span>{appointment.slot_time}</span>
            <span>{appointment.patient_phone}</span>
          </div>

          <label className="da-prescription-field" htmlFor="prescriptionMedicines">
            <span>Medicines and directions <strong>*</strong></span>
            <textarea
              id="prescriptionMedicines"
              value={medicines}
              onChange={event => setMedicines(event.target.value)}
              placeholder={'Example:\nTab. Medicine 500 mg - one tablet twice daily for 5 days\nSyrup Medicine - 10 ml at night'}
              maxLength={3500}
              rows={9}
              autoFocus
            />
          </label>

          <label className="da-prescription-field" htmlFor="prescriptionAdvice">
            <span>Additional advice <small>(optional)</small></span>
            <textarea
              id="prescriptionAdvice"
              value={advice}
              onChange={event => setAdvice(event.target.value)}
              placeholder="Hydration, tests, follow-up instructions..."
              maxLength={1200}
              rows={3}
            />
          </label>

          <div className="da-prescription-privacy">
            <FaDownload /> The PDF is generated on this device and downloaded. It is not saved to the website or Supabase.
          </div>
          {error && <div className="da-prescription-error" role="alert">{error}</div>}
        </div>

        <div className="da-prescription-actions">
          <button className="da-prescription-cancel" onClick={onClose} disabled={generating}>Cancel</button>
          <button className="da-prescription-generate" onClick={handleGenerate} disabled={generating}>
            {generating ? (
              <><FaSpinner className="da-spin" /> Creating PDF...</>
            ) : (
              <><FaWhatsapp /> Download &amp; Open WhatsApp</>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default PrescriptionDialog;
