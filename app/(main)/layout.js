"use client";
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { usePathname } from "next/navigation";
import { useClients } from "@/components/ClientProvider";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const { clients } = useClients();

  // Determine crumbs based on pathname
  let crumbs = [{ label: "דשבורד", href: "/" }];

  if (pathname.startsWith("/clients")) {
    crumbs.push({ label: "לקוחות", href: "/clients" });

    // If it's a specific client page
    const parts = pathname.split("/");
    if (parts.length === 3) {
      const clientId = parts[2];
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        crumbs.push({ label: client.name_full });
      }
    }
  }

  return <AppLayout crumbs={crumbs}>{children}</AppLayout>;
}
