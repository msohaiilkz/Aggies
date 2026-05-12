import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ForceCloseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, notes: string) => void;
  selectedCount: number;
}

export default function ForceCloseModal({
  isOpen,
  onClose,
  onSubmit,
  selectedCount,
}: ForceCloseModalProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (reason) {
      onSubmit(reason, notes);
      setReason("");
      setNotes("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Force Close Alerts</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-500">
            You are about to force close <strong>{selectedCount}</strong>{" "}
            selected alerts. This action requires a valid reason.
          </p>
          <div className="grid gap-2">
            <Label htmlFor="reason">Closure Reason</Label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false_positive">
                  False Positive (Bulk)
                </SelectItem>
                <SelectItem value="duplicate">Duplicate Alerts</SelectItem>
                <SelectItem value="system_error">
                  System Error / Glitch
                </SelectItem>
                <SelectItem value="administrative">
                  Administrative Closure
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional details..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reason}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Force Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
