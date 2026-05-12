import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface FraudLossChartProps {
  data?: Array<{
    date: string;
    count: number;
    totalLoss: number;
  }>;
}

export function FraudLossChart({ data }: FraudLossChartProps) {
  // Generate sample data if none provided
  const chartData = data || [
    { week: "Week 1", fraudCount: 15, loss: 1200000 },
    { week: "Week 2", fraudCount: 23, loss: 1800000 },
    { week: "Week 3", fraudCount: 18, loss: 1500000 },
    { week: "Week 4", fraudCount: 32, loss: 2400000 },
    { week: "Week 5", fraudCount: 28, loss: 2100000 },
    { week: "Week 6", fraudCount: 25, loss: 1900000 },
  ];

  const processedData = data ? data.map((item, index) => ({
    week: `Week ${index + 1}`,
    fraudCount: item.count,
    loss: item.totalLoss
  })) : chartData;

  return (
    <div className="h-72 w-full" data-testid="chart-fraud-loss">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="week" 
            tick={{ fontSize: 12 }}
            stroke="#64748b"
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            stroke="#64748b"
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
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
            formatter={(value: any, name: string) => [
              name === "fraudCount" ? value : `PKR ${Number(value).toLocaleString()}`,
              name === "fraudCount" ? "Fraud Count" : "Loss Amount"
            ]}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="fraudCount"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="loss"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
