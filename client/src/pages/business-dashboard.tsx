import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/date-range-picker";

import { Download, ChevronDown, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import DownloadInsightsModal from "@/components/DownloadInsightsModal";
import { Wallet } from "lucide-react";
import { UnreviewedAccountsModal } from "@/components/UnreviewedAccountsModal";
import { NotContactedAlertsModal } from "@/components/NotContactedAlertsModal";

const trendData = [
  { month: "Nov", value: 20 },
  { month: "", value: 40 },
  { month: "", value: 35 },
  { month: "", value: 80 },
  { month: "", value: 65 },
  { month: "", value: 120 },
  { month: "", value: 100 },
  { month: "", value: 140 },
  { month: "", value: 130 },
  { month: "", value: 160 },
  { month: "Dec", value: 320 },
  { month: "", value: 240 },
  { month: "", value: 250 },
  { month: "", value: 200 },
  { month: "", value: 180 },
  { month: "", value: 210 },
  { month: "", value: 170 },
  { month: "", value: 160 },
  { month: "", value: 180 },
  { month: "", value: 150 },
  { month: "Jan", value: 140 },
  { month: "", value: 155 },
  { month: "", value: 150 },
  { month: "", value: 145 },
  { month: "", value: 160 },
  { month: "", value: 155 },
  { month: "", value: 170 },
  { month: "", value: 175 },
  { month: "", value: 180 },
  { month: "", value: 175 },
  { month: "Feb", value: 180 },
  { month: "", value: 175 },
  { month: "", value: 170 },
  { month: "", value: 160 },
  { month: "", value: 155 },
  { month: "", value: 170 },
  { month: "", value: 165 },
  { month: "", value: 180 },
  { month: "", value: 190 },
  { month: "", value: 210 },
  { month: "Mar", value: 230 },
  { month: "", value: 250 },
  { month: "", value: 280 },
  { month: "", value: 380 },
  { month: "", value: 320 },
  { month: "", value: 420 },
  { month: "", value: 500 },
  { month: "", value: 480 },
  { month: "", value: 520 },
  { month: "", value: 450 },
  { month: "Apr", value: 950 },
  { month: "", value: 720 },
  { month: "", value: 880 },
  { month: "", value: 820 },
  { month: "", value: 920 },
  { month: "", value: 860 },
  { month: "", value: 820 },
];

const lossData = [
  { week: "Week 1", value: 80000 },
  { week: "", value: 120000 },
  { week: "", value: 180000 },
  { week: "", value: 150000 },
  { week: "", value: 240000 },
  { week: "", value: 220000 },
  { week: "", value: 350000 },
  { week: "", value: 320000 },
  { week: "Week 2", value: 450000 },
  { week: "", value: 420000 },
  { week: "", value: 480000 },
  { week: "", value: 460000 },
  { week: "", value: 550000 },
  { week: "", value: 840000 },
  { week: "", value: 620000 },
  { week: "", value: 650000 },
  { week: "Week 3", value: 380000 },
  { week: "", value: 320000 },
  { week: "", value: 280000 },
  { week: "", value: 300000 },
  { week: "", value: 260000 },
  { week: "", value: 280000 },
  { week: "", value: 250000 },
  { week: "", value: 270000 },
  { week: "Week 4", value: 320000 },
  { week: "", value: 340000 },
  { week: "", value: 310000 },
  { week: "", value: 290000 },
  { week: "", value: 320000 },
  { week: "", value: 310000 },
  { week: "", value: 330000 },
  { week: "", value: 320000 },
  { week: "Week 5", value: 400000 },
  { week: "", value: 450000 },
  { week: "", value: 520000 },
  { week: "", value: 480000 },
  { week: "", value: 620000 },
  { week: "", value: 680000 },
  { week: "", value: 540000 },
  { week: "", value: 580000 },
  { week: "Week 6", value: 920000 },
  { week: "", value: 780000 },
  { week: "", value: 1050000 },
  { week: "", value: 940000 },
  { week: "", value: 1100000 },
  { week: "", value: 1020000 },
  { week: "", value: 980000 },
];

const instrumentData = [
  { name: "Digital App", value: 90, color: "#46CDCF" },
  { name: "Credit Card (Online)", value: 75, color: "#46CDCF" },
  { name: "Debit Cards (Online)", value: 15, color: "#46CDCF" },
  { name: "Credit Card (POS)", value: 45, color: "#46CDCF" },
  { name: "Debit Cards (ATM)", value: 85, color: "#46CDCF" },
];

export default function BusinessDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const [unreviewedModalOpen, setUnreviewedModalOpen] = useState(false);
  const [notContactedModalOpen, setNotContactedModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const fraudTypes = [
    { name: "Social Engineering / Impersonation", percentage: 40 },
    { name: "Account Takeover", percentage: 25 },
    { name: "SIM Swap Fraud", percentage: 15 },
    { name: "Others", percentage: 20 },
  ];

  const transactionCategories = [
    { name: "Funds Transfer", percentage: 40 },
    { name: "Donations", percentage: 25 },
    { name: "Bill Payments", percentage: 20 },
    { name: "Others", percentage: 15 },
  ];

  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDownloadModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50/50">
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl h-40 shadow-sm border border-gray-100"
                ></div>
              ))}
            </div>
            <div className="bg-white rounded-xl h-80 shadow-sm border border-gray-100"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Dashboard Content */}
      <div className="flex-1 p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-2 gap-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Overview
          </h1>
          <button
            onClick={handleDownloadClick}
            className="bg-[#46CDCF] hover:bg-[#3db8ba] text-white px-6 py-2.5 rounded-lg flex items-center space-x-2 font-semibold transition-all shadow-sm active:scale-95"
          >
            <span>Download Report</span>
            <Download className="w-5 h-5" />
          </button>
        </div>

        {/* Fraud Insights Section */}
        <Card className="bg-white border-0 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-50 gap-4">
              <h2 className="text-lg font-bold text-gray-900">
                Fraud Insights
              </h2>
              <DatePickerWithRange className="w-full sm:w-auto" />
              {/* <div className="flex items-center gap-3 w-full sm:w-auto">
                <DatePickerWithRange className="w-full sm:w-80 h-9" />
                <Select defaultValue="today">
                  <SelectTrigger className="w-32 h-9 text-sm border-gray-200 rounded-lg">
                    <SelectValue placeholder="Today" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 px-4 py-8">
              {[
                {
                  label: "Suspected Accounts",
                  value: "120",
                  btn: "View all accounts",
                },
                {
                  label: "Suspended Transactions",
                  value: "300",
                  btn: "View all transactions",
                },
                {
                  label: "Total Un-Reviewed Accounts",
                  value: "45",
                  btn: "View all accounts",
                  action: () => setUnreviewedModalOpen(true),
                },
                {
                  label: "Not Contacted Alerts",
                  value: "16",
                  color: "text-red-600",
                  btn: "View not contacted",
                  btnClass:
                    "border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
                  action: () => setNotContactedModalOpen(true),
                },
                { label: "Actual Frauds", value: "13", btn: "View all frauds" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center px-2 py-6 lg:py-4 xl:py-0 text-center min-w-0"
                >
                  <span
                    className={`text-3xl xl:text-4xl font-bold mb-2 ${stat.color || "text-gray-900"}`}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[13px] xl:text-sm text-gray-400 mb-6 font-medium px-4">
                    {stat.label}
                  </span>
                  <button
                    onClick={stat.action}
                    className={`text-[11px] xl:text-xs font-semibold border px-4 xl:px-6 py-2 rounded-md transition-all whitespace-nowrap ${stat.btnClass || "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"}`}
                  >
                    {stat.btn}
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fraud Loss Over Time */}
        <Card className="bg-white border-0 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                Fraud Loss Over Time
              </h3>
              <DatePickerWithRange className="w-full sm:w-auto" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 p-8 gap-8">
              <div className="xl:col-span-3 flex flex-col justify-center space-y-10 pl-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Number of Frauds
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">113</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="h-5 w-5 text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Total Amount of Loss
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">
                    PKR 11,700,000
                  </p>
                </div>
              </div>

              <div className="xl:col-span-9 h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lossData}>
                    <defs>
                      <linearGradient
                        id="purpleGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#a855f7"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#a855f7"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      ticks={[0, 200000, 400000, 600000, 800000, 1000000]}
                      domain={[0, 1100000]}
                      tickFormatter={(val) => `${val / 1000}K`}
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      }}
                      formatter={(val: any) => [
                        `PKR ${val.toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                    <Area
                      type="linear"
                      dataKey="value"
                      stroke="#a855f7"
                      strokeWidth={1.5}
                      fill="url(#purpleGradient)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fraud Trend Analytics */}
        <Card className="bg-white border-0 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                Fraud Trend Analytics
              </h3>
              <DatePickerWithRange className="w-full sm:w-auto" />
            </div>

            <div className="h-[380px] p-8 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient
                      id="tealGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    ticks={[0, 50, 100, 200, 500, 1000]}
                    domain={[0, 1100]}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="linear"
                    dataKey="value"
                    stroke="#2dd4bf"
                    strokeWidth={1.5}
                    fill="url(#tealGradient)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
          {/* Transactions Flagged */}
          <Card className="bg-white border-0 shadow-sm rounded-xl flex flex-col">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg font-bold text-gray-900">
                  Transactions Flagged
                </h3>
                <DatePickerWithRange className="w-full sm:w-auto" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center flex-1">
                <div className="relative flex justify-center">
                  <div className="w-48 h-48">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="10"
                        strokeDasharray="15 264"
                        strokeLinecap="round"
                      />
                      <circle cx="92" cy="50" r="2.5" fill="#ef4444" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        1.3%
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1">
                        Flagged Rate
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                      <span className="text-sm font-semibold text-gray-400">
                        Total Transaction
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      322K{" "}
                      <span className="text-sm font-medium text-gray-400 ml-1 font-sans">
                        transaction
                      </span>
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <span className="text-sm font-semibold text-gray-400">
                        Flagged Transaction
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      4186{" "}
                      <span className="text-sm font-medium text-gray-400 ml-1 font-sans">
                        Flagged
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-10">
                <button className="text-[11px] font-bold border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-6 py-2 rounded-md transition-all tracking-tight whitespace-nowrap">
                  View all flagged transactions
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Top Fraud Types */}
          <Card className="bg-white border-0 shadow-sm rounded-xl flex flex-col">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg font-bold text-gray-900">
                  Top Fraud Types
                </h3>
                <DatePickerWithRange className="w-full sm:w-auto" />
              </div>

              <div className="space-y-6 flex-1">
                {fraudTypes.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm font-semibold text-gray-500">
                      {f.name}
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      {f.percentage}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-10">
                <button className="text-[11px] font-bold border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-6 py-2 rounded-md transition-all tracking-tight whitespace-nowrap">
                  View all frauds
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Fraud By Transaction Category */}
          <Card className="bg-white border-0 shadow-sm rounded-xl flex flex-col">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg font-bold text-gray-900">
                  Fraud By Transaction Category
                </h3>
                <DatePickerWithRange className="w-full sm:w-auto" />
              </div>

              <div className="space-y-6 flex-1">
                {transactionCategories.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm font-semibold text-gray-500">
                      {c.name}
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      {c.percentage}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-10">
                <button className="text-[11px] font-bold border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-6 py-2 rounded-md transition-all tracking-tight whitespace-nowrap">
                  View all transaction
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Fraud By Instrument Type */}
          <Card className="bg-white border-0 shadow-sm rounded-xl flex flex-col">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg font-bold text-gray-900">
                  Fraud By Instrument Type
                </h3>
                <DatePickerWithRange className="w-full sm:w-auto" />
              </div>

              <div className="flex-1 -mx-8 flex flex-col justify-center">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={instrumentData}
                      layout="vertical"
                      margin={{ left: 40, right: 60, top: 0, bottom: 0 }}
                    >
                      <XAxis type="number" hide domain={[0, 100]} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        width={120}
                        tick={{
                          fontSize: 11,
                          fontWeight: 600,
                          fill: "#64748b",
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                        {instrumentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between px-[15%] xl:px-[20%] mt-6">
                  {[0, 20, 40, 60, 80, 100].map((v) => (
                    <span
                      key={v}
                      className="text-[10px] font-bold text-gray-400"
                    >
                      {v}%
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-10">
                <button className="text-[11px] font-bold border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-6 py-2 rounded-md transition-all tracking-tight whitespace-nowrap">
                  View all transaction
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution Card - Same as before but verified labels */}

        {/* Geographic Distribution */}
        <Card className="bg-white border-0 shadow-sm rounded-xl overflow-hidden mb-8">
          <CardContent className="p-0">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                Geographic Distribution
              </h3>
              <DatePickerWithRange className="w-full sm:w-auto" />
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 h-auto xl:h-[450px]">
                {/* Column 1: Karachi & Islamabad */}
                <div className="grid grid-rows-3 gap-3 min-h-[400px] md:min-h-0">
                  <div className="row-span-2 bg-[#7fbdbe] rounded flex items-center justify-center text-white font-bold text-xl md:text-2xl hover:opacity-95 transition-opacity">
                    Karachi
                  </div>
                  <div className="row-span-1 bg-[#c2a0f3] rounded flex items-center justify-center text-white font-bold text-lg md:text-xl hover:opacity-95 transition-opacity">
                    Islamabad
                  </div>
                </div>

                {/* Column 2: Lahore, Rawalpindi, Multan */}
                <div className="grid grid-rows-3 gap-3 min-h-[400px] md:min-h-0">
                  <div className="bg-[#7fbdbe] rounded flex items-center justify-center text-white font-bold text-xl md:text-2xl hover:opacity-95 transition-opacity">
                    Lahore
                  </div>
                  <div className="bg-[#7fbdbe] rounded flex items-center justify-center text-white font-bold text-base md:text-lg hover:opacity-95 transition-opacity">
                    Rawalpindi
                  </div>
                  <div className="bg-[#c2a0f3] rounded flex items-center justify-center text-white font-bold text-base md:text-lg hover:opacity-95 transition-opacity">
                    Multan
                  </div>
                </div>

                {/* Column 3: Hyderabad, Hyderabad, Mirpur Khas */}
                <div className="grid grid-rows-3 gap-3 min-h-[400px] md:min-h-0">
                  <div className="bg-[#7c90e0] rounded flex items-center justify-center text-white font-bold text-xl md:text-2xl hover:opacity-95 transition-opacity">
                    Hyderabad
                  </div>
                  <div className="bg-[#c2a0f3] rounded flex items-center justify-center text-white font-bold text-lg md:text-xl hover:opacity-95 transition-opacity">
                    Hyderabad
                  </div>
                  <div className="bg-[#7c90e0] rounded flex items-center justify-center text-white font-bold text-base md:text-lg hover:opacity-95 transition-opacity">
                    Mirpur Khas
                  </div>
                </div>

                {/* Column 4: Sukkur/Rodi & Faisalabad */}
                <div className="grid grid-rows-3 gap-3 min-h-[400px] md:min-h-0">
                  <div className="row-span-1 flex flex-col gap-3">
                    <div className="flex-1 bg-[#c2a0f3] rounded flex items-center justify-center text-white font-bold text-base md:text-lg hover:opacity-95 transition-opacity">
                      Sukkur
                    </div>
                    <div className="flex-1 bg-[#c2a0f3] rounded flex items-center justify-center text-white font-bold text-base md:text-lg hover:opacity-95 transition-opacity">
                      Rodi
                    </div>
                  </div>
                  <div className="row-span-2 bg-[#7fbdbe] rounded flex items-center justify-center text-white font-bold text-xl md:text-2xl hover:opacity-95 transition-opacity">
                    Faisalabad
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {isDownloadModalOpen && (
        <DownloadInsightsModal
          isOpen={isDownloadModalOpen}
          onClose={handleCloseModal}
          report={{ type: "Overall Insights" }}
        />
      )}
      <UnreviewedAccountsModal
        open={unreviewedModalOpen}
        onOpenChange={setUnreviewedModalOpen}
      />
      <NotContactedAlertsModal
        open={notContactedModalOpen}
        onOpenChange={setNotContactedModalOpen}
      />
    </div>
  );
}
