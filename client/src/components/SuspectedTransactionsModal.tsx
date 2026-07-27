import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SuspectedTransactionsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const transactions = [
    { id: "TXN-88213", customer: "Kelvin Harris", channel: "FT-Raast", date: "10-Jan-2025", amount: "PKR 156,000", risk: "High" },
    { id: "TXN-88219", customer: "Obaid Mehmood", channel: "IBFT", date: "09-Jan-2025", amount: "PKR 15,000", risk: "Medium" },
    { id: "TXN-88224", customer: "Ayesha Khan", channel: "ATM-On-Us", date: "07-Jan-2025", amount: "PKR 95,000", risk: "High" },
    { id: "TXN-88231", customer: "Fahad Mustafa", channel: "Withdrawal", date: "05-Jan-2025", amount: "PKR 500,000", risk: "High" },
    { id: "TXN-88240", customer: "Zainab Ali", channel: "ATM-Of-Us", date: "06-Jan-2025", amount: "PKR 50,000", risk: "Medium" },
    { id: "TXN-88256", customer: "Salman Ahmed", channel: "E-Commerce", date: "09-Jan-2025", amount: "PKR 171,450", risk: "High" },
  ];

  const riskColor = (r: string) =>
    r === "High"
      ? "text-red-600"
      : r === "Medium"
        ? "text-amber-600"
        : "text-emerald-600";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Suspected Transactions</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                  <TableCell>{txn.customer}</TableCell>
                  <TableCell>{txn.channel}</TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>{txn.amount}</TableCell>
                  <TableCell className={`font-medium ${riskColor(txn.risk)}`}>
                    {txn.risk}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
