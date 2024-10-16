"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Lock, Users, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <motion.div
        className="max-w-4xl w-full flex flex-col items-center relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center mb-6">
          <MessageCircle className="mx-auto h-12 w-12 text-white" />
          <h1 className="mt-2 text-3xl font-extrabold text-white tracking-tight sm:text-4xl md:text-5xl">
            Confess
          </h1>
          <p className="mt-2 text-base text-blue-100 sm:text-lg max-w-xl mx-auto">
            Share your secrets anonymously. Connect with others through honesty.
          </p>
        </div>
        <div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { icon: Lock, title: "Anonymous", text: "Share without fear" },
              { icon: Users, title: "Community", text: "Connect with others" },
              { icon: Zap, title: "Instant", text: "Real-time confessions" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white bg-opacity-10 p-3 rounded-lg flex flex-col items-center gap-1"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <item.icon className="h-6 w-6 text-blue-300 mb-1 mx-auto" />
                <h3 className="text-md font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-blue-100 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="flex space-x-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button className="flex items-center justify-center py-2 px-4 rounded-md shadow bg-white text-blue-600 font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Link href="/sign-up">Get Started</Link>
              <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button className="flex items-center justify-center py-2 px-4 rounded-md shadow bg-white text-blue-600 font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Link href="/sign-in">Sign In</Link>
              <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
