function deleteMedicine() {
    let deleteBtn = document.getElementById("delete");
    let medicine = document.querySelector("tbody");

    deleteBtn.addEventListener("click", () => {
        // 1. التحقق من وجود صفوف محدده للحذف
        if (selectedRows.length === 0) {
            alert("برجاء تحديد الدواء المراد حذفه بالضغط على رقمه أولاً.");
            return;
        }

        // 2. حذف الصفوف المحددة من الصفحة
        selectedRows.forEach((row) => {
            row.remove();
        });

        // 3. إعادة ترتيب الأرقام للصفوف المتبقية (1, 2, 3...)
        let rows = medicine.querySelectorAll("tr");
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });

        // 4. تفريغ مصفوفة التحديد
        selectedRows.length = 0;
    });
}

deleteMedicine();