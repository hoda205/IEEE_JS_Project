function validationCard() {
    let name = document.getElementById("card-holder");
    let cardNumber = document.getElementById("card-number");
    let expiryDate = document.getElementById("expiry-date");
    let cvvNumber = document.getElementById("cvv");

    let nameRegex = /^[a-zA-Z\s]{3,}$/;
    let cardNumberRegex = /^\d{16}$/;
    let expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    let cvvNumberRegex = /^\d{3,4}$/;

    let nameError = document.getElementById("name-error")
    let cardError = document.getElementById("card-error")
    let expiryError = document.getElementById("expiry-error")
    let cvvError = document.getElementById("cvv-error")

    name.addEventListener("input", () => {
        if (!nameRegex.test(name.value)) {
            nameError.innerHTML = `اسم صاحب البطاقة غير صحيح`
            nameError.classList.add("error")
        }
        else {
            nameError.innerHTML = ``
            nameError.classList.remove("error")
        }
    })
    cardNumber.addEventListener("input", () => {
        if (!cardNumberRegex.test(cardNumber.value)) {
            cardError.innerHTML = `رقم البطاقة غير صحيح`
            cardError.classList.add("error")
        }
        else {
            cardError.innerHTML = ``
            cardError.classList.remove("error")
        }
    })
    expiryDate.addEventListener("input", () => {
        if (!expiryDateRegex.test(expiryDate.value)) {
            expiryError.innerHTML = `تاريخ الانتهاء غير صحيح`
            expiryError.classList.add("error")
        }
        else {
            expiryError.innerHTML = ``
            expiryError.classList.remove("error")
        }
    })
    cvvNumber.addEventListener("input", () => {
        if (!cvvNumberRegex.test(cvvNumber.value)) {
            cvvError.innerHTML = `CVV غير صحيح`
            cvvError.classList.add("error")
        }
        else {
            cvvError.innerHTML = ``
            cvvError.classList.remove("error")
        }
    })
    if (nameRegex.test(name.value) && cardNumberRegex.test(cardNumber.value) && expiryDateRegex.test(expiryDate.value) && cvvNumberRegex.test(cvvNumber.value)) {
        return true;
    }
    return false;
}
export default validationCard;