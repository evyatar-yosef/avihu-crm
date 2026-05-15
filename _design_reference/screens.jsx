// screens.jsx — Login, Dashboard, Clients, ClientDetail, drawers

// ───────────────────────────────────────────────────────────────────
// LOGIN
// ───────────────────────────────────────────────────────────────────
const Login = ({ onSignIn }) => {
  const [email, setEmail] = React.useState('avihu@avihu-insurance.co.il');
  const [pwd, setPwd] = React.useState('••••••••••••');
  const [showPwd, setShowPwd] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const submit = (e) => {
    e?.preventDefault();
    setBusy(true);
    setTimeout(() => { setBusy(false); onSignIn(); }, 420);
  };

  return (
    <div className="login-stage">
      <div className="login-poetry">
        <div className="login-stamp">
          <div className="logo">א</div>
          <div>
            Avihu CRM
            <div className="text-3" style={{ fontSize: 11.5 }}>אישי. סגור. מוצפן.</div>
          </div>
        </div>

        <div className="login-quote fade-up">
          <em>"הלקוח לא זוכר מה אמרת.<br/></em>
          הוא זוכר איך גרמת לו להרגיש."
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 18, fontWeight: 400 }}>
            — מקסים שאמור בכל סוכנות; שווה לבדוק את התאריכים פעם אחת ביום.
          </div>
        </div>

        <div className="login-foot">
          <span>גרסה 0.4 · מהדורת ערב 14.5.26</span>
          <span>RLS פעיל · TLS 1.3</span>
        </div>
      </div>

      <form className="login-card" onSubmit={submit}>
        <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-3)', fontWeight: 600 }}>
          התחברות
        </div>
        <h1 style={{ margin: '6px 0 4px', fontSize: 30, fontWeight: 500, letterSpacing: '-.025em' }}>
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
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            dir="ltr"
          />
        </Field>

        <Field label="סיסמה">
          <div style={{ position: 'relative' }}>
            <input
              className="input lg"
              type={showPwd ? 'text' : 'password'}
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              autoComplete="current-password"
              style={{ paddingLeft: 38 }}
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPwd(s => !s)}
              style={{ position:'absolute', left: 8, top: 0, bottom: 0, width: 30, display:'grid', placeItems:'center', color: 'var(--text-3)' }}
              aria-label="הצג/הסתר סיסמה"
            >
              <Icon name={showPwd ? 'eyeOff' : 'eye'} size={15} />
            </button>
          </div>
        </Field>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 8 }}>
          <label style={{ display:'flex', alignItems:'center', gap: 8, fontSize: 12.5, color: 'var(--text-2)' }}>
            <input type="checkbox" defaultChecked /> זכור אותי בדפדפן הזה
          </label>
          <a href="#" style={{ fontSize: 12.5, color: 'var(--accent-ink)', textDecoration: 'none' }}>
            שכחתי סיסמה
          </a>
        </div>

        <button className="btn primary" style={{ marginTop: 22, height: 42, fontSize: 14, justifyContent: 'center' }} type="submit" disabled={busy}>
          {busy ? 'מתחבר…' : 'כניסה למערכת'}
          <Icon name="arrowLeft" size={14} style={{ transform: 'scaleX(-1)' }} />
        </button>

        <div style={{ marginTop: 24, padding: '12px 14px', background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Icon name="shield" size={16} stroke={1.4} style={{ color: 'var(--accent)', marginTop: 1, flex: '0 0 16px' }} />
          <div>
            <strong style={{ color: 'var(--text)' }}>הנתונים שלך, שלך בלבד.</strong> Row-Level Security מבטיח שאף משתמש אחר לא יכול לקרוא או לכתוב לטבלאות שלך.
          </div>
        </div>
      </form>
    </div>
  );
};


// ───────────────────────────────────────────────────────────────────
// DASHBOARD
// ───────────────────────────────────────────────────────────────────
const Dashboard = ({ clients, onOpenClient, onAddClient }) => {
  const birthdays  = clients.filter(c => isBirthdayToday(c.date_of_birth));
  const anniversaries = clients.filter(c => isJoiningAnniversary(c.date_joining));
  const upcomingBdays = clients
    .filter(c => !isBirthdayToday(c.date_of_birth))
    .map(c => ({ c, days: daysUntilBirthday(c.date_of_birth) }))
    .filter(x => x.days <= 30)
    .sort((a,b) => a.days - b.days)
    .slice(0, 3);

  const active = clients.filter(c => c.status === 'active').length;
  const needs  = clients.filter(c => c.status === 'needs').length;
  const totalPremium = clients.reduce((s,c) => s + c.products.reduce((a,p) => a + p.premium_monthly, 0), 0);
  const totalProducts = clients.reduce((s,c) => s + c.products.length, 0);

  // Faux yearly distribution for spark
  const sparkData = [3,5,4,7,6,8,5,9,7,6,8,9];
  const maxBar = Math.max(...sparkData);

  return (
    <div className="pg">
      <div className="pg-h">
        <div>
          <h1>שישי, 15 במאי</h1>
          <div className="sub">יש לך <strong style={{ color: 'var(--text)' }}>{birthdays.length + anniversaries.length} פעולות שימור</strong> היום, ועוד שלוש שצריך לסגור עד סוף השבוע.</div>
        </div>
        <div style={{ display:'flex', gap: 8 }}>
          <button className="btn"><Icon name="calendar" size={14} /> תצוגת חודש</button>
          <button className="btn primary" onClick={onAddClient}><Icon name="plus" size={14} /> לקוח חדש</button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-3 fade-up">
        <div className="card">
          <div className="stat">
            <span className="lbl">לקוחות פעילים</span>
            <span className="val num">{active} <small>/ {clients.length}</small></span>
            <span className="delta up">+1 השבוע</span>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <span className="lbl">פרמיה חודשית בתיק</span>
            <span className="val num">{fmtCurrency(totalPremium)}</span>
            <span className="delta">{totalProducts} מוצרים פעילים</span>
            <div className="spark">
              {sparkData.map((v,i) => (
                <span key={i} className={i === sparkData.length - 1 ? 'hi' : ''}
                      style={{ height: `${(v/maxBar)*100}%` }} />
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
            <Icon name="cake" size={16} style={{ color: 'var(--accent)' }} />
            <h3>ימי הולדת היום</h3>
            <span className="meta">{birthdays.length} לקוחות</span>
          </div>
          <div className="card-b">
            {birthdays.length === 0
              ? <Empty>אין ימי הולדת היום.</Empty>
              : birthdays.map(c => (
                  <button key={c.id} className="row-item" onClick={() => onOpenClient(c.id)} style={{ width: '100%' }}>
                    <Avatar name={c.name_full} accent />
                    <div className="col" style={{ alignItems: 'flex-start' }}>
                      <div className="name">{c.name_full}</div>
                      <div className="desc">בן/בת {ageFromDob(c.date_of_birth)} · {c.phone_number}</div>
                    </div>
                    <div className="meta">
                      <span className="pill accent">היום</span>
                      <Icon name="chevronLeft" size={14} />
                    </div>
                  </button>
                ))}

            {upcomingBdays.length > 0 && (
              <>
                <div className="hr" />
                <div className="sb-group-h" style={{ padding: '6px 12px 4px' }}>בקרוב</div>
                {upcomingBdays.map(({ c, days }) => (
                  <button key={c.id} className="row-item" onClick={() => onOpenClient(c.id)} style={{ width: '100%' }}>
                    <Avatar name={c.name_full} />
                    <div className="col" style={{ alignItems: 'flex-start' }}>
                      <div className="name">{c.name_full}</div>
                      <div className="desc">{fmtDate(c.date_of_birth)}</div>
                    </div>
                    <div className="meta">
                      <span className="text-3 num" style={{ fontSize: 12 }}>בעוד {days} ימים</span>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <Icon name="handshake" size={16} style={{ color: 'var(--accent)' }} />
            <h3>שיחות שימור שנתיות</h3>
            <span className="meta">{anniversaries.length} פעולות</span>
          </div>
          <div className="card-b">
            {anniversaries.length === 0
              ? <Empty>אין שיחות שימור מתוזמנות להיום.</Empty>
              : anniversaries.map(c => {
                  const y = yearsSince(c.date_joining);
                  return (
                    <button key={c.id} className="row-item" onClick={() => onOpenClient(c.id)} style={{ width: '100%' }}>
                      <Avatar name={c.name_full} />
                      <div className="col" style={{ alignItems: 'flex-start' }}>
                        <div className="name">{c.name_full}</div>
                        <div className="desc">{y === 1 ? 'שנה' : `${y} שנים`} בתיק · הצטרף ב-{fmtDate(c.date_joining)}</div>
                      </div>
                      <div className="meta">
                        <span className="pill accent">{y === 1 ? '12 חודשים' : `${y * 12} חודשים`}</span>
                        <Icon name="chevronLeft" size={14} />
                      </div>
                    </button>
                  );
                })}
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
              clients.forEach(c => c.products.forEach(p => {
                byCat[p.category] = (byCat[p.category] || 0) + p.premium_monthly;
              }));
              const total = Object.values(byCat).reduce((a,b) => a+b, 0);
              const entries = Object.entries(byCat).sort((a,b) => b[1]-a[1]);
              const hues = [38, 200, 140, 350];
              return (
                <div className="col gap-3">
                  <div style={{ display:'flex', height: 8, borderRadius: 4, overflow:'hidden', background:'var(--bg-soft)' }}>
                    {entries.map(([cat, v], i) => (
                      <div key={cat} style={{
                        width: `${(v/total)*100}%`,
                        background: `oklch(0.66 0.09 ${hues[i % hues.length]})`,
                      }} />
                    ))}
                  </div>
                  {entries.map(([cat, v], i) => (
                    <div key={cat} style={{ display:'flex', alignItems:'center', gap: 10, fontSize: 13 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: `oklch(0.66 0.09 ${hues[i % hues.length]})` }} />
                      <span style={{ flex: 1 }}>{cat}</span>
                      <span className="num text-2" style={{ fontSize: 12 }}>{Math.round((v/total)*100)}%</span>
                      <span className="num" style={{ width: 80, textAlign: 'end' }}>{fmtCurrency(v)}</span>
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
              { dot: 'accent',  text: 'התווסף מוצר',  who: 'דניאל כהן',     detail: 'השקעות · מיטב דש · ₪1,500/חודש', when: '14.5' },
              { dot: 'success', text: 'הערה נשמרה',   who: 'מיכל לוי',      detail: '"מעבר דירה — לבדוק תכולה"',     when: '13.5' },
              { dot: 'warn',    text: 'תזכורת תביעה',  who: 'יוסי אברהם',    detail: 'ממתין למסמכים מהראל',            when: '12.5' },
              { dot: 'text-3',  text: 'נצפה כרטיס',   who: 'עומר שטרן',     detail: 'אין שינוי בסטטוס',                when: '10.5' },
            ].map((a, i) => (
              <div key={i} className="row-item">
                <span style={{ width: 6, height: 6, borderRadius: '50%',
                  background: a.dot === 'accent' ? 'var(--accent)'
                            : a.dot === 'success' ? 'var(--success)'
                            : a.dot === 'warn' ? 'var(--warn)' : 'var(--text-3)' }} />
                <div className="col" style={{ alignItems: 'flex-start' }}>
                  <div className="name" style={{ fontSize: 13 }}>{a.text} · <span className="text-2" style={{ fontWeight: 400 }}>{a.who}</span></div>
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
};


// ───────────────────────────────────────────────────────────────────
// CLIENTS LIST
// ───────────────────────────────────────────────────────────────────
const ClientsList = ({ clients, onOpenClient, onAddClient, search, setSearch, statusFilter, setStatusFilter }) => {
  const filtered = clients.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name_full.toLowerCase().includes(q) || c.phone_number.includes(q);
  });

  return (
    <div className="pg">
      <div className="pg-h">
        <div>
          <h1>לקוחות</h1>
          <div className="sub">{filtered.length} מתוך {clients.length} לקוחות בתיק</div>
        </div>
        <div style={{ display:'flex', gap: 8 }}>
          <button className="btn"><Icon name="download" size={14} /> ייצוא</button>
          <button className="btn primary" onClick={onAddClient}><Icon name="plus" size={14} /> לקוח חדש</button>
        </div>
      </div>

      <div className="filters fade-up">
        <div className="search" style={{ flex: 1, maxWidth: 380 }}>
          <Icon name="search" />
          <input
            className="input"
            placeholder="חיפוש לפי שם או מספר טלפון…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="seg">
          {[
            { id: 'all', label: 'הכל' },
            { id: 'active', label: 'פעיל' },
            { id: 'needs', label: 'דורש טיפול' },
            { id: 'inactive', label: 'לא פעיל' },
          ].map(s => (
            <button key={s.id} className={statusFilter === s.id ? 'on' : ''} onClick={() => setStatusFilter(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ marginInlineStart: 'auto', display:'flex', alignItems:'center', gap: 6, color: 'var(--text-3)', fontSize: 12 }}>
          <span className="kbd">⌘</span>
          <span className="kbd">K</span>
          <span>לחיפוש מהיר</span>
        </div>
      </div>

      <div className="card fade-up d1" style={{ overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 36 }}></th>
              <th>שם מלא</th>
              <th>טלפון</th>
              <th>סטטוס</th>
              <th>הצטרפות</th>
              <th>מוצרים</th>
              <th style={{ textAlign: 'end' }}>פרמיה חודשית</th>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8}><Empty>לא נמצאו לקוחות שתואמים את החיפוש.</Empty></td></tr>
            )}
            {filtered.map(c => {
              const premium = c.products.reduce((a, p) => a + p.premium_monthly, 0);
              const flags = [];
              if (isBirthdayToday(c.date_of_birth))   flags.push({ label: 'יום הולדת', tone: 'accent' });
              if (isJoiningAnniversary(c.date_joining)) flags.push({ label: 'שיחה שנתית', tone: 'accent' });
              return (
                <tr key={c.id} className="clickable" onClick={() => onOpenClient(c.id)}>
                  <td><Avatar name={c.name_full} /></td>
                  <td>
                    <div style={{ display:'flex', flexDirection:'column', gap: 2 }}>
                      <div style={{ fontWeight: 500 }}>{c.name_full}</div>
                      <div className="text-3 mono" style={{ fontSize: 11 }}>{c.id}</div>
                    </div>
                  </td>
                  <td className="mono" dir="ltr" style={{ textAlign: 'end' }}>{c.phone_number}</td>
                  <td>
                    <div style={{ display:'flex', gap: 6, alignItems: 'center' }}>
                      <StatusPill status={c.status} />
                      {flags.map((f,i) => <span key={i} className={`pill ${f.tone}`}>{f.label}</span>)}
                    </div>
                  </td>
                  <td>
                    <div className="col" style={{ gap: 0 }}>
                      <span>{fmtDate(c.date_joining)}</span>
                      <span className="text-3" style={{ fontSize: 11.5 }}>
                        {yearsSince(c.date_joining) === 0 ? 'פחות משנה' : `${yearsSince(c.date_joining)} שנים בתיק`}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap: 4, flexWrap: 'wrap' }}>
                      {c.products.slice(0, 3).map(p => (
                        <span key={p.id} className="pill" style={{ fontSize: 11 }}>{p.category}</span>
                      ))}
                      {c.products.length > 3 && <span className="pill" style={{ fontSize: 11 }}>+{c.products.length - 3}</span>}
                    </div>
                  </td>
                  <td className="num text-r" style={{ fontWeight: 500 }}>{fmtCurrency(premium)}</td>
                  <td><Icon name="chevronLeft" size={14} style={{ color: 'var(--text-3)' }} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// ───────────────────────────────────────────────────────────────────
// CLIENT DETAIL
// ───────────────────────────────────────────────────────────────────
const ClientDetail = ({ client, onBack, onSaveClient, onAddProduct, onDeleteProduct }) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(client);
  const [notes, setNotes] = React.useState(client.general_notes);
  const [savedAt, setSavedAt] = React.useState('לפני 2 ימים');
  const [showAddProduct, setShowAddProduct] = React.useState(false);

  React.useEffect(() => { setDraft(client); setNotes(client.general_notes); }, [client.id]);

  const saveProfile = () => {
    onSaveClient(draft);
    setEditing(false);
    setSavedAt('עכשיו');
  };
  const saveNotes = () => {
    onSaveClient({ ...client, general_notes: notes });
    setSavedAt('עכשיו');
  };

  const premium = client.products.reduce((a, p) => a + p.premium_monthly, 0);
  const isBdayToday = isBirthdayToday(client.date_of_birth);
  const isAnniv     = isJoiningAnniversary(client.date_joining);

  return (
    <div className="pg" style={{ maxWidth: 1180 }}>
      <button className="btn ghost sm" onClick={onBack} style={{ marginBottom: 14 }}>
        <Icon name="chevron" size={14} /> חזרה לרשימת לקוחות
      </button>

      <div className="card fade-up" style={{ overflow: 'hidden' }}>
        {/* Client header */}
        <div className="client-h">
          <Avatar name={client.name_full} size="lg" accent />
          <div className="titles" style={{ flex: 1 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10, flexWrap: 'wrap' }}>
              <h1>{client.name_full}</h1>
              <StatusPill status={client.status} />
              {isBdayToday && <span className="pill accent"><Icon name="cake" size={11} /> יום הולדת {ageFromDob(client.date_of_birth)} היום</span>}
              {isAnniv && <span className="pill accent"><Icon name="handshake" size={11} /> שיחה שנתית · {yearsSince(client.date_joining)} שנים</span>}
            </div>
            <div className="row gap-3 text-2" style={{ fontSize: 13 }}>
              <span className="id mono">{client.id}</span>
              <span>·</span>
              <span className="mono" dir="ltr">{client.phone_number}</span>
              <span>·</span>
              <span>{client.products.length} מוצרים · {fmtCurrency(premium)}/חודש</span>
            </div>
          </div>
          <div style={{ display:'flex', gap: 6 }}>
            <button className="btn sm"><Icon name="phone" size={13} /> חיוג</button>
            <button className="btn sm" onClick={() => setEditing(e => !e)}>
              <Icon name={editing ? 'check' : 'edit'} size={13} />
              {editing ? 'שמירה' : 'עריכה'}
            </button>
            <button className="btn icon sm ghost"><Icon name="dots" size={14} /></button>
          </div>
        </div>

        {/* Personal details */}
        <dl className="client-meta">
          <DetailItem label="טלפון" editing={editing}
            value={draft.phone_number}
            display={<span className="mono" dir="ltr">{client.phone_number}</span>}
            onChange={v => setDraft({ ...draft, phone_number: v })} />
          <DetailItem label="תאריך לידה" editing={editing} type="date"
            value={draft.date_of_birth}
            display={`${fmtDateLong(client.date_of_birth)} · בן/בת ${ageFromDob(client.date_of_birth)}`}
            onChange={v => setDraft({ ...draft, date_of_birth: v })} />
          <DetailItem label="הצטרפות לתיק" editing={editing} type="date"
            value={draft.date_joining}
            display={`${fmtDateLong(client.date_joining)} · ${yearsSince(client.date_joining)} שנים`}
            onChange={v => setDraft({ ...draft, date_joining: v })} />
          <DetailItem label="סטטוס" editing={editing} type="status"
            value={draft.status}
            display={<StatusPill status={client.status} />}
            onChange={v => setDraft({ ...draft, status: v })} />
        </dl>

        {editing && (
          <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-soft)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn sm" onClick={() => { setEditing(false); setDraft(client); }}>ביטול</button>
            <button className="btn sm primary" onClick={saveProfile}>שמירת שינויים</button>
          </div>
        )}

        {/* Products section */}
        <div style={{ padding: '20px 24px 24px' }}>
          <div className="sec-h">
            <h2>מוצרים פיננסיים</h2>
            <span className="meta">{client.products.length} מוצרים · {fmtCurrency(premium)} בחודש</span>
            <div style={{ marginInlineStart: 'auto' }}>
              <button className="btn sm" onClick={() => setShowAddProduct(true)}>
                <Icon name="plus" size={13} /> הוספת מוצר
              </button>
            </div>
          </div>

          <div className="col gap-3">
            {client.products.map(p => (
              <div key={p.id} className="prod">
                <div>
                  <div className="cat">{p.category}</div>
                  <div className="co">{p.company}</div>
                  <div className="start">תחילת פוליסה · {fmtDate(p.date_start)}</div>
                </div>
                <div className="premium">
                  <div className="amt num">{fmtCurrency(p.premium_monthly)}</div>
                  <div className="per">פרמיה / חודש</div>
                </div>
              </div>
            ))}
            {client.products.length === 0 && <Empty>אין מוצרים בתיק. <button className="btn sm" style={{ marginInlineStart: 8 }} onClick={() => setShowAddProduct(true)}><Icon name="plus" size={12} /> הוספה</button></Empty>}
          </div>

          {/* Notes section */}
          <div className="sec-h" style={{ marginTop: 24 }}>
            <h2>הערות</h2>
            <span className="meta">נשמר {savedAt}</span>
          </div>
          <div className="notes-box">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
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
        onSubmit={(p) => { onAddProduct(client.id, p); setShowAddProduct(false); }}
      />
    </div>
  );
};

const DetailItem = ({ label, value, display, editing, type = 'text', onChange }) => (
  <div style={{ minWidth: 200 }}>
    <dt>{label}</dt>
    <dd>
      {!editing ? (
        display
      ) : type === 'status' ? (
        <select className="input" value={value} onChange={e => onChange(e.target.value)} style={{ width: 'auto' }}>
          <option value="active">פעיל</option>
          <option value="inactive">לא פעיל</option>
          <option value="needs">דורש טיפול</option>
        </select>
      ) : (
        <input className="input" type={type} value={value} onChange={e => onChange(e.target.value)} style={{ width: 220 }} dir={type === 'date' ? 'ltr' : 'auto'} />
      )}
    </dd>
  </div>
);


// ───────────────────────────────────────────────────────────────────
// DRAWERS: Add client, Add product
// ───────────────────────────────────────────────────────────────────
const AddClientDrawer = ({ open, onClose, onSubmit }) => {
  const empty = { name_full: '', phone_number: '', date_of_birth: '', date_joining: new Date().toISOString().slice(0,10), status: 'active', general_notes: '' };
  const [c, setC] = React.useState(empty);
  React.useEffect(() => { if (open) setC(empty); }, [open]);

  const valid = c.name_full.trim() && c.phone_number.trim() && c.date_of_birth;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="לקוח חדש"
      sub="הוספה לתיק. ניתן יהיה להוסיף מוצרים מיד אחרי השמירה."
      footer={
        <>
          <button className="btn primary" disabled={!valid} onClick={() => onSubmit(c)}>
            <Icon name="check" size={14} /> שמירה ופתיחת כרטיס
          </button>
          <button className="btn" onClick={onClose}>ביטול</button>
          <div style={{ marginInlineStart: 'auto', fontSize: 11.5, color: 'var(--text-3)', alignSelf: 'center' }}>
            <span className="kbd">Esc</span> לסגירה
          </div>
        </>
      }
    >
      <Field label="שם מלא">
        <input className="input lg" placeholder="לדוגמה: רחל פרידמן"
          value={c.name_full} onChange={e => setC({ ...c, name_full: e.target.value })} autoFocus />
      </Field>
      <div className="field-row">
        <Field label="טלפון נייד">
          <input className="input lg" placeholder="050-000-0000" dir="ltr"
            value={c.phone_number} onChange={e => setC({ ...c, phone_number: e.target.value })} />
        </Field>
        <Field label="תאריך לידה">
          <input className="input lg" type="date" dir="ltr"
            value={c.date_of_birth} onChange={e => setC({ ...c, date_of_birth: e.target.value })} />
        </Field>
      </div>
      <div className="field-row">
        <Field label="תאריך הצטרפות">
          <input className="input lg" type="date" dir="ltr"
            value={c.date_joining} onChange={e => setC({ ...c, date_joining: e.target.value })} />
        </Field>
        <Field label="סטטוס התחלתי">
          <select className="input lg" value={c.status} onChange={e => setC({ ...c, status: e.target.value })}>
            <option value="active">פעיל</option>
            <option value="needs">דורש טיפול</option>
            <option value="inactive">לא פעיל</option>
          </select>
        </Field>
      </div>
      <Field label="הערות (חופשי)" hint="אפשר להוסיף רקע, נקודות שיחה, או להשאיר ריק.">
        <textarea className="input" style={{ height: 88, padding: '8px 12px' }}
          value={c.general_notes} onChange={e => setC({ ...c, general_notes: e.target.value })} />
      </Field>

      <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--bg-soft)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text-2)', display:'flex', gap: 10 }}>
        <Icon name="bell" size={14} stroke={1.4} style={{ color: 'var(--accent)', marginTop: 2, flex:'0 0 14px' }} />
        <div>תזכורת ליום הולדת ושיחת שימור שנתית ייווצרו אוטומטית על בסיס התאריכים שמילאת.</div>
      </div>
    </Drawer>
  );
};

const AddProductDrawer = ({ open, onClose, onSubmit, clientName }) => {
  const empty = { category: 'בריאות', company: COMPANIES[0], date_start: new Date().toISOString().slice(0,10), premium_monthly: '' };
  const [p, setP] = React.useState(empty);
  React.useEffect(() => { if (open) setP(empty); }, [open]);

  const premiumNum = parseFloat(p.premium_monthly) || 0;
  const valid = p.category && p.company && p.date_start && premiumNum > 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="מוצר חדש"
      sub={clientName ? `נוסף לתיק של ${clientName}` : ''}
      footer={
        <>
          <button className="btn primary" disabled={!valid} onClick={() => onSubmit({ ...p, premium_monthly: premiumNum })}>
            <Icon name="check" size={14} /> הוספת מוצר
          </button>
          <button className="btn" onClick={onClose}>ביטול</button>
        </>
      }
    >
      <Field label="סוג מוצר">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8 }}>
          {CATEGORIES.map(cat => (
            <button key={cat}
              type="button"
              onClick={() => setP({ ...p, category: cat })}
              className={`btn ${p.category === cat ? 'primary' : ''}`}
              style={{ height: 38, justifyContent: 'flex-start', padding: '0 14px' }}>
              <Icon name={
                cat === 'בריאות' ? 'shield' :
                cat === 'פנסיה' ? 'pie' :
                cat === 'השקעות' ? 'coins' : 'home'
              } size={14} />
              {cat}
            </button>
          ))}
        </div>
      </Field>

      <Field label="הגוף המוסדי">
        <select className="input lg" value={p.company} onChange={e => setP({ ...p, company: e.target.value })}>
          {COMPANIES.map(co => <option key={co} value={co}>{co}</option>)}
        </select>
      </Field>

      <div className="field-row">
        <Field label="תאריך תחילת פוליסה">
          <input className="input lg" type="date" dir="ltr"
            value={p.date_start} onChange={e => setP({ ...p, date_start: e.target.value })} />
        </Field>
        <Field label="פרמיה / הפקדה חודשית">
          <div style={{ position: 'relative' }}>
            <input className="input lg" type="number" inputMode="numeric" min={0} placeholder="0" dir="ltr"
              style={{ paddingLeft: 32 }}
              value={p.premium_monthly}
              onChange={e => setP({ ...p, premium_monthly: e.target.value })} />
            <span style={{ position:'absolute', left: 12, top: 0, bottom: 0, display:'grid', placeItems:'center', color: 'var(--text-3)', fontSize: 13 }}>₪</span>
          </div>
        </Field>
      </div>

      <div style={{ marginTop: 8, padding: '14px 16px', background: 'var(--accent-soft)', borderRadius: 'var(--radius)', display:'flex', alignItems:'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, color: 'var(--accent-ink)', fontWeight: 600, letterSpacing:'.04em', textTransform: 'uppercase' }}>תוספת שנתית לתיק</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, color: 'var(--accent-ink)', marginTop: 2 }}>
            {fmtCurrency(premiumNum * 12)}
          </div>
        </div>
        <Icon name="spark" size={24} style={{ color: 'var(--accent)' }} />
      </div>
    </Drawer>
  );
};

Object.assign(window, {
  Login, Dashboard, ClientsList, ClientDetail, AddClientDrawer, AddProductDrawer,
});
