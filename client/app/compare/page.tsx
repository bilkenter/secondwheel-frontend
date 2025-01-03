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
  transmission_type: string;
  vehicle_type: string;
  brand: string;
  model_name: string;
  fuel_type: string;
  fuelCapacity: string;
  motor_power: string;
  body_type: string;
  color: string;
  location: string;
  image_urls: string[]
}
export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ad_id1, setad_id1] = useState<Car | null>(null);
  const [ad_id2, setad_id2] = useState<Car | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const ad_id1Id = searchParams.get('ad1');
        const ad_id2Id = searchParams.get('ad2');

        if (!ad_id1Id || !ad_id2Id) {
          router.push('/');  // Redirect if no cars are selected
          return;
        }

        const [ad_id1Data, ad_id2Data] = await Promise.all([
          fetch(`http://127.0.0.1:8000/vehicle/${ad_id1Id}`).then(res => res.json()),
          fetch(`http://127.0.0.1:8000/vehicle/${ad_id2Id}`).then(res => res.json())
        ]);
        if (ad_id1Data && ad_id1Data.ad_id) {
          setad_id1({
            ...ad_id1Data,
            image_urls: ad_id1Data.image_urls || [], // Handle image URLs if they exist
          });
        } else {
          console.error("No vehicle data found for ad1.");
        }

        if (ad_id2Data && ad_id2Data.ad_id) {
          setad_id2({
            ...ad_id2Data,
            image_urls: ad_id2Data.image_urls || [], // Handle image URLs if they exist
          });
        } else {
          console.error("No vehicle data found for ad2.");
        }

        console.log('Car 1:', ad_id1Data); // Log ad_id1 data
        console.log('Car 2:', ad_id2Data); // Log ad_id2 data

        //setad_id1(ad_id1Data);
        //setad_id2(ad_id2Data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, [searchParams]);

  if (!ad_id1 || !ad_id2) return <div>Loading...</div>;

  const comparisonFields = [
    { label: 'Vehicle Type', key: 'vehicle_type' },
    { label: 'Brand', key: 'brand' },
    { label: 'Model Name', key: 'model_ame' },
    { label: 'Year', key: 'year' },
    { label: 'Mileage', key: 'mileage' },
    { label: 'Fuel Type', key: 'fuel_type' },
    { label: 'Fuel Capacity', key: 'fuel_capacity' },
    { label: 'Motor Power', key: 'motor_power' },
    { label: 'Transmission', key: 'transmission_type' },
    { label: 'Body Type', key: 'body_type' },
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
          <img src={ad_id1.image_urls[0] || 'https://via.placeholder.com/150'} alt={ad_id1.title} />
          <Card>
              <CardContent className="p-4">
                {comparisonFields.map(field => (
                  <div key={field.key} className="mb-2">
                    <p className="font-semibold">{field.label}</p>
                    <p>{ad_id1[field.key as keyof Car]}</p>
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
          <img src={ad_id2.image_urls[0] || 'https://via.placeholder.com/150'} alt={ad_id2.title} />
          <Card>
              <CardContent className="p-4">
                {comparisonFields.map(field => (
                  <div key={field.key} className="mb-2">
                    <p className="font-semibold">{field.label}</p>
                    <p>{ad_id2[field.key as keyof Car]}</p>
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
