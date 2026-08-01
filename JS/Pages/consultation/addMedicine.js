let selectedRows = [];

function addMedicine() {
    let addBtn = document.getElementById("add");
    let medicine = document.querySelector("tbody");

    // دالة لإضافة صف جديد
    function createRow() {
        let rowCount = medicine.rows.length + 1;
        let newRowHTML = `
            <tr>
                <td class="id">${rowCount}</td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
            </tr>
        `;
        // insertAdjacentHTML بضيف الصف الجديد من غير ما يمسح البيانات اللي مكتوبة في الصفوف القديمة
        medicine.insertAdjacentHTML('beforeend', newRowHTML);
    }

    // إضافة صف أولاني تلقائياً عند فتح الصفحة
    if (medicine.rows.length === 0) {
        createRow();
    }

    // عند الضغط على زر إضافة دواء
    addBtn.addEventListener("click", () => {
        createRow();
    });

    // تحديد الصف عند الضغط على رقم الصف (id)
    medicine.addEventListener("click", (e) => {
        if (!e.target.classList.contains("id")) return;

        let row = e.target.parentElement;

        if (selectedRows.includes(row)) {
            selectedRows = selectedRows.filter((item) => item !== row);
            row.classList.remove("selected");
        } else {
            selectedRows.push(row);
            row.classList.add("selected");
        }
    });
}

addMedicine();