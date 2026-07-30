console.log(document.querySelector("#currentPssError"))
import { checkAuth } from "../checkAuth.js";
import { hiddenModal } from "./getUserInfor.js";
import { updateUser } from "./updateUserData.js";

const user = checkAuth();

let currentPss = document.getElementById("currentPss");
let newPass = document.getElementById("newPass");
let confirmPass = document.getElementById("confirmPass");
let changePassBtn = document.getElementById("changePassBtn");

changePassBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  let isValid = true;

  // تم تحديث الـ Selector ليتناسب مع الهيكل الجديد للـ HTML بعد إضافة Wrapper
  if (currentPss.value !== user.password) {
    document.querySelector("#currentPssError").textContent =
      "كلمة المرور الحالية غير صحيحة";
    isValid = false;
  } else {
    document.querySelector("#currentPssError").textContent =
      "";
  }

  // ✅ التعديل الصحيح لحقل تأكيد كلمة المرور:
  if (newPass.value !== confirmPass.value) {
    document.querySelector("#confirmPassError").textContent =
      "تأكيد كلمة المرور غير مطابق";
    isValid = false;
  } else {
    document.querySelector("#confirmPassError").textContent =
      "";
  }

  if (!isValid) return;

  const updatedUser = await updateUser(user.id, {
    password: newPass.value,
  });

  if (!updatedUser) return;

  user.password = newPass.value;
  localStorage.setItem("currentUser", JSON.stringify(user));
  hiddenModal();
 
});

// منطق تشغيل أزرار العين لتبديل الرؤية لجميع الحقول
document.querySelectorAll(".password-wrapper").forEach((wrapper) => {
  const input = wrapper.querySelector("input");
  const icons = wrapper.querySelectorAll(".toggle-password");

  icons.forEach((icon) => {
    icon.addEventListener("click", () => {
      // تبديل نوع الحقل الحالي فقط
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      // تبديل الأيقونات النشطة داخل نفس الحاوية فقط
      wrapper.querySelectorAll(".toggle-password").forEach((i) => {
        i.classList.toggle("d-none");
      });
    });
  });
});