import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Ban, Pause, X, MessageSquare, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface InvestigationModalProps {
  alertId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InvestigationModal({
  alertId,
  isOpen,
  onClose,
}: InvestigationModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alert, isLoading: alertLoading } = useQuery({
    queryKey: ["/api/alerts", alertId],
    enabled: !!alertId,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/alerts", alertId, "transactions"],
    enabled: !!alertId,
  });

  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ["/api/alerts", alertId, "notes"],
    enabled: !!alertId,
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["/api/audit-logs", { alertId }],
    enabled: !!alertId,
  });

  const markAsFraudMutation = useMutation({
    mutationFn: async (data: {
      investigationNotes: string;
      fraudType: string;
      lossAmount: number;
    }) => {
      return await apiRequest(
        "POST",
        `/api/alerts/${alertId}/mark-fraud`,
        data,
      );
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Alert marked as fraud successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAlertMutation = useMutation({
    mutationFn: async (status: string) => {
      return await apiRequest("PATCH", `/api/alerts/${alertId}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Alert status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (noteText: string) => {
      return await apiRequest("POST", `/api/alerts/${alertId}/notes`, {
        note: noteText,
        noteType: "TEXT",
      });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Note added successfully" });
      queryClient.invalidateQueries({
        queryKey: ["/api/alerts", alertId, "notes"],
      });
      setNote("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "bg-red-500 text-white";
      case "MEDIUM":
        return "bg-amber-500 text-white";
      case "LOW":
        return "bg-green-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "bg-red-100 text-red-800";
    if (score >= 50) return "bg-amber-100 text-amber-800";
    return "bg-green-100 text-green-800";
  };

  const handleMarkAsFraud = () => {
    if (!note.trim()) {
      toast({
        title: "Error",
        description: "Please add investigation notes before marking as fraud",
        variant: "destructive",
      });
      return;
    }

    markAsFraudMutation.mutate({
      investigationNotes: note,
      fraudType: "Unknown", // This could be a selection in a full implementation
      lossAmount: Number(alert?.amount || 0),
    });
  };

  const handleSuspend = () => {
    updateAlertMutation.mutate("SUSPENDED");
  };

  const handleDismiss = () => {
    updateAlertMutation.mutate("DISMISSED");
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    addNoteMutation.mutate(note);
  };

  if (!alert) return null;

  // Generate AI recommendation based on alert data
  const aiRecommendation = {
    probability: alert.riskScore || 87,
    summary:
      "Multiple high-value transactions to new beneficiaries within short time frame. Pattern consistent with account takeover fraud.",
    action:
      alert.riskScore && alert.riskScore > 80
        ? "MARK AS FRAUD"
        : "REQUIRES INVESTIGATION",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-hidden"
        data-testid="modal-investigation"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <DialogTitle className="text-xl font-semibold">
              Alert Investigation
            </DialogTitle>
            <Badge
              className={`${getSeverityColor(alert.severity)} text-xs font-medium`}
            >
              {alert.severity} SEVERITY
            </Badge>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" data-testid="tab-overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="transactions" data-testid="tab-transactions">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-notes">
                Notes
              </TabsTrigger>
              <TabsTrigger value="audit" data-testid="tab-audit">
                Audit Trail
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Profile */}
                <Card data-testid="card-customer-profile">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">
                      Customer Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Name:</span>
                      <span className="font-medium text-slate-900">
                        {alert.customer?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">SIF Number:</span>
                      <span className="font-mono text-slate-900">
                        {alert.customer?.globalId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Phone:</span>
                      <span className="text-slate-900">
                        {alert.customer?.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Email:</span>
                      <span className="text-slate-900">
                        {alert.customer?.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Customer Since:</span>
                      <span className="text-slate-900">
                        {alert.customer?.customerSince
                          ? new Date(
                              alert.customer.customerSince,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">City:</span>
                      <span className="text-slate-900">
                        {alert.customer?.city || alert.city}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendation */}
                <Card
                  className="bg-blue-50"
                  data-testid="card-ai-recommendation"
                >
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">
                      AI Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {aiRecommendation.probability}%
                      </div>
                      <div className="text-sm text-slate-600">
                        Fraud Probability
                      </div>
                    </div>
                    <div className="text-sm text-slate-700">
                      {aiRecommendation.summary}
                    </div>
                    <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-red-800">
                        Suggested Action:
                      </div>
                      <div className="text-sm text-red-700">
                        {aiRecommendation.action}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card data-testid="card-recent-transactions">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="text-center py-4">
                      Loading transactions...
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Channel</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Risk Score</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          ?.slice(0, 5)
                          .map((txn: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-sm">
                                {new Date(txn.timestamp).toLocaleTimeString()}
                              </TableCell>
                              <TableCell>{txn.channel}</TableCell>
                              <TableCell className="font-semibold">
                                PKR {Number(txn.amount).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${getRiskScoreColor(txn.riskScore || 0)} text-xs font-medium`}
                                >
                                  {txn.riskScore || 0}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    txn.status === "FLAGGED"
                                      ? "destructive"
                                      : "default"
                                  }
                                  className="text-xs"
                                >
                                  {txn.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )) || (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-slate-500"
                            >
                              No transactions found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card data-testid="card-all-transactions">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    All Related Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="text-center py-8">
                      Loading transactions...
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Channel</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Risk Score</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions?.map((txn: any, index: number) => (
                          <TableRow
                            key={index}
                            data-testid={`row-transaction-${index}`}
                          >
                            <TableCell className="font-mono text-sm">
                              {new Date(txn.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell>{txn.channel}</TableCell>
                            <TableCell className="font-semibold">
                              PKR {Number(txn.amount).toLocaleString()}
                            </TableCell>
                            <TableCell>{txn.transactionCategory}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${getRiskScoreColor(txn.riskScore || 0)} text-xs font-medium`}
                              >
                                {txn.riskScore || 0}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  txn.status === "FLAGGED"
                                    ? "destructive"
                                    : "default"
                                }
                                className="text-xs"
                              >
                                {txn.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )) || (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center text-slate-500"
                            >
                              No transactions found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card data-testid="card-investigation-notes">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Investigation Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add your investigation notes here..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={4}
                      data-testid="textarea-investigation-note"
                    />
                    <Button
                      onClick={handleAddNote}
                      disabled={!note.trim() || addNoteMutation.isPending}
                      data-testid="button-add-note"
                    >
                      {addNoteMutation.isPending ? "Adding..." : "Add Note"}
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notesLoading ? (
                      <div className="text-center py-4">Loading notes...</div>
                    ) : notes?.length > 0 ? (
                      notes.map((note: any, index: number) => (
                        <div
                          key={index}
                          className="bg-slate-50 rounded-lg p-3"
                          data-testid={`note-item-${index}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-900">
                              {note.user?.firstName} {note.user?.lastName}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">{note.note}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-slate-500 py-4">
                        No investigation notes yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              <Card data-testid="card-audit-trail">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Audit Trail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {auditLogs?.length > 0 ? (
                      auditLogs.map((log: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-slate-100"
                          data-testid={`audit-log-${index}`}
                        >
                          <div>
                            <span className="text-sm font-medium text-slate-900">
                              {log.action.replace("_", " ")}
                            </span>
                            <div className="text-xs text-slate-500">
                              by {log.user?.firstName} {log.user?.lastName}
                            </div>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-slate-500 py-4">
                        No audit trail available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 bg-slate-50 -mx-6 -mb-6 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleMarkAsFraud}
              disabled={markAsFraudMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-mark-fraud"
            >
              <Ban className="h-4 w-4 mr-2" />
              {markAsFraudMutation.isPending
                ? "Processing..."
                : "Mark as Fraud"}
            </Button>
            <Button
              onClick={handleSuspend}
              disabled={updateAlertMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              data-testid="button-suspend"
            >
              <Pause className="h-4 w-4 mr-2" />
              Suspend
            </Button>
            <Button
              onClick={handleDismiss}
              disabled={updateAlertMutation.isPending}
              variant="outline"
              data-testid="button-dismiss"
            >
              <X className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" data-testid="button-voice-note">
              <Mic className="h-4 w-4 mr-2" />
              Voice Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
