"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Nav from "@/components/ui/nav";

interface Car {
  id: number;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  transmission: string;
  image: string;
  vehicleType: string;
  brand: string;
  modelName: string;
  fuelType: string;
  fuelCapacity: string;
  motorPower: string;
  bodyType: string;
  color: string;
  location: string;
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [car1, setCar1] = useState<Car | null>(null);
  const [car2, setCar2] = useState<Car | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const car1Id = searchParams.get('car1');
        const car2Id = searchParams.get('car2');

        if (!car1Id || !car2Id) {
          router.push('/');
          return;
        }

        const [car1Data, car2Data] = await Promise.all([
          fetch(`/api/cars/${car1Id}`).then(res => res.json()),
          fetch(`/api/cars/${car2Id}`).then(res => res.json())
        ]);

        setCar1(car1Data);
        setCar2(car2Data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, [searchParams]);

  if (!car1 || !car2) return <div>Loading...</div>;

  const comparisonFields = [
    { label: 'Vehicle Type', key: 'vehicleType' },
    { label: 'Brand', key: 'brand' },
    { label: 'Model Name', key: 'modelName' },
    { label: 'Year', key: 'year' },
    { label: 'Mileage', key: 'mileage' },
    { label: 'Fuel Type', key: 'fuelType' },
    { label: 'Fuel Capacity', key: 'fuelCapacity' },
    { label: 'Motor Power', key: 'motorPower' },
    { label: 'Transmission', key: 'transmission' },
    { label: 'Body Type', key: 'bodyType' },
    { label: 'Color', key: 'color' },
    { label: 'Location', key: 'location' },
    { label: 'Price', key: 'price' },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      <Nav />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Vehicle Comparison</h1>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Car 1 */}
          <div>
            <img src={car1.image} alt={car1.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <Card>
              <CardContent className="p-4">
                {comparisonFields.map(field => (
                  <div key={field.key} className="mb-2">
                    <p className="font-semibold">{field.label}</p>
                    <p>{car1[field.key as keyof Car]}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* VS Column */}
          <div className="flex items-center justify-center">
            <div className="text-4xl font-bold">VS</div>
          </div>

          {/* Car 2 */}
          <div>
            <img src={car2.image} alt={car2.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <Card>
              <CardContent className="p-4">
                {comparisonFields.map(field => (
                  <div key={field.key} className="mb-2">
                    <p className="font-semibold">{field.label}</p>
                    <p>{car2[field.key as keyof Car]}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={() => router.push('/')}>Back to Listings</Button>
        </div>
      </div>
    </main>
  );
} 