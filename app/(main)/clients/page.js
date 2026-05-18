"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useClients } from "@/components/ClientProvider";
import { useUI } from "@/components/UIProvider";
import { Avatar, StatusPill, Empty } from "@/components/ui/Shared";
import Icon from "@/components/ui/Icon";
import { isBirthdayToday, isJoiningAnniversary, fmtDate, fmtCurrency, yearsSince } from "@/lib/utils";
import React, { useState, useEffect, useRef, Suspense } from "react";

function ClientsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clients, loading } = useClients();
  const { setShowAddClient } = useUI();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchParams.get("focus") === "search" && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchParams]);

  if (loading) {
    return <div className="pg" style={{ padding: 32 }}>טוען לקוחות...</div>;
  }

  const filtered = clients.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name_full.toLowerCase().includes(q) || c.phone_number.includes(q);
  });

  const onAddClient = () => {
    setShowAddClient(true);
  };

  const onOpenClient = (id) => {
    router.push(`/clients/${id}`);
  };

  return (
    <div className="pg">
      <div className="pg-h">
        <div>
          <h1>לקוחות</h1>
          <div className="sub">
            {filtered.length} מתוך {clients.length} לקוחות בתיק
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn">
            <Icon name="download" size={14} /> ייצוא
          </button>
          <button className="btn primary" onClick={onAddClient}>
            <Icon name="plus" size={14} /> לקוח חדש
          </button>
        </div>
      </div>

      <div className="filters fade-up">
        <div className="search" style={{ flex: 1, maxWidth: 380 }}>
          <Icon name="search" />
          <input
            ref={searchInputRef}
            className="input"
            placeholder="חיפוש לפי שם או מספר טלפון…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="seg">
          {[
            { id: "all", label: "הכל" },
            { id: "active", label: "פעיל" },
            { id: "needs", label: "דורש טיפול" },
            { id: "inactive", label: "לא פעיל" },
          ].map((s) => (
            <button
              key={s.id}
              className={statusFilter === s.id ? "on" : ""}
              onClick={() => setStatusFilter(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div
          style={{
            marginInlineStart: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "var(--text-3)",
            fontSize: 12,
          }}
        >
          <span className="kbd">⌘</span>
          <span className="kbd">K</span>
          <span>לחיפוש מהיר</span>
        </div>
      </div>

      <div className="card fade-up d1" style={{ overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="tbl">
            <thead>
              <tr>
              <th style={{ width: 36 }}></th>
              <th>שם מלא</th>
              <th>טלפון</th>
              <th>סטטוס</th>
              <th>הצטרפות</th>
              <th>מוצרים</th>
              <th style={{ textAlign: "end" }}>פרמיה חודשית</th>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <Empty>לא נמצאו לקוחות שתואמים את החיפוש.</Empty>
                </td>
              </tr>
            )}
            {filtered.map((c) => {
              const premium = c.products.reduce(
                (a, p) => a + p.premium_monthly,
                0
              );
              const flags = [];
              if (isBirthdayToday(c.date_of_birth))
                flags.push({ label: "יום הולדת", tone: "accent" });
              if (isJoiningAnniversary(c.date_joining))
                flags.push({ label: "שיחה שנתית", tone: "accent" });
              return (
                <tr
                  key={c.id}
                  className="clickable"
                  onClick={() => onOpenClient(c.id)}
                >
                  <td>
                    <Avatar name={c.name_full} />
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{c.name_full}</div>
                      <div
                        className="text-3 mono"
                        style={{ fontSize: 11 }}
                      >
                        {c.id}
                      </div>
                    </div>
                  </td>
                  <td
                    className="mono"
                    dir="ltr"
                    style={{ textAlign: "end" }}
                  >
                    {c.phone_number}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <StatusPill status={c.status} />
                      {flags.map((f, i) => (
                        <span key={i} className={`pill ${f.tone}`}>
                          {f.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="col" style={{ gap: 0 }}>
                      <span>{fmtDate(c.date_joining)}</span>
                      <span
                        className="text-3"
                        style={{ fontSize: 11.5 }}
                      >
                        {yearsSince(c.date_joining) === 0
                          ? "פחות משנה"
                          : `${yearsSince(c.date_joining)} שנים בתיק`}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      {c.products.slice(0, 3).map((p) => (
                        <span
                          key={p.id}
                          className="pill"
                          style={{ fontSize: 11 }}
                        >
                          {p.category}
                        </span>
                      ))}
                      {c.products.length > 3 && (
                        <span className="pill" style={{ fontSize: 11 }}>
                          +{c.products.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    className="num text-r"
                    style={{ fontWeight: 500 }}
                  >
                    {fmtCurrency(premium)}
                  </td>
                  <td>
                    <Icon
                      name="chevronLeft"
                      size={14}
                      style={{ color: "var(--text-3)" }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={<div className="pg" style={{ padding: 32 }}>טוען לקוחות...</div>}>
      <ClientsContent />
    </Suspense>
  );
}
