"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from '@/lib/apiClient';

interface User {
  id: number;
  name: string;
  email: string;
  isModerator: boolean;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await api('/users');
        
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const usersData: User[] = await usersResponse.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsers();
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
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
