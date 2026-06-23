import { useEffect, useState } from 'react';
import {
  FaDownload, FaExternalLinkAlt, FaFilePrescription, FaShareAlt, FaSpinner,
} from 'react-icons/fa';
import {
  generatePrescriptionPdf,
  makePrescriptionFilename,
} from '../utils/prescriptionPdf';

const PrescriptionDialog = ({ appointment, onClose }) => {
  const [medicines, setMedicines] = useState('');
  const [advice, setAdvice] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedFile, setGeneratedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleGenerate = async () => {
    if (!medicines.trim()) {
      setError('Please enter the medicines and directions.');
      return;
    }
    setGenerating(true);
    setError('');

    try {
      const pdfBytes = await generatePrescriptionPdf({
        patientName: appointment.patient_name,
        appointmentDate: appointment.slot_date,
        medicines,
        advice,
      });
      const filename = makePrescriptionFilename(appointment.patient_name, appointment.slot_date);
      const file = new File([pdfBytes], filename, { type: 'application/pdf' });
      const objectUrl = URL.createObjectURL(file);
      setGeneratedFile(file);
      setPreviewUrl(objectUrl);
    } catch (generationError) {
      setError(generationError.message || 'Could not generate the prescription PDF.');
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!generatedFile) return;
    setError('');

    try {
      if (navigator.share && navigator.canShare?.({ files: [generatedFile] })) {
        await navigator.share({
          files: [generatedFile],
          title: `Prescription - ${appointment.patient_name}`,
          text: 'Prescription from Prof. Dr. Javed Altaf',
        });
        return;
      }

      window.location.assign(previewUrl);
    } catch (shareError) {
      if (shareError.name !== 'AbortError') {
        setError('Could not open the share sheet. Use Open PDF instead.');
      }
    }
  };

  const handleEditAgain = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setGeneratedFile(null);
    setPreviewUrl('');
    setError('');
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

          {generatedFile ? (
            <div className="da-prescription-ready">
              <div className="da-prescription-ready-icon"><FaFilePrescription /></div>
              <h4>Prescription PDF is ready</h4>
              <p>Tap <strong>Share PDF</strong>, choose WhatsApp, then select the patient. The PDF will be attached directly.</p>
              <div className="da-prescription-ready-actions">
                <button className="da-prescription-share" onClick={handleShare}>
                  <FaShareAlt /> Share PDF
                </button>
                <button className="da-prescription-open" onClick={() => window.location.assign(previewUrl)}>
                  <FaExternalLinkAlt /> Open PDF
                </button>
              </div>
              <button className="da-prescription-edit-again" onClick={handleEditAgain}>Edit prescription</button>
            </div>
          ) : (
            <>
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
                <FaDownload /> The PDF is generated temporarily on this device. It is not saved to the website or Supabase.
              </div>
            </>
          )}
          {error && <div className="da-prescription-error" role="alert">{error}</div>}
        </div>

        {!generatedFile && (
          <div className="da-prescription-actions">
            <button className="da-prescription-cancel" onClick={onClose} disabled={generating}>Cancel</button>
            <button className="da-prescription-generate" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <><FaSpinner className="da-spin" /> Creating PDF...</>
              ) : (
                <><FaFilePrescription /> Create PDF</>
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default PrescriptionDialog;
