import { getDraft, updateDraft } from "./consultationDraft.js";


function deleteMedicine() {

    const medicineList = document.getElementById("medicine-list");


    medicineList.addEventListener("click", async (e) => {


        if (!e.target.classList.contains("delete-btn")) {
            return;
        }



        const row = e.target.closest("tr");

        const rowIndex = row.rowIndex - 1;



        // جلب بيانات الكشف الحالية
        const draft = await getDraft();



        // حذف الدواء من الـ localStorage
        draft.medicines.splice(rowIndex, 1);



        // تحديث الـ localStorage
        await updateDraft(
            "medicines",
            draft.medicines
        );



        // حذف الصف من الجدول
        row.remove();



        // إعادة ترتيب الأرقام
        const rows = medicineList.querySelectorAll("tr");


        rows.forEach((row, index) => {

            row.cells[0].textContent = index + 1;

        });


    });

}



document.addEventListener(
    "DOMContentLoaded",
    deleteMedicine
);