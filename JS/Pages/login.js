import isUser from "../isUser.js";

isUser();
loginUser("01012345678", "hashed_pass_123");
async function loginUser(phoneNumber, password) {
  try {
    const response = await fetch("http://localhost:3000/users");

    const users = await response.json();

    const user = users.find(
      (user) => user.phone_number === phoneNumber && user.password === password,
    );

    // console.log(user);

    if (user) {
      localStorage.setItem(
        "currentUser",

        JSON.stringify(user),
      );

      if (user.role === "patient") {
        window.location.href = "home.html";
      } else if (user.role === "doctor" || user.role === "secretary") {
        window.location.href = "dashboard.html";
      }
    } else {
      alert("رقم الهاتف أو كلمة المرور غير صحيحة");
    }
  } catch (error) {
    console.error("خطأ في تسجيل الدخول:", error);
  }
}


