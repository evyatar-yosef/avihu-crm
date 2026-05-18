"use client";
import React from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function Topbar({ crumbs, actions, onMenuClick }) {
  return (
    <div className="topbar">
      <button 
        className="btn ghost icon sm mobile-menu-btn" 
        onClick={onMenuClick}
        style={{ marginInlineEnd: 8 }}
      >
        <Icon name="menu" size={16} />
      </button>
      <nav className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className="sep">
                <Icon name="chevron" size={12} />
              </span>
            )}
            {i === crumbs.length - 1 ? (
              <span className="cur">{c.label}</span>
            ) : c.href ? (
              <Link href={c.href} className="btn ghost sm" style={{ textDecoration: 'none' }}>
                {c.label}
              </Link>
            ) : (
              <button className="btn ghost sm" onClick={c.onClick}>
                {c.label}
              </button>
            )}
          </React.Fragment>
        ))}
      </nav>
      <div className="topbar-actions">{actions}</div>
    </div>
  );
}
