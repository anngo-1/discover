import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

export interface StackedBarData {
  year: string | number;
  articles: number;
  preprints: number;
  datasets: number;
}

export interface StackedBarChartProps {
  data: StackedBarData[];
  height?: number;
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat().format(value);
};

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  height = 400
}) => {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="text-sm font-semibold mb-1">Year: {label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm">
              {entry.name}: {formatNumber(entry.value as number)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="year"
          tick={{ fill: '#666', fontSize: 12 }}
          tickLine={{ stroke: '#666' }}
        />
        <YAxis 
          tickFormatter={formatNumber}
          tick={{ fill: '#666', fontSize: 12 }}
          tickLine={{ stroke: '#666' }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
        <Legend 
          wrapperStyle={{ paddingTop: '15px' }}
          iconType="circle"
        />
        <Bar 
          dataKey="articles" 
          name="Articles"
          fill="#60A5FA"
          stackId="a"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="preprints" 
          name="Preprints"
          fill="#F472B6"
          stackId="a"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="datasets" 
          name="Datasets"
          fill="#34D399"
          stackId="a"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;