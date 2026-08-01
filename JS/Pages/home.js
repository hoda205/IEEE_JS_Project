import checkPatientAppointment from "../checkPatientAppointment.js";

checkPatientAppointment();

// دالة جلب البيانات من الـ API
async function getPatientHomeData(doctorId = "1") {
  try {
    const [usersRes, doctorsRes, schedulesRes, locationsRes, appointmentsRes] = await Promise.all([
      fetch("http://localhost:3000/users"),
      fetch("http://localhost:3000/doctor_profiles"),
      fetch("http://localhost:3000/schedules"),
      fetch("http://localhost:3000/clinic_locations"),
      fetch("http://localhost:3000/appointments")
    ]);

    const users = await usersRes.json();
    const doctorProfiles = await doctorsRes.json();
    const schedules = await schedulesRes.json();
    const locations = await locationsRes.json();
    const appointments = await appointmentsRes.json();

    const doctorProfile = doctorProfiles.find((doctor) => doctor.id == doctorId);
    if (!doctorProfile) throw new Error("Doctor profile not found");

    const doctorUser = users.find((user) => user.id == doctorProfile.userId);

    // تحديد مكان الدكتور حالياً
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[now.getDay()];

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    const currentSchedule = schedules.find((schedule) => {
      return (
        schedule.doctorId == doctorId &&
        schedule.day_of_week === todayName &&
        schedule.is_active === true &&
        currentTime >= schedule.start_time &&
        currentTime <= schedule.end_time
      );
    });

    let clinicLocation = "الدكتور غير متاح حاليا";
    let clinicAddress = "";
    let isAvailable = false; // متغيّر لمعرفة هل الدكتور متاح أم لا
    let appointmentTime = "---";
    if (currentSchedule) {
      appointmentTime = currentSchedule.end_time + " - " + currentSchedule.start_time;
      const location = locations.find((loc) => loc.id == currentSchedule.clinicLocationId);
      if (location) {

        clinicLocation = location.location_name;
        clinicAddress = location.address;
        isAvailable = true; // الدكتور متاح في العيادة حالياً
      }
    }

    // حساب عدد المنتظرين اليوم
    const today = now.toISOString().split("T")[0];
    const todayAppointments = appointments.filter(
      (app) => app.doctorId == doctorId && app.booking_date === today
    );

    const waitingCount = todayAppointments.filter(
      (app) => app.status === "waiting" || app.status === "in_consultation"
    ).length;

    return {
      doctorName: doctorUser ? doctorUser.full_name : "",
      doctorImage: doctorUser ? doctorUser.profile_image : "default.png",
      specialty: doctorProfile.specialty,
      consultationFee: doctorProfile.consultation_fee,
      location: clinicLocation ,
      clinicAddress: clinicAddress,
      appointmentTime: appointmentTime ,
      waitingCount: waitingCount,
      isAvailable: isAvailable // إضافة حالة الإتاحة للـ Return
    };
  } catch (error) {
    console.error("خطأ في جلب البيانات:", error);
    return null;
  }
}

// دالة عرض البيانات في الـ DOM والتحكم في زِر الحجز
async function renderPatientHomePage() {
  const data = await getPatientHomeData("1");

  if (!data) return;

  // 1. ملء البيانات في العناصر
  document.getElementById("doctorName").textContent = data.doctorName;
  document.getElementById("doctorImg").src += data.doctorImage;
  document.getElementById("doctorImg").alt = data.doctorName;
  document.getElementById("doctorSpecialty").textContent = data.specialty;
  document.getElementById("clinicLocation").textContent = data.location;
  document.getElementById("clinicAddress").textContent = data.clinicAddress;
  document.getElementById("consultationFee").textContent = `${data.consultationFee} ج.م`;
  document.getElementById("waitingCount").textContent = data.waitingCount;
  document.getElementById("appointmentTime").textContent = data.appointmentTime;

  // 2. التحكم في زِر الحجز وعرض الحالة
  const bookBtn = document.getElementById("bookBtn");
  const bookingStatus = document.getElementById("bookingStatus");

  if (data.isAvailable) {
    // الدكتور متاح
    bookBtn.disabled = false;
    bookBtn.style.display = "block"; // أو "inline-block" حسب الـ Layout
    bookBtn.textContent = "إحجز الآن";
    bookBtn.classList.remove("btn-disabled");
    
    bookingStatus.textContent = "متاح للحجز";
    bookingStatus.className = "confirmed";
  } else {
    // الدكتور غير متاح
    bookBtn.disabled = true;
    bookBtn.textContent = "غير متاح للحجز حالياً";
    bookBtn.classList.add("btn-disabled");
    
    // خيار بديل: لو حابة تخفيه تماماً بدل ما تخليه Disabled استخدمي السطر ده:
    // bookBtn.style.display = "none";

    bookingStatus.textContent = "غير متاح";
    bookingStatus.style.color = "#d9534f"; // لون أحمر للتنبيه
  }
}

// تشغيل الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", renderPatientHomePage);
bookBtn.addEventListener("click", (e) =>{
  e.preventDefault();
  window.location.href = "bookingConfirmation.html";
})