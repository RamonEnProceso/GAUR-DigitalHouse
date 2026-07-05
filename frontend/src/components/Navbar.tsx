import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/workouts', label: 'Entrenos', icon: '💪' },
  { to: '/exercises', label: 'Ejercicios', icon: '📋' },
  { to: '/measurements', label: 'Medidas', icon: '📏' },
  { to: '/routines', label: 'Rutinas', icon: '📅' },
  { to: '/profile', label: 'Perfil', icon: '👤' },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
