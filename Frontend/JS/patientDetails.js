let currentAppointment = null;

const API_URL = "http://localhost:3000";

const main = document.querySelector("#patientDetails");
const startBtn = document.querySelector("#startBtn");
const endBtn = document.querySelector("#endBtn");
const cancelBtn = document.querySelector("#cancelAppointmentBtn");

const params = new URLSearchParams(window.location.search);
const patientId = params.get("id");

async function getPatientDetails() {
  try {
    const userRes = await fetch(`${API_URL}/users/${patientId}`);
    const userData = await userRes.json();

    const profileRes = await fetch(`${API_URL}/patient_profiles`);
    const profiles = await profileRes.json();

    const profileData = profiles.find(
      (profile) => String(profile.userId) === String(patientId)
    );

    const user = {
      img: userData.profile_image,
      name: userData.full_name,
      gender: profileData?.gender,
      mobile: userData.phone_number,
      dob: userData.date_of_birth,
      blodType: profileData?.blood_type,
      maritalStatus: profileData?.marital_status,
      address: profileData?.address,
      allergies: profileData?.allergies,
      chronicDiseases: profileData?.chronic_diseases,
    };

    // امسح القديم
    main.innerHTML = "";

    // اعمل Render من جديد
    renderPatient(user);

  } catch (error) {
    console.log(error);
  }
}
function renderPatient(user) {
  main.insertAdjacentHTML(
    "beforeend",
    `<!-- بيانات اساسية -->
    <section class="section main-info">
    <img class="patient-pic" src="${
      user.img
        ? `http://localhost:3001/uploads/${user.img}`
        : `http://localhost:3001/uploads/default.png`
    }" alt="profile picture">
    <div>
    <h3 class="font-bold">${user.name || "لا يوجد اسم"}</h3>
                    <p>${user.gender || "___"}</p>
                </div>
                <div>
                    <h3 class="font-bold">رقم الهاتف</h3>
                    <p>${user.mobile || "___"}</p>
                </div>
    </section>`,
  );
  // البيانات الاساسية

  // البيانات الشخصية
  main.insertAdjacentHTML(
    "beforeend",
    `
    <!-- البيانات الشخصية -->
            <section class="section personal-info">
                <h2 class="text-lg font-bold">البيانات الشخصية</h2>
                <div class="flex flex-col gap-3">
                    <div class="flex justify-between w-full">
                        <h3 class="font-bold">العمر</h3>
                        <p>${calculateAge(user.dob) || "___"}</p>
                    </div>
                    <div class="flex justify-between w-full">
                        <h3 class="font-bold">فصيلة الدم</h3>
                        <p>${user.blodType || "___"}</p>
                    </div>
                    <div class="flex justify-between w-full">
                        <h3 class="font-bold">الحالة الاجتماعية</h3>
                        <p>${user.maritalStatus || "___"}</p>
                    </div>
                    <div class="flex justify-between w-full">
                        <h3 class="font-bold">العنوان</h3>
                        <p>${user.address || "___"}</p>
                    </div>
                </div>
            </section>`,
  );

  // معلومات اضافية
  main.insertAdjacentHTML(
    "beforeend",
    `
    <section class="section additional-info">
        <h2 class="text-lg font-bold">معلومات اضافية</h2>
        <div>
            <div>
                <h3 class="font-bold">الحساسية</h3>
    
                ${user.allergies ? `<ul class="">${user.allergies.map((el) => `<li>${el}</li>`).join("")}</ul>` : "<p>____</p>"}
                
                </div>
            <div>
                <h3 class="font-bold mb-2">الأمراض المزمنة</h3>
                ${
                  user.chronicDiseases
                    ? `<ul> ${user.chronicDiseases.map((el) => `<li>${el}</li>`).join("")}</ul>`
                    : `<p>___</p>`
                }
            </div>
        </div>
    </section>`,
  );
}
async function getPatientAppointment() {
  const res = await fetch(`${API_URL}/appointments`);

  const appointments = await res.json();

  currentAppointment = appointments
    .filter(
      (app) =>
        app.patientId == patientId &&
        (app.status === "waiting" ||
          app.status === "called" ||
          app.status === "in_consultation"),
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  // لو مفيش حجز نشط نخفي كل الأزرار
  if (
    !currentAppointment ||
    currentAppointment.status === "completed" ||
    currentAppointment.status === "cancelled"
  ) {
    startBtn.style.display = "none";
    endBtn.style.display = "none";
    cancelBtn.style.display = "none";

    return;
  }

  updateButtons(currentAppointment.status);
}

async function updateAppointmentStatus(status) {
  if (!currentAppointment) return;

  await fetch(`${API_URL}/appointments/${currentAppointment.id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      status: status,
    }),
  });

  currentAppointment.status = status;

  updateButtons(status);
}

function updateButtons(status) {
  // نخفي كل الأزرار الأول
  startBtn.style.display = "none";
  endBtn.style.display = "none";
  cancelBtn.style.display = "none";

  // انتظار
  if (status === "waiting") {
    startBtn.style.display = "block";
    cancelBtn.style.display = "block";

    startBtn.innerHTML = `
        <i class="fa-solid fa-bullhorn"></i>
        استدعاء المريض
    `;
  }

  // تم الاستدعاء
  else if (status === "called") {
    startBtn.style.display = "block";
    cancelBtn.style.display = "block";

    startBtn.innerHTML = `
        <i class="fa-solid fa-user-doctor"></i>
        بدء الكشف
    `;
  }

  // داخل الكشف
  else if (status === "in_consultation") {
    console.log(endBtn);
    endBtn.style.display = "block";
    cancelBtn.style.display = "block";
  }
}
function calculateAge(birthDate) {
  let today = new Date();
  let birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}
// calculateAge("11-11-2005");

startBtn.addEventListener("click", async () => {
  if (currentAppointment.status === "waiting") {
    await updateAppointmentStatus("called");
  } else if (currentAppointment.status === "called") {
    await updateAppointmentStatus("in_consultation");
  }
});

endBtn.addEventListener("click", async () => {
  await updateAppointmentStatus("completed");

  endBtn.style.display = "none";
  cancelBtn.style.display = "none";
});

cancelBtn.addEventListener("click", async () => {
  await updateAppointmentStatus("cancelled");
});


getPatientDetails();
getPatientAppointment();

setInterval(async () => {
  await getPatientDetails();
  await getPatientAppointment();
}, 3000);
