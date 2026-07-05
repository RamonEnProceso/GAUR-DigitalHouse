import type { InactivityStatus } from '../types';

interface InactivityAlertProps {
  status: InactivityStatus | null;
  loading?: boolean;
}

export default function InactivityAlert({ status, loading }: InactivityAlertProps) {
  if (loading) return null;
  if (!status || !status.inactive) return null;

  return (
    <div className="bg-rose-900/30 border border-rose-700/50 rounded-xl p-4 flex items-start gap-3">
      <span className="text-2xl">⚠️</span>
      <div>
        <h3 className="font-semibold text-rose-300">¡Llevas {status.daysSinceLastWorkout} días sin entrenar!</h3>
        <p className="text-sm text-rose-400/80 mt-1">
          La constancia es clave para ver resultados. ¡Anímate a registrar tu próxima sesión!
        </p>
      </div>
    </div>
  );
}
