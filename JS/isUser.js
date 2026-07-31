export default function isUser() {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) return;

    if (currentUser.role === "patient") {
      window.location.href = "home.html";
    } else if (
      currentUser.role === "doctor" ||
      currentUser.role === "secretary"
    ) {
      window.location.href = "dashboard.html";
    }
  } catch {
    localStorage.removeItem("currentUser");
  }
}

isUser();
