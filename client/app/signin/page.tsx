"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null); // Alert for forgot password
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage(null);

    try {
        const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Signin successful:", data);
        router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Signin failed:", errorData);
        setAlertMessage(errorData.message);
      }
    } catch (error) {
      console.error("An error occurred during signin:", error);
      setAlertMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setForgotMessage("A temporary password has been sent to your email.");
      } else {
        setForgotMessage("Failed to send temporary password. Please try again.");
      }
    } catch (error) {
      console.error("Error sending forgot password email:", error);
      setForgotMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center space-x-2">
            <div>
              <p className="text-2xl font-bold">Welcome To</p>
              <p className="text-2xl font-bold">SecondWheels!</p>
            </div>
            <img src="/icons/SecondWheelsIcon.svg" alt="SecondWheels Logo" className="w-12 h-12 ml-3"/>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignin}>
            {alertMessage && <Alert variant="destructive">{alertMessage}</Alert>}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-2"
              required
            />
            {/* Forgot password link */}
            <p
              className="text-sm italic text-red-500 mb-6 text-right cursor-pointer"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </p>
            {forgotMessage && (
              <Alert variant="default" className="mb-4">
                {forgotMessage}
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          {/* Register link */}
          <p
            className="mt-4 text-sm italic text-red-500 text-center cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Do not have an account? Register here!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
