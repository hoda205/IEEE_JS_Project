import validationCard from "./validationCard.js";
import createAppointment from "./createAppointment.js"
function paymentBtnEvent(patientId, anotherMethod) {
    let firstBtn = document.querySelector("#method-details form")
    let secondBtn = document.getElementById("secondBtn")
    firstBtn.addEventListener("submit", (e) => {
        e.preventDefault();
        if (anotherMethod || validationCard()) {
            secondBtn.disabled = false;
            secondBtn.onclick = async () => {
                console.log("second button clicked");
                const appointmentId = await createAppointment(patientId);
                console.log("appointment id:", appointmentId);
                if (appointmentId) {
                    window.location.href =
                        `queue-tracking.html?appointmentId=${appointmentId}`;
                }
            };
        }
    })
}
export default paymentBtnEvent;
