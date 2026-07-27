import isUser from "../isUser.js";

isUser();

async function registerPatient(fullName, phone, dob, password) {
  try {
    // التأكد أن الرقم غير مستخدم

    const usersResponse = await fetch("http://localhost:3000/users");

    const users = await usersResponse.json();

    const exists = users.some((user) => user.phone_number === phone);

    if (exists) {
      alert("رقم الهاتف مستخدم بالفعل");

      return;
    }

    // إنشاء المستخدم

    const userRes = await fetch("http://localhost:3000/users", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        full_name: fullName,

        phone_number: phone,

        password: password,

        role: "patient",

        date_of_birth: dob,

        profile_image: "default.png",
      }),
    });

    const newUser = await userRes.json();

    // إنشاء patient profile

    await fetch("http://localhost:3000/patient_profiles", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId: newUser.id,

        gender: "غير محدد",

        blood_type: "A+",

        marital_status: "غير محدد",

        address: "",

        allergies: [],

        chronic_diseases: [],
      }),
    });

    alert("تم إنشاء الحساب بنجاح! يمكنك الدخول الآن.");

    window.location.href = "login.html";
  } catch (error) {
    console.error("خطأ في التسجيل:", error);
  }
}
