"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useClients } from "@/components/ClientProvider";
import { Avatar, Empty } from "@/components/ui/Shared";
import Icon from "@/components/ui/Icon";
import {
  isBirthdayToday,
  isJoiningAnniversary,
  daysUntilBirthday,
  ageFromDob,
  fmtDate,
  fmtCurrency,
  yearsSince,
} from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { clients } = useClients();

  const birthdays = clients.filter((c) => isBirthdayToday(c.date_of_birth));
  const anniversaries = clients.filter((c) =>
    isJoiningAnniversary(c.date_joining)
  );
  const upcomingBdays = clients
    .filter((c) => !isBirthdayToday(c.date_of_birth))
    .map((c) => ({ c, days: daysUntilBirthday(c.date_of_birth) }))
    .filter((x) => x.days <= 30)
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  const active = clients.filter((c) => c.status === "active").length;
  const needs = clients.filter((c) => c.status === "needs").length;
  const totalPremium = clients.reduce(
    (s, c) =>
      s + c.products.reduce((a, p) => a + p.premium_monthly, 0),
    0
  );
  const totalProducts = clients.reduce((s, c) => s + c.products.length, 0);

  // Faux yearly distribution for spark
  const sparkData = [3, 5, 4, 7, 6, 8, 5, 9, 7, 6, 8, 9];
  const maxBar = Math.max(...sparkData);

  const onOpenClient = (id) => {
    router.push(`/clients/${id}`);
  };

  const onAddClient = () => {
    // Triggering the drawer would be done via keyboard shortcut or we can pass state down from AppLayout.
    // For now, let's dispatch a custom event to open the drawer
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "n", bubbles: true })
    );
  };

  // The design hardcoded the date "שישי, 15 במאי", but let's make it real-ish
  const todayDateStr = new Date().toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="pg">
      <div className="pg-h">
        <div>
          <h1>{todayDateStr}</h1>
          <div className="sub">
            יש לך{" "}
            <strong style={{ color: "var(--text)" }}>
              {birthdays.length + anniversaries.length} פעולות שימור
            </strong>{" "}
            היום, ועוד שלוש שצריך לסגור עד סוף השבוע.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn">
            <Icon name="calendar" size={14} /> תצוגת חודש
          </button>
          <button className="btn primary" onClick={onAddClient}>
            <Icon name="plus" size={14} /> לקוח חדש
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-3 fade-up">
        <div className="card">
          <div className="stat">
            <span className="lbl">לקוחות פעילים</span>
            <span className="val num">
              {active} <small>/ {clients.length}</small>
            </span>
            <span className="delta up">+1 השבוע</span>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <span className="lbl">פרמיה חודשית בתיק</span>
            <span className="val num">{fmtCurrency(totalPremium)}</span>
            <span className="delta">{totalProducts} מוצרים פעילים</span>
            <div className="spark">
              {sparkData.map((v, i) => (
                <span
                  key={i}
                  className={i === sparkData.length - 1 ? "hi" : ""}
                  style={{ height: `${(v / maxBar) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <span className="lbl">דורש טיפול</span>
            <span className="val num">{needs}</span>
            <span className="delta">תביעה פתוחה · יוסי אברהם</span>
          </div>
        </div>
      </div>

      {/* Alerts: birthdays + anniversaries */}
      <div className="grid-2 mt-6 fade-up d1">
        <div className="card">
          <div className="card-h">
            <Icon name="cake" size={16} style={{ color: "var(--accent)" }} />
            <h3>ימי הולדת היום</h3>
            <span className="meta">{birthdays.length} לקוחות</span>
          </div>
          <div className="card-b">
            {birthdays.length === 0 ? (
              <Empty>אין ימי הולדת היום.</Empty>
            ) : (
              birthdays.map((c) => (
                <button
                  key={c.id}
                  className="row-item"
                  onClick={() => onOpenClient(c.id)}
                  style={{ width: "100%" }}
                >
                  <Avatar name={c.name_full} accent />
                  <div className="col" style={{ alignItems: "flex-start" }}>
                    <div className="name">{c.name_full}</div>
                    <div className="desc">
                      בן/בת {ageFromDob(c.date_of_birth)} · {c.phone_number}
                    </div>
                  </div>
                  <div className="meta">
                    <span className="pill accent">היום</span>
                    <Icon name="chevronLeft" size={14} />
                  </div>
                </button>
              ))
            )}

            {upcomingBdays.length > 0 && (
              <>
                <div className="hr" />
                <div className="sb-group-h" style={{ padding: "6px 12px 4px" }}>
                  בקרוב
                </div>
                {upcomingBdays.map(({ c, days }) => (
                  <button
                    key={c.id}
                    className="row-item"
                    onClick={() => onOpenClient(c.id)}
                    style={{ width: "100%" }}
                  >
                    <Avatar name={c.name_full} />
                    <div className="col" style={{ alignItems: "flex-start" }}>
                      <div className="name">{c.name_full}</div>
                      <div className="desc">{fmtDate(c.date_of_birth)}</div>
                    </div>
                    <div className="meta">
                      <span
                        className="text-3 num"
                        style={{ fontSize: 12 }}
                      >
                        בעוד {days} ימים
                      </span>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <Icon
              name="handshake"
              size={16}
              style={{ color: "var(--accent)" }}
            />
            <h3>שיחות שימור שנתיות</h3>
            <span className="meta">{anniversaries.length} פעולות</span>
          </div>
          <div className="card-b">
            {anniversaries.length === 0 ? (
              <Empty>אין שיחות שימור מתוזמנות להיום.</Empty>
            ) : (
              anniversaries.map((c) => {
                const y = yearsSince(c.date_joining);
                return (
                  <button
                    key={c.id}
                    className="row-item"
                    onClick={() => onOpenClient(c.id)}
                    style={{ width: "100%" }}
                  >
                    <Avatar name={c.name_full} />
                    <div className="col" style={{ alignItems: "flex-start" }}>
                      <div className="name">{c.name_full}</div>
                      <div className="desc">
                        {y === 1 ? "שנה" : `${y} שנים`} בתיק · הצטרף ב-
                        {fmtDate(c.date_joining)}
                      </div>
                    </div>
                    <div className="meta">
                      <span className="pill accent">
                        {y === 1 ? "12 חודשים" : `${y * 12} חודשים`}
                      </span>
                      <Icon name="chevronLeft" size={14} />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent activity / coverage breakdown */}
      <div className="grid-2 mt-6 fade-up d2">
        <div className="card">
          <div className="card-h">
            <Icon name="pie" size={16} />
            <h3>תיק לפי קטגוריה</h3>
            <span className="meta">{totalProducts} מוצרים</span>
          </div>
          <div className="card-b" style={{ padding: 18 }}>
            {(() => {
              const byCat = {};
              clients.forEach((c) =>
                c.products.forEach((p) => {
                  byCat[p.category] =
                    (byCat[p.category] || 0) + p.premium_monthly;
                })
              );
              const total = Object.values(byCat).reduce((a, b) => a + b, 0);
              const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
              const hues = [38, 200, 140, 350];
              return (
                <div className="col gap-3">
                  <div
                    style={{
                      display: "flex",
                      height: 8,
                      borderRadius: 4,
                      overflow: "hidden",
                      background: "var(--bg-soft)",
                    }}
                  >
                    {entries.map(([cat, v], i) => (
                      <div
                        key={cat}
                        style={{
                          width: `${(v / (total || 1)) * 100}%`,
                          background: `oklch(0.66 0.09 ${
                            hues[i % hues.length]
                          })`,
                        }}
                      />
                    ))}
                  </div>
                  {entries.map(([cat, v], i) => (
                    <div
                      key={cat}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 13,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: `oklch(0.66 0.09 ${
                            hues[i % hues.length]
                          })`,
                        }}
                      />
                      <span style={{ flex: 1 }}>{cat}</span>
                      <span
                        className="num text-2"
                        style={{ fontSize: 12 }}
                      >
                        {Math.round((v / (total || 1)) * 100)}%
                      </span>
                      <span
                        className="num"
                        style={{ width: 80, textAlign: "end" }}
                      >
                        {fmtCurrency(v)}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <Icon name="bell" size={16} />
            <h3>פעילות אחרונה</h3>
            <span className="meta">7 ימים</span>
          </div>
          <div className="card-b">
            {[
              {
                dot: "accent",
                text: "התווסף מוצר",
                who: "דניאל כהן",
                detail: "השקעות · מיטב דש · ₪1,500/חודש",
                when: "14.5",
              },
              {
                dot: "success",
                text: "הערה נשמרה",
                who: "מיכל לוי",
                detail: '"מעבר דירה — לבדוק תכולה"',
                when: "13.5",
              },
              {
                dot: "warn",
                text: "תזכורת תביעה",
                who: "יוסי אברהם",
                detail: "ממתין למסמכים מהראל",
                when: "12.5",
              },
              {
                dot: "text-3",
                text: "נצפה כרטיס",
                who: "עומר שטרן",
                detail: "אין שינוי בסטטוס",
                when: "10.5",
              },
            ].map((a, i) => (
              <div key={i} className="row-item">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      a.dot === "accent"
                        ? "var(--accent)"
                        : a.dot === "success"
                        ? "var(--success)"
                        : a.dot === "warn"
                        ? "var(--warn)"
                        : "var(--text-3)",
                  }}
                />
                <div className="col" style={{ alignItems: "flex-start" }}>
                  <div className="name" style={{ fontSize: 13 }}>
                    {a.text} ·{" "}
                    <span className="text-2" style={{ fontWeight: 400 }}>
                      {a.who}
                    </span>
                  </div>
                  <div className="desc">{a.detail}</div>
                </div>
                <div className="meta mono">{a.when}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
