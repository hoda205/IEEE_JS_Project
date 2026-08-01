const API_URL = "http://localhost:3000";

// خريطة الحالات مع الأيقونات والتسميات بالعربية
const statusMap = {
  waiting: {
    text: "في الانتظار",
    className: "waiting",
    icon: "fa-regular fa-clock",
  },
  called: {
    text: "تم الاستدعاء",
    className: "called",
    icon: "fa-solid fa-bullhorn",
  },
  in_consultation: {
    text: "داخل الكشف",
    className: "in_consultation",
    icon: "fa-solid fa-user-doctor",
  },
  completed: {
    text: "تم الكشف",
    className: "completed",
    icon: "fa-solid fa-circle-check",
  },
  cancelled: {
    text: "ملغي",
    className: "cancelled",
    icon: "fa-solid fa-circle-xmark",
  },
};

// ==================== 1. جلب وعرض بيانات الانتظار ====================
async function getAppointments() {
  try {
    const [appointmentsRes, usersRes] = await Promise.all([
      fetch(`${API_URL}/appointments`),
      fetch(`${API_URL}/users`),
    ]);

    const appointments = await appointmentsRes.json();
    const users = await usersRes.json();

    const sortedAppointments = appointments.sort((a, b) => {
      const finishedStatuses = ["completed", "cancelled"];

      const aFinished = finishedStatuses.includes(a.status);
      const bFinished = finishedStatuses.includes(b.status);

      // اللي لسه هيكشفوا فوق
      if (!aFinished && bFinished) return -1;

      if (aFinished && !bFinished) return 1;

      // ترتيب المنتظرين حسب رقم الدور
      if (!aFinished && !bFinished) {
        return a.queue_number - b.queue_number;
      }

      // اللي خلصوا تحت حسب وقت الانتهاء/الإنشاء
      return new Date(a.created_at) - new Date(b.created_at);
    });

    const queueBody = document.getElementById("queueBody");

    queueBody.innerHTML = "";

    if (sortedAppointments.length === 0) {
      queueBody.innerHTML = `
            <tr>
                <td colspan="6">
                    لا يوجد مرضى
                </td>
            </tr>`;

      return;
    }

    sortedAppointments.forEach((appointment) => {
      const patient = users.find((user) => user.id == appointment.patientId);

      const statusInfo = statusMap[appointment.status] || statusMap.waiting;

      queueBody.innerHTML += `
            
            <tr>

                <td>
                    <strong>
                    #${appointment.queue_number}
                    </strong>
                </td>


                <td>
                    ${patient?.full_name || "غير معروف"}
                </td>


                <td>
                    ${patient?.phone_number || "-"}
                </td>


                <td>
                    ${formatDate(appointment.created_at)}
                </td>


                <td>

                    <span class="status ${statusInfo.className}">

                        <i class="${statusInfo.icon}"></i>

                        ${statusInfo.text}

                    </span>

                </td>


                <td>
                    <div class="actions-wrapper">
                        ${renderActionButtons(appointment)}
                    </div>
                </td>


            </tr>

            `;
    });
  } catch (error) {
    console.log(error);
  }
}

async function callPatient(patientId) {
  const res = await fetch(`${API_URL}/users/${patientId}`);

  const patient = await res.json();

  window.location.href = `tel:${patient.phone_number}`;
}
// دالة لتوليد الأزرار المناسبة حسب حالة المريض
function renderActionButtons(appointment) {
  const { id, status } = appointment;

  let buttons = "";

  buttons += `

<button 
class="action-btn"
onclick="openPatientProfile('${appointment.patientId}')">

<i class="fa-solid fa-user"></i>

</button>

`;
  buttons += `

<button 
class="action-btn"
onclick="openPrescription('${appointment.patientId}')">

<i class="fa-regular fa-file-lines"></i>

</button>

`;

  buttons += `
    
    <button 
    class="action-btn"
    onclick="callPatient('${appointment.patientId}')">

    <i class="fa-solid fa-phone"></i>

    </button>

    `;

  if (status === "waiting") {
    buttons += `

        <button 
        class="action-btn btn-call"
        onclick="updateStatus('${id}','called')">

        <i class="fa-solid fa-bullhorn"></i>

        </button>

        `;
  } else if (status === "called") {
    buttons += `

        <button 
        class="action-btn btn-enter"
        onclick="updateStatus('${id}','in_consultation')">


        <i class="fa-solid fa-user-doctor"></i>


        </button>

        `;
  } else if (status === "in_consultation") {
    buttons += `

        <button 
        class="action-btn btn-complete"
        onclick="updateStatus('${id}','completed')">


        <i class="fa-solid fa-check"></i>


        </button>

        `;
  }

  if (status !== "completed" && status !== "cancelled") {
    buttons += `

        <button 
        class="action-btn btn-cancel"
        onclick="updateStatus('${id}','cancelled')">


        <i class="fa-solid fa-xmark"></i>


        </button>

        `;
  }

  return buttons;
}
function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleString("ar-EG", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

// ==================== 2. تحديث حالة المريض ====================
async function updateStatus(id, newStatus) {
  await fetch(`${API_URL}/appointments/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      status: newStatus,
    }),
  });

  getAppointments();
}

// ==================== 3. زر "استدعاء التالي" ====================
const callNextBtn = document.getElementById("callNextBtn");
if (callNextBtn) {
  callNextBtn.addEventListener("click", async () => {
    const response = await fetch(`${API_URL}/appointments`);
    const appointments = await response.json();

    // البحث عن أول مريض بحالة "في الانتظار"
    const nextPatient = appointments
      .filter((app) => app.status === "waiting")
      .sort((a, b) => a.queue_number - b.queue_number)[0];

    if (nextPatient) {
      await updateStatus(nextPatient.id, "called");
    } else {
      alert("لا يوجد مرضى في الانتظار حالياً!");
    }
  });
}

// زر التحديث
const refreshBtn = document.getElementById("refreshBtn");
if (refreshBtn) {
  refreshBtn.addEventListener("click", getAppointments);
}

// ==================== 4. التحكم في Modal الإضافة ====================
const modal = document.getElementById("addPatientModal");
const pageContent = document.getElementById("pageContent");
const addPatientBtn = document.getElementById("addPatientBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const patientForm = document.getElementById("patientForm");

if (addPatientBtn) {
  addPatientBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    pageContent.classList.add("blur");
  });
}
function closePatientModal() {
  modal.style.display = "none";
  pageContent.classList.remove("blur");
  patientForm.reset();
}

closeModal.addEventListener("click", closePatientModal);
cancelBtn.addEventListener("click", closePatientModal);

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closePatientModal();
  }
});
async function getTodayDoctorSchedule(doctorId = "1") {
  const today = new Date();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const todayName = days[today.getDay()];

  const schedulesRes = await fetch(`${API_URL}/schedules`);
  const locationsRes = await fetch(`${API_URL}/clinic_locations`);

  const schedules = await schedulesRes.json();
  const locations = await locationsRes.json();

  const schedule = schedules.find(
    (item) =>
      item.doctorId == doctorId &&
      item.day_of_week == todayName &&
      item.is_active,
  );

  if (!schedule) {
    return null;
  }

  const location = locations.find(
    (item) => item.id == schedule.clinicLocationId,
  );

  return {
    scheduleId: schedule.id,
    clinicLocationId: schedule.clinicLocationId,
    locationName: location.location_name,
    address: location.address,
  };
}
// ==================== 5. إضافة مريض جديد ====================
patientForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const patientName = document.getElementById("patientName").value;

  const patientPhone = document.getElementById("patientPhone").value;

  const birthDate = document.getElementById("patientBirthDate").value;

  try {
    // جلب المستخدمين
    const usersRes = await fetch(`${API_URL}/users`);
    const users = await usersRes.json();

    // نشوف هل المريض موجود
    let patient = users.find((user) => user.phone_number === patientPhone);

    // لو المريض موجود نشوف هل عنده حجز نشط
    if (patient) {
      const appointmentsRes = await fetch(`${API_URL}/appointments`);

      const appointments = await appointmentsRes.json();

      const hasActiveAppointment = appointments.some(
        (app) =>
          app.patientId == patient.id &&
          app.booking_date === new Date().toISOString().split("T")[0] &&
          !["completed", "cancelled"].includes(app.status),
      );
      

      if (hasActiveAppointment) {
        alert("هذا المريض لديه حجز بالفعل اليوم");

        return;
      }
    }

    // لو مش موجود نعمل اكونت جديد
    if (!patient) {
      const newUser = {
        full_name: patientName,

        phone_number: patientPhone,

        password: "",

        role: "patient",

        date_of_birth: birthDate,

        profile_image: "default.png",
      };

      const createUser = await fetch(`${API_URL}/users`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(newUser),
      });

      patient = await createUser.json();
    }

    // جلب حجوزات اليوم
    const appointmentsRes = await fetch(`${API_URL}/appointments`);

    const appointments = await appointmentsRes.json();

    // حساب رقم الدور
    const today = new Date().toISOString().split("T")[0];

    const todayAppointments = appointments.filter(
      (app) => app.booking_date === today,
    );

    const activeAppointments = todayAppointments.filter(
      (app) => app.status !== "completed" && app.status !== "cancelled",
    );

    const queueNumber = activeAppointments.length + 1;

    // وقت وتاريخ إنشاء الحجز تلقائي
    const now = new Date();

    const createdAt = now.toISOString();

    // جلب جدول الدكتور اليوم
    const doctorSchedule = await getTodayDoctorSchedule("1");

    if (!doctorSchedule) {
      alert("لا يوجد مواعيد للطبيب اليوم");

      return;
    }

    // إنشاء الحجز
    await fetch(`${API_URL}/appointments`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        patientId: patient.id,

        doctorId: "1",

        clinicLocationId: doctorSchedule.clinicLocationId,

        scheduleId: doctorSchedule.scheduleId,

        booking_date: today,

        queue_number: queueNumber,

        status: "waiting",

        consultation_fee: 350,

        no_show_penalty: 100,

        created_at: createdAt,
      }),
    });

    closePatientModal();

    getAppointments();
  } catch (error) {
    console.log(error);
  }
});
getAppointments();

function openPatientProfile(patientId) {
  window.location.href = `patientDetails.html?id=${patientId}`;
}

function openPrescription(patientId) {
  window.location.href = `consultation.html?id=${patientId}`;
}
