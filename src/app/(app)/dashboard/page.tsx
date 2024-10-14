"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { Loader2, RefreshCcw, Copy, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { Message } from "@/model/User.model";
import { ApiResponse } from "@/types/ApiResponse";

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  if (!session || !session.user) {
    return <div>Something went wrong</div>;
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded-lg shadow-lg w-full max-w-6xl"
    >
      <h1 className="text-3xl font-bold  mb-6">User Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-blue-500 mb-2">
          Copy Your Unique Link
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 border border-blue-300 rounded focus:ring-blue-400 focus:border-blue-400 bg-white"
          />
          <Button
            onClick={copyToClipboard}
            className={`bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300 ${
              copied ? "bg-green-500 hover:bg-green-600" : ""
            }`}
          >
            {copied ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="data-[state=checked]:bg-blue-500"
          />
          <span className="ml-3 font-medium">
            Accept Messages:{" "}
            {acceptMessages ? (
              <span className="text-blue-500">On</span>
            ) : (
              <span className="text-red-500">Off</span>
            )}
          </span>
        </div>
      </div>

      <Separator className="my-4 bg-blue-200" />

      <div>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCcw className="h-5 w-5" />
          )}
          <span className="ml-2">Refresh Messages</span>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className=" col-span-2 text-center">
            Oops! No messages to display. Share your link to get confessions
            from your friends.
          </p>
        )}
      </div>
    </motion.div>
  );
}
