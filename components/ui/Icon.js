export default function Icon({ name, size = 16, stroke = 1.6, style }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    users:    <><circle cx="9" cy="8" r="3.5"/><path d="M3 20c.7-3.3 3-5 6-5s5.3 1.7 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14c2 .3 4 1.6 4.5 4"/></>,
    plus:     <><path d="M12 5v14M5 12h14"/></>,
    search:   <><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></>,
    cake:     <><path d="M4 19h16M5 15h14v5H5zM6 11v4M12 11v4M18 11v4"/><path d="M12 4v3M11 6c0-1 1-1.5 1-2.5"/><circle cx="6" cy="9.5" r="1.2"/><circle cx="12" cy="9.5" r="1.2"/><circle cx="18" cy="9.5" r="1.2"/></>,
    phone:    <><path d="M5 4h3l2 5-2 1c1 2.5 3 4.5 5.5 5.5l1-2 5 2v3c0 1-1 2-2 2C9 20.5 3.5 15 3.5 6c0-1 1-2 2-2z"/></>,
    chevron:  <><path d="m9 6 6 6-6 6"/></>,
    chevronLeft: <><path d="m15 6-6 6 6 6"/></>,
    chevronDown: <><path d="m6 9 6 6 6-6"/></>,
    arrowLeft: <><path d="m12 5-7 7 7 7M5 12h14"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    bell:     <><path d="M6 8a6 6 0 0 1 12 0v5l2 3H4l2-3z"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1 2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    download: <><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></>,
    upload:   <><path d="M12 20V8M6 12l6-6 6 6M4 4h16"/></>,
    edit:     <><path d="M4 20h4l11-11-4-4L4 16zM14 6l4 4"/></>,
    trash:    <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>,
    x:        <><path d="M6 6l12 12M18 6 6 18"/></>,
    check:    <><path d="m5 12 5 5L20 7"/></>,
    spark:    <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></>,
    shield:   <><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/></>,
    home:     <><path d="m3 11 9-8 9 8M5 10v10h14V10"/></>,
    pie:      <><path d="M12 3v9h9a9 9 0 1 1-9-9z"/><path d="M14 3a7 7 0 0 1 7 7"/></>,
    coins:    <><ellipse cx="8" cy="6" rx="6" ry="3"/><path d="M2 6v6c0 1.7 2.7 3 6 3"/><path d="M2 12v6c0 1.7 2.7 3 6 3"/><ellipse cx="16" cy="14" rx="6" ry="3"/><path d="M10 14v6c0 1.7 2.7 3 6 3s6-1.3 6-3v-6"/></>,
    dots:     <><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></>,
    sun:      <><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1"/></>,
    moon:     <><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></>,
    keyboard: <><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M18 14h.01M8 14h8"/></>,
    eye:      <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff:   <><path d="m3 3 18 18M10.6 6.1A10 10 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.1 3.9M6.1 6.1C3.1 8 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1"/><path d="M9.9 10a3 3 0 0 0 4.2 4.2"/></>,
    handshake: <><path d="M11 17 4 10l3-3 4 4 6-6 3 3-7 7"/><path d="m13 19 2 2 7-7-2-2"/></>,
    menu:     <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  };
  const p = paths[name];
  if (!p) return null;
  return (
    <svg className="ic" viewBox="0 0 24 24" width={size} height={size}
         fill="none" stroke="currentColor" strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round" style={style}>
      {p}
    </svg>
  );
}
