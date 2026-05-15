"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { SAMPLE_CLIENTS } from "@/lib/data";

const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [clients, setClients] = useState([]);
  
  useEffect(() => {
    // On mount, load from localStorage or use initial data
    const saved = localStorage.getItem("avihu_clients");
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      setClients(SAMPLE_CLIENTS);
    }
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem("avihu_clients", JSON.stringify(clients));
    }
  }, [clients]);

  const addClient = (newClient) => {
    const id = `c-${1300 + clients.length}`;
    const full = { ...newClient, id, products: [] };
    setClients((prev) => [full, ...prev]);
    return id;
  };

  const updateClient = (updated) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
    );
  };

  const addProduct = (clientId, p) => {
    const id = `p-${7100 + Math.floor(Math.random() * 900)}`;
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId ? { ...c, products: [...c.products, { ...p, id }] } : c
      )
    );
  };

  return (
    <ClientContext.Provider value={{ clients, addClient, updateClient, addProduct }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  return useContext(ClientContext);
}
