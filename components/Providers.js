"use client";
import { ClientProvider } from "@/components/ClientProvider";
import { UIProvider } from "@/components/UIProvider";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Providers({ children }) {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <ClientProvider>
      <UIProvider>{children}</UIProvider>
    </ClientProvider>
  );
}
