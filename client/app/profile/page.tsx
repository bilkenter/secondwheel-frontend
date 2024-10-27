"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from '@/lib/apiClient';
interface Car {
  id: number;
  title: string;
  price: number;
  isSold: boolean;
}

interface User {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [user, setUser] = useState<User>({ name: '', email: '' });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    // Fetch user data and car listings
  const fetchUserData = async () => {
    const userResponse = await api('/user');
    const userData = await userResponse.json();
    setUser(userData);

    const carsResponse = await api('/cars');
    const carsData = await carsResponse.json();
    setCars(carsData);
  };

  fetchUserData();
  }, []);

  const handleAddCar = () => {
    const newCar: Car = {
      id: cars.length + 1, // backendde id logic gelistirilecek.
      title: 'New Car', // inputtan gelen dynamic degerle degistirilcek.
      price: 0, // inputtan gelen dynamic degerle degistirilcek.
      isSold: false,
    };
    setCars([...cars, newCar]);
  };

  const handleDeleteCar = (carId: number) => {
    setCars(cars.filter(car => car.id !== carId));
  };

  const handleUpdateUser = () => {
    const updateUser = async () => {
      const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
      });

      if (response.ok) {
      const updatedUser = await response.json();
      setUser(updatedUser);
      alert('User updated successfully');
      } else {
      alert('Failed to update user');
      }
    };

    updateUser();
  };

  const handleChangePassword = () => {
    const changePassword = async () => {
      const response = await fetch('/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
      alert('Password changed successfully');
      setNewPassword('');
      } else {
      alert('Failed to change password');
      }
    };

    changePassword();
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
            onChange={(e) => setUser({...user, name: e.target.value})}
            placeholder="Name"
            className="mb-2"
          />
          <Input 
            value={user.email} 
            onChange={(e) => setUser({...user, email: e.target.value})}
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
          <Button onClick={handleChangePassword} className="ml-2">Change Password</Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Car Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAddCar}>Add New Car</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Car Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {cars.map((car) => (
            <div key={car.id} className="flex justify-between items-center mb-2">
              <span>{car.title} - ${car.price}</span>
              <span>{car.isSold ? 'Sold' : 'Available'}</span>
              <Button onClick={() => handleDeleteCar(car.id)}>Delete</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
