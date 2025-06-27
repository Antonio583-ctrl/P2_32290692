export function formatMoneda(monto: number, lang: string) {
  if (lang === 'en') {
    // Inglés (EE.UU.): USD $15.00
    return `USD ${new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol'
    }).format(monto)}`;
  } else {
    // Español (Venezuela): VES 1.500,00 Bs
    const montoEnBs = monto * 106; // Conversión a céntimos
    return `VES ${new Intl.NumberFormat('es-VE', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(montoEnBs)} Bs`;
  }
}
