import { getDraft, updateDraft } from "./consultationDraft.js";

document.addEventListener("DOMContentLoaded", async () => {
  const diagnosis = document.getElementById("diagnosis");
  const notes = document.getElementById("notes");

  // تحميل البيانات عند فتح الصفحة
  const draft = await getDraft();

  if (diagnosis) {
    diagnosis.value = draft.diagnosis || "";
  }

  if (notes) {
    notes.value = draft.notes || "";
  }

  // حفظ التشخيص أثناء الكتابة
  if (diagnosis) {
    diagnosis.addEventListener("input", () => {
      updateDraft("diagnosis", diagnosis.value);
    });
  }

  // حفظ الملاحظات أثناء الكتابة
  if (notes) {
    notes.addEventListener("input", () => {
      updateDraft("notes", notes.value);
    });
  }
});
