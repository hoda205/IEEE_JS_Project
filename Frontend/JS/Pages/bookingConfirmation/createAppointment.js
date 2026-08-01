// إنشاء حجز جديد للمريض
async function createAppointment(patientUserId, doctorId = "1") {
    console.log("createAppointment started", patientUserId);
    try {
        // التأكد أن المريض ليس لديه حجز نشط
        console.log("before appointments fetch");
        const appointmentsRes = await fetch("http://localhost:3000/appointments");
        const appointments = await appointmentsRes.json();
        console.log("appointments loaded");
        console.log("appointments loaded", appointments);
        const activeAppointment = appointments.find(
            (appointment) =>
                appointment.patientId === patientUserId &&
                (appointment.status === "waiting" ||
                    appointment.status === "in_consultation"),
        );

        if (activeAppointment) {
            // alert("لديك حجز قائم بالفعل، لا يمكنك الحجز مرة أخرى حاليا");
            return activeAppointment.id;
        }
        const now = new Date();

        const today = now.toISOString().split("T")[0];

        // معرفة اليوم الحالي
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

        const currentTime = now.toTimeString().slice(0, 5);

        // 1) جلب الحجوزات

        const todayAppointments = appointments.filter(
            (app) => app.doctorId === doctorId && app.booking_date === today,
        );
        console.log("today appointments done");
        const nextQueueNumber = todayAppointments.length + 1;

        // 2) جلب بيانات الدكتور
        const docRes = await fetch("http://localhost:3000/doctor_profiles");

        const doctorProfiles = await docRes.json();
        console.log("doctor fetched");
        const docProfile = doctorProfiles.find((doctor) => doctor.id === doctorId);
        console.log("doctor profile", docProfile);
        if (!docProfile) {
            throw new Error("Doctor not found");
        }

        // 3) معرفة جدول الدكتور الحالي
        const scheduleRes = await fetch("http://localhost:3000/schedules");

        const schedules = await scheduleRes.json();
        console.log("schedule fetched");
        const currentSchedule = schedules.find(
            (schedule) =>
                schedule.doctorId === doctorId &&
                schedule.day_of_week === todayName &&
                schedule.is_active === true &&
                currentTime >= schedule.start_time &&
                currentTime <= schedule.end_time,
        );
        console.log("schedule", currentSchedule);
        if (!currentSchedule) {
            alert("الدكتور غير متاح للحجز حاليا");
            return;
        }

        // 4) إنشاء الحجز
        const newAppointment = {
            patientId: patientUserId,

            doctorId: doctorId,

            scheduleId: currentSchedule.id,

            clinicLocationId: currentSchedule.clinicLocationId,

            booking_date: today,

            queue_number: nextQueueNumber,

            status: "waiting",

            consultation_fee: docProfile.consultation_fee,

            no_show_penalty: docProfile.no_show_penalty,

            created_at: new Date().toISOString(),
        };
        console.log("before post");
        console.log(newAppointment);
        const response = await fetch("http://localhost:3000/appointments", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(newAppointment),
        });
        const savedApp = await response.json();
        return savedApp.id;
    } catch (error) {
        console.error("خطأ في إنشاء الحجز:", error);
    }
}

export default createAppointment;