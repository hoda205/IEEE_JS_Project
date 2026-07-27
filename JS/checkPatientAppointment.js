//  صفحة ال Home و تأكيد الحجز
import {checkAuth} from "./checkAuth.js";

let patientUser= checkAuth();
checkPatientAppointment(patientUser.id);
export default async function checkPatientAppointment(patientUserId) {
  const response = await fetch(
    "http://localhost:3000/appointments"
  );

  const appointments = await response.json();

  const activeAppointment = appointments.find(
    (appointment) =>
      appointment.patientId === patientUserId &&
      (
        appointment.status === "waiting" ||
        appointment.status === "in_consultation"
      )
  );


  if (activeAppointment) {
    alert("لديك حجز قائم بالفعل، لا يمكنك الحجز مرة أخرى حاليا");
    window.location.href =
      `queue-tracking.html?appointmentId=${activeAppointment.id}`;
  }
}
