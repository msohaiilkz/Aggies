import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Check, Clock } from "lucide-react";
import money from "../assets/4.png";

interface MovePendingContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { contactAttempt: string; comments: string }) => void;
}

export default function MovePendingContactModal({
  isOpen,
  onClose,
  onSubmit,
}: MovePendingContactModalProps) {
  const [contactAttempt, setContactAttempt] = useState("");
  const [comments, setComments] = useState("");

  if (!isOpen) return null;

  const canSubmit = contactAttempt !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ contactAttempt, comments });
    handleClose();
  };

  const handleClose = () => {
    setContactAttempt("");
    setComments("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFFFFF66] to-[#3A59D1CC] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center relative">
              <img src={money} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Move to Pending Customer Contact
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-500 -mt-1">
            Select this option if the customer did not pick up the call.
          </p>

          {/* Contact Attempt */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Contact Attempt<span className="text-red-500">*</span>
            </label>
            <Select value={contactAttempt} onValueChange={setContactAttempt}>
              <SelectTrigger className="w-full border-gray-300 rounded-lg h-11 px-3">
                <SelectValue placeholder="Choose the number of attempts..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one">One Attempt</SelectItem>
                <SelectItem value="two">Two Attempt</SelectItem>
                <SelectItem value="three">Three Attempt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Comments
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Add your comments here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          {/* Behaviour note */}
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800 flex gap-2">
            <Clock className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              The alert moves to the <strong>Pending Contact</strong> queue and
              is requeued after <strong>30 minutes</strong>. If you are still
              online it returns to you (and the Executive is notified); if you
              are logged out it moves to the Open Queue and the Executive is
              alerted.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2 flex items-center space-x-2"
          >
            <span>Move to Pending Customer Contact</span>
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <Check className="h-3 w-3 text-blue-600" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
