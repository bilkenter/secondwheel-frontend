"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";

interface Offer {
  offer_id: number;
  vehicle_id: number;
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
  const [userId, setUserId] = useState<number | null>(null); 
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("user_id");
      console.log("Stored user ID:", storedUserId);
      if (storedUserId) {
        const parsedUserId = parseInt(storedUserId, 10);
        setUserId(parsedUserId); 
        fetchUserData(parsedUserId); 
      } else {
        setAlertMessage("User is not logged in.");
      }
    }
  }, []); 

  const fetchUserData = async (user_id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_user_data?user_id=${user_id}`);
      const data = await response.json();
      console.log("User data:", data);
      if (data.user) {
        setUser(data.user); 
        if (data.user.user_type === "Seller") {
          fetchOffersForSeller(user_id); 
        } else if (data.user.user_type === "Buyer") {
          fetchOffersForBuyer(user_id); 
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchOffersForSeller = async (seller_id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_incoming_offers?seller_id=${seller_id}`);
      const data = await response.json();
      console.log("Offers fetched for seller:", data);
      setOffers(data.offers || []);
    } catch (error) {
      console.error("Error fetching offers for seller:", error);
    }
  };

  const fetchOffersForBuyer = async (buyer_id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_buyer_offers?buyer_id=${buyer_id}`);
      const data = await response.json();
      console.log("Offers fetched for buyer:", data);
      setOffers(data.offers || []);
    } catch (error) {
      console.error("Error fetching offers for buyer:", error);
    }
  };

  const handleAction = (offer: Offer, action: "accepted" | "rejected") => {
    setSelectedOffer(offer);
    console.log(offer)
    setAction(action);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedOffer || action === null) return;

    try {
      console.log(selectedOffer.offer_id)
      const response = await fetch(`http://127.0.0.1:8000/accept_reject_offer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offer_id: selectedOffer.offer_id,
          action,
          user_id: userId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.transaction_id) {
          setOffers((prevOffers) =>
            prevOffers.map((offer) =>
              offer.offer_id === selectedOffer.offer_id ? { ...offer, status: "accepted" } : offer
            )
          );
        }
      } else {
        setAlertMessage(data.error || "Error processing the action");
      }
    } catch (error) {
      console.error("Error handling action:", error);
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
          <Card key={offer.offer_id} className="p-6">
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

              {user?.user_type === "Buyer" && offer.status !== "pending" && (
                <div className="space-y-2">
                  <div>Your offer status: {offer.status}</div>
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
