"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });

  if (status === "loading") {
    return <div>Ładowanie...</div>;
  }

  return <>{children}</>;
}
