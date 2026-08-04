async function saveConsultation({
  appointmentId,
  diagnosis,
  notes,
  medicines,
  dietPlan = null,
  requestedLabTests = [],
}) {
  try {
    // ============================
    // جلب بيانات الحجز باستخدام find
    // ============================

    const appointmentsRes = await fetch("http://localhost:3000/appointments");

    if (!appointmentsRes.ok) {
      throw new Error("فشل جلب الحجوزات");
    }

    const appointments = await appointmentsRes.json();

    const appointment = appointments.find(
      (item) => String(item.id) === String(appointmentId),
    );

    if (!appointment) {
      throw new Error("الحجز غير موجود");
    }

    const { patientId, doctorId } = appointment;

    console.log("بيانات الحجز:", {
      appointmentId: appointment.id,
      patientId,
      doctorId,
    });

    const today = new Date().toISOString().split("T")[0];

    // ============================
    // حفظ السجل الطبي
    // ============================

    const recordRes = await fetch("http://localhost:3000/medical_records", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        appointmentId: appointment.id,

        patientId,

        doctorId,

        visit_date: today,

        diagnosis,

        doctor_notes: notes,

        prescriptions: medicines.map((med) => ({
          medicine: med.name,

          dosage: med.dosage,

          duration: med.duration,
        })),

        diet_plan: dietPlan,

        requested_lab_tests: requestedLabTests,

        created_at: new Date().toISOString(),
      }),
    });

    if (!recordRes.ok) {
      throw new Error("فشل حفظ السجل الطبي");
    }

    const newRecord = await recordRes.json();

    console.log("تم حفظ السجل الطبي:", newRecord);

    // ============================
    // تحديث حالة الحجز
    // ============================

    const updateRes = await fetch(
      `http://localhost:3000/appointments/${appointment.id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status: "completed",
        }),
      },
    );

    if (!updateRes.ok) {
      const errorText = await updateRes.text();

      console.error("خطأ تحديث الحجز:", errorText);

      throw new Error("فشل تحديث حالة الحجز");
    }

    const updatedAppointment = await updateRes.json();

    console.log("تم تحديث الحجز:", updatedAppointment);

    return newRecord;
  } catch (error) {
    console.error("خطأ في حفظ الكشف:", error);

    throw error;
  }
}

export default saveConsultation;
