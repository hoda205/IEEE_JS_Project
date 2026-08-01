function validationCard() {
    let name = document.getElementById("card-holder");
    let cardNumber = document.getElementById("card-number");
    let expiryDate = document.getElementById("expiry-date");
    let cvvNumber = document.getElementById("cvv");

    let nameRegex = /^[a-zA-Z\s]{3,}$/;
    let cardNumberRegex = /^\d{16}$/;
    let expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    let cvvNumberRegex = /^\d{3,4}$/;

    let nameError = document.getElementById("name-error");
    let cardError = document.getElementById("card-error");
    let expiryError = document.getElementById("expiry-error");
    let cvvError = document.getElementById("cvv-error");

    if (!name || !cardNumber || !expiryDate || !cvvNumber) return false;

    // دالة للتحقق من حقل معين
    const validateInput = (input, regex, errorEl, message) => {
        if (!regex.test(input.value.trim())) {
            errorEl.innerHTML = message;
            errorEl.classList.add("error");
            return false;
        } else {
            errorEl.innerHTML = ``;
            errorEl.classList.remove("error");
            return true;
        }
    };

    // الاستماع لحدث الكتابة (Input)
    name.addEventListener("input", () => validateInput(name, nameRegex, nameError, "اسم صاحب البطاقة غير صحيح"));
    cardNumber.addEventListener("input", () => validateInput(cardNumber, cardNumberRegex, cardError, "رقم البطاقة غير صحيح"));
    expiryDate.addEventListener("input", () => validateInput(expiryDate, expiryDateRegex, expiryError, "تاريخ الانتهاء غير صحيح"));
    cvvNumber.addEventListener("input", () => validateInput(cvvNumber, cvvNumberRegex, cvvError, "CVV غير صحيح"));

    // التحقق الكلي
    const isNameValid = nameRegex.test(name.value.trim());
    const isCardValid = cardNumberRegex.test(cardNumber.value.trim());
    const isExpiryValid = expiryDateRegex.test(expiryDate.value.trim());
    const isCvvValid = cvvNumberRegex.test(cvvNumber.value.trim());

    return isNameValid && isCardValid && isExpiryValid && isCvvValid;
}

export default validationCard;