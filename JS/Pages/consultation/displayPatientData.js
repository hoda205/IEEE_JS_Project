function getAppointmentId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("appointmentId");
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return "غير محدد";

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function getTodayDate() {
  return new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

async function displayPatientData() {
  const appointmentId = getAppointmentId();

  const nameContainer = document.getElementById("patient-name");
  const ageContainer = document.getElementById("patient-age");
  const dateContainer = document.getElementById("visit-date");

  if (!appointmentId) {
    console.error("لم يتم العثور على appointmentId في الرابط");
    return;
  }

  try {
    // جلب كل الحجوزات
    const appointmentRes = await fetch("http://localhost:3000/appointments");

    if (!appointmentRes.ok) {
      throw new Error("فشل جلب الحجوزات");
    }

    const appointments = await appointmentRes.json();

    // فلترة الحجز بالـ id
    const appointment = appointments.find(
      (app) => String(app.id) === String(appointmentId),
    );

    if (!appointment) {
      throw new Error("الحجز غير موجود");
    }

    // جلب كل المستخدمين
    const usersRes = await fetch("http://localhost:3000/users");

    if (!usersRes.ok) {
      throw new Error("فشل جلب المستخدمين");
    }

    const users = await usersRes.json();

    // فلترة المريض
    const patient = users.find(
      (user) => String(user.id) === String(appointment.patientId),
    );

    if (!patient) {
      throw new Error("المريض غير موجود");
    }

    // عرض البيانات
    if (nameContainer) {
      nameContainer.textContent = patient.full_name;
    }

    if (ageContainer) {
      ageContainer.textContent = `${calculateAge(patient.date_of_birth)} سنة`;
    }

    if (dateContainer) {
      dateContainer.textContent = getTodayDate();
    }
  } catch (error) {
    console.error("حدث خطأ أثناء جلب بيانات المريض:", error);
  }
}

displayPatientData();
