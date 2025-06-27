// recapt.js
document.addEventListener("DOMContentLoaded", function() {
  let recaptchaLoaded = false;
  const container = document.getElementById("captcha");

  function initializeRecaptcha(siteKey) {
    if (!siteKey || !container) return;

    if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
      // Si reCAPTCHA ya está cargado
      grecaptcha.render(container, {
        sitekey: siteKey,
        theme: 'light',
        callback: function() {
          recaptchaLoaded = true;
        }
      });
    } else {
      // Cargar reCAPTCHA dinámicamente si no está presente
      window.onRecaptchaLoad = function() {
        grecaptcha.render(container, {
          sitekey: siteKey,
          theme: 'light',
          callback: function() {
            recaptchaLoaded = true;
          }
        });
      };

      if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoad`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  }

  // Obtener la clave del servidor
  fetch("/api/recaptcha-key")
    .then(res => res.json())
    .then(data => {
      if (data.siteKey) {
        initializeRecaptcha(data.siteKey);
        
        // Verificar periódicamente si se cargó
        const checkInterval = setInterval(() => {
          if (recaptchaLoaded) {
            clearInterval(checkInterval);
            container.style.opacity = '1';
          }
        }, 100);
      }
    })
    .catch(err => {
      console.error("Error cargando reCAPTCHA:", err);
    });
});