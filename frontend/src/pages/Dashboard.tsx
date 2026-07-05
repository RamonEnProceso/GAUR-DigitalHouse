import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStreak } from '../api/workouts';
import { getLatestMeasurement } from '../api/measurements';
import { checkInactivity } from '../api/inactivity';
import { getProfile } from '../api/users';
import StatCard from '../components/StatCard';
import StreakBadge from '../components/StreakBadge';
import InactivityAlert from '../components/InactivityAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import type { User, BodyMeasurement, StreakInfo, InactivityStatus } from '../types';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [measurement, setMeasurement] = useState<BodyMeasurement | null>(null);
  const [inactivity, setInactivity] = useState<InactivityStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfile().catch(() => null),
      getStreak().catch(() => null),
      getLatestMeasurement().catch(() => null),
      checkInactivity().catch(() => null),
    ]).then(([u, s, m, i]) => {
      setUser(u);
      setStreak(s);
      setMeasurement(m);
      setInactivity(i);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {/* Bienvenida */}
      <div>
        <h2 className="text-xl font-bold text-white">
          ¡Hola, {user?.nombre || 'Guerrero'}! 👋
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {user?.descripcion || 'Bienvenido a tu entrenamiento'}
        </p>
      </div>

      {/* Alerta de inactividad */}
      <InactivityAlert status={inactivity} />

      {/* Racha */}
      <div className="flex items-center gap-3">
        <StreakBadge streak={streak?.currentStreak || 0} />
        {measurement && (
          <span className="text-sm text-gray-400">
            Último peso: {measurement.weight}kg
          </span>
        )}
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Peso actual"
          value={measurement?.weight ? `${measurement.weight} kg` : '—'}
          icon="⚖️"
          color="emerald"
        />
        <StatCard
          label="Cintura"
          value={measurement?.waist ? `${measurement.waist} cm` : '—'}
          icon="📏"
          color="blue"
        />
        <StatCard
          label="Edad"
          value={user?.edad || '—'}
          icon="🎂"
          color="amber"
        />
        <StatCard
          label="Altura"
          value={user?.altura ? `${user.altura} m` : '—'}
          icon="📐"
          color="rose"
        />
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/workouts/new"
          className="flex items-center justify-center gap-2 p-4 bg-emerald-700/30 border border-emerald-600/50 rounded-xl text-emerald-300 hover:bg-emerald-700/50 transition-colors"
        >
          <span className="text-2xl">💪</span>
          <span className="font-medium">Nuevo entreno</span>
        </Link>
        <Link
          to="/measurements"
          className="flex items-center justify-center gap-2 p-4 bg-blue-700/30 border border-blue-600/50 rounded-xl text-blue-300 hover:bg-blue-700/50 transition-colors"
        >
          <span className="text-2xl">📏</span>
          <span className="font-medium">Medirme</span>
        </Link>
      </div>

      {/* Última sesión */}
      {streak?.lastWorkoutDate && (
        <div className="text-center text-sm text-gray-500">
          Último entrenamiento:{' '}
          {new Date(streak.lastWorkoutDate).toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </div>
      )}
    </div>
  );
}
