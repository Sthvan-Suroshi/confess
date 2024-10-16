"use client";

import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const session = useSession();
  return (
    <div className="bg-blue-50 pb-5 h-screen">
      {session && <Navbar />}
      {children}
    </div>
  );
}
