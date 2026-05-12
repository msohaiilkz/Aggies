import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Loader2, ShieldCheck, Mail, Lock, Clock } from "lucide-react";
import { addAnalyst } from "@/hooks/use-analysts";
import { useAuth } from "@/hooks/use-auth";

export function CreateAnalystModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "Junior Analyst",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      addAnalyst({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        username: formData.username,
        email: formData.email || undefined,
        role: formData.role,
        status: "Pending",           // ← Always starts as Pending
        createdBy: user?.email || "executive",
      });

      setIsLoading(false);
      toast({
        title: "Analyst Account Created",
        description: `${formData.firstName} ${formData.lastName} added with Pending status. Awaiting Super Admin activation.`,
      });
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        role: "Junior Analyst",
      });
      onCreated?.();
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-[#46CDCF] text-white rounded-lg">
              <UserPlus className="h-5 w-5" />
            </div>
            Create Analyst Account
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-1.5">
            Register a new analyst to the platform. The account will be{" "}
            <strong>pending</strong> until a Super Admin activates it.
          </DialogDescription>
        </DialogHeader>

        {/* Pending status notice */}
        <div className="bg-amber-50 p-3 rounded-lg flex items-start gap-3 border border-amber-200 mt-1">
          <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong>Activation Required:</strong> New analysts are set to{" "}
            <strong>Pending</strong> by default. A Super Admin must activate
            the account before the analyst can access the system.
          </div>
        </div>

        <div className="bg-blue-50/50 p-3 rounded-lg flex items-start gap-3 border border-blue-100">
          <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs text-blue-800 leading-relaxed">
            <strong>Security Note:</strong> Passwords must be at least 8
            characters. Use{" "}
            <em>Junior Analyst</em> role for initial onboarding.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">First Name</label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Last Name</label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe_analyst"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email (optional)</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@company.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Role</label>
            <Select
              value={formData.role}
              onValueChange={(val) => setFormData({ ...formData, role: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Junior Analyst">Junior Analyst</SelectItem>
                <SelectItem value="Senior Analyst">Senior Analyst</SelectItem>
                <SelectItem value="Risk Specialist">Risk Specialist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="pl-10"
                required
                minLength={8}
              />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#46CDCF] hover:bg-[#3db8ba] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
