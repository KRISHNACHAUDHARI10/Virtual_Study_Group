document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;

    const userData = {
      username: form.username.value,
      phone: form.phone.value,
      course: form.course.value,
      password: form.password.value,
      email: form.email.value,
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();

        if (res.ok) {
          // Show success toast
          Toastify({
            text: data.message || "Registration Successful!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          }).showToast();

          form.reset();
          setTimeout(() => {
            window.location.href = "/home"; //
          }, 2000);
        } else {
          // Show error toast
          Toastify({
            text: data.message || "Something went wrong.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc3a0)",
          }).showToast();
        }
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);

        // Show error toast if server returns non-JSON response
        Toastify({
          text: "Unexpected response from server.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc3a0)",
        }).showToast();
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      // Show error toast if there was an error with the fetch request
      Toastify({
        text: "Something went wrong. Please try again.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc3a0)",
      }).showToast();
    }
  });
