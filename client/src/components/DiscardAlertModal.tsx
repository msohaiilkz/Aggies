import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import money from "../assets/4.png";

interface DiscardAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export default function DiscardAlertModal({
  isOpen,
  onClose,
  onSubmit,
}: DiscardAlertModalProps) {
  const [textNote, setTextNote] = useState("");

  if (!isOpen) return null;

  const canSubmit = textNote.trim().length > 0;

  const handleSubmit = () => {
    if (!textNote.trim()) return;
    onSubmit(textNote);
    handleClose();
  };

  const handleClose = () => {
    setTextNote("");
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
              Discarding Alert
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
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-3">
              Additional Note<span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Add your reason for discarding this alert..."
              value={textNote}
              onChange={(e) => setTextNote(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2 flex items-center space-x-2"
          >
            <span>Submit</span>
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <Check className="h-3 w-3 text-blue-600" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
