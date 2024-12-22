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
    vehicleType: "",
    brand: "",
    modelName: "",
    year: "",
    mileage: "",
    fuelType: "",
    fuelTankCapacity: "",
    motorPower: "",
    transmissionType: "",
    bodyType: "",
    color: "",
    location: "",
    price: 0,
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    numOfDoors: "",
    wheelNumber: "",
    cylinderVolume: "",
    hasBasket: false,
    seatNumber: "",
    roofHeight: "",
    cabinSpace: "",
    hasSlidingDoor: false,
  });
  const [images, setImages] = useState<File[]>([]);
  const router = useRouter();

    //change with backend
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type} = e.target;
    if (type === "checkbox") {
        // Checkbox inputs
        const checked = (e.target as HTMLInputElement).checked; // Explicit cast to avoid errors
        setAdditionalInfo((prev) => ({ ...prev, [name]: checked }));
      } else if (name in additionalInfo) {
        // Inputs for additionalInfo
        setAdditionalInfo((prev) => ({ ...prev, [name]: value }));
      } else {
        // Inputs for vehicleInfo
        setVehicleInfo((prevState) => ({ ...prevState, [name]: value }));
      }
    };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vehicleInfo.price <= 0) {
        setAlertMessage("Price must be greater than zero.");
        return;
      }
    if (
      Object.values(vehicleInfo).some((value) => value === "") ||
      images.length === 0 ||
      (vehicleInfo.vehicleType === "car" && !additionalInfo.numOfDoors) ||
      (vehicleInfo.vehicleType === "motorcycle" &&
        (!additionalInfo.wheelNumber || !additionalInfo.cylinderVolume)) ||
      (vehicleInfo.vehicleType === "van" &&
        (!additionalInfo.seatNumber || !additionalInfo.roofHeight || !additionalInfo.cabinSpace))
    ) {
      setAlertMessage("Please fill in all fields and upload at least one image.");
      return;
    }

    // Perform your submit logic here (e.g., send to backend)
    console.log("Vehicle Information:", vehicleInfo);
    console.log("Additional Information:", additionalInfo);
    console.log("Uploaded Images:", images);

    // Redirect after successful submission
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
              <select
                name="vehicleType"
                value={vehicleInfo.vehicleType}
                onChange={handleChange}
                required
                className="block w-full p-2 border rounded"
                style={{ color: vehicleInfo.vehicleType ? "black" : "gray" }}
              >
                <option value="" disabled>
                  Select Vehicle Type
                </option>
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="van">Van</option>
              </select>
            </div>
            {/* Original Fields */}
            {[
              "brand",
              "modelName",
              "year",
              "mileage",
              "fuelType",
              "fuelTankCapacity",
              "motorPower",
              "transmissionType",
              "bodyType",
              "color",
              "location",
              "price",
            ].map((field) => (
              <div key={field}>
                <Input
                  type={
                    field === "year" || field === "price" || field === "mileage"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  placeholder={field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  value={vehicleInfo[field as keyof typeof vehicleInfo]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            {/* Additional Fields */}
            {vehicleInfo.vehicleType === "car" && (
              <div>
                <Input
                  type="number"
                  name="numOfDoors"
                  placeholder="Number of Doors"
                  value={additionalInfo.numOfDoors}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            {vehicleInfo.vehicleType === "motorcycle" && (
              <>
                <Input
                  type="number"
                  name="wheelNumber"
                  placeholder="Number of Wheels"
                  value={additionalInfo.wheelNumber}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="number"
                  name="cylinderVolume"
                  placeholder="Cylinder Volume"
                  value={additionalInfo.cylinderVolume}
                  onChange={handleChange}
                  required
                />
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="hasBasket"
                      checked={additionalInfo.hasBasket}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Has Basket
                  </label>
                </div>
              </>
            )}
            {vehicleInfo.vehicleType === "van" && (
              <>
                <Input
                  type="number"
                  name="seatNumber"
                  placeholder="Number of Seats"
                  value={additionalInfo.seatNumber}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="roofHeight"
                  placeholder="Roof Height"
                  value={additionalInfo.roofHeight}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="cabinSpace"
                  placeholder="Cabin Space"
                  value={additionalInfo.cabinSpace}
                  onChange={handleChange}
                  required
                />
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="hasSlidingDoor"
                      checked={additionalInfo.hasSlidingDoor}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Has Sliding Door
                  </label>
                </div>
              </>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500"
                required
              />
              {images.length > 0 && (
                <p className="text-sm text-gray-600">You have uploaded {images.length} image(s).</p>
              )}
            </div>
            <Button type="submit">Post Your Ad</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
