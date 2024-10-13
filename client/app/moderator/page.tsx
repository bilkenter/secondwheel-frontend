"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Ad {
  id: number;
  title: string;
  userId: number;
}

export default function ModeratorPage() {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetch('/api/ads')
      .then(response => response.json())
      .then(data => setAds(data))
      .catch(error => console.error('Error fetching ads:', error));
  }, []);

  const handleApproveAd = (adId: number) => {
    fetch(`/api/ads/${adId}/approve`, {
      method: 'POST',
    })
      .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setAds(prevAds => prevAds.filter(ad => ad.id !== adId));
      })
      .catch(error => console.error('Error approving ad:', error));
  };

  const handleRejectAd = (adId: number) => {
    fetch(`/api/ads/${adId}/reject`, {
      method: 'POST',
    })
      .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setAds(prevAds => prevAds.filter(ad => ad.id !== adId));
      })
      .catch(error => console.error('Error rejecting ad:', error));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Moderator Panel</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Ad Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          {ads.map((ad) => (
            <div key={ad.id} className="flex justify-between items-center mb-2">
              <span>{ad.title}</span>
              <div>
                <Button onClick={() => handleApproveAd(ad.id)} className="mr-2">Approve</Button>
                <Button onClick={() => handleRejectAd(ad.id)}>Reject</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
