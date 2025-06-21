export function formatFecha(fechaStr: string): string {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  let horas = fecha.getHours();
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  const ampm = horas >= 12 ? 'PM' : 'AM';
  horas = horas % 12;
  if (horas === 0) horas = 12;
  return `${dia}/${mes}/${año} ${horas}:${minutos} ${ampm}`;
}