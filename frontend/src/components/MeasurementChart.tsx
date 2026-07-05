import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { BodyMeasurement } from '../types';

interface MeasurementChartProps {
  measurements: BodyMeasurement[];
  metric: keyof Pick<BodyMeasurement, 'weight' | 'waist' | 'chest' | 'left_arm' | 'right_arm'>;
  label: string;
  color?: string;
}

export default function MeasurementChart({
  measurements,
  metric,
  label,
  color = '#10b981',
}: MeasurementChartProps) {
  const data = measurements
    .filter((m) => m[metric] != null)
    .map((m) => ({
      date: new Date(m.measured_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
      }),
      value: m[metric] as number,
    }))
    .reverse();

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        Se necesitan al menos 2 mediciones para mostrar el gráfico
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name={label}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
