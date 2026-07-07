import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Check, PhoneCall, PhoneOff } from "lucide-react";
import money from "../assets/4.png";

interface MarkFalsePositiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    connection: "connected" | "not_connected";
    note: string;
  }) => void;
}

export default function MarkFalsePositiveModal({
  isOpen,
  onClose,
  onSubmit,
}: MarkFalsePositiveModalProps) {
  const [connection, setConnection] = useState<
    "connected" | "not_connected" | ""
  >("");
  const [textNote, setTextNote] = useState("");

  if (!isOpen) return null;

  const isNotConnected = connection === "not_connected";
  // A connection must be chosen and a note added before submitting.
  const canSubmit = connection !== "" && textNote.trim().length > 0;

  const handleSubmit = () => {
    if (!connection || !textNote.trim()) return;
    onSubmit({ connection, note: textNote });
    handleClose();
  };

  const handleClose = () => {
    setConnection("");
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
              Marking Alert as False Positive
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
          {/* Connection status */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-3">
              Was the customer contacted?
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConnection("connected")}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                  connection === "connected"
                    ? "border-green-500 bg-green-50 ring-2 ring-green-500/20"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    connection === "connected"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Connected
                  </p>
                  <p className="text-xs text-gray-500">Customer was reached</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConnection("not_connected")}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                  connection === "not_connected"
                    ? "border-red-500 bg-red-50 ring-2 ring-red-500/20"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    connection === "not_connected"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <PhoneOff className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Not Connected
                  </p>
                  <p className="text-xs text-gray-500">
                    Could not reach customer
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Contextual info banner */}
          {connection === "connected" && (
            <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-sm text-green-700">
              Customer confirmed the activity is legitimate. The alert will be
              resolved as a false positive.
            </div>
          )}
          {isNotConnected && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              Customer could not be reached. The alert will be escalated and
              marked as fraud.
            </div>
          )}

          {/* Additional note — shown for both connection states */}
          {connection !== "" && (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-3">
                Additional Note<span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Add your notes here..."
                value={textNote}
                onChange={(e) => setTextNote(e.target.value)}
              />
            </div>
          )}
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
