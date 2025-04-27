document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const message = params.get("message");

  if (message && message === "logout") {
    const logoutMessageDiv = document.getElementById("logout-message");
    logoutMessageDiv.textContent = "You have logged out successfully!";
  }

  // Logout button functionality
  document.querySelector(".logout-btn").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to the login page with a message query string
    window.location.href = "login.html?message=logout";
  });
});
