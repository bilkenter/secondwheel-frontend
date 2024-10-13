"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Car {
  id: number;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  transmission: string;
  images: string[];
}

export default function CarPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
      const response = await fetch(`/api/cars/${id}`);
      const data = await response.json();
      setCar(data);
      } catch (error) {
      console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, [id]);

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
            <div className="grid grid-cols-2 gap-2">
              {car.images.map((image, index) => (
                <img key={index} src={image} alt={`Car image ${index + 1}`} className="w-full h-auto" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2"><strong>Price:</strong> ${car.price.toLocaleString()}</p>
            <p className="mb-2"><strong>Year:</strong> {car.year}</p>
            <p className="mb-2"><strong>Mileage:</strong> {car.mileage.toLocaleString()} miles</p>
            <p className="mb-2"><strong>Transmission:</strong> {car.transmission}</p>
            <p className="mb-4"><strong>Description:</strong> {car.description}</p>
            <Button>Contact Seller</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
