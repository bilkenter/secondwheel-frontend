"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from '@/lib/apiClient';

interface Vehicle {
  id: number;
  title: string;
  vehicleType: string;
  price: number;
  status: string; // e.g., "Available" or "Sold"
}

interface User {
  name: string;
  email: string;
  type: string; // "buyer" or "seller"
}

export default function ProfilePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [user, setUser] = useState<User>({ name: '', email: '', type: 'seller' });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userResponse = await api('/user');
      const userData = await userResponse.json();
      setUser(userData);

      if (userData.type === 'seller') {
        const vehiclesResponse = await api('/vehicles');
        const vehiclesData = await vehiclesResponse.json();
        setVehicles(vehiclesData);
      }
    };

    fetchUserData();
  }, []);

  const handleAddVehicle = () => {
    const newVehicle: Vehicle = {
      id: vehicles.length + 1, // ID logic will be updated in the backend.
      title: 'New Vehicle',    // Placeholder for input value.
      vehicleType: 'Car',      // Placeholder for input value.
      price: 0,                // Placeholder for input value.
      status: 'Available',
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const handleDeleteVehicle = (vehicleId: number) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
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
          <Button onClick={handleChangePassword} className="ml-2">Change Password</Button>
        </CardContent>
      </Card>

      {user.type === 'seller' && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Vehicle Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleAddVehicle}>Add New Vehicle</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Vehicle Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex justify-between items-center mb-2">
                  <span>{vehicle.title} ({vehicle.vehicleType}) - ${vehicle.price}</span>
                  <span>{vehicle.status}</span>
                  <Button onClick={() => handleDeleteVehicle(vehicle.id)}>Delete</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
