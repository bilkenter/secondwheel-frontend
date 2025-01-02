import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChatRoom from './ChatRoom';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId: string;
  sellerId: string;
  currentUserId: string;
  carTitle: string;
}

export default function ChatModal({
  isOpen,
  onClose,
  carId,
  sellerId,
  currentUserId,
  carTitle,
}: ChatModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chat with Seller</DialogTitle>
        </DialogHeader>
        <ChatRoom
          carId={carId}
          sellerId={sellerId}
          currentUserId={currentUserId}
          carTitle={carTitle}
        />
      </DialogContent>
    </Dialog>
  );
} 