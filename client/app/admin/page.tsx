"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from '@/lib/apiClient';
interface User {
  id: number;
  name: string;
  email: string;
  isModerator: boolean;
}

interface Ad {
  id: number;
  title: string;
  userId: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    const fetchUsersAndAds = async () => {
      try {
      const usersResponse = await api('/users');
      const adsResponse = await api('/ads');
      
      if (!usersResponse.ok || !adsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const usersData: User[] = await usersResponse.json();
      const adsData: Ad[] = await adsResponse.json();

      setUsers(usersData);
      setAds(adsData);
      } catch (error) {
      console.error('Error fetching data:', error);
      }
    };

    fetchUsersAndAds();
  }, []);

  const handleAddModerator = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isModerator: true } : user
    );
    setUsers(updatedUsers);
    api(`/users/${userId}/makeModerator`, {
      method: 'POST',
    }).then(response => {
      if (!response.ok) {
      console.error('Failed to update user role');
      }
    }).catch(error => {
      console.error('Error updating user role:', error);
    });
  };

  const handleRemoveModerator = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isModerator: false } : user
    );
    setUsers(updatedUsers);
    api(`/users/${userId}/removeModerator`, {
      method: 'POST',
    }).then(response => {
      if (!response.ok) {
      console.error('Failed to update user role');
      }
    }).catch(error => {
      console.error('Error updating user role:', error);
    });
  };

  const handleBanUser = (userId: number) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);

    api(`/users/${userId}/ban`, {
      method: 'POST',
    }).then(response => {
      if (!response.ok) {
      console.error('Failed to ban user');
      }
    }).catch(error => {
      console.error('Error banning user:', error);
    });
  };

  const handleDeleteAd = (adId: number) => {
    const updatedAds = ads.filter(ad => ad.id !== adId);
    setAds(updatedAds);

    api(`/ads/${adId}`, {
      method: 'DELETE',
    }).then(response => {
      if (!response.ok) {
      console.error('Failed to delete ad');
      }
    }).catch(error => {
      console.error('Error deleting ad:', error);
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {users.map((user) => (
            <div key={user.id} className="flex justify-between items-center mb-2">
              <span>{user.name} - {user.email}</span>
              {user.isModerator ? (
                <Button onClick={() => handleRemoveModerator(user.id)}>Remove Moderator</Button>
              ) : (
                <Button onClick={() => handleAddModerator(user.id)}>Make Moderator</Button>
              )}
              <Button onClick={() => handleBanUser(user.id)}>Ban User</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ad Management</CardTitle>
        </CardHeader>
        <CardContent>
          {ads.map((ad) => (
            <div key={ad.id} className="flex justify-between items-center mb-2">
              <span>{ad.title}</span>
              <Button onClick={() => handleDeleteAd(ad.id)}>Delete Ad</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
