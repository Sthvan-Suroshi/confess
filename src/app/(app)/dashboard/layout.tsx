"use client";

import React from "react";
import "../../globals.css";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();

  return (
    <>
      {session && <Navbar />}
      <div>{children}</div>
    </>
  );
}
