"use client";
import React, { createContext, useContext, useState, useEffect, startTransition } from "react";
import { supabase } from "@/lib/supabase";

const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*, products(*)');
      
      if (error) throw error;
      
      if (data) {
        // Sort products by date inside each client just in case
        const withProducts = data.map(c => ({
          ...c,
          products: c.products || []
        }));
        startTransition(() => setClients(withProducts));
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const addClient = async (newClient) => {
    const id = `c-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 10)}`;
    const full = { ...newClient, id };
    
    // Optimistic update
    const next = [{ ...full, products: [] }, ...clients];
    setClients(next);

    const { error } = await supabase.from('clients').insert(full);
    if (error) {
      console.error("Error adding client:", error);
      fetchClients(); // revert on error
    }
    return id;
  };

  const updateClient = async (updated) => {
    // Optimistic update
    const next = clients.map((c) => (c.id === updated.id ? { ...c, ...updated } : c));
    setClients(next);

    // Filter out products before sending to 'clients' table
    const { products, ...clientData } = updated;
    const { error } = await supabase.from('clients').update(clientData).eq('id', updated.id);
    
    if (error) {
      console.error("Error updating client:", error);
      fetchClients(); // revert on error
    }
  };

  const addProduct = async (clientId, p) => {
    const id = `p-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 10)}`;
    const newProduct = { ...p, id, client_id: clientId };
    
    // Optimistic update
    const next = clients.map((c) =>
      c.id === clientId ? { ...c, products: [...c.products, newProduct] } : c
    );
    setClients(next);

    const { error } = await supabase.from('products').insert(newProduct);
    if (error) {
      console.error("Error adding product:", error);
      fetchClients(); // revert on error
    }
  };

  return (
    <ClientContext.Provider value={{ clients, loading, addClient, updateClient, addProduct, refresh: fetchClients }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  return useContext(ClientContext);
}

