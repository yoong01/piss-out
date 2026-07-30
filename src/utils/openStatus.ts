import { OpeningHours } from '../data/types';

export function getOpenStatus(hours: OpeningHours, now: Date = new Date()) {
  const [openH, openM] = hours.open.split(':').map(Number);
  const [closeH, closeM] = hours.close.split(':').map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;
  const crossesMidnight = closeMinutes <= openMinutes;
  if (crossesMidnight) closeMinutes += 24 * 60;

  let adjustedNow = nowMinutes;
  if (crossesMidnight && nowMinutes < openMinutes) adjustedNow += 24 * 60;

  const isOpen = adjustedNow >= openMinutes && adjustedNow < closeMinutes;
  return {
    isOpen,
    label: isOpen ? `Open · closes ${hours.close}` : `Closed · opens ${hours.open}`,
  };
}
