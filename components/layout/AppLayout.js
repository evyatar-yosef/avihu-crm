"use client";
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AddClientDrawer from "@/components/features/AddClientDrawer";
import Icon from "@/components/ui/Icon";
import { useClients } from "@/components/ClientProvider";
import { useUI } from "@/components/UIProvider";
import { isBirthdayToday, isJoiningAnniversary } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";

export default function AppLayout({ children, crumbs = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { clients, addClient } = useClients();
  const { showAddClient, setShowAddClient, mobileMenuOpen, setMobileMenuOpen } = useUI();
  const [themeDark, setThemeDark] = useState(false);

  // useCallback keeps onSearchClick stable — no refs during render
  const onSearchClick = useCallback(() => {
    setMobileMenuOpen(false);
    if (pathname !== "/clients") {
      router.push("/clients?focus=search");
    } else {
      const input = document.querySelector(".filters .input");
      if (input) input.focus();
    }
  }, [pathname, router, setMobileMenuOpen]);

  useEffect(() => {
    const isDark = document.documentElement.dataset.theme === "dark";
    if (isDark) {
      queueMicrotask(() => setThemeDark(true));
    }

    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setShowAddClient(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onSearchClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearchClick, setShowAddClient]);

  const toggleTheme = () => {
    const n = !themeDark;
    setThemeDark(n);
    document.documentElement.dataset.theme = n ? "dark" : "light";
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const alertsCount = clients.filter(
    (c) => isBirthdayToday(c.date_of_birth) || isJoiningAnniversary(c.date_joining)
  ).length;

  const handleAddClient = (newClient) => {
    addClient(newClient);
    setShowAddClient(false);
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
      <button className="btn ghost icon" title="התנתקות" onClick={handleSignOut}>
        <Icon name="arrowLeft" size={15} />
      </button>
    </>
  );

  return (
    <>
      <div className="app">
        <Sidebar
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          alertsCount={alertsCount}
          onAddClient={() => {
            setMobileMenuOpen(false);
            setShowAddClient(true);
          }}
          onSearchClick={onSearchClick}
        />
        <main className="main">
          <Topbar
            crumbs={crumbs}
            actions={topActions}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
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
