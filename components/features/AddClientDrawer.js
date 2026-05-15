"use client";
import React, { useState, useEffect } from "react";
import { Drawer, Field } from "@/components/ui/Shared";
import Icon from "@/components/ui/Icon";

export default function AddClientDrawer({ open, onClose, onSubmit }) {
  const empty = {
    name_full: "",
    phone_number: "",
    date_of_birth: "",
    date_joining: new Date().toISOString().slice(0, 10),
    status: "active",
    general_notes: "",
  };
  
  const [c, setC] = useState(empty);
  
  useEffect(() => {
    if (open) setC(empty);
  }, [open]);

  const valid = c.name_full.trim() && c.phone_number.trim() && c.date_of_birth;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="לקוח חדש"
      sub="הוספה לתיק. ניתן יהיה להוסיף מוצרים מיד אחרי השמירה."
      footer={
        <>
          <button
            className="btn primary"
            disabled={!valid}
            onClick={() => onSubmit(c)}
          >
            <Icon name="check" size={14} /> שמירה ופתיחת כרטיס
          </button>
          <button className="btn" onClick={onClose}>
            ביטול
          </button>
          <div
            style={{
              marginInlineStart: "auto",
              fontSize: 11.5,
              color: "var(--text-3)",
              alignSelf: "center",
            }}
          >
            <span className="kbd">Esc</span> לסגירה
          </div>
        </>
      }
    >
      <Field label="שם מלא">
        <input
          className="input lg"
          placeholder="לדוגמה: רחל פרידמן"
          value={c.name_full}
          onChange={(e) => setC({ ...c, name_full: e.target.value })}
          autoFocus
        />
      </Field>
      <div className="field-row">
        <Field label="טלפון נייד">
          <input
            className="input lg"
            placeholder="050-000-0000"
            dir="ltr"
            value={c.phone_number}
            onChange={(e) => setC({ ...c, phone_number: e.target.value })}
          />
        </Field>
        <Field label="תאריך לידה">
          <input
            className="input lg"
            type="date"
            dir="ltr"
            value={c.date_of_birth}
            onChange={(e) => setC({ ...c, date_of_birth: e.target.value })}
          />
        </Field>
      </div>
      <div className="field-row">
        <Field label="תאריך הצטרפות">
          <input
            className="input lg"
            type="date"
            dir="ltr"
            value={c.date_joining}
            onChange={(e) => setC({ ...c, date_joining: e.target.value })}
          />
        </Field>
        <Field label="סטטוס התחלתי">
          <select
            className="input lg"
            value={c.status}
            onChange={(e) => setC({ ...c, status: e.target.value })}
          >
            <option value="active">פעיל</option>
            <option value="needs">דורש טיפול</option>
            <option value="inactive">לא פעיל</option>
          </select>
        </Field>
      </div>
      <Field
        label="הערות (חופשי)"
        hint="אפשר להוסיף רקע, נקודות שיחה, או להשאיר ריק."
      >
        <textarea
          className="input"
          style={{ height: 88, padding: "8px 12px" }}
          value={c.general_notes}
          onChange={(e) => setC({ ...c, general_notes: e.target.value })}
        />
      </Field>

      <div
        style={{
          marginTop: 20,
          padding: "12px 14px",
          background: "var(--bg-soft)",
          borderRadius: "var(--radius)",
          fontSize: 12,
          color: "var(--text-2)",
          display: "flex",
          gap: 10,
        }}
      >
        <Icon
          name="bell"
          size={14}
          stroke={1.4}
          style={{ color: "var(--accent)", marginTop: 2, flex: "0 0 14px" }}
        />
        <div>
          תזכורת ליום הולדת ושיחת שימור שנתית ייווצרו אוטומטית על בסיס
          התאריכים שמילאת.
        </div>
      </div>
    </Drawer>
  );
}
