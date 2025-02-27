"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import ChatModal from "@/components/Chat/ChatModal";

interface Car {
  ad_id: number;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  transmission: string;
  images: string[];
  user_id: number | null; 
}

export default function CarPage() {
  const { ad_id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);

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
  }, [ad_id]); 

  if (!car) return <div>Loading...</div>;

  const sellerId = car.user_id ? car.user_id.toString() : '';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{car.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
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
              <Button variant="outline" onClick={() => setIsChatOpen(true)}>Contact Seller</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {car && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          carId={car.ad_id.toString()}
          sellerId={sellerId}
          currentUserId={localStorage.getItem("user_id") || ''}
          carTitle={car.title}
        />
      )}
    </div>
  );
}
