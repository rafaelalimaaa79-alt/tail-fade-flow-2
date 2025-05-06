
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BetHistoryPoint } from "@/types/bettor";
import { cn } from "@/lib/utils";

type BettorPerformanceGraphProps = {
  data: BetHistoryPoint[];
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
  isPositive: boolean;
  className?: string;
};

const formatDate = (dateString: string, timeframe: '1D' | '1W' | '1M' | '3M' | '1Y') => {
  const date = new Date(dateString);
  if (timeframe === '1D') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (timeframe === '1W') {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

const BettorPerformanceGraph: React.FC<BettorPerformanceGraphProps> = ({ 
  data,
  timeframe,
  isPositive,
  className
}) => {
  const [activePoint, setActivePoint] = useState<any>(null);
  
  // Prepare data for the chart - convert timestamp to formatted date
  const chartData = data.map(point => ({
    ...point,
    formattedDate: formatDate(point.timestamp, timeframe)
  }));

  // Calculate min and max for Y axis padding
  const allUnits = data.map(p => p.units);
  const minY = Math.min(...allUnits);
  const maxY = Math.max(...allUnits);
  const padding = Math.max(1, (maxY - minY) * 0.1); // At least 1 unit padding
  
  return (
    <div className={cn("h-64 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
          onMouseMove={(e) => {
            if (e.activePayload) {
              setActivePoint(e.activePayload[0].payload);
            }
          }}
          onMouseLeave={() => setActivePoint(null)}
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
            dataKey="formattedDate" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            interval="preserveStartEnd"
            minTickGap={10}
          />
          <YAxis 
            domain={[minY - padding, maxY + padding]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg bg-white p-2 shadow-lg border border-gray-200">
                    <p className="font-medium">{data.formattedDate}</p>
                    <p className={`text-lg font-bold ${isPositive ? 'text-onetime-green' : 'text-onetime-red'}`}>
                      {data.units > 0 ? '+' : ''}{data.units} Units
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="units"
            stroke={isPositive ? "#10B981" : "#EF4444"}
            strokeWidth={2}
            activeDot={{ 
              r: 6, 
              strokeWidth: 2, 
              stroke: "white"
            }}
            dot={false}
          />
          
          {/* Interactive Ball/Dot on the Line */}
          {activePoint && (
            <circle
              cx={activePoint.cx}
              cy={activePoint.cy}
              r={6}
              fill={isPositive ? "#10B981" : "#EF4444"}
              stroke="white"
              strokeWidth={2}
              className="animate-pulse"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BettorPerformanceGraph;
