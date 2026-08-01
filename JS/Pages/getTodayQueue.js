  import { checkAuth } from "../checkAuth.js";

 const doctor = checkAuth();

if (doctor) {
  loadQueue();
} else {
  window.location.replace("login.html");
}

  // تحميل بيانات الطابور
  async function loadQueue() {
    const queue = await getTodayQueue();

    if (!queue) return;

    console.log(queue);

    // مثال لعرض البيانات
    // document.getElementById("myQueue").textContent = queue.myQueueNumber;
    // document.getElementById("currentQueue").textContent = queue.currentQueueNumber;
    // document.getElementById("patientsAhead").textContent = queue.patientsAhead;
    // document.getElementById("estimatedTime").textContent = queue.estimatedMinutes;
  }
// 1. جلب طابور اليوم كاملاً مع أسماء المرضى
async function getTodayQueue() {
  try {
    const today = new Date().toISOString().split("T")[0];

    // جلب الحجوزات والمستخدمين
    const [appRes, usersRes] = await Promise.all([
      fetch("http://localhost:3000/appointments"),
      fetch("http://localhost:3000/users"),
    ]);

    const appointments = await appRes.json();
    const users = await usersRes.json();

    // المرضى فقط
    const patients = users.filter((user) => user.role === "patient");

    // حجوزات اليوم فقط
    const todayAppointments = appointments.filter(
      (app) => app.booking_date === today && app.status !== "cancelled",
    );

    return todayAppointments.map((app) => {
      const patientUser = patients.find((user) => user.id === app.patientId);

      return {
        ...app,

        patientName: patientUser ? patientUser.full_name : "مريض غير معروف",

        patientPhone: patientUser ? patientUser.phone_number : "",
      };
    });
  } catch (error) {
    console.error("خطأ في جلب طابور اليوم:", error);
  }
}

// 2. تغيير حالة المريض
async function updatePatientStatus(appointmentId, newStatus) {
  try {
    await fetch(`http://localhost:3000/appointments/${appointmentId}`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status: newStatus,
      }),
    });

    alert("تم تحديث حالة المريض");
  } catch (error) {
    console.error("خطأ في تحديث الحالة:", error);
  }
}
