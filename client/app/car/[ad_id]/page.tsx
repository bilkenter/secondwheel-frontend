"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface Car {
  ad_id: number;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  transmission: string;
  images: string[];  // Keep the images property but don't use it yet
  user_id: number;
}

export default function CarPage() {
  const { ad_id } = useParams();  // Capture ad_id from URL
  const [car, setCar] = useState<Car | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/car/${ad_id}/`);
        console.log(ad_id);
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, [ad_id]); // Run this useEffect only when ad_id changes

  if (!car) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{car.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder message instead of fetching images */}
            <p>No images available for this car at the moment.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2"><strong>Price:</strong> ${car.price}</p>
            <p className="mb-2"><strong>Year:</strong> {car.year}</p>
            <p className="mb-2"><strong>Mileage:</strong> {car.mileage} miles</p>
            <p className="mb-2"><strong>Transmission:</strong> {car.transmission}</p>
            <p className="mb-4"><strong>Description:</strong> {car.description}</p>
            <div className="flex gap-2">
              <Button onClick={() => router.push(`/car/${ad_id}/buy`)}>Buy Now</Button>
              <Button variant="outline">Contact Seller</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {car && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          ad_id={car.ad_id.toString()}
          sellerId={car.user_id}
          currentUserId={localStorage.getItem("user_id") || ''}
          carTitle={car.title}
        />
      )}
    </div>
  );
}
