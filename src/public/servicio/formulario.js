document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("contactForm");
  if (!form || !window.translations) return;

  const t = window.translations.contact;
  let isSubmitting = false; // evitar duplicados

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;
    
    // Mostrar estado de carga
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = t.sending || "Enviando...";

    try {
      var correo = document.getElementById("correo").value;
      var nombre = document.getElementById("nombre").value;
      var comentario = document.getElementById("comentario").value;

      try {
        await new Promise(resolve => {
          if (typeof grecaptcha !== 'undefined' && grecaptcha.ready) {
            grecaptcha.ready(resolve);
          } else {
            resolve();
          }
        });
      } catch (error) {
        console.error("Error initializing reCAPTCHA:", error);
      }

      const token = grecaptcha.getResponse();

      if (!token) {
        showToast(t.validation.captcha, "#c0392b");
        return;
      }

      if (!correo || !nombre || !comentario) {
        showToast(t.validation.requiredAll, "#c0392b");
      return;
      }

      fetch("/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          correo, 
          nombre, 
          comentario, 
          "g-recaptcha": token }),
      })
        .then(function (resp) {
          if (resp.ok) {
            form.reset();
            grecaptcha.reset();
            showToast(t.success, "#27ae60");
          } else {
            alert(t.error);
          }
        })
        .catch(err => {
        showToast(t.error, "#c0392b");
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
});
