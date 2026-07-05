import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMeasurement } from '../api/measurements';

interface FormData {
  weight: string;
  waist: string;
  chest: string;
  left_arm: string;
  right_arm: string;
  left_thigh: string;
  right_thigh: string;
  neck: string;
  notes: string;
}

export default function MeasurementForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    weight: '', waist: '', chest: '', left_arm: '', right_arm: '',
    left_thigh: '', right_thigh: '', neck: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toNumberOrUndefined = (val: string) => {
    const n = Number(val);
    return val !== '' && !isNaN(n) ? n : undefined;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await createMeasurement({
        weight: toNumberOrUndefined(form.weight),
        waist: toNumberOrUndefined(form.waist),
        chest: toNumberOrUndefined(form.chest),
        left_arm: toNumberOrUndefined(form.left_arm),
        right_arm: toNumberOrUndefined(form.right_arm),
        left_thigh: toNumberOrUndefined(form.left_thigh),
        right_thigh: toNumberOrUndefined(form.right_thigh),
        neck: toNumberOrUndefined(form.neck),
        notes: form.notes || undefined,
      });
      navigate('/measurements');
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const fields: { label: string; key: keyof FormData; unit: string }[] = [
    { label: 'Peso', key: 'weight', unit: 'kg' },
    { label: 'Cintura', key: 'waist', unit: 'cm' },
    { label: 'Pecho', key: 'chest', unit: 'cm' },
    { label: 'Brazo izquierdo', key: 'left_arm', unit: 'cm' },
    { label: 'Brazo derecho', key: 'right_arm', unit: 'cm' },
    { label: 'Muslo izquierdo', key: 'left_thigh', unit: 'cm' },
    { label: 'Muslo derecho', key: 'right_thigh', unit: 'cm' },
    { label: 'Cuello', key: 'neck', unit: 'cm' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Nueva medición</h2>
        <button onClick={() => navigate('/measurements')} className="text-gray-400 hover:text-white text-sm">
          Cancelar
        </button>
      </div>

      <div className="text-sm text-gray-400">
        {new Date().toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ label, key, unit }) => (
          <div key={key}>
            <label className="block text-sm text-gray-400 mb-1">{label}</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                step="0.1"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
              <span className="text-gray-500 text-sm w-6">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Notas</label>
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Opcional: alguna observación"
          rows={2}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3 bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors"
      >
        {submitting ? 'Guardando...' : 'Guardar medición'}
      </button>
    </div>
  );
}
