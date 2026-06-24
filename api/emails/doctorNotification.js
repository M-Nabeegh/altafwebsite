// api/emails/doctorNotification.js
// HTML email template sent to doctor/admin when a new appointment is confirmed.

export function doctorNotificationHtml({
  patientName,
  patientEmail,
  patientPhone,
  slotDate,
  slotTime,
  basketId,
  amount,
  transactionId,
  notes,
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
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>New Confirmed Booking</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    :root { color-scheme: light only; supported-color-schemes: light only; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', Arial, sans-serif; background: #f4f7fb; color: #1a1a2e; }
    @media (prefers-color-scheme: dark) {
      .email-page { background-color:#f4f7fb !important; }
      .email-card { background-color:#ffffff !important; color:#111827 !important; }
      .email-header { background-color:#047857 !important; }
      .email-header-copy { color:#ffffff !important; -webkit-text-fill-color:#ffffff !important; }
      .email-footer { background-color:#f8fafc !important; }
    }
  </style>
</head>
<body class="email-page" bgcolor="#f4f7fb" style="background:#f4f7fb; padding: 32px 16px; color:#1a1a2e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
    
    <!-- Header -->
    <tr>
      <td class="email-header" bgcolor="#047857" style="background:#047857; border-radius: 16px 16px 0 0; padding: 36px 40px 28px; text-align:center;">
        <div style="font-size:40px; margin-bottom:12px;">🔔</div>
        <h1 class="email-header-copy" style="color:#ffffff; -webkit-text-fill-color:#ffffff; font-size:21px; font-weight:700; margin-bottom:8px;">New Confirmed Appointment</h1>
        <p class="email-header-copy" style="color:#ffffff; -webkit-text-fill-color:#ffffff; font-size:13px;">A patient has completed payment and their appointment is confirmed.</p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td class="email-card" bgcolor="#ffffff" style="background:#ffffff; color:#111827; padding: 36px 40px;">

        <!-- Alert Banner -->
        <div style="background:#f0fdf4; border: 1.5px solid #86efac; border-radius:10px; padding: 16px 20px; margin-bottom:28px; display:flex; align-items:center;">
          <span style="font-size:20px; margin-right:12px;">✅</span>
          <div>
            <strong style="font-size:14px; color:#14532d;">Payment Verified via PayFast</strong><br/>
            <span style="font-size:13px; color:#166534;">IPN callback received and hash validated successfully.</span>
          </div>
        </div>

        <!-- Patient Info -->
        <p style="font-size:12px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:14px;">👤 PATIENT INFORMATION</p>
        <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f9fafb" style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; margin-bottom:24px;">
          <tr>
            <td style="padding: 20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; border-bottom:1px solid #e5e7eb; width:45%;">
                    <span style="font-size:12px; color:#6b7280;">Full Name</span>
                  </td>
                  <td style="padding: 8px 0; border-bottom:1px solid #e5e7eb; text-align:right;">
                    <strong style="font-size:13px; color:#111827;">${patientName}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom:1px solid #e5e7eb;">
                    <span style="font-size:12px; color:#6b7280;">Email</span>
                  </td>
                  <td style="padding: 8px 0; border-bottom:1px solid #e5e7eb; text-align:right;">
                    <a href="mailto:${patientEmail}" style="font-size:13px; color:#1d4ed8; text-decoration:none; word-break:break-all;">${patientEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="font-size:12px; color:#6b7280;">Phone / WhatsApp</span>
                  </td>
                  <td style="padding: 8px 0; text-align:right;">
                    <a href="https://wa.me/${patientPhone.replace(/[^0-9]/g, '')}" style="font-size:13px; color:#059669; text-decoration:none;">${patientPhone}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Appointment Details -->
        <p style="font-size:12px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:14px;">📅 APPOINTMENT DETAILS</p>
        <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#eff6ff" style="background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:10px; margin-bottom:24px;">
          <tr>
            <td style="padding: 20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; border-bottom:1px solid #dbeafe; width:45%;">
                    <span style="font-size:12px; color:#6b7280;">Date</span>
                  </td>
                  <td style="padding: 8px 0; border-bottom:1px solid #dbeafe; text-align:right;">
                    <strong style="font-size:13px; color:#1e3a5f;">${formattedDate}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom:1px solid #dbeafe;">
                    <span style="font-size:12px; color:#6b7280;">Time Slot</span>
                  </td>
                  <td style="padding: 8px 0; border-bottom:1px solid #dbeafe; text-align:right;">
                    <strong style="font-size:13px; color:#1e3a5f;">${slotTime}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom:1px solid #dbeafe;">
                    <span style="font-size:12px; color:#6b7280;">Amount Paid</span>
                  </td>
                  <td style="padding: 8px 0; border-bottom:1px solid #dbeafe; text-align:right;">
                    <strong style="font-size:14px; color:#059669;">PKR ${formattedAmount} ✅</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom:1px solid #dbeafe;">
                    <span style="font-size:12px; color:#6b7280;">Booking Ref</span>
                  </td>
                  <td style="padding: 8px 0; border-bottom:1px solid #dbeafe; text-align:right;">
                    <code style="font-size:11px; background:#dbeafe; color:#1d4ed8; padding:2px 7px; border-radius:4px;">${basketId}</code>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>

        <p style="font-size:11px; color:#6b7280; margin:-12px 0 24px; text-align:right;">
          Gateway Transaction ID: <strong>${transactionId || 'Not provided'}</strong>
        </p>

        ${notes ? `<!-- Patient Notes -->
        <p style="font-size:12px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:12px;">📝 PATIENT NOTES / SYMPTOMS</p>
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:18px 20px; margin-bottom:24px;">
          <p style="font-size:13px; color:#78350f; line-height:1.6; white-space:pre-wrap;">${notes}</p>
        </div>` : ''}

        <!-- Action Required Note -->
        <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:16px 20px;">
          <p style="font-size:13px; color:#991b1b; line-height:1.6;">
            <strong>⚡ Action Required:</strong> Please start the WhatsApp video call approximately 2 minutes before the patient's scheduled slot.
          </p>
        </div>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td class="email-footer" bgcolor="#f8fafc" style="background:#f8fafc; border-radius: 0 0 16px 16px; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
        <p style="font-size:11px; color:#9ca3af; text-align:center; line-height:1.6;">
          Automated booking notification from <strong>javedaltaf.com</strong> booking system.<br/>
          Payment verified via PayFast IPN callback.
        </p>
      </td>
    </tr>

  </table>
</body>
</html>`;
}
