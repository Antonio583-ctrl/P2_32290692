export function formatMoneda(monto: number, lang: string) {
  if (lang === 'en') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monto);
  } else {
    return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(monto);
  }
}