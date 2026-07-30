// ******************* Show Password *************************

function showPass() {
    let pass=document.getElementById("password")
    let btn = document.getElementById("show-password");
    let icon=document.getElementById("iconeye");

    if (pass.type=="password") {
        pass.type = "text";
         icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
    } else {
        pass.type = "password";
         icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
    }
}
function showPassrepete() {
 let pass=document.getElementById("confirmPassword")
    let btn = document.getElementById("show-password");
       let icon=document.getElementById("iconeye2");


    if (pass.type=="password") {
        pass.type = "text";
         icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
    } else {
        pass.type = "password";
         icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
    }
}





// **************************** Form ********************/

let form = document.getElementById("registerForm");

let name = document.getElementById("name");
let email = document.getElementById("email");
let errorname = document.getElementById("errorname");
let erroremail = document.getElementById("erroremail");
let errorphone = document.getElementById("errorphone");
let errorpass = document.getElementById("errorpass");
let pass = document.getElementById("password");
let rePass = document.getElementById("confirmPassword");
let res,res2;

name.onfocus = function () {

    name.style.border = "solid 1px blue";

};

name.onblur = function (event) {

    let regex = /^[a-zA-Z]{3,}(\s{1}[a-zA-Z]{3,})+$/
 let res=(regex.test(name.value));

     if (!res&&name.value!="") {

        errorname.innerText = "من فضلك ادخل اسم صحيح مثل .... .... ....";

        name.classList.add("error-border");

    }

    else {

        errorname.innerText = "";

        name.classList.remove("error-border");

    }
};

email.onblur = function (event) {

    let regex = /^[a-zA-Z]{3,12}(@)(domain|gmail)(\.com|\.net|\.edu|\.org)/;
    // aseeltoson423@domain.com.eg

    let res2 = regex.test(email.value);

    if (!res2&&email.value!="") {

        erroremail.innerText = "من فضلك ادخل بريد الكتروني صحيح";

        email.classList.add("error-border");
    }

    else {

        error.innerText = "";

        email.classList.remove("error-border");

    }
};

rePass.onblur = function (event) {

    if (pass.value!=rePass.value) {

        errorpass.innerText = "يجب ان تتطابق كلمه المرور مع تاكيد كلمه المرور";

        rePass.classList.add("error-border");

    }

    else {

        errorpass.innerText = "";

        rePass.classList.remove("error-border");

    }
};





 function check() {
        if (!name.hasAttribute("required")) {
          name.setAttribute("required", "");
        }
        if (!email.hasAttribute("required")) {
          email.setAttribute("required", "");
        }
         if (!phone.hasAttribute("required")) {
          phone.setAttribute("required", "");
        }
        if (!agree.hasAttribute("required")) {
          agree.setAttribute("required", "");
        }
      }




