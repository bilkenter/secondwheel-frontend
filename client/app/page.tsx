"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Nav from "@/components/ui/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Vehicle {
  ad_id: number;  // changed to ad_id
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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [priceError, setPriceError] = useState<string>('');
  const [yearFrom, setYearFrom] = useState<string>('');
  const [yearTo, setYearTo] = useState<string>('');
  const [maxMileage, setMaxMileage] = useState<string>('');
  const [yearError, setYearError] = useState<string>('');
  const [comparingMode, setComparingMode] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const router = useRouter();

  const validatePriceRange = (min: string, max: string) => {
    if (min && max && Number(min) > Number(max)) {
      setPriceError('Minimum price cannot be greater than maximum price');
    } else {
      setPriceError('');
    }
  };

  const validateYearRange = (from: string, to: string) => {
    if (from && to && Number(from) > Number(to)) {
      setYearError('Start year cannot be greater than end year');
    } else {
      setYearError('');
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    if (!comparingMode) return;

    setSelectedVehicles(prev => {
      if (prev.find(c => c.ad_id === vehicle.ad_id)) {
        return prev.filter(c => c.ad_id !== vehicle.ad_id);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, vehicle];
    });
  };

  const handleCompare = () => {
    if (selectedVehicles.length === 2) {
      router.push(`/compare?ad1=${selectedVehicles[0].ad_id}&ad2=${selectedVehicles[1].ad_id}`);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/get_all_cars/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setVehicles(data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
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
                <option value="bmw">BMW</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
                <option value="volkswagen">Volkswagen</option>
                <option value="hyundai">Hyundai</option>
                <option value="kia">Kia</option>
                <option value="lexus">Lexus</option>
                <option value="porsche">Porsche</option>
                <option value="subaru">Subaru</option>
                <option value="volvo">Volvo</option>
              </select>
            </div>
            <div>
              <label htmlFor="priceRange" className="block mb-2">Price Range</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  id="minPrice"
                  placeholder="min TL"
                  min="0"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    validatePriceRange(e.target.value, maxPrice);
                  }}
                  className={`w-1/2 ${priceError ? 'border-red-500' : ''}`}
                />
                <span>-</span>
                <Input
                  type="number"
                  id="maxPrice"
                  placeholder="max TL"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    validatePriceRange(minPrice, e.target.value);
                  }}
                  className={`w-1/2 ${priceError ? 'border-red-500' : ''}`}
                />
              </div>
              {priceError && <p className="text-red-500 text-sm mt-1">{priceError}</p>}
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
                  value={yearFrom}
                  onChange={(e) => {
                    setYearFrom(e.target.value);
                    validateYearRange(e.target.value, yearTo);
                  }}
                  className={`w-1/2 ${yearError ? 'border-red-500' : ''}`}
                />
                <Input
                  type="number"
                  id="yearTo"
                  placeholder="To"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={yearTo}
                  onChange={(e) => {
                    setYearTo(e.target.value);
                    validateYearRange(yearFrom, e.target.value);
                  }}
                  className={`w-1/2 ${yearError ? 'border-red-500' : ''}`}
                />
              </div>
              {yearError && <p className="text-red-500 text-sm mt-1">{yearError}</p>}
            </div>
            <div>
              <label htmlFor="mileage" className="block mb-2">Mileage</label>
              <Input
                type="number"
                id="mileage"
                placeholder="Max mileage"
                min="0"
                value={maxMileage}
                onChange={(e) => setMaxMileage(e.target.value)}
                className="w-full"
              />
            </div>
            <Button className="w-full">Apply Filters</Button>
          </div>
        </aside>
        <div className="flex-1 p-8">
          <div className="mb-8 flex justify-between items-center">
            <Input
              type="text"
              placeholder="Search for vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mr-4"
            />
            <Button
              onClick={() => {
                setComparingMode(!comparingMode);
                setSelectedVehicles([]);
              }}
              variant={comparingMode ? "destructive" : "default"}
            >
              {comparingMode ? "Cancel Compare" : "Compare Vehicles"}
            </Button>
            {comparingMode && (
              <Button
                onClick={handleCompare}
                disabled={selectedVehicles.length !== 2}
                className="ml-2"
              >
                Compare Selected ({selectedVehicles.length}/2)
              </Button>
            )}
          </div>

          {/* Car listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <div
                  key={vehicle.ad_id}
                  onClick={() => comparingMode ? handleVehicleSelect(vehicle) : router.push(`/vehicle/${vehicle.ad_id}`)} // Use ad_id here for routing

                  className={`cursor-pointer transition-transform hover:scale-105 relative ${comparingMode && selectedVehicles.find(c => c.ad_id === vehicle.ad_id)
                    ? 'ring-2 ring-blue-500'
                    : ''
                    }`}
                >
                  {comparingMode && selectedVehicles.find(c => c.ad_id === vehicle.ad_id) && (
                    <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                  <Card className="overflow-hidden">
                    <img src={vehicle.image} alt={vehicle.title} className="w-full h-48 object-cover" />
                    <CardHeader>
                      <CardTitle>{vehicle.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">{vehicle.description}</p>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-lg">${vehicle.price.toLocaleString()}</p>
                        <span className="text-sm text-gray-500">{vehicle.year}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="mr-4">{vehicle.mileage.toLocaleString()} miles</span>
                        <span>{vehicle.transmission}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                No vehicles found that match the filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}