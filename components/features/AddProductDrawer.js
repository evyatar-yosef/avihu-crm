"use client";
import React, { useState, useEffect } from "react";
import { Drawer, Field } from "@/components/ui/Shared";
import Icon from "@/components/ui/Icon";
import { COMPANIES, CATEGORIES } from "@/lib/data";
import { fmtCurrency } from "@/lib/utils";

export default function AddProductDrawer({ open, onClose, onSubmit, clientName }) {
  const empty = {
    category: "בריאות",
    company: COMPANIES[0],
    date_start: new Date().toISOString().slice(0, 10),
    premium_monthly: "",
  };
  
  const [p, setP] = useState(empty);
  
  useEffect(() => {
    if (open) setP(empty);
  }, [open]);

  const premiumNum = parseFloat(p.premium_monthly) || 0;
  const valid = p.category && p.company && p.date_start && premiumNum > 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="מוצר חדש"
      sub={clientName ? `נוסף לתיק של ${clientName}` : ""}
      footer={
        <>
          <button
            className="btn primary"
            disabled={!valid}
            onClick={() => onSubmit({ ...p, premium_monthly: premiumNum })}
          >
            <Icon name="check" size={14} /> הוספת מוצר
          </button>
          <button className="btn" onClick={onClose}>
            ביטול
          </button>
        </>
      }
    >
      <Field label="סוג מוצר">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setP({ ...p, category: cat })}
              className={`btn ${p.category === cat ? "primary" : ""}`}
              style={{ height: 38, justifyContent: "flex-start", padding: "0 14px" }}
            >
              <Icon
                name={
                  cat === "בריאות" ? "shield" :
                  cat === "פנסיה" ? "pie" :
                  cat === "השקעות" ? "coins" : "home"
                }
                size={14}
              />
              {cat}
            </button>
          ))}
        </div>
      </Field>

      <Field label="הגוף המוסדי">
        <select
          className="input lg"
          value={p.company}
          onChange={(e) => setP({ ...p, company: e.target.value })}
        >
          {COMPANIES.map((co) => (
            <option key={co} value={co}>
              {co}
            </option>
          ))}
        </select>
      </Field>

      <div className="field-row">
        <Field label="תאריך תחילת פוליסה">
          <input
            className="input lg"
            type="date"
            dir="ltr"
            value={p.date_start}
            onChange={(e) => setP({ ...p, date_start: e.target.value })}
          />
        </Field>
        <Field label="פרמיה / הפקדה חודשית">
          <div style={{ position: "relative" }}>
            <input
              className="input lg"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="0"
              dir="ltr"
              style={{ paddingLeft: 32 }}
              value={p.premium_monthly}
              onChange={(e) => setP({ ...p, premium_monthly: e.target.value })}
            />
            <span
              style={{
                position: "absolute",
                left: 12,
                top: 0,
                bottom: 0,
                display: "grid",
                placeItems: "center",
                color: "var(--text-3)",
                fontSize: 13,
              }}
            >
              ₪
            </span>
          </div>
        </Field>
      </div>

      <div
        style={{
          marginTop: 8,
          padding: "14px 16px",
          background: "var(--accent-soft)",
          borderRadius: "var(--radius)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11.5,
              color: "var(--accent-ink)",
              fontWeight: 600,
              letterSpacing: ".04em",
              textTransform: "uppercase",
            }}
          >
            תוספת שנתית לתיק
          </div>
          <div
            className="num"
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "var(--accent-ink)",
              marginTop: 2,
            }}
          >
            {fmtCurrency(premiumNum * 12)}
          </div>
        </div>
        <Icon name="spark" size={24} style={{ color: "var(--accent)" }} />
      </div>
    </Drawer>
  );
}
