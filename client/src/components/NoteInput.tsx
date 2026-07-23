import { useEffect, useRef, useState } from "react";
import { Mic, Square, Trash2 } from "lucide-react";

export interface NoteState {
  mode: "comment" | "voice";
  text: string;
  voiceRecorded: boolean;
  voiceSeconds: number;
  hasNote: boolean; // comment text OR a recorded voice note
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Comment OR Voice note input with a live recording timer (WhatsApp-style —
 * counts up from 0:00 in real time). Shared by the Fraud / Pending / Not Fraud
 * modals so the behaviour and validation are identical everywhere.
 */
export function NoteInput({
  onChange,
  required = true,
}: {
  onChange: (n: NoteState) => void;
  required?: boolean;
}) {
  const [mode, setMode] = useState<"comment" | "voice">("comment");
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live timer: tick every second while recording.
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(
        () => setVoiceSeconds((s) => s + 1),
        1000,
      );
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Bubble the current note state up to the parent whenever it changes.
  useEffect(() => {
    onChange({
      mode,
      text,
      voiceRecorded,
      voiceSeconds,
      hasNote: text.trim().length > 0 || voiceRecorded,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, text, voiceRecorded, voiceSeconds]);

  return (
    <div>
      {/* Tabs */}
      <div className="inline-flex rounded-lg bg-gray-100 p-1 mb-3">
        <button
          type="button"
          onClick={() => setMode("comment")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "comment"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Comment
        </button>
        <button
          type="button"
          onClick={() => setMode("voice")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "voice"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Mic className="h-3.5 w-3.5" />
          Voice Note
        </button>
      </div>

      {/* Comment tab */}
      {mode === "comment" && (
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Add your notes here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {/* Voice tab */}
      {mode === "voice" && (
        <div>
          {!voiceRecorded && !isRecording && (
            <button
              type="button"
              onClick={() => {
                setVoiceSeconds(0);
                setIsRecording(true);
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
                Recording…
                <span className="font-mono tabular-nums text-red-600">
                  {fmt(voiceSeconds)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRecording(false);
                  setVoiceRecorded(true);
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
                Voice note recorded · {fmt(voiceSeconds)}
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

      {required && (
        <p className="text-xs text-gray-400 mt-2">
          A comment <strong>or</strong> a voice note is required.
        </p>
      )}
    </div>
  );
}
