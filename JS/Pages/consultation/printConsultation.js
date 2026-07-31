import saveConsultation from "./saveConsultation.js";

const form = document.querySelector("form");
const secondBtn = document.getElementById("secondBtn");

function getPatientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function getCurrentAppointment(patientId) {
    const response = await fetch("http://localhost:3000/appointments");
    const appointments = await response.json();

    return appointments.find(
        appointment =>
            appointment.patientId === patientId &&
            appointment.status === "in_consultation"
    );
}

function getDiagnosis() {
    return document.getElementById("diagnosis").value.trim();
}

function getNotes() {
    return document.getElementById("notes").value.trim();
}

function getMedicines() {
    const medicines = [];

    const rows = document.querySelectorAll("#medicine tbody tr");

    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");

        medicines.push({
            name: cells[1].textContent.trim(),
            dosage: cells[2].textContent.trim(),
            duration: cells[3].textContent.trim()
        });
    });

    return medicines;
}

async function handleSave(e) {
    e.preventDefault();

    const patientId = getPatientId();

    const appointment = await getCurrentAppointment(patientId);

    if (!appointment) {
        alert("لا يوجد موعد جاري");
        return;
    }

    const saved = await saveConsultation({
        appointmentId: appointment.id,
        patientId: patientId,
        doctorId: appointment.doctorId,
        diagnosis: getDiagnosis(),
        notes: getNotes(),
        medicines: getMedicines()
    });

    if (saved) {
        secondBtn.disabled = false;
        alert("تم حفظ الروشتة بنجاح");
    }
}

function printConsultation() {
    window.print();
}

form.addEventListener("submit", handleSave);
secondBtn.addEventListener("click", printConsultation);