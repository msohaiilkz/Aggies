import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Check, Mic, Square, Trash2 } from "lucide-react";
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
  const [noteMode, setNoteMode] = useState<"comment" | "voice">("comment");
  const [textNote, setTextNote] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);

  if (!isOpen) return null;

  // Either a comment OR a voice note is required (analyst picks one).
  const hasNote = textNote.trim().length > 0 || voiceRecorded;

  const canSubmit = !!fraudType && !!contactStatus && hasNote;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const data = {
      fraudType,
      fraudReason,
      contactStatus,
      note: textNote,
      voiceNote: voiceRecorded,
      voiceSeconds,
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

          {/* Comment OR Voice Note — tabbed (analyst picks one) */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Comments / Investigation Notes
              <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Choose a comment <strong>or</strong> a voice note — one is
              required.
            </p>

            {/* Tabs */}
            <div className="inline-flex rounded-lg bg-gray-100 p-1 mb-3">
              <button
                type="button"
                onClick={() => setNoteMode("comment")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  noteMode === "comment"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Comment
              </button>
              <button
                type="button"
                onClick={() => setNoteMode("voice")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  noteMode === "voice"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Mic className="h-3.5 w-3.5" />
                Voice Note
              </button>
            </div>

            {/* Comment tab */}
            {noteMode === "comment" && (
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Add your investigation notes here..."
                value={textNote}
                onChange={(e) => setTextNote(e.target.value)}
              />
            )}

            {/* Voice tab */}
            {noteMode === "voice" && (
              <div>
                {!voiceRecorded && !isRecording && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecording(true);
                      setVoiceSeconds(0);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Mic className="h-4 w-4 text-red-500" />
                    Record Voice Note
                  </button>
                )}

                {isRecording && (
                  <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                      Recording… voice note
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecording(false);
                        setVoiceRecorded(true);
                        setVoiceSeconds(12); // demo duration
                      }}
                      className="flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      <Square className="h-3 w-3" />
                      Stop
                    </button>
                  </div>
                )}

                {voiceRecorded && !isRecording && (
                  <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-2.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                      <Mic className="h-4 w-4" />
                      Voice note recorded ({voiceSeconds}s)
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVoiceRecorded(false);
                        setVoiceSeconds(0);
                      }}
                      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
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
