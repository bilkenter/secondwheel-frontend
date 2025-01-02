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

interface Offer {
  id: number;
  vehicle: string;
  buyer: string;
  amount: number;
  date: string;
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
  type: "buyer" | "seller";
  name: string;
}

export default function OfferManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [action, setAction] = useState<"accepted" | "rejected" | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchOffers();
    fetchUserType();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/offers");
      const data = await response.json();
      setOffers(data.offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const fetchUserType = async () => {
    try {
      const response = await fetch("/api/user"); // Adjust API endpoint as needed
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user type:", error);
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
        // Mock transaction data for demo purposes
        const mockTransaction: Transaction = {
          transactionId: `TXN-${selectedOffer.id}-${Date.now()}`,
          buyerName: selectedOffer.buyer,
          sellerName: user?.name || "Unknown Seller",
          transactionDate: new Date().toLocaleString(),
          offerPrice: selectedOffer.amount,
        };

        setTransaction(mockTransaction);

        // Update local state
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
                <div className="font-medium">Vehicle: {offer.vehicle}</div>
                <div>Buyer: {offer.buyer}</div>
                <div>Offer Amount: ${offer.amount.toLocaleString()}</div>
                <div>Offer Date: {offer.date}</div>
                <div>Status: {offer.status}</div>
              </div>

              {user?.type === "seller" && offer.status === "pending" && (
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
              <div>Offer Price: ${transaction.offerPrice.toLocaleString()}</div>
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
