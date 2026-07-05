import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-6xl mb-4">🤷</span>
      <h2 className="text-xl font-bold text-white mb-2">Página no encontrada</h2>
      <p className="text-sm text-gray-400 mb-6">La página que buscas no existe o fue movida.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-500 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
