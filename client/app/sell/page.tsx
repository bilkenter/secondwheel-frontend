"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export default function SellVehiclePage() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    description: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(vehicleInfo).some((value) => value === "") || images.length === 0) {
      setAlertMessage("Please fill in all fields and upload at least one image.");
      return;
    }

    // Perform your submit logic here (e.g., send to backend)
    // For now, we’ll just log the data to console
    console.log("Vehicle Information:", vehicleInfo);
    console.log("Uploaded Images:", images);

    // Redirect after successful submission (or show a success message)
    router.push("/profile");
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Sell Your Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          {alertMessage && <Alert>{alertMessage}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="make"
                placeholder="Vehicle Make"
                value={vehicleInfo.make}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Input
                type="text"
                name="model"
                placeholder="Vehicle Model"
                value={vehicleInfo.model}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Input
                type="number"
                name="year"
                placeholder="Vehicle Year"
                value={vehicleInfo.year}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Input
                type="number"
                name="price"
                placeholder="Price"
                value={vehicleInfo.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Input
                type="text"
                name="description"
                placeholder="Description"
                value={vehicleInfo.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500"
                required
              />
            </div>
            <Button type="submit">Post Your Ad</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
