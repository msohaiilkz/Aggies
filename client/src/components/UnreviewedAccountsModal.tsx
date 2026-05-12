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

export function UnreviewedAccountsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const transactions = [
    {
      id: "TXN001",
      account: "John Doe",
      date: "2024-01-20",
      amount: "PKR 50,000",
      status: "Unreviewed",
    },
    {
      id: "TXN002",
      account: "Jane Smith",
      date: "2024-01-21",
      amount: "PKR 120,000",
      status: "Unreviewed",
    },
    {
      id: "TXN003",
      account: "Alice Johnson",
      date: "2024-01-22",
      amount: "PKR 35,000",
      status: "Unreviewed",
    },
    {
      id: "TXN004",
      account: "Bob Brown",
      date: "2024-01-22",
      amount: "PKR 85,000",
      status: "Unreviewed",
    },
    {
      id: "TXN005",
      account: "Charlie Davis",
      date: "2024-01-23",
      amount: "PKR 200,000",
      status: "Unreviewed",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Unreviewed Transactions</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>{txn.id}</TableCell>
                  <TableCell>{txn.account}</TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>{txn.amount}</TableCell>
                  <TableCell className="text-yellow-600 font-medium">
                    {txn.status}
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
