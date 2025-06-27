document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-pago");
  if (!form || !window.translationsPg) return;

  const t = window.translationsPg;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    if (data.numero_tarjeta) {
    data.numero_tarjeta = data.numero_tarjeta.replace(/\D/g, "");
    }

    showToast("Processing payment...", "#4CAF50");
    showToast(document.documentElement.lng === 'es' ? "Procesando pago..." : "Processing payment...", "#4CAF50");

    try {
      const response = await fetch("/pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
      });

      const result = await response.json();

      if (response.ok) {
          localStorage.removeItem('serviciosSeleccionados');
          showToast(result.message || t.success, "#4CAF50");
          setTimeout(() => {
            window.location.href = '/pago';
          }, 2000);
          form.reset();
      } else {
          showToast(result.message || t.error.paymentProcessing, "#c0392b")
      } 
    }  catch (error) {
      console.error("Error al procesar el pago:", error);
      showToast(t.conexion, "#c0392b");
    }
  });
});