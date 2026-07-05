import userModel from '../models/user.model.js';
import exerciseModel, { Exercise } from '../models/exercise.model.js';
import aiConfigModel from '../models/ai-config.model.js';
import workoutModel from '../models/workout.model.js';
import measurementModel from '../models/measurement.model.js';
import routineModel from '../models/routine.model.js';

export interface AiGenerateRequest {
  goals?: string;
  equipment?: string[];
  days_per_week?: number;
  focus?: string;
}

interface AiExerciseSuggestion {
  exercise_id: string;
  target_sets: number;
  target_reps_min: number;
  target_reps_max: number;
}

interface AiDaySuggestion {
  day_number: number;
  exercises: AiExerciseSuggestion[];
}

interface AiRoutineSuggestion {
  name: string;
  description: string;
  days: AiDaySuggestion[];
}

/**
 * Genera una rutina usando la API de IA configurada por el usuario.
 *
 * Flujo:
 * 1. Obtener perfil del usuario, últimas sesiones, medidas recientes
 * 2. Obtener catálogo de ejercicios disponibles
 * 3. Leer la configuración de IA del usuario (provider + api_key + model)
 * 4. Construir un prompt con el contexto del usuario
 * 5. Llamar a la API de IA (formato compatible con OpenAI Chat Completions)
 * 6. Parsear la respuesta JSON
 * 7. Validar que los exercise_id existan
 * 8. Guardar la rutina en la base de datos
 */
export async function generateRoutine(userId: string, request: AiGenerateRequest) {
  // 1. Obtener datos del usuario
  const user = await userModel.getById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const recentSessions = await workoutModel.getAll(userId);
  const latestMeasurement = await measurementModel.getLatest(userId);
  const exercises = await exerciseModel.getAll();
  const aiConfig = await aiConfigModel.getByUserId(userId);

  if (!aiConfig || !aiConfig.api_key) {
    throw new Error('No hay configuración de IA. Configura tu API key en Perfil.');
  }

  // 2. Construir el prompt
  const prompt = buildPrompt(user, recentSessions.slice(0, 5), latestMeasurement, exercises, request);

  // 3. Llamar a la API
  const aiResponse = await callAiProvider(aiConfig.provider, aiConfig.api_key, aiConfig.model, prompt);

  // 4. Parsear la respuesta
  let suggestion: AiRoutineSuggestion;
  try {
    suggestion = JSON.parse(aiResponse);
  } catch {
    // Intentar extraer JSON del texto si viene con markdown
    const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      suggestion = JSON.parse(jsonMatch[1]);
    } else {
      throw new Error('La IA no devolvió un JSON válido. Intenta de nuevo.');
    }
  }

  // 5. Validar que los ejercicios existan
  const validExerciseIds = new Set(exercises.map((e) => e.id));
  for (const day of suggestion.days) {
    for (const ex of day.exercises) {
      if (!validExerciseIds.has(ex.exercise_id)) {
        throw new Error(`Ejercicio inválido sugerido: ${ex.exercise_id}`);
      }
    }
  }

  // 6. Guardar la rutina
  const allExercises: {
    exercise_id: string;
    day_number: number;
    target_sets: number;
    target_reps_min: number;
    target_reps_max: number;
    sort_order: number;
  }[] = [];

  for (const day of suggestion.days) {
    day.exercises.forEach((ex, idx) => {
      allExercises.push({
        exercise_id: ex.exercise_id,
        day_number: day.day_number,
        target_sets: ex.target_sets,
        target_reps_min: ex.target_reps_min,
        target_reps_max: ex.target_reps_max,
        sort_order: idx + 1,
      });
    });
  }

  const routine = await routineModel.createRoutine(userId, {
    name: suggestion.name,
    description: suggestion.description,
    days_per_week: request.days_per_week || suggestion.days.length,
    is_active: true,
    exercises: allExercises,
  });

  return routine;
}

function buildPrompt(
  user: any,
  recentSessions: any[],
  latestMeasurement: any,
  exercises: Exercise[],
  request: AiGenerateRequest
): string {
  const equipmentList = request.equipment || ['bodyweight'];
  const days = request.days_per_week || 3;
  const goals = request.goals || 'mejorar condición física general';

  // Resumir sesiones recientes para dar contexto
  const sessionSummary = recentSessions.length > 0
    ? recentSessions.map((s) => `  - ${s.performed_at}: ${s.notes || 'Sin notas'}`).join('\n')
    : '  - No hay sesiones registradas aún.';

  // Medidas recientes
  const measurementText = latestMeasurement
    ? `Peso: ${latestMeasurement.weight}kg | Cintura: ${latestMeasurement.waist}cm | Pecho: ${latestMeasurement.chest}cm`
    : 'Sin mediciones registradas.';

  // Catálogo de ejercicios como JSON simplificado
  const catalogJSON = JSON.stringify(
    exercises.map((e) => ({
      id: e.id,
      name: e.name,
      type: e.type,
      difficulty: e.difficulty,
      muscles: e.target_muscles,
    }))
  );

  return `Eres un entrenador personal experto en calistenia y entrenamiento en casa.

DATOS DEL USUARIO:
- Nombre: ${user.nombre}
- Edad: ${user.edad || 'No especificada'}
- Altura: ${user.altura || 'No especificada'}m
- Peso actual: ${user.peso_actual || 'No especificado'}kg
- Medidas recientes: ${measurementText}
- Objetivo: ${goals}
- Equipamiento disponible: ${equipmentList.join(', ')}
- Días por semana: ${days}
- Descripción: ${user.descripcion || 'No especificada'}
- Meta a futuro: ${user.futuro_ideal || 'No especificada'}

SESIONES RECIENTES:
${sessionSummary}

CATÁLOGO DE EJERCICIOS DISPONIBLES:
${catalogJSON}

INSTRUCCIONES:
Genera una rutina de entrenamiento personalizada de ${days} días por semana basada en los datos del usuario.
- Utiliza SOLO ejercicios del catálogo proporcionado (usa su ID exacto).
- Distribuye los ejercicios equilibradamente entre los días.
- Considera el equipamiento disponible del usuario.
- Adapta la dificultad al nivel del usuario (principiante si tiene pocas sesiones, intermedio/avanzado si tiene más).
- Incluye variedad de grupos musculares.

Responde SOLO con JSON válido en este formato exacto, sin texto adicional:
{
  "name": "Nombre de la rutina",
  "description": "Breve descripción de la rutina y su enfoque",
  "days": [
    {
      "day_number": 1,
      "exercises": [
        {
          "exercise_id": "uuid-del-ejercicio",
          "target_sets": 3,
          "target_reps_min": 8,
          "target_reps_max": 12
        }
      ]
    }
  ]
}`;
}

async function callAiProvider(
  provider: string,
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  const url = provider === 'openai'
    ? 'https://api.openai.com/v1/chat/completions'
    : provider === 'deepseek'
    ? 'https://api.deepseek.com/v1/chat/completions'
    : provider === 'anthropic'
    ? 'https://api.anthropic.com/v1/messages'
    : provider === 'gemini'
    ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    : `https://api.openai.com/v1/chat/completions`; // fallback a OpenAI

  if (provider === 'openai' || provider === 'deepseek') {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || (provider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o-mini'),
        messages: [
          { role: 'system', content: 'Eres un entrenador personal experto. Genera rutinas de ejercicio en JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error de API (${provider}): ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  if (provider === 'anthropic') {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-3-haiku-20240307',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error de API (${provider}): ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  // Gemini
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error de API (${provider}): ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
