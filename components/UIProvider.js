"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [showAddClient, setShowAddClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <UIContext.Provider value={{ showAddClient, setShowAddClient, mobileMenuOpen, setMobileMenuOpen }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
