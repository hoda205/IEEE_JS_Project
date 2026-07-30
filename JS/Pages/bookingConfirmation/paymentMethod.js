import paymentBtnEvent from "./paymentBtnEvent.js";
import validationCard from "./validationCard.js";
import checkPatientAppointment from "../../checkPatientAppointment.js";
import { checkAuth } from "../../checkAuth.js";
console.log("paymentMethod loaded");
const patient = checkAuth();
if (patient) checkPatientAppointment(patient.id);
function paymentMethod() {
    const methods = document.querySelectorAll("input[name='method']");
    methods.forEach((radio) => {
        radio.addEventListener("change", () => {
            if (radio.checked) {
                if (radio.id === "card") {
                    document.getElementById("method-details").innerHTML = `<h4>تفاصيل الدفع عبر البطاقة الذكية :</h4>
                <form id="credit-card">
                <label for="card-holder">اسم صاحب البطاقة</label>
                <input type="text" name="card-holder" id="card-holder" required>
                <span id="name-error"></span>

                <label for="card-number">رقم البطاقة</label>
                <input type="text" name="card-number" id="card-number" required>
                <span id="card-error"></span>

                <label for="expiry-date">تاريخ الانتهاء</label>
                <input type="text" name="expiry-date" id="expiry-date" placeholder="MM/YY" required>
                <span id="expiry-error"></span>

                <label for="cvv">CVV</label>
                <input type="text" name="cvv" id="cvv" required>
                <span id="cvv-error"></span>

                <button type="submit" class="firstBtn">انهاء الدفع</button>
                </form>`;
                    validationCard();
                    paymentBtnEvent(patient.id, false);
                }
                else if (radio.id === "instapay") {
                    document.getElementById("method-details").innerHTML = `<h4>تفاصيل الدفع عبر انستا باي :</h4>
                <form>
                <label for="insta-id">قم بتحويل قيمة الكشف الى الحاسب التالي :</label>
                <input type="text" name="insta-id" id="insta-id" readonly value="1234567890">
                <button type="submit" class="firstBtn">انهاء الدفع</button>
                </form>`;
                    paymentBtnEvent(patient.id, true);
                }
                else if (radio.id === "vodafone") {
                    document.getElementById("method-details").innerHTML = `<h4>تفاصيل الدفع عبر فودافون كاش :</h4>
                <form>
                <label for="insta-id">قم بتحويل قيمة الكشف الى الحاسب التالي :</label>
                <input type="text" name="insta-id" id="insta-id" readonly value="1234567890">
                <button type="submit" class="firstBtn">انهاء الدفع</button>
                </form>`;
                    paymentBtnEvent(patient.id, true);
                }
            }
        })
    });
}
paymentMethod();
export default paymentMethod;