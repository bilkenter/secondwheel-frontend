"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export default function SellVehiclePage() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState({
    vehicle_type: "",
    brand: "",
    model_name: "",
    year: "",
    mileage: "",
    fuel_type: "",
    fuel_tank_capacity: "",
    motor_power: "",
    transmission_type: "",
    body_type: "",
    color: "",
    location: "",
    price: 0,
    description: "", // Added description
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
  const [image_urls, setImages] = useState<File[]>([]); // Image state if needed in the future
  const [pdfFile, setPdfFile] = useState<File | null>(null); // State for PDF file upload
  const [userId, setUserId] = useState<number | null>(null); // User ID state
  const [userType, setUserType] = useState<string | null>(null); // User Type state
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("user_id");
      if (storedUserId) {
        setUserId(parseInt(storedUserId, 10)); // Ensure it's a number
        // Fetch user data based on the user ID
        fetchUserData(parseInt(storedUserId, 10));
      } else {
        setAlertMessage("User is not logged in.");
      }
    }
  }, []);

  // Fetch user data to check user type
  const fetchUserData = async (userId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_user_data?user_id=${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserType(userData.user.user_type); // Get the user type
        
        if (userData.user.user_type !== "Seller") {
          setAlertMessage("You are not a seller. You cannot post an ad.");
        }
      } else {
        setAlertMessage("Error fetching user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAlertMessage("An unexpected error occurred.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setAdditionalInfo((prev) => ({ ...prev, [name]: checked }));
    } else if (name in additionalInfo) {
      setAdditionalInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      setVehicleInfo((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  // Separate function for handling file changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files)); // Store selected image files
    }
  };
  // Separate function for handling PDF file changes (expert report)
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFile(e.target.files[0]); // Store selected PDF file
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (alertMessage) {
      return; // Prevent submission if there's an alert message
    }

    if (vehicleInfo.price <= 0) {
      setAlertMessage("Price must be greater than zero.");
      return;
    }

    if (
      Object.values(vehicleInfo).some((value) => value === "") ||
      (vehicleInfo.vehicle_type === "Car" && !additionalInfo.numOfDoors) ||
      (vehicleInfo.vehicle_type === "Motorcycle" &&
        (!additionalInfo.wheelNumber || !additionalInfo.cylinderVolume)) ||
      (vehicleInfo.vehicle_type === "Van" &&
        (!additionalInfo.seatNumber || !additionalInfo.roofHeight || !additionalInfo.cabinSpace))
    ) {
      setAlertMessage("Please fill in all fields.");
      return;
    }

    if (!userId) {
      setAlertMessage("User is not logged in.");
      return;
    }

    const vehicleData = {
      vehicle_type: vehicleInfo.vehicle_type,
      brand: vehicleInfo.brand,
      model_name: vehicleInfo.model_name,
      year: vehicleInfo.year,
      mileage: vehicleInfo.mileage,
      fuel_type: vehicleInfo.fuel_type,
      fuel_tank_capacity: vehicleInfo.fuel_tank_capacity,
      motor_power: vehicleInfo.motor_power,
      transmission_type: vehicleInfo.transmission_type,
      body_type: vehicleInfo.body_type,
      color: vehicleInfo.color,
      location: vehicleInfo.location,
      price: vehicleInfo.price,
      description: vehicleInfo.description,
      user_id: userId,
    };

    // Add additional info based on vehicle type
    if (vehicleInfo.vehicle_type === "Car") {
      vehicleData.numOfDoors = additionalInfo.numOfDoors;
    } else if (vehicleInfo.vehicle_type === "Motorcycle") {
      vehicleData.wheelNumber = additionalInfo.wheelNumber;
      vehicleData.cylinderVolume = additionalInfo.cylinderVolume;
      vehicleData.hasBasket = additionalInfo.hasBasket;
    } else if (vehicleInfo.vehicle_type === "Van") {
      vehicleData.seatNumber = additionalInfo.seatNumber;
      vehicleData.roofHeight = additionalInfo.roofHeight;
      vehicleData.cabinSpace = additionalInfo.cabinSpace;
      vehicleData.hasSlidingDoor = additionalInfo.hasSlidingDoor;
    }

    // Create a FormData object to send the vehicle data and images
    const formData = new FormData();
    formData.append('vehicle_data', JSON.stringify(vehicleData));

    // Append images to formData
    image_urls.forEach((image) => {
      formData.append('images', image);
    });
    // Append the PDF file if exists
    if (pdfFile) {
      formData.append('pdf_file', pdfFile);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/create_vehicle_ad/", {
        method: "POST",/* 
        headers: {
          "Content-Type": "application/json", // Ensure the Content-Type is application/json
        }, */
        body: formData, // Send the vehicleData object as JSON
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Ad created successfully:", data);
        router.push("/profile"); // Redirect to profile page to view ads
      } else {
        const errorData = await response.json();
        setAlertMessage(errorData.message || "An error occurred while posting the ad.");
      }
      
      const data = await response.json();
      console.log("Data is: ", data);

    } catch (error) {
      console.error("Error submitting vehicle ad:", error);
      setAlertMessage("An unexpected error occurred. Please try again.");
    }
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
                name="vehicle_type"
                value={vehicleInfo.vehicle_type}
                onChange={handleChange}
                required
                className="block w-full p-2 border rounded"
                style={{ color: vehicleInfo.vehicle_type ? "black" : "gray" }}
              >
                <option value="" disabled>
                  Select Vehicle Type
                </option>
                <option value="Car">Car</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Van">Van</option>
              </select>
            </div>
            {[ 
              "brand", "model_name", "year", "mileage", "fuel_type", "fuel_tank_capacity", 
              "motor_power", "transmission_type", "body_type", "color", "location", "price" 
            ].map((field) => (
              <div key={field}>
                <Input
                  type={field === "year" || field === "price" || field === "mileage" ? "number" : "text"}
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  value={vehicleInfo[field as keyof typeof vehicleInfo]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            {/* Description field */}
            <div>
              <Input
                type="text"
                name="description"
                placeholder="Vehicle Description"
                value={vehicleInfo.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Additional Fields */}
            {vehicleInfo.vehicle_type === "Car" && (
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
            {vehicleInfo.vehicle_type === "Motorcycle" && (
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
            {vehicleInfo.vehicle_type === "Van" && (
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

            {/* Image Upload */}
            <div>
              <label>Upload Images:</label>
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full"
              />
            </div>

            {/* Expert Report PDF Upload */}
            <div>
              <label>Upload Expert Report (PDF):</label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={handlePdfFileChange}
                className="w-full"
              />
            </div>

            <Button type="submit">Post Your Ad</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}