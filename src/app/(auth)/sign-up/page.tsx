"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsChecking(true);
        setUsernameMessage("");
        try {
          const res = await axios.get(
            "/api/check-unique-username?username=" + username
          );

          setUsernameMessage(res.data.message);
          setIsChecking(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            setUsernameMessage(error.response?.data.message);
            setIsChecking(false);
          }
        }
      }

      if (!username) {
        setUsernameMessage("");
      }
    };

    checkUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: res.data.message,
      });
      router.replace(`verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg = axiosError.response?.data.message;
      toast({
        title: "Error! Signup failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">
          Sign Up
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-500">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedUsername(e.target.value);
                      }}
                      className="border-blue-300 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </FormControl>
                  {isChecking && (
                    <Loader2 className="animate-spin h-4 w-4 text-blue-500" />
                  )}
                  <p
                    className={`text-sm break-words ${
                      usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-500">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      {...field}
                      className="border-blue-300 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-500">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      {...field}
                      type="password"
                      className="border-blue-300 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already a member?{" "}
            <Link
              href={"/sign-in"}
              className="text-blue-500 hover:text-blue-600"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
