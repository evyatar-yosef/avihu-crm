// app.jsx — root + routing state + Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "density": "regular",
  "accent": "#b8854a",
  "startScreen": "dashboard"
}/*EDITMODE-END*/;

const AGENT = { name: 'אביהו לוי', role: 'סוכן ביטוח ופיננסים' };

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [authed, setAuthed] = React.useState(true);
  const [route, setRoute] = React.useState(t.startScreen || 'dashboard'); // dashboard | clients | client
  const [activeClientId, setActiveClientId] = React.useState(null);

  const [clients, setClients] = React.useState(SAMPLE_CLIENTS);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showAddClient, setShowAddClient] = React.useState(false);

  // Apply theme/density to <html>
  React.useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? 'dark' : 'light';
    document.documentElement.dataset.density = t.density;
    document.documentElement.style.setProperty('--accent', t.accent);
    // derive soft + ink
    document.documentElement.style.setProperty('--accent-soft', `color-mix(in oklch, ${t.accent} ${t.dark ? '22%' : '14%'}, ${t.dark ? '#1a1814' : '#fff'})`);
    document.documentElement.style.setProperty('--accent-ink', `color-mix(in oklch, ${t.accent} 70%, ${t.dark ? '#fff' : '#000'})`);
  }, [t.dark, t.density, t.accent]);

  const activeClient = clients.find(c => c.id === activeClientId);
  const alertsCount = clients.filter(c => isBirthdayToday(c.date_of_birth) || isJoiningAnniversary(c.date_joining)).length;

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!authed) return;
    const onKey = (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key === 'n' || e.key === 'נ') { e.preventDefault(); setShowAddClient(true); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setRoute('clients');
        setTimeout(() => document.querySelector('.filters .input')?.focus(), 50);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [authed]);

  const openClient = (id) => { setActiveClientId(id); setRoute('client'); };
  const goBack = () => setRoute('clients');

  const handleNavigate = (id) => {
    if (id === 'add-client') return setShowAddClient(true);
    if (id === 'search') {
      setRoute('clients');
      setTimeout(() => document.querySelector('.filters .input')?.focus(), 50);
      return;
    }
    setRoute(id);
  };

  const handleAddClient = (newClient) => {
    const id = `c-${1300 + clients.length}`;
    const full = { ...newClient, id, products: [] };
    setClients(prev => [full, ...prev]);
    setShowAddClient(false);
    openClient(id);
  };

  const handleSaveClient = (updated) => {
    setClients(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c));
  };

  const handleAddProduct = (clientId, p) => {
    const id = `p-${7100 + Math.floor(Math.random() * 900)}`;
    setClients(prev => prev.map(c =>
      c.id === clientId ? { ...c, products: [...c.products, { ...p, id }] } : c
    ));
  };

  if (!authed) {
    return (
      <>
        <Login onSignIn={() => setAuthed(true)} />
        {renderTweaks(t, setTweak)}
      </>
    );
  }

  const crumbs = (() => {
    if (route === 'dashboard') return [{ label: 'דשבורד' }];
    if (route === 'clients')   return [{ label: 'דשבורד', onClick: () => setRoute('dashboard') }, { label: 'לקוחות' }];
    if (route === 'client')    return [
      { label: 'דשבורד', onClick: () => setRoute('dashboard') },
      { label: 'לקוחות',  onClick: () => setRoute('clients') },
      { label: activeClient?.name_full || '' },
    ];
    return [{ label: 'דשבורד' }];
  })();

  const topActions = (
    <>
      <button className="btn ghost icon" onClick={() => setTweak('dark', !t.dark)} title={t.dark ? 'בהיר' : 'כהה'}>
        <Icon name={t.dark ? 'sun' : 'moon'} size={15} />
      </button>
      <button className="btn ghost icon" title="הגדרות">
        <Icon name="settings" size={15} />
      </button>
      <button className="btn ghost icon" title="התנתקות" onClick={() => setAuthed(false)}>
        <Icon name="arrowLeft" size={15} />
      </button>
    </>
  );

  return (
    <>
      <div className="app">
        <Sidebar route={route} onNavigate={handleNavigate} alertsCount={alertsCount} agent={AGENT} />
        <main className="main">
          <Topbar crumbs={crumbs} actions={topActions} />

          {route === 'dashboard' && (
            <Dashboard
              clients={clients}
              onOpenClient={openClient}
              onAddClient={() => setShowAddClient(true)}
            />
          )}

          {route === 'clients' && (
            <ClientsList
              clients={clients}
              onOpenClient={openClient}
              onAddClient={() => setShowAddClient(true)}
              search={search} setSearch={setSearch}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            />
          )}

          {route === 'client' && activeClient && (
            <ClientDetail
              client={activeClient}
              onBack={goBack}
              onSaveClient={handleSaveClient}
              onAddProduct={handleAddProduct}
            />
          )}
        </main>
      </div>

      <AddClientDrawer
        open={showAddClient}
        onClose={() => setShowAddClient(false)}
        onSubmit={handleAddClient}
      />

      {renderTweaks(t, setTweak)}
    </>
  );
}

function renderTweaks(t, setTweak) {
  return (
    <TweaksPanel title="הגדרות עיצוב">
      <TweakSection label="מראה" />
      <TweakToggle label="מצב כהה" value={t.dark} onChange={v => setTweak('dark', v)} />
      <TweakRadio  label="צפיפות" value={t.density}
                   options={['compact', 'regular', 'comfy']}
                   onChange={v => setTweak('density', v)} />
      <TweakSection label="צבע מבטא" />
      <TweakColor  label="Accent"
                   value={t.accent}
                   options={['#b8854a', '#1e3a5f', '#3d5a40', '#8b2e2e', '#5a4a8b']}
                   onChange={v => setTweak('accent', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
