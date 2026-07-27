const main = document.querySelector("#patientDetails");
let inThequeue = true;
let withDoctor = false 
let startBtn = document.querySelector("#startBtn");
let endBtn = document.querySelector("#endBtn");
// console.log(btns);

// بيانات المريض
let user = {
    "id": 1,
    "img": "profileImg.avif",
    "name": "ساره محمود",
    "gender": "انثي",
    "mobile": "0123456789",
    "dob": "9-9-2007",
    "blodType": "A+",
    "maritalStatus": "متزوج",
    "address": "عرب الرمل",
    "allergies": ["انجوم", "طماطم", "ملوخية"],
    "chronicDiseases": ["السكر", "الضغط"],
    
}

// البيانات الاساسية
main.insertAdjacentHTML( "beforeend" ,
`<!-- بيانات اساسية -->
<section class="section main-info">
<img class="patient-pic" src="../assets/patient-assets/${user.img || "defult.jpg"}" alt="profile picture">
<div>
<h3 class="font-bold">${user.name || "لا يوجد اسم"}</h3>
                <p>${user.gender || "___"}</p>
            </div>
            <div>
                <h3 class="font-bold">رقم الهاتف</h3>
                <p>${user.mobile || "___"}</p>
            </div>
</section>`);

// البيانات الشخصية
main.insertAdjacentHTML( "beforeend" , `
<!-- البيانات الشخصية -->
        <section class="section personal-info">
            <h2 class="text-lg font-bold">البيانات الشخصية</h2>
            <div class="flex flex-col gap-3">
                <div class="flex justify-between w-full">
                    <h3 class="font-bold">العمر</h3>
                    <p>${calculateAge(user.dob) || "___"}</p>
                </div>
                <div class="flex justify-between w-full">
                    <h3 class="font-bold">فصيلة الدم</h3>
                    <p>${user.blodType || "___"}</p>
                </div>
                <div class="flex justify-between w-full">
                    <h3 class="font-bold">الحالة الاجتماعية</h3>
                    <p>${user.maritalStatus || "___"}</p>
                </div>
                <div class="flex justify-between w-full">
                    <h3 class="font-bold">العنوان</h3>
                    <p>${user.address || "___"}</p>
                </div>
            </div>
        </section>`)


// معلومات اضافية
main.insertAdjacentHTML( "beforeend" ,`
<section class="section additional-info">
    <h2 class="text-lg font-bold">معلومات اضافية</h2>
    <div>
        <div>
            <h3 class="font-bold">الحساسية</h3>

            ${user.allergies ? `<ul class="">${user.allergies.map(el => `<li>${el}</li>`).join("")}</ul>` : "<p>____</p>"}
            
            </div>
        <div>
            <h3 class="font-bold mb-2">الأمراض المزمنة</h3>
            ${user.chronicDiseases ? `<ul> ${user.chronicDiseases.map(el => `<li>${el}</li>`).join("")}</ul>` : `<p>___</p>`
            }
        </div>
    </div>
</section>`)



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
calculateAge("11-11-2005");



startBtn.addEventListener("click", () =>{
    console.log("الكشف بدا");
    startBtn.style.display = "none";
    endBtn.style.display = "block";
    
})
endBtn.addEventListener("click", () =>{
    console.log("الكشف خلص");
    endBtn.style.display = "none";
})
