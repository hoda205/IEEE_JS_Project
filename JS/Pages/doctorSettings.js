const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const profilesRes = await fetch("http://localhost:3000/doctor_profiles");

const profiles = await profilesRes.json();

const doctorProfile = profiles.find(
  (profile) => profile.userId === currentUser.id,
);

console.log(doctorProfile.id);

// تحديث إعدادات العيادة
async function updateDoctorSettings(doctorId = "1", settings) {
  try {
    // جلب كل بيانات الدكتور
    const response = await fetch("http://localhost:3000/doctor_profiles");

    const profiles = await response.json();

    // البحث عن بروفايل الدكتور
    const doctorProfile = profiles.find((profile) => profile.id === doctorId);

    if (!doctorProfile) {
      alert("بيانات الدكتور غير موجودة");
      return;
    }

    // تحديث الإعدادات
    await fetch(`http://localhost:3000/doctor_profiles/${doctorProfile.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    alert("تم حفظ الإعدادات بنجاح");
  } catch (error) {
    console.error("خطأ في تحديث إعدادات الدكتور:", error);
  }
}

// updateDoctorSettings(doctorProfile.id, {
//   consultation_fee: 350,
//   no_show_penalty: 100,
//   is_booking_open: false,
// });
