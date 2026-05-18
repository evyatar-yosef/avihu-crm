"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { initials } from "@/lib/utils";

const AGENT = { name: "אביהו יוסף", role: "סוכן ביטוח ופיננסים" };

export default function Sidebar({ open, onClose, alertsCount, onAddClient, onSearchClick }) {
  const pathname = usePathname();

  const items = [
    { id: "dashboard", label: "דשבורד", icon: "dashboard", href: "/" },
    { id: "clients", label: "לקוחות", icon: "users", href: "/clients", badge: alertsCount },
  ];

  return (
    <>
      {/* Scrim only visible on mobile when sidebar is open */}
      <div
        className={`sb-scrim ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
        {...(!open ? { inert: "" } : {})}
      />
      <aside className={`sb ${open ? "open" : ""}`} {...(!open ? { inert: "" } : {})}>
        <div className="sb-brand">
          <div className="sb-logo">א</div>
          <div className="sb-name">
            Avihu
            <small>CRM אישי</small>
          </div>
          {/* Close button only relevant on mobile */}
          <button
            className="btn ghost icon sm sb-close-btn"
            onClick={onClose}
            style={{ marginInlineStart: "auto" }}
            aria-label="סגור תפריט"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        <nav className="sb-group">
          {items.map((it) => {
            const isActive =
              pathname === it.href || (it.href === "/clients" && pathname.startsWith("/clients"));
            return (
              <Link
                key={it.id}
                href={it.href}
                onClick={onClose}
                className={`sb-item ${isActive ? "active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <Icon name={it.icon} size={15} />
                {it.label}
                {it.badge ? <span className="badge">{it.badge}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="sb-group">
          <div className="sb-group-h">קיצורי דרך</div>
          <button className="sb-item" onClick={onAddClient}>
            <Icon name="plus" size={15} />
            לקוח חדש
            <span className="kbd" style={{ marginInlineStart: "auto" }}>N</span>
          </button>
          <button className="sb-item" onClick={onSearchClick}>
            <Icon name="search" size={15} />
            חיפוש
            <span className="kbd" style={{ marginInlineStart: "auto" }}>⌘K</span>
          </button>
        </div>

        <div className="sb-foot" style={{ marginTop: "auto" }}>
          <div className="sb-avatar">{initials(AGENT.name)}</div>
          <div className="sb-user">
            {AGENT.name}
            <small>{AGENT.role}</small>
          </div>
        </div>
      </aside>
    </>
  );
}
