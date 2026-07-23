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
import { NoteInput, type NoteState } from "./NoteInput";
import money from "../assets/4.png";

// Client's "Fraud Types" sheet — each type with its common fraud reasons.
const FRAUD_TYPES: { type: string; reasons: string[] }[] = [
  {
    type: "Account Takeover (ATO)",
    reasons: ["Unauthorized Login", "Credential Compromise"],
  },
  {
    type: "Unauthorized Funds Transfer",
    reasons: ["Customer Did Not Authorize Transfer"],
  },
  { type: "SIM Swap Fraud", reasons: ["SIM Swapped Before Transaction"] },
  {
    type: "Phishing / Credential Theft",
    reasons: ["Fake Call (Bank Impersonation)", "Fake SMS", "Fake Website"],
  },
  { type: "OTP Fraud", reasons: ["Customer Shared OTP", "OTP Compromised"] },
  {
    type: "Social Engineering Scam",
    reasons: [
      "Bank Staff Impersonation",
      "Investment Scam",
      "Prize/Lottery Scam",
    ],
  },
  {
    type: "Remote Access / Malware Fraud",
    reasons: ["AnyDesk/TeamViewer Installed", "Malware Infection"],
  },
  {
    type: "Device Change Fraud",
    reasons: ["New Device Registered Before Transaction"],
  },
  { type: "Other", reasons: [] }, // Specify in Comments
];

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
  const [fraudReason, setFraudReason] = useState("");
  const [contactStatus, setContactStatus] = useState("");
  const [note, setNote] = useState<NoteState>({
    mode: "comment",
    text: "",
    voiceRecorded: false,
    voiceSeconds: 0,
    hasNote: false,
  });

  if (!isOpen) return null;

  // fraud type + contact status + a comment OR voice note are all required.
  const canSubmit = !!fraudType && !!contactStatus && note.hasNote;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const data = {
      fraudType,
      fraudReason,
      contactStatus,
      note: note.text,
      voiceNote: note.voiceRecorded,
      voiceSeconds: note.voiceSeconds,
    };
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
            <Select
              value={fraudType}
              onValueChange={(v) => {
                setFraudType(v);
                setFraudReason("");
              }}
            >
              <SelectTrigger className="w-full border-gray-300 rounded-lg h-11 px-3">
                <SelectValue placeholder="Choose a type from here..." />
              </SelectTrigger>
              <SelectContent>
                {FRAUD_TYPES.map((t) => (
                  <SelectItem key={t.type} value={t.type}>
                    {t.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          {/* Customer Contact Status */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Customer Contact Status<span className="text-red-500">*</span>
            </label>
            <Select value={contactStatus} onValueChange={setContactStatus}>
              <SelectTrigger className="w-full border-gray-300 rounded-lg h-11 px-3">
                <SelectValue placeholder="Choose the contact status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="attempted-no-response">
                  Attempted – No Response
                </SelectItem>
                <SelectItem value="not-contacted">Not Contacted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Comment OR Voice Note (shared component, live timer) */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Comments / Investigation Notes
              <span className="text-red-500">*</span>
            </label>
            <NoteInput onChange={setNote} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4  flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
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
