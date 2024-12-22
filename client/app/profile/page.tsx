"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from '@/lib/apiClient';
import { useRouter } from "next/navigation";

interface Ad {
  ad_id: number;
  price: number;
  posting_date: string;
  status: string;  // e.g., "Available" or "Sold"
}

interface User {
  name: string;
  email: string;
  type: string;  // "buyer" or "seller"
}

export default function ProfilePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [user, setUser] = useState<User>({ name: '', email: '', type: 'seller' }); //type accordingly
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const userResponse = await api('/user');
      const userData = await userResponse.json();
      setUser(userData);

      if (userData.type === 'seller') {
        const adsResponse = await api('/ads');  // Update API to fetch ads
        const adsData = await adsResponse.json();
        setAds(adsData);
      }
    };

    fetchUserData();
  }, []);

  const handleAddAd = () => {
    router.push("/sell");
    /*const newAd: Ad = {
      ad_id: ads.length + 1, // ID logic will be updated in the backend
      price: 0,              // Placeholder for input value
      posting_date: new Date().toLocaleDateString(),  // Current date
      status: 'Available',
    };
    setAds([...ads, newAd]);*/
  };

  const handleDeleteAd = (ad_id: number) => {
    setAds(ads.filter(ad => ad.ad_id !== ad_id));
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        alert('User updated successfully');
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        alert('Password changed successfully');
        setNewPassword('');
      } else {
        alert('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={user.name} 
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            placeholder="Name"
            className="mb-2"
          />
          <Input 
            value={user.email} 
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
            className="mb-2"
          />
          <Input 
            type="password"
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="mb-2"
          />
          <Button onClick={handleUpdateUser}>Update Profile</Button>
          <Button onClick={handleChangePassword} className="ml-2 mt-2">Change Password</Button>
        </CardContent>
      </Card>

      {user.type === 'seller' && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Ad Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleAddAd}>Add New Ad</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Ad Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {ads.map((ad) => (
                <div key={ad.ad_id} className="flex justify-between items-center mb-2">
                  <span>{ad.posting_date} - ${ad.price}</span>
                  <span>{ad.status}</span>
                  <Button onClick={() => handleDeleteAd(ad.ad_id)}>Delete</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
