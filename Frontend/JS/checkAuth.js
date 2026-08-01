export function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // console.log(currentUser );
  if (!currentUser) {
    window.location.href = "login.html";
    return null;
  }

  let role = ["patient", "doctor", "secretary"]
  if (!role.includes(currentUser.role)) {
    window.location.href = "login.html";
    return null;
  }

  return currentUser;
}