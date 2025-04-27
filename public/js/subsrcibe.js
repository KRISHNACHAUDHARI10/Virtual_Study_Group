document.getElementById("subscribeBtn").addEventListener("click", async () => {
  const email = document.getElementById("emailInput").value.trim();

  if (!email) {
    alert("Please enter a valid email.");
    return;
  }

  try {
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Subscribed successfully!");
      document.getElementById("emailInput").value = ""; // clear field
    } else {
      alert(data.error || "Subscription failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Try again.");
  }
});
