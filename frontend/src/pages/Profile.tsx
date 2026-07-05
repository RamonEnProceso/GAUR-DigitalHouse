import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api/users';
import { getAiConfig, saveAiConfig, deleteAiConfig } from '../api/ai-config';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import type { User, AiConfig } from '../types';

export default function Profile() {
  const [, setUser] = useState<User | null>(null);
  const [aiConfig, setAiConfig] = useState<AiConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-4o-mini');
  const [aiSectionOpen, setAiSectionOpen] = useState(false);

  // Formulario perfil
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [altura, setAltura] = useState('');
  const [pesoActual, setPesoActual] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [futuroIdeal, setFuturoIdeal] = useState('');

  useEffect(() => {
    Promise.all([
      getProfile().catch(() => null),
      getAiConfig().catch(() => null),
    ]).then(([u, c]) => {
      if (u) {
        setUser(u);
        setNombre(u.nombre || '');
        setEdad(u.edad?.toString() || '');
        setAltura(u.altura?.toString() || '');
        setPesoActual(u.peso_actual?.toString() || '');
        setDescripcion(u.descripcion || '');
        setFuturoIdeal(u.futuro_ideal || '');
      }
      if (c) {
        setAiConfig(c);
        setProvider(c.provider || 'openai');
        setModel(c.model || 'gpt-4o-mini');
      }
      setLoading(false);
    });
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile({
        nombre,
        edad: edad ? Number(edad) : undefined,
        altura: altura ? Number(altura) : undefined,
        peso_actual: pesoActual ? Number(pesoActual) : undefined,
        descripcion: descripcion || undefined,
        futuro_ideal: futuroIdeal || undefined,
      });
      setUser(updated);
      alert('Perfil actualizado');
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAiConfig = async () => {
    if (!apiKey) {
      alert('Ingresa tu API key');
      return;
    }
    setSaving(true);
    try {
      const config = await saveAiConfig({
        provider,
        api_key: apiKey,
        model,
      });
      setAiConfig(config);
      setApiKey('');
      alert('API key guardada');
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAiConfig = async () => {
    if (!confirm('¿Eliminar tu API key?')) return;
    try {
      await deleteAiConfig();
      setAiConfig(null);
      setApiKey('');
      alert('API key eliminada');
    } catch {
      alert('Error al eliminar');
    }
  };

  const { signOut } = useAuth();

  if (loading) return <LoadingSpinner />;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      console.error('Error al cerrar sesión');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Perfil</h2>

      {/* Datos personales */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Datos personales</h3>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Edad</label>
            <input
              type="number"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Altura (m)</label>
            <input
              type="number"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              step="0.01"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Peso actual (kg)</label>
          <input
            type="number"
            value={pesoActual}
            onChange={(e) => setPesoActual(e.target.value)}
            step="0.1"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="¿Quién eres? Tu historia fitness..."
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Meta a futuro</label>
          <textarea
            value={futuroIdeal}
            onChange={(e) => setFuturoIdeal(e.target.value)}
            placeholder="¿Cómo quieres sentirte/verte?"
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none"
          />
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full py-2 bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </div>

      {/* Configuración de IA — colapsable */}
      <div className="bg-gray-800/20 rounded-xl border border-gray-700/30 overflow-hidden">
        <button
          onClick={() => setAiSectionOpen(!aiSectionOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              🤖 IA (opcional)
            </span>
            {aiConfig?.has_key && (
              <span className="text-xs bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-full">
                Configurada
              </span>
            )}
          </div>
          <span className={`text-gray-500 transition-transform ${aiSectionOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {aiSectionOpen && (
          <div className="px-4 pb-4 space-y-3">
            <p className="text-xs text-gray-500">
            Opcional: configura tu API key para generar rutinas personalizadas con IA.
            La clave se almacena en la base de datos.
            </p>

            {aiConfig?.has_key && (
              <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-3">
                <div className="text-sm text-emerald-300">
                  ✅ API key configurada
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {aiConfig.provider} — {aiConfig.model}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={aiConfig?.has_key ? 'Ingresa nueva key para actualizar' : 'sk-...'}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Proveedor</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="gemini">Gemini</option>
                  <option value="deepseek">DeepSeek</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Modelo</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="gpt-4o-mini"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveAiConfig}
                disabled={saving || !apiKey}
                className="flex-1 py-2 bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 transition-colors"
              >
                {saving ? 'Guardando...' : 'Guardar API key'}
              </button>
              {aiConfig?.has_key && (
                <button
                  onClick={handleDeleteAiConfig}
                  className="py-2 px-4 bg-rose-700/50 text-rose-300 rounded-lg text-sm hover:bg-rose-700/70 transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cerrar sesión */}
      <div className="pt-4 border-t border-gray-800">
        <button
          onClick={handleSignOut}
          className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
