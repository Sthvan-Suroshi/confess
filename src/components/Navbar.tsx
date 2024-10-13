"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const user: User = session?.user as User;

  const handleSignOut = () => {
    router.replace("/");
    signOut();
  };

  return (
    <motion.nav
      className="p-5 bg-blue-100 shadow-md"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex w-full justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <MessageCircle className="mx-auto h-8 w-8 text-blue-600" />
          </motion.div>
        </Link>
        {session ? (
          <div className="flex items-center space-x-4">
            <motion.span
              className="font-semibold text-blue-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Welcome, {user?.username || user?.email}
            </motion.span>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={handleSignOut}
                className="bg-blue-600 text-white"
              >
                Sign Out
              </Button>
            </motion.div>
          </div>
        ) : (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button className="bg-blue-600 text-white">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
