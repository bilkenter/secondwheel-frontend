"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Ad {
  ad_id: number;
  price: number;
  posting_date: string;
  status: string;
  vehicle_id: number;
}

interface User {
  name: string;
  email: string;
  type: string;
  user_id: number;
}

interface Chat {
  carId: string;
  carTitle: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  buyerId: string;
  buyerName: string;
}

export default function ProfilePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [user, setUser] = useState<User>({ name: '', email: '', type: 'seller', user_id: 0 });
  const [newPassword, setNewPassword] = useState('');
  const [balance, setBalance] = useState(0);
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  // Fetch user data and ads
  useEffect(() => {
    const fetchUserData = async () => {
      // Get the user ID from localStorage
      const storedUserId = localStorage.getItem("user_id");
      console.log("Fetching ads for user:", storedUserId);

      if (storedUserId) {
        // Set the user state with the retrieved user ID
        setUser({ ...user, user_id: parseInt(storedUserId) });

        // Fetch user data based on the user ID
        try {
          const userResponse = await fetch(`http://127.0.0.1:8000/get_user_data?user_id=${storedUserId}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser({ ...user, ...userData.user }); // Update user state with fetched data
            setBalance(userData.user.balance || 0);
            console.log("User Data:", userData);
          } else {
            console.log("Error fetching user data:", userResponse);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        // Fetch ads for this user
        const adsResponse = await fetch(`http://127.0.0.1:8000/get_seller_ads?user_id=${storedUserId}`);
        if (adsResponse.ok) {
          const adsData = await adsResponse.json();
          console.log("Ads Data:", adsData);
          setAds(adsData.ads);  // Update the state with ads data
        } else {
          console.log("Error response:", adsResponse);
        }
      } else {
        console.error("User not logged in");
      }
    };

    fetchUserData();
  }, []);  // Empty dependency array ensures this runs once when the component mounts

  useEffect(() => {
    const fetchChats = async () => {
      if (user.user_id) {
        try {
          // API endpoint /api/chat/seller/[userId] needed
          const response = await fetch(`/api/chat/seller/${user.user_id}`);
          if (response.ok) {
            const data = await response.json();
            setChats(data);
          }
        } catch (error) {
          console.error('Error fetching chats:', error);
        }
      }
    };

    fetchChats();
  }, [user.user_id]);

  const handleAddAd = () => {
    router.push("/sell"); // Navigate to the sell page to create a new ad
  };

  const handleDeleteAd = async (ad_id: number) => {
    try {
      // Correct URL format to delete the ad using the ad_id in the URL path
      const response = await fetch(`http://127.0.0.1:8000/delete_ad/${ad_id}/`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setAds(ads.filter(ad => ad.ad_id !== ad_id)); // Remove the deleted ad from the state
      } else {
        alert('Failed to delete ad');
      }
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('An unexpected error occurred. Please try again.');
    }
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Button
          onClick={() => router.push('/profile/offers')}
          className="md:w-auto"
        >
          Manage Offers
        </Button>
      </div>

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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p>${balance.toFixed(2)}</p>
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
              {ads.length === 0 ? (
                <p>No ads available. Add a new ad!</p>
              ) : (
                ads.map((ad) => (
                  <div key={ad.ad_id} className="flex justify-between items-center mb-2">
                    <span>{ad.posting_date} - ${ad.price}</span>
                    <span>{ad.status}</span>
                    <Button onClick={() => handleDeleteAd(ad.ad_id)}>Delete</Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Chats</CardTitle>
            </CardHeader>
            <CardContent>
              {chats.length === 0 ? (
                <p>No active chats</p>
              ) : (
                <div className="space-y-4">
                  {chats.map((chat) => (
                    <Link 
                      href={`/chat/${chat.carId}`} 
                      key={chat.carId}
                      className="block p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{chat.carTitle}</h3>
                          <p className="text-sm text-gray-500">
                            Chatting with: {chat.buyerName}
                          </p>
                        </div>
                        {chat.lastMessage && (
                          <div className="text-sm text-gray-500">
                            <p>{chat.lastMessage.content}</p>
                            <p>{new Date(chat.lastMessage.timestamp).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
