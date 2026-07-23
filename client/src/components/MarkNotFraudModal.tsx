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

const EMPTY_NOTE: NoteState = {
  mode: "comment",
  text: "",
  voiceRecorded: false,
  voiceSeconds: 0,
  hasNote: false,
};

interface MarkNotFraudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { contactStatus: string; comments: string }) => void;
}

export default function MarkNotFraudModal({
  isOpen,
  onClose,
  onSubmit,
}: MarkNotFraudModalProps) {
  const [contactStatus, setContactStatus] = useState("");
  const [note, setNote] = useState<NoteState>(EMPTY_NOTE);

  if (!isOpen) return null;

  // Contact status + a comment OR voice note are both required.
  const canSubmit = contactStatus !== "" && note.hasNote;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ contactStatus, comments: note.text });
    handleClose();
  };

  const handleClose = () => {
    setContactStatus("");
    setNote(EMPTY_NOTE);
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
              Marking Alert as Not Fraud
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

          {/* Comment OR Voice note (required) */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Comments / Notes<span className="text-red-500">*</span>
            </label>
            <NoteInput onChange={setNote} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2 flex items-center space-x-2"
          >
            <span>Mark as Not Fraud</span>
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <Check className="h-3 w-3 text-green-600" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
