"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  user?: string;
}

export function DeleteConfirmationDialog({
  open,
  onConfirm,
  onCancel,
  user = "item",
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrashIcon className="w-5 h-5 text-red-500" />
            Delete Confirmation
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {user}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
