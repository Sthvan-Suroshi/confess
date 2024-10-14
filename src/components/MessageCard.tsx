"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User.model";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: res?.data?.message,
      });
      onMessageDelete(message._id as string);
    } catch (error) {
      toast({
        title: "Error deleting message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 border-none shadow-md h-[200px] flex flex-col">
        <CardHeader className="relative pb-2 flex-shrink-0 z-10">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0"
            animate={{ opacity: isHovered ? 0.2 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white truncate mr-2">
              Anonymous Message
            </h3>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden relative">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-700 dark:text-gray-200 line-clamp-3 p-2">
              {message.content}
            </p>
          </motion.div>
          <motion.div
            className="absolute inset-0 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-700 dark:text-gray-200 p-2">
              {message.content}
            </p>
          </motion.div>
        </CardContent>
        <CardFooter className="pt-2 flex-shrink-0 justify-end border-t-2 border-gray-300">
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="text-xs text-gray-500 dark:text-gray-400 flex items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Clock className="w-3 h-3 mr-1" />
                {new Date(message.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
      <motion.div
        className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
}
