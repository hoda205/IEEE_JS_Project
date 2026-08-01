import { loadPatient } from "./getPatientDetails.js";

async function loadUserInfo() {
  let userInfo = await loadPatient();
  let data = userInfo.userInfo;
  
  let fullname = document.getElementById("fullname");
  let number = document.getElementById("number");
  let date = document.getElementById("date");
  let img = document.getElementById("profileImg");
  
  fullname.textContent = data.full_name;
  number.textContent = data.phone_number;
  date.textContent = data.date_of_birth;

  img.src = data.profile_image
    ? `http://localhost:3001/uploads/${data.profile_image}`
    : "../../assets/users/default.png";
}

loadUserInfo();

let editInfo = document.getElementById("editInfo");
let editPass = document.getElementById("editPass");
let cancelBtn = document.getElementById("cancelBtn");

let modal = document.getElementById("modalForm");
let formTitle = document.getElementById("modalTite");

let editInfoForm = document.getElementById("editInfoForm");
let changPassForm = document.getElementById("changPassForm");

let fullN = document.getElementById("fullN");
let phoneN = document.getElementById("phoneN");
let dateB = document.getElementById("dateB");

let containerFileInput = document.getElementById("containerFileInput");
let fileInput = document.getElementById("fileInput");
let previewImg = document.getElementById("preview");
let upload = document.getElementById("upload");

function showModal() {
  modal.classList.add("modalApp");
}

export function hiddenModal() {
  modal.classList.remove("modalApp");
  
  editInfoForm.style.display = "none";
  changPassForm.style.display = "none";
  document.getElementById("editUserImgForm").style.display = "none";
}
hiddenModal();

async function editInfoFunc() {
  showModal();

  editInfoForm.style.display = "flex";
  formTitle.textContent = "تعديل البيانات الشخصية";

  let userInfo = await loadPatient();
  let data = userInfo.userInfo;

  fullN.value = data.full_name;
  phoneN.value = data.phone_number;
  dateB.value = formatToInputDate(data.date_of_birth);

  document.querySelector("#phoneN + p").textContent = "";
  document.querySelector("#fullN + p").textContent = "";
}

function changePassFunc() {
  showModal();

  changPassForm.style.display = "flex";
  formTitle.textContent = "تغيير كلمة المرور";

  document.querySelector("#confirmPassError").textContent = "";
  document.querySelector("#currentPssError").textContent = "";

  document.getElementById("currentPss").value = "";
  document.getElementById("newPass").value = "";
  document.getElementById("confirmPass").value = "";
}

editInfo.addEventListener("click", editInfoFunc);
editPass.addEventListener("click", changePassFunc);
cancelBtn.addEventListener("click", hiddenModal);
document.getElementById("editImg").addEventListener("click", () =>{
  previewImg.style.display = "none";
    containerFileInput.querySelector("div").style.display = "flex";
    previewImg.src = "";

  document.getElementById("editUserImgForm").style.display = "flex";
  showModal();
  formTitle.textContent = "تعديل صورة الملف الشخصي   ";
})
containerFileInput.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];


  if (file) {
    previewImg.style.display = "block";
    containerFileInput.querySelector("div").style.display = "none";
    previewImg.src = URL.createObjectURL(file);
  }
});

upload.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!fileInput.files.length) {
    document.getElementById("uploadImgError").textContent =
      "اختاري صورة أولاً";
    return;
  }

  document.getElementById("uploadImgError").textContent = "";

  try {
    const userInfo = await loadPatient();
    const userId = userInfo.userInfo.id;
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    const uploadResponse = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("فشل رفع الصورة");
    }

    const uploadData = await uploadResponse.json();

    await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_image: uploadData.image,
      }),
    });

    document.getElementById(
      "profileImg"
    ).src = `http://localhost:3001/uploads/${uploadData.image}`;

    document.getElementById("editUserImgForm").style.display = "none";
    hiddenModal();

    console.log("تم تحديث الصورة");
  } catch (error) {
    console.error(error);
    document.getElementById("uploadImgError").textContent =
      "حدث خطأ أثناء رفع الصورة";
  }
});

function formatToInputDate(dateStr) {
  if (!dateStr) return "";

  const parts = dateStr.split("-");

  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }

  return dateStr;
}