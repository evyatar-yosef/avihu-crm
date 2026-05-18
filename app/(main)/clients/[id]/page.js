"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useClients } from "@/components/ClientProvider";
import { Avatar, StatusPill, Empty } from "@/components/ui/Shared";
import Icon from "@/components/ui/Icon";
import AddProductDrawer from "@/components/features/AddProductDrawer";
import {
  isBirthdayToday,
  isJoiningAnniversary,
  ageFromDob,
  fmtDate,
  fmtDateLong,
  fmtCurrency,
  yearsSince,
} from "@/lib/utils";

const DetailItem = ({ label, value, display, editing, type = "text", onChange }) => (
  <div style={{ minWidth: 200 }}>
    <dt>{label}</dt>
    <dd>
      {!editing ? (
        display
      ) : type === "status" ? (
        <select
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "auto" }}
        >
          <option value="active">פעיל</option>
          <option value="inactive">לא פעיל</option>
          <option value="needs">דורש טיפול</option>
        </select>
      ) : (
        <input
          className="input"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", maxWidth: 220 }}
          dir={type === "date" ? "ltr" : "auto"}
        />
      )}
    </dd>
  </div>
);

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { clients, loading, updateClient, addProduct } = useClients();

  const [client, setClient] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [notes, setNotes] = useState("");
  const [savedAt, setSavedAt] = useState("לפני 2 ימים");
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const c = clients.find((c) => c.id === params.id);
      if (c) {
        setClient(c);
        setDraft(c);
        setNotes(c.general_notes || "");
      }
    }
  }, [params?.id, clients]);

  if (loading || !client) return <div className="pg"><Empty>טוען נתונים...</Empty></div>;

  const saveProfile = () => {
    updateClient(draft);
    setEditing(false);
    setSavedAt("עכשיו");
  };

  const saveNotes = () => {
    if (notes !== client.general_notes) {
      updateClient({ ...client, general_notes: notes });
      setSavedAt("עכשיו");
    }
  };

  const onAddProductSubmit = (p) => {
    addProduct(client.id, p);
    setShowAddProduct(false);
  };

  const premium = client.products.reduce((a, p) => a + p.premium_monthly, 0);
  const isBdayToday = isBirthdayToday(client.date_of_birth);
  const isAnniv = isJoiningAnniversary(client.date_joining);

  return (
    <div className="pg" style={{ maxWidth: 1180 }}>
      <button
        className="btn ghost sm"
        onClick={() => router.push("/clients")}
        style={{ marginBottom: 14 }}
      >
        <Icon name="chevron" size={14} /> חזרה לרשימת לקוחות
      </button>

      <div className="card fade-up" style={{ overflow: "hidden" }}>
        {/* Client header */}
        <div className="client-h">
          <Avatar name={client.name_full} size="lg" accent />
          <div className="titles" style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <h1>{client.name_full}</h1>
              <StatusPill status={client.status} />
              {isBdayToday && (
                <span className="pill accent">
                  <Icon name="cake" size={11} /> יום הולדת{" "}
                  {ageFromDob(client.date_of_birth)} היום
                </span>
              )}
              {isAnniv && (
                <span className="pill accent">
                  <Icon name="handshake" size={11} /> שיחה שנתית ·{" "}
                  {yearsSince(client.date_joining)} שנים
                </span>
              )}
            </div>
            <div className="row gap-3 text-2" style={{ fontSize: 13 }}>
              <span className="id mono">{client.id}</span>
              <span>·</span>
              <span className="mono" dir="ltr">
                {client.phone_number}
              </span>
              <span>·</span>
              <span>
                {client.products.length} מוצרים · {fmtCurrency(premium)}/חודש
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn sm">
              <Icon name="phone" size={13} /> חיוג
            </button>
            <button className="btn sm" onClick={() => setEditing((e) => !e)}>
              <Icon name={editing ? "check" : "edit"} size={13} />
              {editing ? "שמירה" : "עריכה"}
            </button>
            <button className="btn icon sm ghost">
              <Icon name="dots" size={14} />
            </button>
          </div>
        </div>

        {/* Personal details */}
        <dl className="client-meta">
          <DetailItem
            label="טלפון"
            editing={editing}
            value={draft.phone_number}
            display={<span className="mono" dir="ltr">{client.phone_number}</span>}
            onChange={(v) => setDraft({ ...draft, phone_number: v })}
          />
          <DetailItem
            label="תאריך לידה"
            editing={editing}
            type="date"
            value={draft.date_of_birth}
            display={`${fmtDateLong(client.date_of_birth)} · בן/בת ${ageFromDob(
              client.date_of_birth
            )}`}
            onChange={(v) => setDraft({ ...draft, date_of_birth: v })}
          />
          <DetailItem
            label="הצטרפות לתיק"
            editing={editing}
            type="date"
            value={draft.date_joining}
            display={`${fmtDateLong(client.date_joining)} · ${yearsSince(
              client.date_joining
            )} שנים`}
            onChange={(v) => setDraft({ ...draft, date_joining: v })}
          />
          <DetailItem
            label="סטטוס"
            editing={editing}
            type="status"
            value={draft.status}
            display={<StatusPill status={client.status} />}
            onChange={(v) => setDraft({ ...draft, status: v })}
          />
        </dl>

        {editing && (
          <div
            style={{
              padding: "12px 24px",
              borderBottom: "1px solid var(--border)",
              background: "var(--bg-soft)",
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            <button
              className="btn sm"
              onClick={() => {
                setEditing(false);
                setDraft(client);
              }}
            >
              ביטול
            </button>
            <button className="btn sm primary" onClick={saveProfile}>
              שמירת שינויים
            </button>
          </div>
        )}

        {/* Products section */}
        <div style={{ padding: "20px 24px 24px" }}>
          <div className="sec-h">
            <h2>מוצרים פיננסיים</h2>
            <span className="meta">
              {client.products.length} מוצרים · {fmtCurrency(premium)} בחודש
            </span>
            <div style={{ marginInlineStart: "auto" }}>
              <button className="btn sm" onClick={() => setShowAddProduct(true)}>
                <Icon name="plus" size={13} /> הוספת מוצר
              </button>
            </div>
          </div>

          <div className="col gap-3">
            {client.products.map((p) => (
              <div key={p.id} className="prod">
                <div>
                  <div className="cat">{p.category}</div>
                  <div className="co">{p.company}</div>
                  <div className="start">
                    תחילת פוליסה · {fmtDate(p.date_start)}
                  </div>
                </div>
                <div className="premium">
                  <div className="amt num">{fmtCurrency(p.premium_monthly)}</div>
                  <div className="per">פרמיה / חודש</div>
                </div>
              </div>
            ))}
            {client.products.length === 0 && (
              <Empty>
                אין מוצרים בתיק.{" "}
                <button
                  className="btn sm"
                  style={{ marginInlineStart: 8 }}
                  onClick={() => setShowAddProduct(true)}
                >
                  <Icon name="plus" size={12} /> הוספה
                </button>
              </Empty>
            )}
          </div>

          {/* Notes section */}
          <div className="sec-h" style={{ marginTop: 24 }}>
            <h2>הערות</h2>
            <span className="meta">נשמר {savedAt}</span>
          </div>
          <div className="notes-box">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              placeholder="הערות חופשיות על הלקוח, רקע אישי, נקודות שיחה…"
            />
            <div className="notes-meta">
              <span>שמירה אוטומטית בעת לחיצה מחוץ לשדה.</span>
              <span className="num">{notes.length} תווים</span>
            </div>
          </div>
        </div>
      </div>

      <AddProductDrawer
        open={showAddProduct}
        clientName={client.name_full}
        onClose={() => setShowAddProduct(false)}
        onSubmit={onAddProductSubmit}
      />
    </div>
  );
}
