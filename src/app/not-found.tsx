"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingObjectsVariants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
};

const FloatingObject = ({ emoji, delay }: { emoji: string; delay: number }) => (
  <motion.div
    className="absolute text-4xl"
    initial="initial"
    animate="animate"
    exit="exit"
    variants={floatingObjectsVariants}
    transition={{
      y: { type: "spring", stiffness: 100, damping: 10, duration: 0.5, delay },
      opacity: { duration: 0.2, delay },
    }}
    style={{
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
    }}
  >
    {emoji}
  </motion.div>
);

export default function NotFound() {
  const [isReloading, setIsReloading] = useState(false);
  const [floatingObjects, setFloatingObjects] = useState<string[]>([]);

  useEffect(() => {
    const objects = ["💻", "🔌", "🔧", "⚡", "🔍", "🛠️", "📡", "🔋"];
    setFloatingObjects(objects);
  }, []);

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-200 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4 overflow-hidden relative">
      <AnimatePresence>
        {floatingObjects.map((emoji, index) => (
          <FloatingObject key={index} emoji={emoji} delay={index * 0.2} />
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <AlertTriangle className="w-20 h-20 mx-auto text-red-500 mb-6" />
          <span className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            404 Page Not Found
          </span>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Oops! Something Went Wrong!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Don't worry, Try Again!
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            onClick={handleReload}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 flex items-center"
            disabled={isReloading}
          >
            <RefreshCcw
              className={`mr-2 h-5 w-5 ${isReloading ? "animate-spin" : ""}`}
            />
            {isReloading ? "Reloading..." : "Try Again"}
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 flex items-center"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Button>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-gray-600 dark:text-gray-400">
            If the problem persists, please contact Sthvan-Suroshi.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
