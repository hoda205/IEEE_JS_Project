    import isUser from "../isUser.js";
    isUser();

// عناصر الـ DOM
const form = document.getElementById("registerForm");
// console.log(form)
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("birthDate");
const pass = document.getElementById("password");
const rePass = document.getElementById("confirmPassword");

const errorname = document.getElementById("errorname");
const erroremail = document.getElementById("erroremail");
const errorpass = document.getElementById("errorpass");


// دالة إظهار/إخفاء كلمة المرور (متاح ربطها عالمياً للـ HTML)
window.showPass = function() {
    let icon = document.getElementById("iconeye");
    if (pass.type === "password") {
        pass.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        pass.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
};

window.showPassrepete = function() {
    let icon = document.getElementById("iconeye2");
    if (rePass.type === "password") {
        rePass.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        rePass.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
};

// Validations
nameInput.onblur = function () {
    let regex = /^[\u0600-\u06FFa-zA-Z\s]{3,}$/; // يدعم عربي وإنجليزي
    if (!regex.test(nameInput.value) && nameInput.value !== "") {
        errorname.innerText = "من فضلك أدخل اسماً صحيحاً";
        nameInput.classList.add("error-border");
    } else {
        errorname.innerText = "";
        nameInput.classList.remove("error-border");
    }
};

emailInput.onblur = function () {
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(emailInput.value) && emailInput.value !== "") {
        erroremail.innerText = "من فضلك أدخل بريد إلكتروني صحيح";
        emailInput.classList.add("error-border");
    } else {
        erroremail.innerText = ""; // تصحيح الخطأ هنا
        emailInput.classList.remove("error-border");
    }
};

rePass.onblur = function () {
    if (pass.value !== rePass.value) {
        errorpass.innerText = "كلمات المرور غير متطابقة";
        rePass.classList.add("error-border");
    } else {
        errorpass.innerText = "";
        rePass.classList.remove("error-border");
    }
};

// Event Listener عند إرسال النموذج
form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (pass.value !== rePass.value) {
        errorpass.innerText = "كلمات المرور غير متطابقة";
        return;
    }

    registerPatient(nameInput.value, phoneInput.value, dobInput.value, pass.value);
});

// API Registration
async function registerPatient(fullName, phone, dob, password) {
  try {
    const usersResponse = await fetch("http://localhost:3000/users");
    const users = await usersResponse.json();

    const exists = users.some((user) => user.phone_number === phone);
    if (exists) {
      alert("رقم الهاتف مستخدم بالفعل");
      return;
    }

    const userRes = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    await fetch("http://localhost:3000/patient_profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    // alert("تم إنشاء الحساب بنجاح! يمكنك الدخول الآن.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("خطأ في التسجيل:", error);
  }
}
document.getElementById("showPassBtn").addEventListener("click", showPass)
document.getElementById("showConBtn").addEventListener("click", showPassrepete)