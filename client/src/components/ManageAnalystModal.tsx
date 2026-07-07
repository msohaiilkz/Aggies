import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserCog, Loader2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { type Analyst } from "@/hooks/use-analysts";
import { addRequest } from "@/hooks/use-analyst-requests";
import { useAuth } from "@/hooks/use-auth";

export function ManageAnalystModal({
  isOpen,
  onClose,
  analyst,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  analyst: Analyst | null;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ role: "", status: "" });

  useEffect(() => {
    if (analyst) {
      setFormData({ role: analyst.role, status: analyst.status });
    }
  }, [analyst]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analyst) return;
    setIsLoading(true);

    setTimeout(() => {
      // Executive can only REQUEST a role/status change — Super Admin approves.
      addRequest({
        type: "ROLE_UPDATE",
        requestedBy: user?.email || "executive",
        analystId: analyst.id,
        analystName: analyst.name,
        newRole: formData.role,
        newStatus: formData.status as Analyst["status"],
      });
      setIsLoading(false);
      toast({
        title: "Request Sent for Approval",
        description: `Role/status change for ${analyst.name} has been sent to the Super Admin for approval.`,
      });
      onUpdate();
      onClose();
    }, 1000);
  };

  const handleRemove = () => {
    if (!analyst) return;
    // Executive can only REQUEST removal — Super Admin approves.
    addRequest({
      type: "REMOVE",
      requestedBy: user?.email || "executive",
      analystId: analyst.id,
      analystName: analyst.name,
    });
    toast({
      title: "Removal Request Sent",
      description: `Request to remove ${analyst.name} has been sent to the Super Admin for approval.`,
    });
    onUpdate();
    onClose();
  };

  if (!analyst) return null;

  const statusIcon = {
    Active: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    Pending: <Clock className="w-4 h-4 text-amber-500" />,
    Inactive: <XCircle className="w-4 h-4 text-gray-400" />,
  }[analyst.status];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-blue-600" />
            Manage Analyst
          </DialogTitle>
        </DialogHeader>

        {/* Analyst info card */}
        <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3 border border-slate-100">
          <div className="w-11 h-11 bg-[#46CDCF]/20 text-[#2a9a9c] font-bold rounded-full flex items-center justify-center text-base shrink-0">
            {analyst.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{analyst.name}</p>
            <p className="text-xs text-gray-500 font-mono">@{analyst.username}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
            {statusIcon}
            {analyst.status}
          </div>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg flex items-start gap-3 border border-amber-200">
          <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong>Approval Required:</strong> Changes and removals are{" "}
            <strong>requests</strong> only. A Super Admin must approve them
            before they take effect.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div className="space-y-2">
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Account Status</label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData({ ...formData, status: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive (Suspended)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4 flex justify-between sm:justify-between w-full">
            <Button
              type="button"
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleRemove}
              disabled={isLoading}
            >
              Request Removal
            </Button>
            <div className="flex gap-2">
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
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Request Change"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
