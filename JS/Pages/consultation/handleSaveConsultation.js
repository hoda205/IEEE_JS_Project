import saveConsultation from './saveConsultation.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const printBtn = document.getElementById("secondBtn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // يمنع إعادة تحميل الصفحة

        // 1. تفعيل زر الطباعة فوراً بعد الضغط على الحفظ
        if (printBtn) {
            printBtn.disabled = false;
        }

        // 2. قراءة النصوص
        const diagnosis = document.getElementById("diagnosis").value.trim();
        const notes = document.getElementById("notes").value.trim();

        // 3. قراءة أدوية الجدول
        const medicineRows = document.querySelectorAll("#medicine tbody tr");
        const medicines = [];

        medicineRows.forEach(row => {
            const cells = row.querySelectorAll("td");
            const name = cells[1].textContent.trim();
            const dosage = cells[2].textContent.trim();
            const duration = cells[3].textContent.trim();

            if (name !== "") {
                medicines.push({ name, dosage, duration });
            }
        });

        // 4. قراءة الـ IDs من رابط الصفحة
        const params = new URLSearchParams(window.location.search);
        const patientId = params.get("id");
        const appointmentId = params.get("appointmentId") || "1";
        const doctorId = params.get("doctorId") || "1";

        // 5. استدعاء دالة الحفظ
        await saveConsultation({
            appointmentId,
            patientId,
            doctorId,
            diagnosis,
            notes,
            medicines
        });
    });
    
});