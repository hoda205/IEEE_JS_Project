  import { checkAuth } from "../checkAuth.js";

async function loadPatient() {

  const patientId = "1";

  const data = await getPatientDetails(patientId);

  console.log(data);

}

loadPatient();


// جلب تفاصيل المريض بالكامل
async function getPatientDetails(patientUserId) {
  try {
    const [userRes, profileRes, historyRes] = await Promise.all([
      fetch("http://localhost:3000/users"),
      fetch("http://localhost:3000/patient_profiles"),
      fetch("http://localhost:3000/medical_records"),
    ]);

    const users = await userRes.json();
    const profiles = await profileRes.json();
    const history = await historyRes.json();

    // بيانات المستخدم
    const userInfo = users.find((user) => user.id === patientUserId);

    // بروفايل المريض
    const profile = profiles.find(
      (profile) => profile.userId === patientUserId,
    );

    // الأرشيف الطبي
    const medicalHistory = history.filter(
      (record) => record.patientId === patientUserId,
    );

    if (!userInfo) {
      return null;
    }

    return {
      userInfo: userInfo,
      profile: profile || {},
      medicalHistory: medicalHistory,
    };
  } catch (error) {
    console.error("خطأ في جلب تفاصيل المريض:", error);
  }
}
