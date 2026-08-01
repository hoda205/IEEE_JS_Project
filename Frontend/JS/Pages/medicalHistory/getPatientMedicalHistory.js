    import displayPatientData from "./displayPatientData.js";
import { checkAuth } from "../../checkAuth.js";
const patient = checkAuth();

if (patient) {
    // console.log(patient);
    // displayPatientData(patient);
    loadMedicalHistory();
} else {
    window.location.replace("login.html");
}

// تحميل بيانات الطابور
async function loadMedicalHistory() {
    console.log("loadMedicalHistory started");

    const history = await getPatientMedicalHistory(patient.id);

    console.log(history);

    if (!history) return;

    const medicalHistory = document.getElementById("medical-history");

    if (history.length === 0) {
        medicalHistory.innerHTML = "لا توجد زيارات سابقة.";
        return;
    }

    history.forEach(record => {

        const card = document.createElement("div");
        card.className = "visit-card";

        const visitDate = new Date(record.visit_date).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        card.innerHTML = `
            <div class="visit-header">
            <p>${visitDate}</p>
            <button class="show-btn">عرض تفاصيل الزيارة</button>
            </div>
        `;

        const showBtn = card.querySelector(".show-btn");

        showBtn.addEventListener("click", () => {

            const details = card.querySelector(".visit-details");

            // لو التفاصيل ظاهرة اخفيها
            if (details) {
                details.remove();
                showBtn.textContent = "عرض تفاصيل الزيارة";
                return;
            }

            // إنشاء جزء التفاصيل
            const visitDetails = document.createElement("div");
            visitDetails.className = "visit-details";

            visitDetails.innerHTML = `
                <h3>التشخيص:</h3>
                <p>${record.diagnosis}</p>

                <h3>الملاحظات:</h3>
                <p>${record.doctor_notes}</p>
            `;

            if (record.prescriptions && record.prescriptions.length > 0) {

                visitDetails.innerHTML += `
                    <h3>الوصفة العلاجية:</h3>

                    <table>
                        <thead>
                            <tr>
                                <th>الدواء</th>
                                <th>الجرعة</th>
                                <th>المدة</th>
                            </tr>
                        </thead>

                        <tbody></tbody>
                    </table>
                `;

                const tbody = visitDetails.querySelector("tbody");

                record.prescriptions.forEach(pre => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${pre.medicine}</td>
                            <td>${pre.dosage}</td>
                            <td>${pre.duration}</td>
                        </tr>
                    `;
                });

            } else {

                visitDetails.innerHTML += `
                    <h3>الوصفة العلاجية:</h3>
                    <p>لا توجد أدوية موصوفة.</p>
                `;
            }

            card.appendChild(visitDetails);

            showBtn.textContent = "إخفاء التفاصيل";
        });

        medicalHistory.appendChild(card);
    });
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
        console.log(records);
        const patientRecords = records
            .filter(record => record.patientId === patientUserId)
            .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));

        return patientRecords;
    } catch (error) {

        console.error(
            "خطأ في جلب الأرشيف الطبي:",
            error
        );

    }
}