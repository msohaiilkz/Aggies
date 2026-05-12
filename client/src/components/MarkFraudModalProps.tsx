import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Check } from "lucide-react";
import money from "../assets/4.png";
interface MarkFraudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function MarkFraudModal({
  isOpen,
  onClose,
  onSubmit,
}: MarkFraudModalProps) {
  const [fraudType, setFraudType] = useState("");
  const [reason, setReason] = useState("");
  const [noteType, setNoteType] = useState("text");
  const [textNote, setTextNote] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const data = { fraudType, reason, noteType, note: textNote };
    onSubmit(data);
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
              Marking Transaction as Fraud
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Fraud Type */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Assign Fraud Type<span className="text-red-500">*</span>
            </label>
            <Select value={fraudType} onValueChange={setFraudType}>
              <SelectTrigger className="w-full border-gray-300 rounded-lg h-11 px-3">
                <SelectValue placeholder="Choose a type from here..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card-fraud">Card Fraud</SelectItem>
                <SelectItem value="identity-theft">Identity Theft</SelectItem>
                <SelectItem value="phishing">Phishing</SelectItem>
                <SelectItem value="money-laundering">
                  Money Laundering
                </SelectItem>
                <SelectItem value="account-takeover">
                  Account Takeover
                </SelectItem>
                <SelectItem value="synthetic-fraud">Synthetic Fraud</SelectItem>
                <SelectItem value="check-fraud">Check Fraud</SelectItem>
                <SelectItem value="wire-fraud">Wire Fraud</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Choose a Reason<span className="text-red-500">*</span>
            </label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full border-gray-300 rounded-lg h-11 px-3">
                <SelectValue placeholder="Choose a reason from here..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suspicious-activity">
                  Suspicious Activity Pattern
                </SelectItem>
                <SelectItem value="unauthorized-transaction">
                  Unauthorized Transaction
                </SelectItem>
                <SelectItem value="customer-complaint">
                  Customer Complaint
                </SelectItem>
                <SelectItem value="risk-score">High Risk Score</SelectItem>
                <SelectItem value="velocity-check">
                  Velocity Check Failed
                </SelectItem>
                <SelectItem value="blacklist-match">Blacklist Match</SelectItem>
                <SelectItem value="device-fingerprint">
                  Device Fingerprint Mismatch
                </SelectItem>
                <SelectItem value="geolocation">Unusual Geolocation</SelectItem>
                <SelectItem value="amount-threshold">
                  Amount Threshold Exceeded
                </SelectItem>
                <SelectItem value="manual-review">
                  Manual Review Decision
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-3">
              Additional Note
            </label>
            <div className="flex space-x-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                className={`rounded-full px-4 py-1 text-sm ${noteType === "text" ? "bg-gray-200" : ""}`}
                onClick={() => setNoteType("text")}
              >
                Text Note
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`rounded-full px-4 py-1 text-sm ${noteType === "voice" ? "bg-gray-200" : ""}`}
                onClick={() => setNoteType("voice")}
              >
                Voice Note
              </Button>
            </div>

            {noteType === "text" && (
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Add your notes here..."
                value={textNote}
                onChange={(e) => setTextNote(e.target.value)}
              />
            )}

            {noteType === "voice" && (
              <div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                <div className="mb-2 text-xl">🎤</div>
                <p className="text-sm">
                  Voice note recording feature would be here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4  flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!fraudType || !reason}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2 flex items-center space-x-2"
          >
            <span>Mark as Fraud</span>
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <Check className="h-3 w-3 text-gray-600" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
