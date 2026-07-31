function deleteMedicine() {
    let deleteBtn = document.getElementById("delete");
    let medicine = document.querySelector("tbody");
    deleteBtn.addEventListener("click", () => {
        selectedRows.forEach((row) => {
            row.remove();
        })
        let rows = medicine.querySelectorAll("tr");
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        })
        selectedRows = [];
    })
}
deleteMedicine();