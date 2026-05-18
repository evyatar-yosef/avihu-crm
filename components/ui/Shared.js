"use client";
import React, { useEffect } from "react";
import { initials } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/data";
import Icon from "./Icon";

export const Avatar = ({ name, size = "md", accent = false }) => {
  const cls = ["avatar", size === "lg" ? "lg" : "", accent ? "accent" : ""]
    .filter(Boolean)
    .join(" ");
  return <div className={cls}>{initials(name)}</div>;
};

export const StatusPill = ({ status }) => {
  const s = STATUS_LABELS[status] || STATUS_LABELS.active;
  return <span className={`pill dot ${s.cls}`}>{s.label}</span>;
};

export const Drawer = ({ open, onClose, title, sub, children, footer }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={`drawer-scrim ${open ? "open" : ""}`} onClick={onClose} {...(!open ? { inert: "" } : {})} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open} {...(!open ? { inert: "" } : {})}>
        <header className="drawer-h">
          <div style={{ flex: 1 }}>
            <h2>{title}</h2>
            {sub && <div className="sub">{sub}</div>}
          </div>
          <button
            className="btn icon ghost"
            onClick={onClose}
            aria-label="סגירה"
          >
            <Icon name="x" size={15} />
          </button>
        </header>
        <div className="drawer-b">{children}</div>
        {footer && <footer className="drawer-f">{footer}</footer>}
      </aside>
    </>
  );
};

export const Field = ({ label, hint, children }) => (
  <div className="field">
    <label>{label}</label>
    {children}
    {hint && <div className="hint">{hint}</div>}
  </div>
);

export const Empty = ({ children }) => (
  <div className="card-empty">{children}</div>
);
