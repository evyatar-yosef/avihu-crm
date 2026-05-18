// lib/data.js
// Today: Dynamic

export const TODAY = new Date();

export const COMPANIES = ['הראל', 'מגדל', 'אלטשולר שחם', 'כלל', 'מנורה מבטחים', 'הפניקס', 'מיטב דש'];
export const CATEGORIES = ['בריאות', 'חיים/משכנתא', 'פנסיה', 'השקעות'];

export const STATUS_LABELS = {
  active:   { label: 'פעיל',         cls: 'active' },
  inactive: { label: 'לא פעיל',     cls: 'inactive' },
  needs:    { label: 'דורש טיפול',  cls: 'needs' },
};
