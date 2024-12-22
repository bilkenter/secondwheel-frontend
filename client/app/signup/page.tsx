"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/apiClient";
import { Alert } from "@/components/ui/alert";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("");
  const [notificationPreference, setNotificationPreference] = useState("");
  const [iban, setIban] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage(null);

    try {
      const requestData = {
        username,
        email,
        password,
        userType,
        notificationPreference,
      };

      const response = await fetch("http://127.0.0.1:8000/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Signup successful:", data);
        router.push("/"); // Redirect after successful signup
      } else {
        const errorData = await response.json();
        console.error("Signup failed:", errorData);
        setAlertMessage(errorData.message || "An error occurred during signup.");
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
      setAlertMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen" suppressHydrationWarning>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
          {alertMessage && <Alert variant="destructive">{alertMessage}</Alert>}
            {/* Name */}
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4"
              required
            />

            {/* Email */}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              required
            />

            {/* Password */}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
              required
            />

            {/* User Type Dropdown */}
            <div className="mb-4">
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full border rounded px-2 py-1 text-gray-500 focus:outline-none"
                required
              >
                <option value="" disabled hidden>
                  Select User Type
                </option>
                <option value="Buyer" className="text-gray-500">
                  Buyer
                </option>
                <option value="Seller" className="text-gray-500">
                  Seller
                </option>
                <option value="Admin" className="text-gray-500">
                  Admin
                </option>
                <option value="Moderator" className="text-gray-500">
                  Moderator
                </option>
              </select>
            </div>

            {/* Notification Preference Dropdown */}
            <div className="mb-6">
              <select
                id="notificationPreference"
                value={notificationPreference}
                onChange={(e) => setNotificationPreference(e.target.value)}
                className="w-full border rounded px-2 py-1 text-gray-500 focus:outline-none"
                required
              >
                <option value="" disabled hidden>
                  Select Notification Preference
                </option>
                <option value="email" className="text-gray-500">
                  Email
                </option>
                <option value="sms" className="text-gray-500">
                  SMS
                </option>
              </select>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
