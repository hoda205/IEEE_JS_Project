 import isUser from "../isUser.js";
    isUser();
// 1. تحديد العناصر من الـ DOM
const loginForm = document.getElementById("loginForm");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const showPassBtn = document.getElementById("showPassword");
const iconEye = document.getElementById("iconeye");
const errorMsg = document.getElementById("errorMsg");

// 2. دالة إظهار / إخفاء كلمة المرور
showPassBtn.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        iconEye.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        passwordInput.type = "password";
        iconEye.classList.replace("fa-eye-slash", "fa-eye");
    }
});

// 3. معالجة إرسال نموذج تسجيل الدخول
loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    const phone = phoneInput.value.trim();
    const password = passwordInput.value;

    try {
        // جلب المستخدمين من الـ API
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) throw new Error("تعذر الاتصال بالخادم");

        const users = await response.json();

        // البحث عن المستخدم ببيانات الهاتف وكلمة المرور
        const user = users.find(
            (u) => u.phone_number === phone && u.password === password
        );

        if (user) {
            // alert(`أهلاً بك، ${user.full_name}! تم تسجيل الدخول بنجاح.`);
            
            // حفظ بيانات الجلسة (اختياري)
            localStorage.setItem("currentUser", JSON.stringify(user));

            // التوجيه للصفحة الرئيسية أو لوحة التحكم
            window.location.href = "home.html";
        } else {
            // alert("رقم الهاتف أو كلمة المرور غير صحيحة.");
            errorMsg.textContent = "رقم الهاتف أو كلمة المرور غير صحيحة.";
        }
    } catch (error) {
        console.error("خطأ أثناء تسجيل الدخول:", error);
        // alert();
        errorMsg.textContent = "حدث خطأ أثناء محاولة تسجيل الدخول، يُرجى المحاولة لاحقاً.";
    }
});