import { loadPatient } from "./getPatientDetails.js";
import { updateUser } from "./updateUserData.js";
export async function loadUserInfo() {
  let userInfo = await loadPatient();
  let data = userInfo.userInfo;

  let fullname = document.getElementById("fullname");
  let mainName = document.getElementById("mainName");
  let number = document.getElementById("number");
  let date = document.getElementById("date");
  let img = document.getElementById("profileImg");

  fullname.textContent = data.full_name;
  mainName.textContent = data.full_name;
  number.textContent = data.phone_number;
  date.textContent = data.date_of_birth;
  // console.log(data.profile_image)
  img.src = data.profile_image
    ? `http://localhost:3001/uploads/${data.profile_image}`
    : `http://localhost:3001/uploads/default.png`;
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
let deleteImage = document.getElementById("deleteImage");
export function showModal() {
  modal.classList.add("modalApp");
}

export function hiddenModal() {
  modal.classList.remove("modalApp");

  editInfoForm.style.display = "none";
  changPassForm.style.display = "none";
  document.getElementById("editUserImgForm").style.display = "none";
  document.getElementById("editMedicalForm").style.display = "none";
}
hiddenModal();
// showModal();
export function enableSaveButton(inputs, button) {
  button.disabled = true;

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      button.disabled = false;
    });

    input.addEventListener("change", () => {
      button.disabled = false;
    });
  });
}
async function editInfoFunc() {
  
  const infoInputs = [fullN, phoneN, dateB];
  enableSaveButton(infoInputs, editInfoBtn);

  showModal();

  editInfoForm.style.display = "flex";
  formTitle.textContent = "تعديل البيانات الشخصية";

  let userInfo = await loadPatient();
  let data = userInfo.userInfo;

  fullN.value = data.full_name;
  phoneN.value = data.phone_number;
  dateB.value = data.date_of_birth;

  document.querySelector("#phoneN + p").textContent = "";
  document.querySelector("#fullN + p").textContent = "";
}

function changePassFunc() {
  const passInputs = [
    document.getElementById("currentPss"),
    document.getElementById("newPass"),
    document.getElementById("confirmPass"),
  ];

  const savePassBtn = document.getElementById("changePassBtn");

  enableSaveButton(passInputs, savePassBtn);

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
document.getElementById("editImg").addEventListener("click", () => {
  previewImg.style.display = "none";
  containerFileInput.querySelector("div").style.display = "flex";
  previewImg.src = "";

  document.getElementById("editUserImgForm").style.display = "flex";
  showModal();
  formTitle.textContent = "تعديل صورة الملف الشخصي   ";
});
containerFileInput.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  console.log("hi form huda");
  const file = fileInput.files[0];

  if (file) {
    previewImg.style.display = "block";
    containerFileInput.querySelector("div").style.display = "none";
    previewImg.src = URL.createObjectURL(file);
  }
});
enableSaveButton([fileInput], upload);
upload.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!fileInput.files.length) {
    document.getElementById("uploadImgError").textContent = "اختاري صورة أولاً";
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
    
    updateUser(userId, { profile_image: `${uploadData.image}` });
    document.getElementById("headerUserimg").src = uploadData.image
      ? `http://localhost:3001/uploads/${uploadData.image}`
      : `http://localhost:3001/uploads/default.png`;

    document.getElementById("profileImg").src = uploadData.image
      ? `http://localhost:3001/uploads/${uploadData.image}`
      : `http://localhost:3001/uploads/default.png`;

    document.getElementById("editUserImgForm").style.display = "none";
    hiddenModal();

    console.log("تم تحديث الصورة");
  } catch (error) {
    console.error(error);
    document.getElementById("uploadImgError").textContent =
      "حدث خطأ أثناء رفع الصورة";
  }
});
deleteImage.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    let userInfo = await loadPatient();
    const user = userInfo.userInfo;
    const userId = user.id;

    // حذف الصورة من فولدر الباك
    // if (user.profile_image && user.profile_image !== "default.png") {
    //   const response = await fetch(
    //     `http://localhost:3001/upload/${user.profile_image}`,
    //     {
    //       method: "DELETE",
    //     },
    //   );

    //   console.log("Delete image:", await response.text());
    // }

    // تحديث الداتا في json-server
    const isUpdate = await updateUser(userId, {
      profile_image: "default.png",
    });

    if (!isUpdate) return;

    // تغيير الصورة في الصفحة
    document.getElementById("profileImg").src =
      `http://localhost:3001/uploads/default.png?t=${Date.now()}`;

      document.getElementById("headerUserimg").src = 
      `http://localhost:3001/uploads/default.png?t=${Date.now()}`;
      

    hiddenModal();
  } catch (error) {
    console.log(error);
  }
});

// function formatToInputDate(dateStr) {
//   if (!dateStr) return "";

//   const parts = dateStr.split("-");

//   if (parts.length === 3) {
//     const [day, month, year] = parts;
//     return `${year}-${month}-${day}`;
//   }

//   return dateStr;
// }
