  import { checkAuth } from "../checkAuth.js";

 const doctor = checkAuth();

if (doctor) {
  loadQueue();
} else {
  window.location.replace("login.html");
}

  // تحميل بيانات الطابور
  async function loadQueue() {
    const queue = await getDashboardStats();

    if (!queue) return;

    console.log(queue);

    // مثال لعرض البيانات
    // document.getElementById("myQueue").textContent = queue.myQueueNumber;
    // document.getElementById("currentQueue").textContent = queue.currentQueueNumber;
    // document.getElementById("patientsAhead").textContent = queue.patientsAhead;
    // document.getElementById("estimatedTime").textContent = queue.estimatedMinutes;
  }
// جلب إحصائيات Dashboard اليوم
async function getDashboardStats() {
  try {

    const today = new Date()
      .toISOString()
      .split("T")[0];


    // جلب كل الحجوزات
    const response = await fetch(
      "http://localhost:3000/appointments"
    );

    const appointments = await response.json();


    // حجوزات اليوم فقط
    const todayAppointments = appointments.filter(
      appointment =>
        appointment.booking_date === today
    );


    const stats = {

      // إجمالي حجوزات اليوم
      totalBookings: todayAppointments.length,


      // المنتظرين
      waiting: todayAppointments.filter(
        appointment =>
          appointment.status === "waiting" ||
          appointment.status === "called"
      ).length,


      // داخل الكشف
      inConsultation: todayAppointments.filter(
        appointment =>
          appointment.status === "in_consultation"
      ).length,


      // تم الكشف عليهم
      completed: todayAppointments.filter(
        appointment =>
          appointment.status === "completed"
      ).length,


      // لم يحضر
      noShow: todayAppointments.filter(
        appointment =>
          appointment.status === "no_show"
      ).length,


      // إجمالي الدخل
      totalIncome: todayAppointments
        .filter(
          appointment =>
            appointment.status === "completed"
        )
        .reduce(
          (sum, appointment) =>
            sum + (appointment.consultation_fee || 0),
          0
        )

    };


    return stats;


  } catch (error) {

    console.error(
      "خطأ في جلب إحصائيات الداشبورد:",
      error
    );

  }
}