  import { checkAuth } from "../checkAuth.js";

 const patient = checkAuth();

if (patient) {
  loadQueue();
} else {
  window.location.replace("login.html");
}

  // تحميل بيانات الطابور
  async function loadQueue() {
    const queue = await getPatientMedicalHistory(patient.id);

    if (!queue) return;

    console.log(queue);

    // مثال لعرض البيانات
    // document.getElementById("myQueue").textContent = queue.myQueueNumber;
    // document.getElementById("currentQueue").textContent = queue.currentQueueNumber;
    // document.getElementById("patientsAhead").textContent = queue.patientsAhead;
    // document.getElementById("estimatedTime").textContent = queue.estimatedMinutes;
  }

// جلب الأرشيف الطبي للمريض
async function getPatientMedicalHistory(patientUserId) {
  try {

    // جلب كل السجلات الطبية
    const recordsRes = await fetch(
      "http://localhost:3000/medical_records"
    );

    const records = await recordsRes.json();


    // فلترة سجلات المريض
    const patientRecords = records.filter(
      record => record.patientId === patientUserId
    );


    return patientRecords;


  } catch (error) {

    console.error(
      "خطأ في جلب الأرشيف الطبي:",
      error
    );

  }
}