"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MessageSquare, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

export default function FullPageFancyMessageInput() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [bubbles, setBubbles] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const username = pathname.split("/")[2];

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTyping) {
        setBubbles((prev) => [
          ...prev.slice(-20),
          { id: Date.now(), x: Math.random() * 100, y: 110 },
        ]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isTyping]);

  useEffect(() => {
    if (message) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);

    const data = {
      content: message,
      username,
    };
    const res = await axios.post("/api/send-message", data);

    if (!res.data.success) {
      toast({
        title: "Error",
        description: res.data.message,
        variant: "destructive",
      });
      return;
    }

    setIsSending(false);
    setIsSuccess(true);
    setMessage("");

    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center p-4 overflow-hidden relative">
      <AnimatePresence>
        {isTyping &&
          bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="absolute text-blue-500 dark:text-blue-400 opacity-50"
              initial={{ y: "110%", x: `${bubble.x}%` }}
              animate={{ y: "-20%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 10, ease: "linear" }}
              style={{ fontSize: `${Math.random() * 20 + 10}px` }}
            >
              <MessageSquare />
            </motion.div>
          ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <motion.h2
          className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Send us a message
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 border-2 border-blue-300 dark:border-blue-700 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 text-gray-800 dark:text-white min-h-[200px]"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              type="submit"
              disabled={isSending || !message.trim() || isSuccess}
              className={`w-full py-4 px-6 rounded-xl text-xl font-semibold transition-all duration-300 ease-in-out ${
                isSuccess
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white shadow-lg hover:shadow-xl`}
            >
              <AnimatePresence mode="wait">
                {isSending ? (
                  <motion.div
                    key="sending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center"
                  >
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Sending...
                  </motion.div>
                ) : isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="flex items-center justify-center"
                  >
                    <Sparkles className="w-6 h-6 mr-2" />
                    Sent!
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center"
                  >
                    {isTyping ? (
                      <motion.div className="flex space-x-1 mr-2">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              y: [0, -4, 0],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                            className="w-1 h-1 bg-white rounded-full"
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <Send className="w-6 h-6 mr-2" />
                    )}
                    Send Message
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </form>
        <motion.div
          className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Sparkles className="inline-block w-4 h-4 mr-1 text-yellow-500" />
          We appreciate your feedback!
        </motion.div>

        {/* New section for encouraging sign-ups */}
        <motion.div
          className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl shadow-inner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
            Want to hear from your friends?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Sign up now to receive anonymous confessions and messages from your
            friends!
          </p>
          <Button
            onClick={() => {
              router.push("/sign-up");
            }}
            variant="outline"
            className="w-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 hover:bg-blue-300 dark:hover:bg-blue-800 transition-colors duration-300"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Sign Up Now
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
