"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Shared";
import Icon from "@/components/ui/Icon";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("avihuyoyo@gmail.com");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e?.preventDefault();
    setBusy(true);
    setErrorMsg("");
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pwd,
    });

    setBusy(false);

    if (error) {
      setErrorMsg("אימייל או סיסמה שגויים.");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="login-stage">
      <div className="login-poetry">
        <div className="login-stamp">
          <div className="logo">א</div>
          <div>
            Avihu CRM
            <div className="text-3" style={{ fontSize: 11.5 }}>
              אישי. סגור. מוצפן.
            </div>
          </div>
        </div>

        <div className="login-quote fade-up">
          <em>&quot;הלקוח לא זוכר מה אמרת.<br /></em>
          הוא זוכר איך גרמת לו להרגיש.&quot;
          <div
            style={{
              fontSize: 13,
              color: "var(--text-3)",
              marginTop: 18,
              fontWeight: 400,
            }}
          >
            — מקסים שאמור בכל סוכנות; שווה לבדוק את התאריכים פעם אחת ביום.
          </div>
        </div>

        <div className="login-foot">
          <span>גרסה 0.4 · מהדורת ערב 14.5.26</span>
          <span>RLS פעיל · TLS 1.3</span>
        </div>
      </div>

      <form className="login-card" onSubmit={submit}>
        <div className="mobile-only" style={{ marginBottom: 20, alignItems: "center", gap: 10 }}>
          <div className="logo" style={{ width: 32, height: 32, fontSize: 16, margin: 0 }}>א</div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Avihu CRM</div>
        </div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "var(--text-3)",
            fontWeight: 600,
          }}
        >
          התחברות
        </div>
        <h1
          style={{
            margin: "6px 0 4px",
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-.025em",
          }}
        >
          ערב טוב, אביהו
        </h1>
        <div className="text-2" style={{ fontSize: 14, marginBottom: 28 }}>
          חמישה לקוחות, שלוש עשרה פוליסות, ושיחה אחת ליום הולדת.
        </div>

        <Field label="כתובת אימייל">
          <input
            className="input lg"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            dir="ltr"
          />
        </Field>

        <Field label="סיסמה">
          <div style={{ position: "relative" }}>
            <input
              className="input lg"
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              autoComplete="current-password"
              style={{ paddingLeft: 38 }}
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              style={{
                position: "absolute",
                left: 8,
                top: 0,
                bottom: 0,
                width: 30,
                display: "grid",
                placeItems: "center",
                color: "var(--text-3)",
              }}
              aria-label="הצג/הסתר סיסמה"
            >
              <Icon name={showPwd ? "eyeOff" : "eye"} size={15} />
            </button>
          </div>
        </Field>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
              color: "var(--text-2)",
            }}
          >
            <input type="checkbox" defaultChecked /> זכור אותי בדפדפן הזה
          </label>
          <a
            href="#"
            style={{
              fontSize: 12.5,
              color: "var(--accent-ink)",
              textDecoration: "none",
            }}
          >
            שכחתי סיסמה
          </a>
        </div>

        {errorMsg && (
          <div style={{ color: "var(--warn)", fontSize: 13, marginTop: 12, textAlign: "center" }}>
            {errorMsg}
          </div>
        )}

        <button
          className="btn primary"
          style={{ marginTop: errorMsg ? 12 : 22, height: 42, fontSize: 14, justifyContent: "center" }}
          type="submit"
          disabled={busy}
        >
          {busy ? "מתחבר…" : "כניסה למערכת"}
          <Icon name="arrowLeft" size={14} style={{ transform: "scaleX(-1)" }} />
        </button>

        <div
          style={{
            marginTop: 24,
            padding: "12px 14px",
            background: "var(--bg-soft)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 12,
            color: "var(--text-2)",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <Icon
            name="shield"
            size={16}
            stroke={1.4}
            style={{ color: "var(--accent)", marginTop: 1, flex: "0 0 16px" }}
          />
          <div>
            <strong style={{ color: "var(--text)" }}>
              הנתונים שלך, שלך בלבד.
            </strong>{" "}
            Row-Level Security מבטיח שאף משתמש אחר לא יכול לקרוא או לכתוב לטבלאות
            שלך.
          </div>
        </div>
      </form>
    </div>
  );
}
