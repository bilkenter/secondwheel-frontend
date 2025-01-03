"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from '@/lib/apiClient';

interface Ad {
  id: number;
  title: string;
  userId: number;
}

interface Report {
  id: number;
  adId: number;
  reason: string;
  date: string;
  status: 'pending' | 'valid' | 'invalid';
  userId: number;
}

interface User {
  id: number;
  username: string;
  email: string;
}

export default function ModeratorPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adsResponse, reportsResponse, usersResponse] = await Promise.all([
          api('/ads'),
          api('/reports'),
          api('/users')
        ]);

        if (!adsResponse.ok || !reportsResponse.ok || !usersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const adsData: Ad[] = await adsResponse.json();
        const reportsData: Report[] = await reportsResponse.json();
        const usersData: User[] = await usersResponse.json();

        setAds(adsData);
        setReports(reportsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleApproveReport = (reportId: number, adId: number, userId: number) => {
    api(`/reports/${reportId}/approve`, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to approve report');
        }
        setAds(prevAds => prevAds.filter(ad => ad.id !== adId)); 
        setReports(prevReports => prevReports.map(report => 
          report.id === reportId ? { ...report, status: 'valid' } : report
        ));
      })
      .catch(error => console.error('Error approving report:', error));
  };

  const handleRejectReport = (reportId: number) => {
    api(`/reports/${reportId}/reject`, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to reject report');
        }
        setReports(prevReports => prevReports.map(report => 
          report.id === reportId ? { ...report, status: 'invalid' } : report
        ));
      })
      .catch(error => console.error('Error rejecting report:', error));
  };

  const handleBanUser = (userId: number) => {
    api(`/users/${userId}/ban`, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to ban user');
        }
        setIsModalOpen(false); 
        setReports(prevReports => prevReports.filter(report => report.userId !== userId));
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      })
      .catch(error => console.error('Error banning user:', error));
  };

  const openBanModal = (userId: number) => {
    setUserToBan(userId);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Moderator Panel</h1>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.map(report => (
            <Card key={report.id} className="mb-4">
              <CardHeader>
                <CardTitle>Report #{report.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Reason:</strong> {report.reason}</p>
                <p><strong>Date:</strong> {report.date}</p>
                <p><strong>Status:</strong> {report.status}</p>

                {report.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button onClick={() => handleApproveReport(report.id, report.adId, report.userId)} className="mr-2">
                      Valid
                    </Button>
                    <Button onClick={() => handleRejectReport(report.id)}>
                      Invalid
                    </Button>
                  </div>
                )}

                {report.status === 'valid' && (
                  <Button onClick={() => openBanModal(report.userId)}>
                    Ban User
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {isModalOpen && userToBan && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3>Are you sure you want to ban this user?</h3>
            <div className="flex space-x-2 mt-4">
              <Button onClick={() => handleBanUser(userToBan)} className="bg-red-500 text-white">
                Yes, Ban User
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
