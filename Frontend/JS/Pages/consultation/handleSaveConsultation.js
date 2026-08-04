import saveConsultation from "./saveConsultation.js";

async function handleSave() {

  const diagnosis = document.getElementById("diagnosis").value.trim();

  const notes = document.getElementById("notes").value.trim();


  const medicineRows = document.querySelectorAll("#medicine-list tr");

  const medicines = [];


  medicineRows.forEach((row) => {

    const cells = row.querySelectorAll("td");

    if (cells.length < 4) return;


    medicines.push({

      name: cells[1].textContent.trim(),

      dosage: cells[2].textContent.trim(),

      duration: cells[3].textContent.trim(),

    });

  });



  const params = new URLSearchParams(window.location.search);

  const appointmentId = params.get("appointmentId");



  if (!appointmentId) {

    alert("رقم الحجز غير موجود");

    return;

  }



  try {


    await saveConsultation({

      appointmentId,

      diagnosis,

      notes,

      medicines,

    });



    alert("تم حفظ الكشف بنجاح");


  } catch (error) {


    console.error("خطأ أثناء الحفظ:", error);


    alert("حدث خطأ أثناء الحفظ");


  }

}



// زر الحفظ
document.getElementById("saveBtn")
.addEventListener("click", (e)=>{

  e.preventDefault();

  handleSave();

});



// زر الطباعة
document.getElementById("printBtn")
.addEventListener("click", (e)=>{

  e.preventDefault();

  window.print();

});