let selectedRows = [];
function addMedicine() {
    let addBtn = document.getElementById("add")
    let medicine = document.querySelector("tbody")
    addBtn.addEventListener("click", () => {
        let rowCount = medicine.rows.length + 1;
        medicine.innerHTML += `<tr>
        <td class="id">${rowCount}</td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
    </tr>`

    })
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