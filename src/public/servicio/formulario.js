document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var correo = document.getElementById("correo").value;
    var nombre = document.getElementById("nombre").value;
    var comentario = document.getElementById("comentario").value;

     const token = grecaptcha.getResponse(); // 👈 Este debe estar dentro del submit
    if (!token) {
      alert("Por favor completa el reCAPTCHA.");
      return;
    }

    fetch("/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, nombre, comentario, "g-recaptcha": token }),
    })
      .then(function (resp) {
        if (resp.ok) {

          

          document.querySelector(".form-container").innerHTML = `
            <h2>¡Gracias por contactarnos!</h2>
                <h3>Hemos recibido tu mensaje. Te responderemos pronto.</h3>
            <button onclick="window.location.reload()">Enviar otro</button>
          `;
        } else {
          console.error("❌ Error guardando contacto:", resp.status, resp.statusText);
        }
      })
      .catch(function (err) {
        console.error("⚠️ Error general en geoCliente.js:", err);
      });
  });
});
