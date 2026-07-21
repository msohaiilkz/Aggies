import { useState } from "react";
import { useLocation } from "wouter";
import { KeyRound, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-10 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  const [, setLocation] = useLocation();
  const { changePassword } = useAuth();
  const { toast } = useToast();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      toast({
        title: "Passwords don't match",
        description: "New Password and Confirm New Password must be the same.",
        variant: "destructive",
      });
      return;
    }
    const err = changePassword(current, next);
    if (err) {
      toast({ title: "Couldn't change password", description: err, variant: "destructive" });
      return;
    }
    toast({
      title: "Password changed ✅",
      description: "Your password has been updated. Use it next time you log in.",
    });
    setCurrent("");
    setNext("");
    setConfirm("");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center">
            <KeyRound className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Change Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordField
            label="Current Password"
            value={current}
            onChange={setCurrent}
            placeholder="Enter your current password"
          />

          {/* Requirements */}
          <div className="rounded-lg bg-blue-50/60 border border-blue-100 p-4 flex gap-3">
            <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <ul className="text-xs text-blue-800 space-y-1 list-disc pl-4">
              <li>12–128 characters</li>
              <li>Passphrases and spaces are allowed</li>
              <li>Cannot be empty or only whitespace</li>
              <li>Avoid common words, sequences, or reused placeholders</li>
            </ul>
          </div>

          <PasswordField
            label="New Password"
            value={next}
            onChange={setNext}
            placeholder="Enter a new password"
          />
          <PasswordField
            label="Confirm New Password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Re-enter the new password"
          />

          <div className="flex items-center gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold"
            >
              Change password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
