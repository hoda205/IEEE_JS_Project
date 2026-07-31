import saveConsultation from "./saveConsultation.js";

async function handleSaveConsultation() {

    let diagnosis = document.getElementById("diagnosis").value;
    let notes = document.getElementById("notes").value;

    let medicines = [];

    let rows = document.querySelectorAll("#medicine tbody tr");

    rows.forEach(row => {
        let cells = row.querySelectorAll("td");

        medicines.push({
            name: cells[1].innerText,
            dosage: cells[2].innerText,
            duration: cells[3].innerText
        });
    });

    await saveConsultation({
        appointmentId: "1001",
        patientId: "1",
        doctorId: "1",
        diagnosis,
        notes,
        medicines
    });
}

document.getElementById("firstBtn").addEventListener("click", (e) => {
    e.preventDefault();
    handleSaveConsultation();
});