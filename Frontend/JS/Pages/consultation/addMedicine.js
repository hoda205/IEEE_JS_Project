import { getDraft, updateDraft } from "./consultationDraft.js";

let medicineList;
let addBtn;

let medName;
let medDose;
let medDuration;

function renderMedicines(medicines) {
  medicineList.innerHTML = "";

  medicines.forEach((med, index) => {
    let row = `
            <tr>
                <td class="id">${index + 1}</td>
                <td>${med.name}</td>
                <td>${med.dose}</td>
                <td>${med.duration}</td>
                <td class="no-print">
                    <button type="button" class="delete-btn">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;

    medicineList.insertAdjacentHTML("beforeend", row);
  });
}

async function addMedicine() {

  medicineList = document.getElementById("medicine-list");
  addBtn = document.getElementById("add-btn");

  medName = document.getElementById("med-name");
  medDose = document.getElementById("med-dose");
  medDuration = document.getElementById("med-duration");


  const draft = await getDraft();

  renderMedicines(draft.medicines || []);



  addBtn.addEventListener("click", async () => {

    let name = medName.value.trim();
    let dose = medDose.value.trim();
    let duration = medDuration.value.trim();


    if (!name || !dose || !duration) {
      alert("من فضلك أدخل بيانات الدواء كاملة");
      return;
    }


    const draft = await getDraft();


    draft.medicines.push({

      name,
      dose,
      duration

    });


    updateDraft(
      "medicines",
      draft.medicines
    );


    renderMedicines(
      draft.medicines
    );


    medName.value = "";
    medDose.value = "";
    medDuration.value = "";

  });

}

document.addEventListener("DOMContentLoaded", addMedicine);
