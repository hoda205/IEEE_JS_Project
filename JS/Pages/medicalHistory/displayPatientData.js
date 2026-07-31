let name = document.getElementById("name");
let age = document.getElementById("age");
function displayPatientData(patient) {
    name.innerHTML += `<p>${patient.name}</p>`
    age.innerHTML += `<p>${patient.age}</p>`
}
export default displayPatientData;