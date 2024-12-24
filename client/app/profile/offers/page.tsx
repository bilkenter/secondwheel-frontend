"use client";

import React, { useState, useEffect } from 'react';
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
  status: 'pending' | 'accepted' | 'rejected';
}

export default function OfferManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [action, setAction] = useState<'accepted' | 'rejected' | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      const data = await response.json();
      setOffers(data.offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handleAction = (offer: Offer, action: 'accepted' | 'rejected') => {
    setSelectedOffer(offer);
    setAction(action);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedOffer || !action) return;

    try {
      const response = await fetch(`/api/offers/${selectedOffer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      if (response.ok) {
        // Update local state
        setOffers(offers.map(offer => 
          offer.id === selectedOffer.id 
            ? { ...offer, status: action }
            : offer
        ));
      }
    } catch (error) {
      console.error('Error updating offer:', error);
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
              
              {offer.status === 'pending' && (
                <div className="space-x-2">
                  <Button
                    onClick={() => handleAction(offer, 'accepted')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleAction(offer, 'rejected')}
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

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {action} this offer?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 