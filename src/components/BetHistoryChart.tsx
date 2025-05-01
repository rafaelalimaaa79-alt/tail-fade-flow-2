
import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { cn } from "@/lib/utils";

type BetHistoryChartProps = {
  data: {
    date: string;
    value: number;
  }[];
  isPositive?: boolean;
};

const BetHistoryChart: React.FC<BetHistoryChartProps> = ({ 
  data,
  isPositive = true
}) => {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={isPositive ? "#10B981" : "#EF4444"}
            fillOpacity={1}
            fill={isPositive ? "url(#colorPositive)" : "url(#colorNegative)"}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BetHistoryChart;
