import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeasurements, deleteMeasurement } from '../api/measurements';
import MeasurementChart from '../components/MeasurementChart';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import type { BodyMeasurement } from '../types';

export default function Measurements() {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<'weight' | 'waist' | 'chest'>('weight');

  const loadMeasurements = () => {
    setLoading(true);
    getMeasurements()
      .then(setMeasurements)
      .catch(() => setMeasurements([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadMeasurements(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta medición?')) return;
    try {
      await deleteMeasurement(id);
      loadMeasurements();
    } catch {
      alert('Error al eliminar');
    }
  };

  const last = measurements[0];
  const prev = measurements[1];

  const diff = (field: keyof BodyMeasurement) => {
    if (!last || !prev || last[field] == null || prev[field] == null) return null;
    return (last[field] as number) - (prev[field] as number);
  };

  const diffText = (val: number | null) => {
    if (val === null) return null;
    const sign = val > 0 ? '+' : '';
    const color = val > 0 ? 'text-rose-400' : val < 0 ? 'text-emerald-400' : 'text-gray-400';
    return <span className={`text-xs ${color}`}>{sign}{val}</span>;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Medidas corporales</h2>
        <button
          onClick={() => navigate('/measurements/new')}
          className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-500 transition-colors"
        >
          + Nueva
        </button>
      </div>

      {measurements.length === 0 ? (
        <EmptyState
          icon="📏"
          title="Sin mediciones"
          description="Registra tu primera medición para ver tu progreso"
          action={{ label: 'Registrar medición', onClick: () => navigate('/measurements/new') }}
        />
      ) : (
        <>
          {/* Última vs anterior */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Peso', field: 'weight' as const, unit: 'kg' },
              { label: 'Cintura', field: 'waist' as const, unit: 'cm' },
              { label: 'Pecho', field: 'chest' as const, unit: 'cm' },
            ].map(({ label, field, unit }) => (
              <div key={field} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-400">{label}</div>
                <div className="text-lg font-bold text-white">
                  {last?.[field] ?? '—'}
                  <span className="text-xs text-gray-500 font-normal ml-0.5">{unit}</span>
                </div>
                <div className="mt-0.5">{diffText(diff(field))}</div>
              </div>
            ))}
          </div>

          {/* Más medidas */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Brazo izq.', field: 'left_arm' as const },
              { label: 'Brazo der.', field: 'right_arm' as const },
              { label: 'Muslo izq.', field: 'left_thigh' as const },
              { label: 'Muslo der.', field: 'right_thigh' as const },
              { label: 'Cuello', field: 'neck' as const },
            ].map(({ label, field }) => (
              <div key={field} className="bg-gray-800/30 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-sm text-white font-medium">{last?.[field] ?? '—'} cm</div>
              </div>
            ))}
          </div>

          {/* Selector de métrica para gráfico */}
          <div className="flex gap-2">
            {(['weight', 'waist', 'chest'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  activeMetric === m
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {m === 'weight' ? 'Peso' : m === 'waist' ? 'Cintura' : 'Pecho'}
              </button>
            ))}
          </div>

          {/* Gráfico */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <MeasurementChart
              measurements={measurements}
              metric={activeMetric}
              label={activeMetric === 'weight' ? 'Peso (kg)' : `${activeMetric} (cm)`}
            />
          </div>

          {/* Historial */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Historial</h3>
            <div className="space-y-1">
              {measurements.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 px-3 bg-gray-800/20 rounded-lg">
                  <div className="text-sm text-gray-300">
                    {new Date(m.measured_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span>{m.weight ? `${m.weight}kg` : '—'}</span>
                    <span className="text-gray-500">{m.waist ? `${m.waist}cm` : '—'}</span>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-rose-500 text-xs hover:text-rose-400"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
