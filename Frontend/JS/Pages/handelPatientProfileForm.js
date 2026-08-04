import { showModal, hiddenModal } from "./getUserInfor.js";
import {showSuccessPopup} from "./updateUserData.js"
let allergies = [];
let diseases = [];

const API_URL = "http://localhost:3000";

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

let patientProfile = null;
let originalMedicalData = null;
// ===================== Elements =====================

const allergiesInput = document.getElementById("allergiesInput");
const addAllergyBtn = document.getElementById("addAllergyBtn");
const allergiesOutput = document.getElementById("allergiesFormOutput");

const diseasesInput = document.getElementById("diseasesInput");
const addDiseaseBtn = document.getElementById("addDiseaseBtn");
const diseasesOutput = document.getElementById("diseasesFormOutput");

const editMedicalBtn = document.getElementById("editMedicalBtn");
const editMedicalForm = document.getElementById("editMedicalForm");

let formTitle = document.getElementById("modalTite");

const genderInput = document.getElementById("genderInput");
const bloodInput = document.getElementById("bloodInput");
const maritalInput = document.getElementById("maritalInput");
const addressInput = document.getElementById("addressInput");

const saveMedicalBtn = document.getElementById("saveMedicalBtn");

function checkMedicalChanges() {
  const currentData = {
    gender: genderInput.value,
    blood_type: bloodInput.value,
    marital_status: maritalInput.value,
    address: addressInput.value.trim(),
    allergies: [...allergies],
    chronic_diseases: [...diseases],
  };

  const hasChanged =
    JSON.stringify(currentData) !== JSON.stringify(originalMedicalData);

  saveMedicalBtn.disabled = !hasChanged;
}

// ===================== Render Tags =====================

function renderItems(array, container) {
  container.innerHTML = "";

  array.forEach((item, index) => {
    container.innerHTML += `
            <p>
                ${item}
                <i 
                    class="fa-solid fa-x"
                    data-index="${index}">
                </i>
            </p>
        `;
  });
}

// ===================== Get Profile =====================

async function getPatientProfile() {
  const response = await fetch(`${API_URL}/patient_profiles`);

  const profiles = await response.json();

  patientProfile = profiles.find(
    (profile) => profile.userId === currentUser.id,
  );

  if (!patientProfile) {
    console.log("No profile found");
    return;
  }

  allergies = [...patientProfile.allergies];

  diseases = [...patientProfile.chronic_diseases];

  displayProfile(patientProfile);
}

// ===================== Display Profile =====================

function displayProfile(profile) {
  document.getElementById("gender").textContent = profile.gender;

  document.getElementById("bloodType").textContent = profile.blood_type;

  document.getElementById("maritalStatus").textContent = profile.marital_status;

  document.getElementById("address").textContent =
    profile.address || "غير مضاف";

  const allergiesContent = document.getElementById("allergiesContent");

  allergiesContent.innerHTML = "";

  profile.allergies.forEach((item) => {
    allergiesContent.innerHTML += `
            <p>${item}</p>
        `;
  });

  const diseasesContent = document.getElementById("diseasesContent");

  diseasesContent.innerHTML = "";

  profile.chronic_diseases.forEach((item) => {
    diseasesContent.innerHTML += `
            <p>${item}</p>
        `;
  });
}

// ===================== Fill Edit Form =====================

function fillMedicalForm(profile) {
  if (!profile) return;

  document.getElementById("genderInput").value = profile.gender;
  document.getElementById("bloodInput").value = profile.blood_type;
  document.getElementById("maritalInput").value = profile.marital_status;
  document.getElementById("addressInput").value = profile.address || "";

  allergies = [...profile.allergies];
  diseases = [...profile.chronic_diseases];

  renderItems(allergies, allergiesOutput);
  renderItems(diseases, diseasesOutput);

  // حفظ نسخة من البيانات الأصلية
  originalMedicalData = {
    gender: profile.gender,
    blood_type: profile.blood_type,
    marital_status: profile.marital_status,
    address: profile.address || "",
    allergies: [...profile.allergies],
    chronic_diseases: [...profile.chronic_diseases],
  };

  // أول ما الفورم يفتح الزر يبقى Disabled
  saveMedicalBtn.disabled = true;
}

// ===================== Open Edit Form =====================

editMedicalBtn.addEventListener("click", () => {
  showModal();
  formTitle.textContent = "تعديل البيانات الطبية";
  fillMedicalForm(patientProfile);
  editMedicalForm.style.display = "flex";
});

// ===================== Add Allergy =====================

addAllergyBtn.addEventListener("click", () => {
  const value = allergiesInput.value.trim();

  if (value) {
    allergies.push(value);

    allergiesInput.value = "";

    renderItems(allergies, allergiesOutput);
    checkMedicalChanges();
  }
});

// ===================== Add Disease =====================

addDiseaseBtn.addEventListener("click", () => {
  const value = diseasesInput.value.trim();

  if (value) {
    diseases.push(value);

    diseasesInput.value = "";

    renderItems(diseases, diseasesOutput);
    checkMedicalChanges();
  }
});

// ===================== Delete Allergy =====================

allergiesOutput.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-x")) {
    allergies.splice(e.target.dataset.index, 1);

    renderItems(allergies, allergiesOutput);
    checkMedicalChanges();
  }
});

// ===================== Delete Disease =====================

diseasesOutput.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-x")) {
    diseases.splice(e.target.dataset.index, 1);

    renderItems(diseases, diseasesOutput);
    checkMedicalChanges();
  }
});
// ===================== Save Medical Data =====================

saveMedicalBtn.addEventListener("click", async () => {
  const updatedMedicalData = {
    gender: genderInput.value,
    blood_type: bloodInput.value,
    marital_status: maritalInput.value,
    address: addressInput.value.trim(),
    allergies: [...allergies],
    chronic_diseases: [...diseases],
  };

  try {
    const response = await fetch(
      `${API_URL}/patient_profiles/${patientProfile.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMedicalData),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    const updatedProfile = await response.json();

    // تحديث البيانات المحلية
    patientProfile = updatedProfile;

    // تحديث العرض في الصفحة
    displayProfile(patientProfile);

    // تحديث النسخة الأصلية عشان الزر يرجع disabled
    originalMedicalData = {
      gender: updatedProfile.gender,
      blood_type: updatedProfile.blood_type,
      marital_status: updatedProfile.marital_status,
      address: updatedProfile.address || "",
      allergies: [...updatedProfile.allergies],
      chronic_diseases: [...updatedProfile.chronic_diseases],
    };

    saveMedicalBtn.disabled = true;

    // قفل المودال
    editMedicalForm.style.display = "none";
    showSuccessPopup();
    let id = await setTimeout(() => {
      document.getElementById("successPopup").style.display = "none";
    }, 20000);
    hiddenModal();
  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء حفظ البيانات");
  }
});
// ===================== Start =====================

getPatientProfile();

function setupExpandable(headerId, contentId) {
  const header = document.getElementById(headerId);
  const content = document.getElementById(contentId);

  header.addEventListener("click", () => {
    content.classList.toggle("open");
    header.classList.toggle("active");
  });
}

setupExpandable("allergiesHeader", "allergiesContent");

setupExpandable("diseasesHeader", "diseasesContent");

genderInput.addEventListener("change", checkMedicalChanges);

bloodInput.addEventListener("change", checkMedicalChanges);

maritalInput.addEventListener("change", checkMedicalChanges);

addressInput.addEventListener("input", checkMedicalChanges);
