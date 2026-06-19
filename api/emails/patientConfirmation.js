// api/emails/patientConfirmation.js
// HTML email template sent to the patient after successful payment verification.

export function patientConfirmationHtml({
  patientName,
  slotDate,
  slotTime,
  basketId,
  amount,
  transactionId,
  orderDate,
}) {
  const formattedDate = slotDate
    ? new Date(slotDate).toLocaleDateString('en-PK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : slotDate;

  const formattedAmount = new Intl.NumberFormat('en-PK').format(amount);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Appointment Confirmed — Prof. Dr. Javed Altaf</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', Arial, sans-serif; background: #f4f7fb; color: #1a1a2e; }
  </style>
</head>
<body style="background:#f4f7fb; padding: 32px 16px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
    
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #0056b3 0%, #003d82 100%); border-radius: 16px 16px 0 0; padding: 40px 40px 32px; text-align:center;">
        <div style="width:64px; height:64px; background:rgba(255,255,255,0.15); border-radius:50%; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; font-size:30px;">✅</div>
        <h1 style="color:#ffffff; font-size:22px; font-weight:700; margin-bottom:8px; letter-spacing:-0.3px;">Appointment Confirmed!</h1>
        <p style="color:rgba(255,255,255,0.8); font-size:14px; line-height:1.5;">Your online consultation with Prof. Dr. Javed Altaf has been confirmed and payment received.</p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="background:#ffffff; padding: 40px;">
        
        <p style="font-size:15px; color:#374151; margin-bottom:28px; line-height:1.6;">
          Dear <strong style="color:#0056b3;">${patientName}</strong>,<br/><br/>
          We are pleased to confirm your online urological consultation. Please find your appointment details below.
        </p>

        <!-- Appointment Summary Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff; border:1.5px solid #bfdbfe; border-radius:12px; margin-bottom:28px;">
          <tr>
            <td style="padding: 24px 28px;">
              <p style="font-size:11px; font-weight:700; color:#3b82f6; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px;">📋 Appointment Summary</p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #dbeafe;">
                    <span style="font-size:13px; color:#6b7280;">📅 Consultation Date</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #dbeafe; text-align:right;">
                    <strong style="font-size:13px; color:#1e3a5f;">${formattedDate}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #dbeafe;">
                    <span style="font-size:13px; color:#6b7280;">🕐 Time Slot</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #dbeafe; text-align:right;">
                    <strong style="font-size:13px; color:#1e3a5f;">${slotTime}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #dbeafe;">
                    <span style="font-size:13px; color:#6b7280;">👨‍⚕️ Consultant</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #dbeafe; text-align:right;">
                    <strong style="font-size:13px; color:#1e3a5f;">Prof. Dr. Javed Altaf</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #dbeafe;">
                    <span style="font-size:13px; color:#6b7280;">💳 Amount Paid</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #dbeafe; text-align:right;">
                    <strong style="font-size:14px; color:#059669;">PKR ${formattedAmount}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <span style="font-size:13px; color:#6b7280;">🔖 Booking Reference</span>
                  </td>
                  <td style="padding: 10px 0; text-align:right;">
                    <code style="font-size:12px; background:#e0f2fe; color:#0369a1; padding: 3px 8px; border-radius:4px; font-family:monospace;">${basketId}</code>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>

        <!-- What's Next -->
        <p style="font-size:13px; font-weight:700; color:#1e3a5f; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:16px;">WHAT HAPPENS NEXT</p>
        
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 12px 0; vertical-align:top; width:40px; font-size:20px;">📧</td>
            <td style="padding: 12px 0; vertical-align:top;">
              <strong style="font-size:14px; color:#1e3a5f; display:block; margin-bottom:3px;">Check Your Email</strong>
              <span style="font-size:13px; color:#6b7280;">A confirmation email is on its way. Dr. Javed Altaf will video call on your WhatsApp number 2 mins before.</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; vertical-align:top; font-size:20px;">🎥</td>
            <td style="padding: 12px 0; vertical-align:top;">
              <strong style="font-size:14px; color:#1e3a5f; display:block; margin-bottom:3px;">Join on Time</strong>
              <span style="font-size:13px; color:#6b7280;">Please be ready at your selected slot on Saturday. The consultation is 20 minutes.</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; vertical-align:top; font-size:20px;">📋</td>
            <td style="padding: 12px 0; vertical-align:top;">
              <strong style="font-size:14px; color:#1e3a5f; display:block; margin-bottom:3px;">Prepare Your Reports</strong>
              <span style="font-size:13px; color:#6b7280;">Keep any relevant lab reports, ultrasounds, or prescriptions ready for the consultation.</span>
            </td>
          </tr>
        </table>

        <!-- CTA Button -->
        <div style="text-align:center; margin-top:32px;">
          <a href="https://javedaltaf.com" style="display:inline-block; background: linear-gradient(135deg, #0056b3, #003d82); color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding: 14px 32px; border-radius:8px; letter-spacing:0.2px;">Visit javedaltaf.com</a>
        </div>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc; border-radius: 0 0 16px 16px; padding: 28px 40px; border-top: 1px solid #e5e7eb;">
        <p style="font-size:12px; color:#9ca3af; text-align:center; line-height:1.6; margin-bottom:8px;">
          This is an automated confirmation from <strong>javedaltaf.com</strong><br/>
          If you did not make this booking, please contact us immediately.
        </p>
        <p style="font-size:12px; color:#9ca3af; text-align:center;">
          🌐 <a href="https://javedaltaf.com" style="color:#3b82f6; text-decoration:none;">javedaltaf.com</a>
        </p>
      </td>
    </tr>

  </table>
</body>
</html>`;
}
