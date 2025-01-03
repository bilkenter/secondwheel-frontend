"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Alert } from "@/components/ui/alert";

interface Offer {
  id: number;
  vehicle_id: string;
  buyer_id: string;
  offered_price: number;
  offer_date: string;
  status: "pending" | "accepted" | "rejected";
}

interface Transaction {
  transactionId: string;
  buyerName: string;
  sellerName: string;
  transactionDate: string;
  offerPrice: number;
}

interface User {
  user_type: "Buyer" | "Seller" | "Moderator" | "Admin" | "Unknown";
  name: string;
  user_id: number;
}

export default function OfferManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [action, setAction] = useState<"accepted" | "rejected" | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null); // Track user ID
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("user_id");
      console.log("Stored user ID:", storedUserId); // Check stored userId
      if (storedUserId) {
        // Directly use the storedUserId to fetch the user data
        const parsedUserId = parseInt(storedUserId, 10);
        fetchUserData(parsedUserId); // Call fetchUserData with parsedUserId
      } else {
        setAlertMessage("User is not logged in.");
      }
    }
  }, []); // Empty dependency array, so this effect runs once after the initial render

  const fetchUserData = async (user_id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_user_data?user_id=${user_id}`);
      const data = await response.json();
      console.log("User data:", data); // Log fetched user data
      if (data.user) {
        setUser(data.user); // Set user data from the API response
        if (data.user.user_type === "Seller") {
          fetchOffers(user_id); // Fetch offers if the user is a seller
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  // Fetch offers for a seller using the seller_id
  const fetchOffers = async (seller_id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_incoming_offers?seller_id=${seller_id}`);
      const data = await response.json();
      console.log("Offers fetched:", data);
      setOffers(data.offers || []); // Store the fetched offers in the state
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const handleAction = (offer: Offer, action: "accepted" | "rejected") => {
    setSelectedOffer(offer);
    setAction(action);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedOffer || action !== "accepted") return;

    try {
      const response = await fetch(`/api/offers/${selectedOffer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });

      if (response.ok) {
        const mockTransaction: Transaction = {
          transactionId: `TXN-${selectedOffer.id}-${Date.now()}`,
          buyerName: selectedOffer.buyer_id,
          sellerName: user?.name || "Unknown Seller",
          transactionDate: new Date().toLocaleString(),
          offerPrice: selectedOffer.offered_price,
        };

        setTransaction(mockTransaction);

        setOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer.id === selectedOffer.id
              ? { ...offer, status: "accepted" }
              : offer
          )
        );

        setIsPaymentDialogOpen(true);
      }
    } catch (error) {
      console.error("Error updating offer:", error);
    }

    setIsConfirmDialogOpen(false);
    setSelectedOffer(null);
    setAction(null);
  };

 
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Offer Management</h1>

      <div className="space-y-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="font-medium">Vehicle: {offer.vehicle_id}</div>
                <div>Buyer: {offer.buyer_id}</div>
                <div>Offer Amount: ${offer.offered_price}</div>
                <div>Offer Date: {offer.offer_date}</div>
                <div>Status: {offer.status}</div>
              </div>

              {user?.user_type === "Seller" && offer.status === "pending" && (
                <div className="space-x-2">
                  <Button
                    onClick={() => handleAction(offer, "accepted")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleAction(offer, "rejected")}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Confirm Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {action} this offer?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Successful Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">Payment Successful!</DialogTitle>
            <DialogDescription>
              Your payment has been successfully processed!
            </DialogDescription>
          </DialogHeader>
          {transaction && (
            <div className="mt-4 space-y-2">
              <div>Transaction ID: {transaction.transactionId}</div>
              <div>Buyer Name: {transaction.buyerName}</div>
              <div>Seller Name: {transaction.sellerName}</div>
              <div>Transaction Date: {transaction.transactionDate}</div>
              <div>Offer Price: ${transaction.offerPrice}</div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPaymentDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}