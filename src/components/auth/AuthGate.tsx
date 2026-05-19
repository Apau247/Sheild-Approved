"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGate({
  children,
  fallbackPath = "/login",
}: {
  children: ReactNode;
  fallbackPath?: string;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.replace(fallbackPath);
  }, [isLoading, user, router, fallbackPath]);

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-white/70">
        Loading secure session…
      </div>
    );
  }

  return <>{children}</>;
}
