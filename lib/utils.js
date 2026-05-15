// lib/utils.js
import { TODAY } from './data';

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function fmtDateLong(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function fmtCurrency(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(n);
}

export function initials(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
}

export function ageFromDob(iso) {
  const d = new Date(iso);
  let age = TODAY.getFullYear() - d.getFullYear();
  const m = TODAY.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && TODAY.getDate() < d.getDate())) age--;
  return age;
}

export function yearsSince(iso) {
  const d = new Date(iso);
  let y = TODAY.getFullYear() - d.getFullYear();
  const m = TODAY.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && TODAY.getDate() < d.getDate())) y--;
  return y;
}

export function isBirthdayToday(iso) {
  const d = new Date(iso);
  return d.getMonth() === TODAY.getMonth() && d.getDate() === TODAY.getDate();
}

export function isJoiningAnniversary(iso) {
  const d = new Date(iso);
  return d.getMonth() === TODAY.getMonth()
      && d.getDate() === TODAY.getDate()
      && d.getFullYear() < TODAY.getFullYear();
}

export function daysUntilBirthday(iso) {
  const d = new Date(iso);
  const next = new Date(TODAY.getFullYear(), d.getMonth(), d.getDate());
  if (next < TODAY) next.setFullYear(next.getFullYear() + 1);
  return Math.round((next - TODAY) / 86400000);
}
