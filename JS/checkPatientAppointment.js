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
    return;
  }
  const now = new Date();

        const today = now.toISOString().split("T")[0];

        // معرفة اليوم الحالي
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        const todayName = days[now.getDay()];

        const currentTime = now.toTimeString().slice(0, 5);

        // 1) جلب الحجوزات

        const todayAppointments = appointments.filter(
            (app) => app.doctorId === doctorId && app.booking_date === today,
        );

        const nextQueueNumber = todayAppointments.length + 1;

        // 2) جلب بيانات الدكتور
        const docRes = await fetch("http://localhost:3000/doctor_profiles");

        const doctorProfiles = await docRes.json();

        const docProfile = doctorProfiles.find((doctor) => doctor.id === doctorId);

        if (!docProfile) {
            throw new Error("Doctor not found");
        }

        // 3) معرفة جدول الدكتور الحالي
        const scheduleRes = await fetch("http://localhost:3000/schedules");

        const schedules = await scheduleRes.json();

        const currentSchedule = schedules.find(
            (schedule) =>
                schedule.doctorId === doctorId &&
                schedule.day_of_week === todayName &&
                schedule.is_active === true &&
                currentTime >= schedule.start_time &&
                currentTime <= schedule.end_time,
        );

        if (!currentSchedule) {
            alert("الدكتور غير متاح للحجز حاليا");
            window.location.href = "home.html";
            return;
        }
  
}
