"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Nav from "@/components/ui/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Car {
  id: number;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  transmission: string;
  image: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-1 flex">
        <aside className="w-64 bg-gray-100 p-4">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="brand" className="block mb-2">Brand</label>
              <select id="brand" className="w-full p-2 border rounded">
                <option value="">All Brands</option>
                <option value="toyota">Toyota</option>
                <option value="honda">Honda</option>
                <option value="ford">Ford</option>
                <option value="chevrolet">Chevrolet</option>
                <option value="nissan">Nissan</option>
              </select>
            </div>
            <div>
              <label htmlFor="priceRange" className="block mb-2">Price Range</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="range"
                  id="priceRange"
                  min="0"
                  max="100000"
                  step="1000"
                  className="w-full"
                />
                <span id="priceDisplay" className="text-sm">$0 - $100,000</span>
              </div>
            </div>
            <div>
              <label htmlFor="year" className="block mb-2">Year</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  id="yearFrom"
                  placeholder="From"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-1/2"
                />
                <Input
                  type="number"
                  id="yearTo"
                  placeholder="To"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-1/2"
                />
              </div>
            </div>
            <div>
              <label htmlFor="mileage" className="block mb-2">Mileage</label>
              <Input
                type="number"
                id="mileage"
                placeholder="Max mileage"
                min="0"
                className="w-full"
              />
            </div>
            <Button className="w-full">Apply Filters</Button>
          </div>
        </aside>

        <div className="flex-1 p-8">
          {/* Search bar */}
          <div className="mb-8">
            <Input
              type="text"
              placeholder="Search for cars..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Car listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <Card key={car.id} className="overflow-hidden">
                <img src={car.image} alt={car.title} className="w-full h-48 object-cover" />
                <CardHeader>
                  <CardTitle>{car.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{car.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">${car.price.toLocaleString()}</p>
                    <span className="text-sm text-gray-500">{car.year}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="mr-4">{car.mileage.toLocaleString()} miles</span>
                    <span>{car.transmission}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
