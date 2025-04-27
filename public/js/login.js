document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    Toastify({
      text: "Please enter both email and password",
      duration: 3000,
      gravity: "top",
      position: "center", // changed to center
      backgroundColor: "#f44336", // red
    }).showToast();
    return;
  }

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      Toastify({
        text: data.message,
        duration: 2000,
        gravity: "top",
        position: "center", // changed to center
        backgroundColor: "#4CAF50", // green
      }).showToast();

      setTimeout(() => {
        window.location.href = "/home"; // redirect to home page
      }, 2000); // Delay redirect to allow toast to show
    } else {
      Toastify({
        text: " " + data.message,
        duration: 3000,
        gravity: "top",
        position: "center", // already center
        backgroundColor: "#f44336", // red
      }).showToast();
    }
  } catch (err) {
    console.error("Login failed", err);
    Toastify({
      text: " Server error during login",
      duration: 3000,
      gravity: "top",
      position: "center", // already center
      backgroundColor: "#f44336",
    }).showToast();
  }
});
