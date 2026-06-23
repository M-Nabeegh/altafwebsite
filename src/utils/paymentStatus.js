export function hasDetectedPaidAppointment(appointment) {
  return appointment?.paymentStatus === 'paid'
    && (appointment.status === 'confirmed' || appointment.status === 'cancelled');
}
