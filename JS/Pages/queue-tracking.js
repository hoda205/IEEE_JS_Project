  import { checkAuth } from "../checkAuth.js";

 const patient = checkAuth();

if (patient) {
  loadQueue();
} else {
  window.location.replace("login.html");
}

  // تحميل بيانات الطابور
  async function loadQueue() {
    const queue = await getQueueTracking(patient.id);

    if (!queue) return;

    console.log(queue);

    // مثال لعرض البيانات
    // document.getElementById("myQueue").textContent = queue.myQueueNumber;
    // document.getElementById("currentQueue").textContent = queue.currentQueueNumber;
    // document.getElementById("patientsAhead").textContent = queue.patientsAhead;
    // document.getElementById("estimatedTime").textContent = queue.estimatedMinutes;
  }

  // متابعة الطابور
  async function getQueueTracking(patientUserId) {
    try {
      const today = new Date().toISOString().split("T")[0];

      // قراءة id الحجز من الرابط
      const params = new URLSearchParams(window.location.search);
      const appointmentId = params.get("appointmentId");

      if (!appointmentId) {
        window.location.href = "home.html";
        return null;
      }

      // جلب جميع الحجوزات
      const response = await fetch("http://localhost:3000/appointments");
      const appointments = await response.json();

      // البحث عن الحجز
      const myApp = appointments.find(
        (app) => app.id === appointmentId
      );

      if (!myApp) {
        window.location.href = "home.html";
        return null;
      }

      // التأكد أن الحجز يخص المستخدم الحالي
      if (myApp.patientId !== patientUserId) {
        alert("لا يمكنك الوصول إلى هذا الحجز");
        window.location.href = "home.html";
        return null;
      }

      // حجوزات اليوم لنفس الدكتور
      const todayAppointments = appointments
        .filter(
          (app) =>
            app.doctorId === myApp.doctorId &&
            app.booking_date === today &&
            app.status !== "cancelled"
        )
        .sort((a, b) => a.queue_number - b.queue_number);

      // المريض الحالي داخل الكشف أو تم نداؤه
      const currentPatient =
        todayAppointments.find(
          (app) => app.status === "in_consultation"
        ) ||
        todayAppointments.find(
          (app) => app.status === "called"
        );

      // عدد المرضى قبله
      const patientsAhead = todayAppointments.filter(
        (app) =>
          app.queue_number < myApp.queue_number &&
          (app.status === "waiting" ||
            app.status === "called")
      ).length;

      return {
        myQueueNumber: myApp.queue_number,
        currentQueueNumber: currentPatient
          ? currentPatient.queue_number
          : 0,
        patientsAhead,
        estimatedMinutes: patientsAhead * 15,
        status: myApp.status,
        appointmentId: myApp.id,
      };

    } catch (error) {
      console.error("خطأ في متابعة الطابور:", error);
      return null;
    }
  }

  // إلغاء الحجز
async function cancelAppointment() {
  try {

    const params = new URLSearchParams(window.location.search);
    const appointmentId = params.get("appointmentId");

    if (!appointmentId) {
      window.location.replace("home.html");
      return;
    }


    const response = await fetch(
      `http://localhost:3000/appointments/${appointmentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      }
    );


    const updatedAppointment = await response.json();

    console.log(updatedAppointment);


    // alert("تم إلغاء الحجز");


    window.location.replace("home.html");
    return;


  } catch (error) {
    console.error("خطأ في إلغاء الحجز:", error);
  }
}
  // cancelAppointment();