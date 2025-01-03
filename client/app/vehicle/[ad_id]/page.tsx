"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import ChatModal from "@/components/Chat/ChatModal";
import Nav from "@/components/ui/nav";

interface Vehicle {
  vehicle_id: number;
  brand: string;
  model_name: string;
  year: number;
  mileage: number;
  motor_power: number;
  fuel_type: string;
  fuel_tank_capacity: number;
  transmission_type: string;
  body_type: string;
  color: string;
  vehicle_type: "Car" | "Motorcycle" | "Van"; // New attribute for vehicle type
  number_of_doors?: number; // Only for cars
  wheel_number?: number; // Only for motorcycles
  cylinder_volume?: number; // Only for motorcycles
  has_basket?: boolean; // Only for motorcycles
  seat_number?: number; // Only for vans
  roof_height?: number; // Only for vans
  cabin_space?: number; // Only for vans
  has_sliding_door?: boolean; // Only for vans
  ad_id: number;
  price: number;
  location: string;
  description: string;
  posting_date: string;
  status: string;
  seller_name: string; // Seller's name
  seller_email: string; // Seller's email address
  image_urls: string[];  // Keep the images property but don't use it yet
  user_id: number;
  title: string;
  pdf_file: string;
}

/*interface Ad {
  ad_id: number;
  price: number;
  location: string;
  description: string;
  posting_date: string;
  status: string;
  seller_name: string; // Seller's name
  seller_email: string; // Seller's email address
}

interface Image {
  image_id: number;
  ad_id: number;
  extension: string;
  height: number;
  width: number;
}
*/
export default function VehiclePage() {
  const { ad_id } = useParams(); // ad_id
  //const [ad, setAd] = useState<Ad | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  //const [images, setImages] = useState<Image[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOfferPending, setIsOfferPending] = useState(false);
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const fetchAdData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/vehicle/${ad_id}/`);

        // Check if the response is successful
        if (!response.ok) {
          console.error("Failed to fetch vehicle data, status:", response.status);
          return;
        }

        const data = await response.json();
        console.log("Fetched data:", data);  // Log the response data

        // Check if vehicle data is returned as an object
        if (data && data.ad_id) {
          setVehicle({
            ...data,
            image_urls: data.image_urls || [], // Handle image URLs if they exist
          });
        } else {
          console.error("No vehicle data found.");
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    fetchAdData();
  }, [ad_id]);


  //if (!vehicle) return <div>Loading...</div>;

  /*
    // Mock data for testing
    useEffect(() => {
      const fetchMockData = () => {
        // Mock Ad Data
        const mockAd: Ad = {
          ad_id: 1,
          price: 25000,
          location: "New York, NY",
          description:
            "Well-maintained 2020 Toyota Corolla, excellent condition.",
          posting_date: "2023-12-10",
          status: "Available",
          seller_name: "Hermione Granger", // Adding seller name
          seller_email: "hermione@example.com", // Adding seller email
        };
  
        // Mock Vehicle Data
        const mockVehicle: Vehicle = {
          vehicle_type: "Car",
          vehicle_id: 1,
          brand: "Toyota",
          model_name: "Corolla",
          year: 2020,
          mileage: 12000,
          motor_power: 132,
          fuel_type: "Gasoline",
          fuel_tank_capacity: 50,
          transmission_type: "Automatic",
          body_type: "Sedan",
          color: "White",
          number_of_doors: 4,
        };
  
        // Mock Images Data
        const images: Image[] = [
          { image_id: 1, ad_id: 1, extension: "jpg", height: 500, width: 800 },
          { image_id: 2, ad_id: 1, extension: "jpg", height: 500, width: 800 },
        ];
  
        // Set the mock data
        setAd(mockAd);
        setVehicle(mockVehicle);
        setImages(images);
      };
  
      fetchMockData();
    }, [ad_id]);
  */
  const handleMakeOfferClick = () => {
    setIsOfferModalOpen(true);
  };

  const handleContactSellerClick = () => {
    setIsChatOpen(true);
  };

  const handleReportAdClick = () => {
    setIsReportModalOpen(true);
  };

  const handleGiveReviewClick = () => {
    setIsReviewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsContactModalOpen(false);
    setIsOfferModalOpen(false);
    setIsReportModalOpen(false);
    setIsReviewModalOpen(false)
  };

  const handleOfferSubmit = async () => {
    // Validate offerAmount
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      alert("Please enter a valid offer amount.");
      return;
    }

    try {
      // Create the request payload
      const offerData = {
        ad_id: vehicle?.ad_id,
        offered_price: parseFloat(offerAmount),
        user_id: localStorage.getItem("user_id"),  // Get the current user ID (this should be saved in local storage)
      };

      // Send POST request to make an offer
      const response = await fetch("http://127.0.0.1:8000/make_offer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offerData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Offer made successfully:", result);
        setIsOfferPending(true);  // Set offer pending state
        setIsOfferModalOpen(false);  // Close the offer modal
      } else {
        const error = await response.json();
        console.error("Failed to make an offer:", error);
        alert(error.error);
      }
    } catch (error) {
      console.error("Error making an offer:", error);
      alert("Error making an offer. Please try again.");
    }
  };

  const handleReportSubmit = () => {
    console.log("Report Reason:", reportReason);
    setIsReportModalOpen(false);
  };

  const handleReviewSubmit = () => {
    console.log("Rating:", rating, "Comment:", reviewComment);
    setIsReviewModalOpen(false);
  };

  const handleNextImage = () => {
    const images = vehicle?.image_urls;
    if (!images) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    const images = vehicle?.image_urls;
    if (!images) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  if (!vehicle) return <div>Loading...</div>;

  //same here
  return (
    <div>
      <Nav />
      <h1 className="text-3xl font-bold text-center mb-4 text-[#12314E] mt-6">
        Vehicle Details
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Image and Buttons */}
        <div>
          {/* Placeholder for the image */}
          <div className="relative">
            {/* Display the first image from the image_urls */}
            {vehicle?.image_urls && vehicle.image_urls.length > 0 ? (
              <img
                src={vehicle.image_urls[currentImageIndex]}
                alt="Vehicle Image"
                style={{
                  width: "620px",
                  height: "470px",
                  border: "4px solid black",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  marginTop: "85px",
                  marginBottom: "24px",
                  marginLeft: "170px",
                }}
              />
            ) : (
              <p>No images available for this car at the moment.</p>
            )}

            {/* Image Navigation Buttons */}
            {vehicle?.image_urls.length > 1 && (
              <>
                {/* Previous Image Button */}
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-20 ml-9 transform -translate-y-1/2 bg-[#12314E] text-white p-2 rounded-full"
                  style={{ zIndex: 1 }}
                >
                  &#10094;
                </button>
                {/* Next Image Button */}
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-[#12314E] text-white p-2 rounded-full"
                  style={{ zIndex: 1 }}
                >
                  &#10095;
                </button>
              </>
            )}
          </div>
          <div
            className="grid grid-cols-2 gap-4"
            style={{
              marginTop: "50px",
              marginLeft: "190px",
            }}
          >
            <Button
              style={{
                backgroundColor: "#12314E",
                color: "white",
                width: "238px",
                height: "55px",
                fontSize: "18px",
                fontWeight: "500",
                borderRadius: "20px",
              }}
              onClick={handleContactSellerClick} // Open chat
            >
              Contact Seller
            </Button>
            <Button
              style={{
                backgroundColor: "#12314E",
                color: "white",
                width: "238px",
                height: "55px",
                fontSize: "18px",
                fontWeight: "500",
                borderRadius: "20px",
              }}
              disabled={vehicle?.status?.toLowerCase() === "sold"}
              onClick={handleMakeOfferClick}
            >
              Make Offer
            </Button>
            <Button
              style={{
                backgroundColor: "#12314E",
                color: "white",
                width: "238px",
                height: "55px",
                fontSize: "18px",
                fontWeight: "500",
                borderRadius: "20px",
              }}
              onClick={handleReportAdClick}
            >
              Report Ad
            </Button>
            <Button
              style={{
                backgroundColor: "#12314E",
                color: "white",
                width: "238px",
                height: "55px",
                fontSize: "18px",
                fontWeight: "500",
                borderRadius: "20px",
              }}
              onClick={handleGiveReviewClick}
            >
              Give Review
            </Button>
            {/* Offer Pending Message */}
            {isOfferPending && (
              <p
                style={{
                  color: "red",
                  fontStyle: "italic",
                  marginTop: "10px",
                  gridColumn: "span 2", //the message spans both columns
                }}
              >
                Your offer is pending approval!
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Details Card */}
        <Card
          style={{
            position: "relative",
            backgroundColor: "#CDD2EF",
            border: "1px solid #12314E",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            width: "575px",
            height: "705px",
            marginTop: "20px",
            marginLeft: "80px",
          }}
        >
          {vehicle?.status?.toLowerCase() === "sold" && (
            <img
              src="/icons/sold.svg"
              alt="Sold"
              style={{
                position: "absolute",
                top: "0px",
                right: "-25px",
                width: "75x", // Adjust width as needed
                height: "75px", // Adjust height as needed
                zIndex: 1, // Ensure it appears above other elements
              }}
            />
          )}
          <CardContent
            className="text-[#12314E]"
            style={{
              fontSize: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly", // Evenly distribute the content vertically
              textAlign: "center", // Center text within the content
              height: "100%", // Make sure the CardContent takes full height of the card
            }}
          >
            <p className="mb-2 mt-8">
              <strong>Vehicle Type:</strong> {vehicle.vehicle_type}
            </p>
            <p className="mb-2">
              <strong>Brand:</strong> {vehicle.brand}
            </p>
            <p className="mb-2">
              <strong>Model Name:</strong> {vehicle.model_name}
            </p>
            <p className="mb-2">
              <strong>Year:</strong> {vehicle.year}
            </p>
            <hr className="my-2 border-[#12314E]" />
            <p className="mb-2">
              <strong>Mileage:</strong> {vehicle.mileage.toLocaleString()} miles
            </p>
            <p className="mb-2">
              <strong>Fuel Type:</strong> {vehicle.fuel_type}
            </p>
            <p className="mb-2">
              <strong>Fuel Tank Capacity:</strong> {vehicle.fuel_tank_capacity}{" "}
              L
            </p>
            <p className="mb-2">
              <strong>Motor Power:</strong> {vehicle.motor_power} HP
            </p>
            <p className="mb-2">
              <strong>Transmission Type:</strong> {vehicle.transmission_type}
            </p>
            <p className="mb-2">
              <strong>Body Type:</strong> {vehicle.body_type}
            </p>
            <p className="mb-2">
              <strong>Color:</strong> {vehicle.color}
            </p>

            {/* Conditional fields based on vehicle type */}
            {vehicle?.vehicle_type === "Car" && vehicle?.number_of_doors && (
              <p className="mb-2">
                <strong>Number of Doors:</strong> {vehicle.number_of_doors}
              </p>
            )}
            {vehicle?.vehicle_type === "Motorcycle" && vehicle?.wheel_number && (
              <p className="mb-2">
                <strong>Wheel Number:</strong> {vehicle.wheel_number}
              </p>
            )}
            {vehicle?.vehicle_type === "Motorcycle" && vehicle?.cylinder_volume && (
              <p className="mb-2">
                <strong>Cylinder Volume:</strong> {vehicle.cylinder_volume} cc
              </p>
            )}
            {vehicle?.vehicle_type === "Motorcycle" && vehicle?.has_basket !== undefined && (
              <p className="mb-2">
                <strong>Has Basket:</strong> {vehicle.has_basket ? "Yes" : "No"}
              </p>
            )}
            {vehicle?.vehicle_type === "Van" && vehicle?.seat_number && (
              <p className="mb-2">
                <strong>Seat Number:</strong> {vehicle.seat_number}
              </p>
            )}
            {vehicle?.vehicle_type === "Van" && vehicle?.roof_height && (
              <p className="mb-2">
                <strong>Roof Height:</strong> {vehicle.roof_height} cm
              </p>
            )}
            {vehicle?.vehicle_type === "Van" && vehicle?.cabin_space && (
              <p className="mb-2">
                <strong>Cabin Space:</strong> {vehicle.cabin_space} m²
              </p>
            )}
            {vehicle?.vehicle_type === "Van" && vehicle?.has_sliding_door !== undefined && (
              <p className="mb-2">
                <strong>Has Sliding Door:</strong> {vehicle.has_sliding_door ? "Yes" : "No"}
              </p>
            )}

            <hr className="my-2 border-[#12314E]" />
            <p className="mb-2">
              <strong>Location:</strong> {vehicle.location}
            </p>
            <p className="mb-2">
              <strong>Price:</strong> ${vehicle.price.toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    vehicle?.status?.toLowerCase() === "available" ? "green" : "red",
                }}
              >
                {vehicle.status}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actual contact seller Modal */}
      {vehicle && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          carId={vehicle.ad_id.toString()}
          sellerId={vehicle.user_id?.toString()}
          currentUserId={localStorage.getItem("user_id") || ''}
          carTitle={vehicle.title}
        />
      )}

      {/* OLD Contact Seller Modal 
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="bg-white w-[400px] p-6 rounded-lg shadow-lg"
            style={{ zIndex: 100 }}
          >
            <h2 className="text-2xl font-bold text-[#12314E] text-center mb-4">
              Contact Seller
            </h2>
            <div className="text-center">
              <p className="mb-2">Seller Name: {vehicle.seller_name}</p>
              <p className="mb-4">
                Email:{" "}
                <a
                  href={`mailto:${vehicle.seller_email}`}
                  className="text-[#12314E] underline"
                >
                  {vehicle.seller_email}
                </a>
              </p>
              <Button
                style={{
                  backgroundColor: "#3A3A3A",
                  color: "white",
                  width: "100%",
                  height: "50px",
                  fontSize: "16px",
                  borderRadius: "10px",
                }}
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
        */}

      {/* Modal for Making an Offer */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="bg-white w-[400px] p-6 rounded-lg shadow-lg"
            style={{ zIndex: 100 }}
          >
            <h2 className="text-2xl font-bold text-[#3A3A3A] text-center mb-4">
              Make an Offer
            </h2>
            <div className="flex flex-col items-center">
              <input
                type="number"
                placeholder="Enter offer amount"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#6C6B6B] mb-1"
              />
              <small className="italic text-gray-500 mb-4">
                Your offer will be sent to the seller for review.
              </small>
              <div className="flex flex-col gap-4">
                <Button
                  style={{
                    backgroundColor: "#3A3A3A",
                    color: "white",
                    width: "100%",
                    height: "50px",
                    fontSize: "16px",
                    borderRadius: "10px",
                  }}
                  onClick={handleOfferSubmit}
                >
                  Submit Offer
                </Button>
                <Button
                  style={{
                    backgroundColor: "#3A3A3A",
                    color: "white",
                    width: "100%",
                    height: "50px",
                    fontSize: "16px",
                    borderRadius: "10px",
                  }}
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Report Ad Modal */}
      {isReportModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Report Ad</h2>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Enter the reason for reporting this ad..."
            />
            <div className="modal-actions">
              <Button onClick={handleReportSubmit}>Submit</Button>
              <Button onClick={handleCloseModal}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Give Review Modal */}
      {isReviewModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Give Review</h2>
            <input
              type="number"
              value={rating}
              min={0}
              max={5}
              onChange={(e) => setRating(Number(e.target.value))}
              placeholder="Rate out of 5"
            />
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your review..."
            />
            <div className="modal-actions">
              <Button onClick={handleReviewSubmit}>Submit</Button>
              <Button onClick={handleCloseModal}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
