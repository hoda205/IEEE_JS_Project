
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


const userTypes =
    document.querySelectorAll(".user-type");

userTypes.forEach((button) => {
    
    button.addEventListener("click", () => {
        userTypes.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
    });

});