"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AddClientDrawer from "@/components/features/AddClientDrawer";
import Icon from "@/components/ui/Icon";
import { useClients } from "@/components/ClientProvider";
import { isBirthdayToday, isJoiningAnniversary } from "@/lib/utils";

export default function AppLayout({ children, crumbs = [] }) {
  const { clients, addClient } = useClients();
  const [showAddClient, setShowAddClient] = useState(false);
  const [themeDark, setThemeDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.dataset.theme === "dark";
    setThemeDark(isDark);
  }, []);

  const toggleTheme = () => {
    const n = !themeDark;
    setThemeDark(n);
    document.documentElement.dataset.theme = n ? "dark" : "light";
  };

  const alertsCount = clients.filter(
    (c) => isBirthdayToday(c.date_of_birth) || isJoiningAnniversary(c.date_joining)
  ).length;

  const handleAddClient = (newClient) => {
    addClient(newClient);
    setShowAddClient(false);
  };

  const onSearchClick = () => {
    const input = document.querySelector(".filters .input");
    if (input) input.focus();
  };

  const topActions = (
    <>
      <button
        className="btn ghost icon"
        onClick={toggleTheme}
        title={themeDark ? "בהיר" : "כהה"}
      >
        <Icon name={themeDark ? "sun" : "moon"} size={15} />
      </button>
      <button className="btn ghost icon" title="הגדרות">
        <Icon name="settings" size={15} />
      </button>
      <button className="btn ghost icon" title="התנתקות">
        <Icon name="arrowLeft" size={15} />
      </button>
    </>
  );

  return (
    <>
      <div className="app">
        <Sidebar
          alertsCount={alertsCount}
          onAddClient={() => setShowAddClient(true)}
          onSearchClick={onSearchClick}
        />
        <main className="main">
          <Topbar crumbs={crumbs} actions={topActions} />
          {children}
        </main>
      </div>
      <AddClientDrawer
        open={showAddClient}
        onClose={() => setShowAddClient(false)}
        onSubmit={handleAddClient}
      />
    </>
  );
}
