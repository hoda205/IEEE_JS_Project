// حفظ نتيجة الكشف وإنهاء الموعد
async function saveConsultation({
    appointmentId,
    patientId,
    doctorId,
    diagnosis,
    notes,
    medicines,
    dietPlan = null,
    requestedLabTests = []
}) {
    try {
        const today = new Date().toISOString().split("T")[0];

        // 1. إنشاء سجل طبي جديد
        const recordRes = await fetch("http://localhost:3000/medical_records", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                appointmentId,
                patientId,
                doctorId,
                visit_date: today,
                diagnosis,
                doctor_notes: notes,
                prescriptions: medicines.map(med => ({
                    medicine: med.name,
                    dosage: med.dosage,
                    duration: med.duration
                })),
                diet_plan: dietPlan,
                requested_lab_tests: requestedLabTests,
                created_at: new Date().toISOString()
            })
        });

        const newRecord = await recordRes.json();

        // 2. تحديث حالة الحجز إلى مكتمل
        await fetch(`http://localhost:3000/appointments/${appointmentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "completed" })
        });

        alert("تم حفظ الكشف بنجاح!");
        return newRecord;
    } catch (error) {
        console.error("خطأ في حفظ الكشف:", error);
    }
}

export default saveConsultation;