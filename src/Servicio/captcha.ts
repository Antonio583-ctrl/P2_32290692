export async function verificarCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error("❌ Clave secreta reCAPTCHA no configurada");
    return false;
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("⚠️ Error al verificar reCAPTCHA:", error);
    return false;
  }
}
