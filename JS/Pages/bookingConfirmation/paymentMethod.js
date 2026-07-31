import paymentBtnEvent from "./paymentBtnEvent.js";
import validationCard from "./validationCard.js";
import checkPatientAppointment from "../../checkPatientAppointment.js";
import { checkAuth } from "../../checkAuth.js";

console.log("paymentMethod loaded");

const patient = checkAuth();
if (patient?.id) {
    checkPatientAppointment(patient.id);
}

// دالة للانتقال إلى أسفل الصفحة بسلاسة
function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
}

// قوالب واجهة المستخدم لطرق الدفع المختلفه
const templates = {
    card: () => `
        <h4>تفاصيل الدفع عبر البطاقة الذكية:</h4>
        <form id="credit-card" class="payment-subform">
            <div class="input-group">
                <label for="card-holder">اسم صاحب البطاقة</label>
                <input type="text" name="card-holder" id="card-holder" placeholder="الاسم كما هو مدون على البطاقة" required>
                <span id="name-error" class="error"></span>
            </div>

            <div class="input-group">
                <label for="card-number">رقم البطاقة</label>
                <input type="text" name="card-number" id="card-number" placeholder="0000 0000 0000 0000" maxlength="19" required>
                <span id="card-error" class="error"></span>
            </div>

            <div class="form-row">
                <div class="input-group">
                    <label for="expiry-date">تاريخ الانتهاء</label>
                    <input type="text" name="expiry-date" id="expiry-date" placeholder="MM/YY" maxlength="5" required>
                    <span id="expiry-error" class="error"></span>
                </div>
                <div class="input-group">
                    <label for="cvv">CVV</label>
                    <input type="password" name="cvv" id="cvv" placeholder="123" maxlength="4" required>
                    <span id="cvv-error" class="error"></span>
                </div>
            </div>

            <button type="submit" class="firstBtn">إنهاء الدفع</button>
        </form>
    `,
    transfer: (title, accountNumber) => `
        <h4>تفاصيل الدفع عبر ${title}:</h4>
        <form class="payment-subform">
            <label for="transfer-number">قم بتحويل قيمة الكشف إلى الرقم التالي:</label>
            <div class="copy-field">
                <input type="text" id="transfer-number" readonly value="${accountNumber}">
                <button type="button" class="copy-btn" id="copyBtn">
                    <i class="fa-regular fa-copy"></i> نسخ
                </button>
            </div>
            <button type="submit" class="firstBtn">إنهاء الدفع</button>
        </form>
    `
};

function paymentMethod() {
    const methods = document.querySelectorAll("input[name='method']");
    const container = document.getElementById("method-details");

    if (!methods.length || !container) return;

    methods.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            if (!radio.checked) return;

            // تحديث التحديد البصري للخيار المختار
            document.querySelectorAll(".payment-option").forEach((opt) => opt.classList.remove("selected"));
            radio.closest(".payment-option")?.classList.add("selected");

            const methodId = radio.id;

            if (methodId === "card") {
                container.innerHTML = templates.card();
                validationCard();
                if (patient?.id) paymentBtnEvent(patient.id, false);
            } else if (methodId === "instapay" || methodId === "vodafone") {
                const title = methodId === "instapay" ? "إنستا باي" : "فودافون كاش";
                const accountNumber = methodId === "instapay" ? "1234567890" : "01000000000";

                container.innerHTML = templates.transfer(title, accountNumber);
                if (patient?.id) paymentBtnEvent(patient.id, true);

                setupCopyButton(accountNumber);
            }

            // التعامل مع ضغطة "إنهاء الدفع"
            const subForm = container.querySelector("form");
            subForm?.addEventListener("submit", (evt) => {
                evt.preventDefault();

                if (methodId === "card") {
                    // إذا كانت بطاقة، نتأكد من صحة البيانات أولاً
                    const isValid = validationCard();
                    if (isValid) {
                        scrollToBottom();
                    }
                } else {
                    // إذا كان تحويل (إنستا باي / فودافون كاش)، ننتقل للأسفل مباشرة
                    scrollToBottom();
                }
            });
        });
    });
}

function setupCopyButton(textToCopy) {
    const copyBtn = document.getElementById("copyBtn");
    if (!copyBtn) return;

    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> تم النسخ`;
            setTimeout(() => {
                copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> نسخ`;
            }, 2000);
        } catch (err) {
            console.error("فشل النسخ: ", err);
        }
    });
}

paymentMethod();
export default paymentMethod;