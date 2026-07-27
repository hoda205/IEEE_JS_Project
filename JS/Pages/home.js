import checkPatientAppointment from "../checkPatientAppointment.js";

checkPatientAppointment();

// جلب بيانات الصفحة الرئيسية للمريض

async function getPatientHomeData(doctorId = "1") {
  try {
    // جلب بيانات الدكتور من users

    const usersRes = await fetch("http://localhost:3000/users");

    const users = await usersRes.json();

    // جلب بيانات تخصص الدكتور

    const doctorsRes = await fetch("http://localhost:3000/doctor_profiles");

    const doctorProfiles = await doctorsRes.json();

    const doctorProfile = doctorProfiles.find(
      (doctor) => doctor.id === doctorId,
    );

    // التأكد أن الدكتور موجود

    if (!doctorProfile) {
      throw new Error("Doctor profile not found");
    }

    // جلب بيانات المستخدم الخاص بالدكتور

    const doctorUser = users.find((user) => user.id === doctorProfile.userId);

    // ==========================

    // تحديد مكان الدكتور حاليا

    // ==========================

    // جلب جدول المواعيد

    const schedulesRes = await fetch("http://localhost:3000/schedules");

    const schedules = await schedulesRes.json();

    const now = new Date();

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

    // الوقت الحالي HH:MM

    const currentTime = now

      .toTimeString()

      .slice(0, 5);

    // إيجاد موعد الدكتور الحالي

    const currentSchedule = schedules.find(
      (schedule) =>
        schedule.doctorId === doctorId &&
        schedule.day_of_week === todayName &&
        schedule.is_active === true &&
        currentTime >= schedule.start_time &&
        currentTime <= schedule.end_time,
    );

    let clinicLocation = "الدكتور غير متاح حاليا";

    if (currentSchedule) {
      const locationsRes = await fetch(
        "http://localhost:3000/clinic_locations",
      );

      const locations = await locationsRes.json();

      const location = locations.find(
        (location) => location.id === currentSchedule.clinicLocationId,
      );

      if (location) {
        clinicLocation = location.location_name;
      }
    }

    // ==========================

    // حساب عدد المنتظرين اليوم

    // ==========================

    const appointmentsRes = await fetch("http://localhost:3000/appointments");

    const appointments = await appointmentsRes.json();

    const today = new Date()

      .toISOString()

      .split("T")[0];

    const todayAppointments = appointments.filter(
      (appointment) =>
        appointment.doctorId === doctorId && appointment.booking_date === today,
    );

    const waitingCount = todayAppointments.filter(
      (appointment) =>
        appointment.status === "waiting" ||
        appointment.status === "in_consultation",
    ).length;

    return {
      doctorName: doctorUser.full_name,

      doctorImage: doctorUser.profile_image,

      specialty: doctorProfile.specialty,

      consultationFee: doctorProfile.consultation_fee,

      location: clinicLocation,

      waitingCount: waitingCount,
    };
  } catch (error) {
    console.error(
      "خطأ في جلب بيانات الصفحة الرئيسية:",

      error,
    );
  }
}

async function patientHomeData() {
  const data = await getPatientHomeData();
  console.log(data);
  return data;
}

console.log(patientHomeData());

// "الدكتور غير متاح حاليا"
// location
// معناه ان الدكتور مش شغال دلوقتي
