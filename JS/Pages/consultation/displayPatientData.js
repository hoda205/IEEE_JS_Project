function getPatientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

async function displayPatientData() {
    const patientId = getPatientId();

    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();

    const patient = users.find(user => String(user.id) === patientId);

    namee.innerHTML += `<p>${patient.full_name}</p>`;
    age.innerHTML += `<p>${calculateAge(patient.date_of_birth)}</p>`;
    date.innerHTML += `<p>${getDate}</p>`;
}

displayPatientData();