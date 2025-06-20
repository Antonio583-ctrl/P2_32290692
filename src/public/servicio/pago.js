document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-pago");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    if (data.numero_tarjeta) {
    data.numero_tarjeta = data.numero_tarjeta.replace(/\D/g, "");
    }

    fetch("/pago", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    })
      .then(async resp => {
        const respuesta = await resp.json();
        Toastify({
          text: respuesta.message || (resp.ok ? "Pago realizado correctamente" : "Error al procesar el pago"),
          duration: 4000,
          gravity: "center",
          position: "center",
          backgroundColor: resp.ok ? "#4CAF50" : "#c0392b"
        }).showToast();

        if (resp.ok) form.reset();
      })
      .catch(() => {
        Toastify({
          text: "Error de conexión",
          duration: 4000,
          gravity: "center",
          position: "center",
          backgroundColor: "#c0392b"
        }).showToast();
      });
  });
});