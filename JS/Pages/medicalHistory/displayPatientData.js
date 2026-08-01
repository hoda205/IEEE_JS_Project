let name = document.getElementById("name");
let age = document.getElementById("age");
function displayPatientData(patient) {
    name.innerHTML += `<p>${patient.full_name}</p>`
    age.innerHTML += `<p>${calculateAge(patient.date_of_birth)}</p>`
}
export default displayPatientData;

function calculateAge(birthDate){
    let date = new Date();
    let birth = new Date(birthDate);
    let age = date.getFullYear() - birth.getFullYear();
    if(date.getMonth() < birth.getMonth())
        age--;
    else if(date.getMonth() === birth.getMonth() && date.getDay() < birth.getDay())
        age--;
    console.log(age);
    return age;
}


