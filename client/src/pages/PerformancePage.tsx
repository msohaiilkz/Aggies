import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { DatePickerWithRange } from "@/components/date-range-picker";

// Function to generate jittery data to match the high-frequency look of the image
const generateJitteryData = () => {
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  const pointsPerMonth = 15;
  const data = [];

  const baseValues = {
    accuracy: [5, 45, 25, 68, 48, 44],
    precision: [2, 38, 32, 32, 49, 52],
    recall: [-5, 50, 62, 40, 100, 40],
    f1Score: [0, 60, 75, 68, 88, 75],
  };

  for (let i = 0; i < months.length - 1; i++) {
    for (let j = 0; j < pointsPerMonth; j++) {
      const t = j / pointsPerMonth;
      const monthLabel = j === 0 ? months[i] : "";

      const jitter = (val: number) => val + (Math.random() - 0.5) * 15;

      const lerp = (start: number, end: number, t: number) =>
        start + (end - start) * t;

      data.push({
        month: monthLabel,
        accuracy: jitter(
          lerp(baseValues.accuracy[i], baseValues.accuracy[i + 1], t),
        ),
        precision: jitter(
          lerp(baseValues.precision[i], baseValues.precision[i + 1], t),
        ),
        recall: jitter(lerp(baseValues.recall[i], baseValues.recall[i + 1], t)),
        f1Score: jitter(
          lerp(baseValues.f1Score[i], baseValues.f1Score[i + 1], t),
        ),
      });
    }
  }
  // Add last point
  data.push({
    month: months[months.length - 1],
    accuracy: baseValues.accuracy[5],
    precision: baseValues.precision[5],
    recall: baseValues.recall[5],
    f1Score: baseValues.f1Score[5],
  });

  return data;
};

const GaugeChart = ({ percentage, color, status, subLabel = "Accurate" }) => {
  // Constants for arc math
  const radius = 85;
  const strokeWidth = 15;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-full max-w-[300px] aspect-[16/9] flex items-end justify-center overflow-hidden pt-4">
        <svg viewBox="0 0 200 110" className="w-full h-auto">
          {/* Background track */}
          <path
            d="M 15 100 A 85 85 0 0 1 185 100"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress bar */}
          <path
            d="M 15 100 A 85 85 0 0 1 185 100"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Content overlay inside the arc */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-4xl font-extrabold text-gray-900 leading-none">
            {percentage}%
          </span>
          <span className="text-[13px] font-bold text-gray-400 mt-2 uppercase tracking-wide">
            {subLabel}
          </span>

          <div
            className={`mt-3 flex items-center px-3 py-1 rounded-sm gap-1 ${
              status === "Increasing"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {status === "Increasing" ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span className="text-[10px] font-extrabold uppercase tracking-widest">
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Scale */}
      <div className="w-full max-w-[260px] flex flex-col items-center mt-[-4px]">
        <div className="w-full flex justify-between px-2 mb-1">
          <span className="text-[11px] font-extrabold text-gray-300">0%</span>
          <span className="text-[11px] font-extrabold text-gray-300">100%</span>
        </div>
        <div className="w-full border-t border-dashed border-gray-200"></div>
      </div>
    </div>
  );
};

const PerformancePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const data = useMemo(() => generateJitteryData(), []);

  const metricOptions = [
    { id: "accuracy", label: "Accuracy", color: "#5c6bc0" },
    { id: "precision", label: "Precision", color: "#7cfc00" },
    { id: "recall", label: "Recall", color: "#00ced1" },
    { id: "f1Score", label: "F1 Score", color: "#da70d6" },
  ];

  const [selectedMetrics, setSelectedMetrics] = useState(
    metricOptions.map((m) => m.id),
  );

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const toggleMetric = (id: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const showAll = () => setSelectedMetrics(metricOptions.map((m) => m.id));
  const clearFilters = () => setSelectedMetrics([]);

  const getTriggerLabel = () => {
    if (selectedMetrics.length === 0) return "Select metrics";
    if (selectedMetrics.length === metricOptions.length) return "Show All";

    const labels = metricOptions
      .filter((m) => selectedMetrics.includes(m.id))
      .map((m) => m.label);

    const joined = labels.join(", ");
    return joined.length > 25 ? joined.substring(0, 22) + "..." : joined;
  };

  if (isLoading) {
    return (
      <MainLayout title="Performance">
        <div className="p-8 space-y-8 animate-pulse text-center">
          <div className="h-96 bg-gray-100 rounded-xl"></div>
          <div className="grid grid-cols-2 gap-8">
            <div className="h-60 bg-gray-100 rounded-xl"></div>
            <div className="h-60 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Performance">
      <div className="p-8 space-y-10 max-w-[1600px] mx-auto w-full">
        {/* System Performance Trend Chart */}
        <Card className="bg-white border-0 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
              <h2 className="text-xl font-bold text-gray-900">
                System Performance Trend
              </h2>
              <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                {/* Custom Multi-select Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-56 h-11 border-gray-200 rounded-lg justify-between px-4 hover:bg-gray-50 bg-white"
                    >
                      <span className="text-sm font-medium text-gray-700 truncate mr-2">
                        {getTriggerLabel()}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-60 p-0 rounded-xl shadow-xl border-gray-100"
                    align="end"
                  >
                    <div className="p-4 space-y-4">
                      <div
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={showAll}
                      >
                        <Checkbox
                          id="show-all"
                          checked={
                            selectedMetrics.length === metricOptions.length
                          }
                          onCheckedChange={showAll}
                          className="border-gray-300 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                        />
                        <label className="text-[15px] font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer">
                          Show All
                        </label>
                      </div>

                      {metricOptions.map((metric) => (
                        <div
                          key={metric.id}
                          className="flex items-center space-x-3 cursor-pointer group"
                          onClick={() => toggleMetric(metric.id)}
                        >
                          <Checkbox
                            id={metric.id}
                            checked={selectedMetrics.includes(metric.id)}
                            onCheckedChange={() => toggleMetric(metric.id)}
                            className="border-gray-300 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                          <label className="text-[15px] font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer">
                            {metric.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 p-3 text-center">
                      <button
                        onClick={clearFilters}
                        className="text-[14px] font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Clear filters
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>

                <DatePickerWithRange className="w-full sm:w-auto" />
              </div>
            </div>

            <div className="h-[450px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#f1f5f9"
                    strokeWidth={1}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 600 }}
                    dy={20}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 600 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "14px",
                      border: "none",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  {/* Conditionally rendering lines to match the reference image filtration logic */}
                  {selectedMetrics.includes("accuracy") && (
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#5c6bc0"
                      strokeWidth={1.8}
                      dot={false}
                      animationDuration={1000}
                    />
                  )}
                  {selectedMetrics.includes("precision") && (
                    <Line
                      type="monotone"
                      dataKey="precision"
                      stroke="#7cfc00"
                      strokeWidth={1.8}
                      dot={false}
                      animationDuration={1200}
                    />
                  )}
                  {selectedMetrics.includes("recall") && (
                    <Line
                      type="monotone"
                      dataKey="recall"
                      stroke="#00ced1"
                      strokeWidth={1.8}
                      dot={false}
                      animationDuration={1400}
                    />
                  )}
                  {selectedMetrics.includes("f1Score") && (
                    <Line
                      type="monotone"
                      dataKey="f1Score"
                      stroke="#da70d6"
                      strokeWidth={1.8}
                      dot={false}
                      animationDuration={1600}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic Legend */}
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mt-12 pb-2">
              {metricOptions.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 transition-opacity duration-300 ${
                    selectedMetrics.includes(item.id)
                      ? "opacity-100"
                      : "opacity-30"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-bold text-gray-500">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gauges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
          {[
            {
              title: "System Accuracy",
              percentage: 87,
              color: "#2ecc71",
              status: "Increasing",
            },
            {
              title: "System Precision",
              percentage: 73,
              color: "#ff7043",
              status: "Decreasing",
            },
            {
              title: "System Recall",
              percentage: 66,
              color: "#ff7043",
              status: "Increasing",
            },
            {
              title: "F1 Score (%)",
              percentage: 72,
              color: "#ff7043",
              status: "Increasing",
            },
          ].map((metric, idx) => (
            <Card
              key={idx}
              className="bg-white border-0 shadow-sm rounded-xl overflow-hidden flex flex-col h-full"
            >
              <CardContent className="p-10 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-8 gap-4">
                  <h3 className="text-[19px] font-bold text-gray-900">
                    {metric.title}
                  </h3>
                  <DatePickerWithRange className="w-full sm:w-auto" />
                </div>
                <div className="flex-1 flex items-center justify-center py-6">
                  <GaugeChart
                    percentage={metric.percentage}
                    color={metric.color}
                    status={metric.status}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default PerformancePage;
