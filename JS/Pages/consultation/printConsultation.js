document.addEventListener("DOMContentLoaded", () => {
    const printBtn = document.getElementById("secondBtn");

    if (printBtn) {
        printBtn.addEventListener("click", (e) => {
            e.preventDefault(); // يمنع أي سلوك افتراضي للصفحة
            window.print();     // يفتح شاشة الطباعة
        });
    }
});