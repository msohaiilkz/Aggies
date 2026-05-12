import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface FraudTrendChartProps {
  data?: Array<{
    date: string;
    count: number;
    totalLoss: number;
  }>;
}

export function FraudTrendChart({ data }: FraudTrendChartProps) {
  // Generate sample data if none provided
  const chartData = data || [
    { month: "Nov", count: 45 },
    { month: "Dec", count: 78 },
    { month: "Jan", count: 92 },
    { month: "Feb", count: 156 },
    { month: "Mar", count: 134 },
    { month: "Apr", count: 189 },
  ];

  const processedData = data ? data.map((item, index) => {
    const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
    return {
      month: months[index % months.length],
      count: item.count
    };
  }) : chartData;

  return (
    <div className="h-72 w-full" data-testid="chart-fraud-trend">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorFraudTrend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            stroke="#64748b"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#64748b"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px"
            }}
            formatter={(value: any) => [value, "Fraud Cases"]}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorFraudTrend)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
