document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/recaptcha-key")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("captcha");
      if (container && data.siteKey) {
        container.setAttribute("data-sitekey", data.siteKey);
        grecaptcha.render(container);
      }
    })
    .catch(err => {
      console.error("Error cargando clave reCAPTCHA:", err);
    });
});
