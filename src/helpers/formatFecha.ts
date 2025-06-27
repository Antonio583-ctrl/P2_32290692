import moment from 'moment';
import 'moment/locale/es';

export function formatFecha(date: Date | string, lang: string) {
  moment.locale(lang === 'en' ? 'en' : 'es');
  const format = lang === 'en' ? 'MM/DD/YYYY hh:mm A' : 'DD/MM/YYYY HH:mm';
  return moment(date).format(format);
}