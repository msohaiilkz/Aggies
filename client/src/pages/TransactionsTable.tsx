import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";

const transactions = [
  {
    account: "MZ00923172131231",
    customer: "Kelvin Harris",
    globalId: "P4366918NC140",
    idType: "Passport",
    transactionId: "MZ00923172131231",
    type: "IBFT",
    date: "16 Apr, 2025",
    time: "7:59 AM",
  },
  {
    account: "HBPK230120311231",
    customer: "Obaid Mehmood",
    globalId: "P4366918NC140",
    idType: "Passport",
    transactionId: "HBPK230120311231",
    type: "IBFT",
    date: "16 Apr, 2025",
    time: "7:59 AM",
  },
  {
    account: "HBPK67568683341",
    customer: "Abid Ali",
    globalId: "42301-26920823-3",
    idType: "CNIC",
    transactionId: "HBPK67568683341",
    type: "Bill Payment",
    date: "16 Apr, 2025",
    time: "7:59 AM",
  },
  {
    account: "HBPK67568683341",
    customer: "Obaid Mehmood",
    globalId: "P4366918NC140",
    idType: "Passport",
    transactionId: "HBPK230120311231",
    type: "Credit Card Payment",
    date: "16 Apr, 2025",
    time: "7:59 AM",
  },
  {
    account: "HBPK230120311231",
    customer: "Abid Ali",
    globalId: "42301-26920823-3",
    idType: "CNIC",
    transactionId: "HBPK67568683341",
    type: "IBFT",
    date: "16 Apr, 2025",
    time: "7:59 AM",
  },
];

export default function TransactionsTable() {
  return (
    <MainLayout title="Transactions">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Transactions</h1>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            {/* Filters Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Input
                placeholder="Search by global id"
                className="text-sm border-gray-300"
              />
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Pick a date range"
                  className="pl-9 text-sm border-gray-300"
                />
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <Select>
                <SelectTrigger className="text-sm border-gray-300">
                  <SelectValue placeholder="Choose from here" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="karachi">Karachi</SelectItem>
                  <SelectItem value="lahore">Lahore</SelectItem>
                  <SelectItem value="islamabad">Islamabad</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="text-sm border-gray-300">
                  <SelectValue placeholder="Choose from here" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upto10k">Up to 10,000 PKR</SelectItem>
                  <SelectItem value="upto50k">Up to 50,000 PKR</SelectItem>
                  <SelectItem value="upto100k">Up to 100,000 PKR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600 font-medium">
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3">Account Number</th>
                    <th className="px-4 py-3">Customer Name</th>
                    <th className="px-4 py-3">SIF Number</th>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Transaction Type</th>
                    <th className="px-4 py-3">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-900">{t.account}</td>
                      <td className="px-4 py-3 text-gray-900">{t.customer}</td>
                      <td className="px-4 py-3 text-gray-900">
                        <div className="font-medium">{t.globalId}</div>
                        <div className="text-xs text-gray-500">
                          ID Type: {t.idType}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {t.transactionId}
                      </td>
                      <td className="px-4 py-3 text-gray-900">{t.type}</td>
                      <td className="px-4 py-3 text-gray-900">
                        {t.date}
                        <div className="text-xs text-gray-500">{t.time}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
