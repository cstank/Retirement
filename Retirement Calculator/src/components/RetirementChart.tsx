"use client"

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { YearData } from '../lib/calculate';
import { formatCurrency } from '../lib/utils';

interface RetirementChartProps {
  data: YearData[];
  currencySymbol?: string;
  labelSavings: string;
  labelTarget: string;
  color?: string;
  minimal?: boolean; // Ignored now, reverting to full style
}

export function RetirementChart({ data, currencySymbol = '¥', labelSavings, labelTarget, color = '#8b5cf6' }: RetirementChartProps) {
  const isChinese = currencySymbol === '¥';
  const isDark = color === '#ef4444'; // Heuristic for dark mode (void theme)

  const formatYAxis = (tickItem: number) => {
    if (isChinese) {
      if (tickItem >= 100000000) return `${(tickItem / 100000000).toFixed(1)}亿`;
      if (tickItem >= 10000) return `${(tickItem / 10000).toFixed(0)}万`;
    } else {
      if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(1)}M`;
      if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}k`;
    }
    return tickItem.toString();
  };
  
  const tooltipFormatter = (value: number) => {
    return [formatCurrency(value, currencySymbol, isChinese ? 'zh-CN' : 'en-US'), undefined];
  }

  return (
    <div className="h-[100%] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={isDark ? 0.1 : 0.2} stroke={isDark ? '#fff' : '#000'} />
          <XAxis 
            dataKey="age" 
            tickLine={false}
            axisLine={false}
            tick={{ fill: isDark ? '#9ca3af' : '#94a3b8', fontSize: 12 }}
            minTickGap={30}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            tickLine={false}
            axisLine={false}
            tick={{ fill: isDark ? '#9ca3af' : '#94a3b8', fontSize: 12 }}
            width={60}
          />
          <Tooltip 
            formatter={tooltipFormatter}
            labelFormatter={(label) => `Age ${label}`}
            contentStyle={{ 
               borderRadius: '12px', 
               border: 'none', 
               boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
               background: isDark ? '#1f2937' : '#fff',
               color: isDark ? '#fff' : '#000'
            }}
          />
          <ReferenceLine 
            y={data[0]?.target} 
            stroke={isDark ? '#f87171' : '#ef4444'} 
            strokeDasharray="3 3" 
            strokeOpacity={0.6}
            label={{ 
              value: labelTarget, 
              fill: isDark ? '#f87171' : '#ef4444', 
              fontSize: 12, 
              position: 'insideTopRight' 
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="savings" 
            name={labelSavings}
            stroke={color} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSavings)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
