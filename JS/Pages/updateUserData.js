import { checkAuth } from "../checkAuth.js";
import {hiddenModal} from './getUserInfor.js'
const user = checkAuth();

console.log(user);

async function checkPhoneNumber(phoneNumber) {
  try {
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();

    const isExist = users.some(
      (u) => u.phone_number === phoneNumber && u.id !== user.id, // تجاهل رقم المستخدم الحالي
    );

    return !isExist;
  } catch (error) {
    console.error("خطأ أثناء التحقق من رقم الهاتف:", error);
    return false;
  }
}

export async function updateUser(userId, updatedData) {
  console.log(userId, updatedData)
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("فشل في تحديث البيانات");
    }

    const updatedUser = await response.json();

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    return updatedUser;
  } catch (error) {
    console.error("خطأ في تحديث البيانات:", error);
    return null;
  }
}

let fullN = document.getElementById("fullN");
let phoneN = document.getElementById("phoneN");
let dateB = document.getElementById("dateB");
let editInfoBtn = document.getElementById("editInfoBtn");

async function validation() {
  let isValid = true;

  if (fullN.value.trim() === "") {
    document.querySelector("#fullN + p").textContent = "ما ينفعش تسيبه فاضي";

    isValid = false;
  } else document.querySelector("#fullN + p").textContent = "";

  if (phoneN.value.trim() === "") {
    document.querySelector("#phoneN + p").textContent = "ما ينفعش تسيبه فاضي";

    isValid = false;
  } else if (phoneN.value.length < 11) {
    document.querySelector("#phoneN + p").textContent =
      "دخل رقم شغال ما تعبناش معاك";

    isValid = false;
  } else document.querySelector("#phoneN + p").textContent = "";

  return isValid;
}

editInfoBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const valid = await validation();

  if (!valid) return;

  if (user.phone_number !== phoneN.value) {
    const validNumber = await checkPhoneNumber(phoneN.value);

    if (!validNumber) {
      document.querySelector("#phoneN + p").textContent =
        "الرقم ده مستخدم قبل كده";

      return;
    }
  } else document.querySelector("#phoneN + p").textContent = "";

  const updatedData = {
    date_of_birth: dateB.value,
    phone_number: phoneN.value,
    full_name: fullN.value,
  };

  const updatedUser = await updateUser(user.id, updatedData);

  if (!updatedUser) return;

  hiddenModal();
  

  // showSuccessPopup();
  // showSuccessPopup(); 
  // setTimeout(() => {
  //   document.getElementById("successPopup").style.display = "none";
  // }, 20000);
  
});
function showSuccessPopup() {
  const popup = document.querySelector(".success-popup");
  const range = document.querySelector(".range");

  popup.style.display = "flex";

  // إعادة تشغيل حركة الشريط
  range.style.animation = "none";
  range.offsetHeight;
  range.style.animation = "range 3s linear";

  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}


// setTimeout(() => {
//   document.getElementById("successPopup").style.display = "none";
// }, 2000);