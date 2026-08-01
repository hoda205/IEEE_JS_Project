function getPatientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return "غير محدد"; // حماية في حالة عدم وجود تاريخ ميلاد

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

// دالة لتجهيز تاريخ اليوم بتنسيق عربي مناسب (مثال: 2026/8/1)
function getTodayDate() {
    const today = new Date();
    return today.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
    });
}

async function displayPatientData() {
    const patientId = getPatientId();

    // جلب عناصر الـ DOM بالـ ID
    const nameContainer = document.getElementById("name");
    const ageContainer = document.getElementById("age");
    const dateContainer = document.getElementById("date");

    if (!patientId) {
        console.error("لم يتم العثور على ID المريض في الرابط");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/users");

        if (!response.ok) {
            throw new Error("فشل الاتصال بالسيرفر");
        }

        const users = await response.json();
        const patient = users.find(user => String(user.id) === patientId);

        if (patient) {
            // عرض البيانات المجلوبة
            if (nameContainer) nameContainer.innerHTML += ` <span>${patient.full_name}</span>`;
            if (ageContainer) ageContainer.innerHTML += ` <span>${calculateAge(patient.date_of_birth)} سنة</span>`;
            if (dateContainer) dateContainer.innerHTML += ` <span>${getTodayDate()}</span>`;
        } else {
            console.warn("المريض غير موجود بقاعدة البيانات");
        }
    } catch (error) {
        console.error("حدث خطأ أثناء جلب بيانات المريض:", error);
    }
}

displayPatientData();