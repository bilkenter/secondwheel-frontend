"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Car {
  id: number;
  title: string;
  price: number;
}

interface User {
  credits: number;
}

export default function BuyCarPage() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch car data
        const carResponse = await fetch(`/api/cars/${id}`);
        const carData = await carResponse.json();
        setCar(carData);

        // Fetch user data (including credits)
        const userResponse = await fetch('/api/user');
        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load necessary data");
      }
    };

    fetchData();
  }, [id]);

  const handlePurchase = async () => {
    if (!car || !user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: car.id,
          price: car.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Purchase failed');
      }

      setSuccess(true);
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push('/purchase/success');
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  if (!car || !user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Purchase Confirmation</h1>

      <div className="grid gap-6 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Car</Label>
                <p className="text-lg font-medium">{car.title}</p>
              </div>
              
              <div>
                <Label>Price</Label>
                <p className="text-lg font-medium">${car.price.toLocaleString()}</p>
              </div>

              <div>
                <Label>Your Credits</Label>
                <p className="text-lg font-medium">${user.credits.toLocaleString()}</p>
              </div>

              <div>
                <Label>Remaining Credits After Purchase</Label>
                <p className="text-lg font-medium">
                  ${(user.credits - car.price).toLocaleString()}
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50">
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Your purchase was successful. Redirecting...
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handlePurchase}
                  disabled={loading || user.credits < car.price}
                  className="w-full"
                >
                  {loading ? "Processing..." : "Confirm Purchase"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>

              {user.credits < car.price && (
                <Alert variant="destructive">
                  <AlertTitle>Insufficient Credits</AlertTitle>
                  <AlertDescription>
                    You don't have enough credits to purchase this car.
                    Please add more credits to your account.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}