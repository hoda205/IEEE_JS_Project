import { checkAuth } from "../checkAuth.js";

let user = checkAuth();

const fullName = user?.full_name || "";
const nameParts = fullName.trim().split(" ");
const firstNameTwo = nameParts.slice(0, 2).join(" ");

// console.log(firstNameTwo); 
function addHeader() {
  // 1. إضافة الـ CSS الخاص بالـ Header
  document.head.insertAdjacentHTML(
    "beforeend",
    `<link rel="stylesheet" href="../CSS/header.css">`
  );

  // 2. إدراج الـ HTML الخاص بالـ Header
  // استخدام صورة افتراضية في حالة عدم وجود profile_image
  const profileImgSrc = user?.profile_image
    ? `http://localhost:3001/uploads/${user.profile_image}`
    : `http://localhost:3001/uploads/default.png`;

  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <header class="patient-header">
        <div class= "container" > 
            <img src="../assets/logo.png" alt="logo" class="logo">

            <div class="rightSide">
                <i class="fa-regular fa-bell"></i>
                
                <div class="userInfo">
                    <div class="img-pages">
                        <img id="userImg" src="${profileImgSrc}" alt="profile img">

                        <ul id="pages" style="display: none;">
                            <li><a href="./home.html">الصفحة الرئيسية</a></li>
                            <li><a href="./profile.html">الملف الشخصي</a></li>
                            <li><a href="./medicalHistory.html">التاريخ الطبي</a></li>
                            <li class="logout" id="logoutBtn">تسجيل خروج</li>
                        </ul>
                    </div>
                    <p id="userName">${firstNameTwo || "المريض"}</p>
                </div>
            </div>
        </div>
    </header>`
  );

  // 3. ربط الـ Events بعد ما العناصر تترسم في الـ DOM
  initHeaderEvents();
}

function initHeaderEvents() {
  const userImg = document.getElementById("userImg");
  const pages = document.getElementById("pages");

  if (!userImg || !pages) return;

  // فتح / إغلاق القائمة عند الضغط على صورة المستخدِم (Toggle)
  userImg.addEventListener("click", (event) => {
    event.stopPropagation();
    const isVisible = pages.style.display === "flex";
    pages.style.display = isVisible ? "none" : "flex";
  });

  // منع إغلاق القائمة عند الضغط داخلها
  pages.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // إغلاق القائمة عند الضغط في أي مكان آخر بالصفحة
  document.addEventListener("click", () => {
    pages.style.display = "none";
  });
}

// 🚀 استدعاء الدالة لبناء الـ Header فور استيراد الملف
addHeader();

document.getElementById("logoutBtn").addEventListener("click", () =>{
    localStorage.removeItem("currentUser")
    window.location.href = "login.html";
})