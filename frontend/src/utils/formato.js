export const folio = (id) => `OS-${String(id).padStart(5, '0')}`;

export function fecha(valor, conHora = true) {
  if (!valor) return '—';

  const d = new Date(String(valor).replace(' ', 'T'));

  if (Number.isNaN(d.getTime())) return valor;

  return d.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(conHora ? { hour: '2-digit', minute: '2-digit' } : {})
  });
}
