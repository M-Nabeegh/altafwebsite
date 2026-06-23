export function hasDetectedPaidAppointment(appointment) {
  return appointment?.paymentStatus === 'paid'
    && (appointment.status === 'confirmed' || appointment.status === 'cancelled');
}

export function hasTerminalFailedPayment(appointment) {
  return appointment?.paymentStatus === 'failed'
    || appointment?.status === 'failed'
    || (appointment?.status === 'cancelled' && appointment?.paymentStatus !== 'paid');
}
