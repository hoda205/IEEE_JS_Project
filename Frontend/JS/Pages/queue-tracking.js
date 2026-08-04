  import { checkAuth } from "../checkAuth.js";

const patient = checkAuth();

if (patient) {
  loadQueue();

  setInterval(() => {
    loadQueue();
  }, 3000);

} else {
  window.location.replace("login.html");
}

// تحميل بيانات الطابور
async function loadQueue() { 
  const queue = await getQueueTracking(patient.id);

if (!queue) return;


if (queue.status === "cancelled" || queue.status === "completed") {
  window.location.replace("home.html");
  return;
}

console.log(queue);

  document.getElementById("myQueueNumber").textContent = queue.myQueueNumber;

  document.getElementById("currentQueueNumber").textContent =
    queue.currentQueueNumber;

  document.getElementById("patientsAhead").textContent = queue.patientsAhead;

  document.getElementById("estimatedMinutes").textContent =
    queue.estimatedMinutes;

  document.getElementById("bookingStatus").textContent = getStatusText(
    queue.status,
  );

  const statusIcon = document.querySelector(".booking-status-icon");

  switch (queue.status) {
    case "waiting":
      statusIcon.className = "booking-status-icon fa-regular fa-clock";
      break;

    case "called":
      statusIcon.className = "booking-status-icon fa-solid fa-bell";
      break;

    case "in_consultation":
      statusIcon.className = "booking-status-icon fa-solid fa-user-doctor";
      break;

    case "completed":
      statusIcon.className = "booking-status-icon fa-solid fa-circle-check";
      break;

    case "cancelled":
      statusIcon.className = "text-danger booking-status-icon fa-solid fa-circle-xmark";
      break;
  }

  const cancelBtn = document.getElementById("cancelBtn");

  const cancelModal = document.getElementById("cancelModal");

  const confirmCancel = document.getElementById("confirmCancel");

  const closeModal = document.getElementById("closeModal");

  // فتح الـ Modal
  cancelBtn.addEventListener("click", () => {
    cancelModal.classList.add("active");
  });

  // إغلاق بدون إلغاء
  closeModal.addEventListener("click", () => {
    cancelModal.classList.remove("active");
  });

  // تأكيد الإلغاء
  confirmCancel.addEventListener("click", () => {
    cancelAppointment();
  });
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
    const myApp = appointments.find((app) => app.id === appointmentId);

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
          app.status !== "cancelled",
      )
      .sort((a, b) => a.queue_number - b.queue_number);

    // المريض الحالي داخل الكشف أو تم نداؤه
    const currentPatient =
      todayAppointments.find((app) => app.status === "in_consultation") ||
      todayAppointments.find((app) => app.status === "called");

    // عدد المرضى قبله
    const patientsAhead = todayAppointments.filter(
      (app) =>
        app.queue_number < myApp.queue_number &&
        (app.status === "waiting" || app.status === "called"),
    ).length;
    // console.log(currentPatient);
    // if(!currentPatient)
    //   currentPatient.queue_number = myApp.queue_number;
    console.log(myApp.queue_number)
    return {
      myQueueNumber: myApp.queue_number,
      currentQueueNumber: currentPatient ? currentPatient.queue_number : myApp.queue_number,
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
      },
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

function getStatusText(status) {
  switch (status) {
    case "waiting":
      return "في الانتظار";

    case "called":
      return "تم النداء";

    case "in_consultation":
      return "جاري الكشف";

    case "completed":
      return "تم الانتهاء";

    case "cancelled":
      return "تم الإلغاء";

    default:
      return status;
  }
}
// cancelAppointment();
