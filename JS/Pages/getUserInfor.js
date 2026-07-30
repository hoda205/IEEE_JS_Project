import { loadPatient } from "./getPatientDetails.js";

async function loadUserInfo() {
  let userInfo = await loadPatient();
  let data = userInfo.userInfo;

  console.log(data);
  // return userInfo.userInfo;
  let fullname = document.getElementById("fullname");
  let number = document.getElementById("number");
  let date = document.getElementById("date");
  let img = document.getElementById("profileImg");
  fullname.textContent = data["full_name"];
  number.textContent = data["phone_number"];
  date.textContent = data["date_of_birth"];
  img.src = `../../assets/users/${data["profile_image"]}`;
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
// console.log(editInfoForm);

function showModal() {
  modal.classList.add("modalApp");
}
export function hiddenModal() {
  modal.classList.remove("modalApp");
}
async function editInfoFunc() {
  showModal();
  changPassForm.style.display = "none";
  editInfoForm.style.display = "flex";

  formTitle.textContent = "تعديل البيانات الشخصية";

  let userInfo = await loadPatient();
  let data = userInfo.userInfo;

  fullN.value = data["full_name"];
  phoneN.value = data["phone_number"];
  dateB.value = data["date_of_birth"];

  document.querySelector("#phoneN + p").textContent = "";
  document.querySelector("#fullN + p").textContent = "";
}

function changePassFunc() {
  showModal();

  changPassForm.style.display = "flex";
  editInfoForm.style.display = "none";
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
