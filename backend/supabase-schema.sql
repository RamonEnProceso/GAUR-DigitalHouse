-- =====================================================
-- GAUR - Database Schema (PostgreSQL / Supabase)
-- Ejecutar en el SQL Editor de Supabase
-- =====================================================

-- 1. USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL DEFAULT 'Usuario',
  edad INTEGER,
  cumpleaños DATE,
  altura DECIMAL(5,2),
  peso_actual DECIMAL(5,2),
  descripcion TEXT,
  futuro_ideal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EXERCISES (catálogo de ejercicios)
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('calisthenics', 'dumbbell', 'bar', 'bands')),
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  target_muscles TEXT[] DEFAULT '{}',
  instructions TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WORKOUT_SESSIONS (entrenamientos diarios)
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notes TEXT,
  performed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WORKOUT_SETS (series dentro de una sesión)
CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  reps INTEGER NOT NULL,
  weight DECIMAL(5,2),
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  notes TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BODY_MEASUREMENTS (medidas corporales)
CREATE TABLE body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2),
  waist DECIMAL(5,2),
  chest DECIMAL(5,2),
  left_arm DECIMAL(5,2),
  right_arm DECIMAL(5,2),
  left_thigh DECIMAL(5,2),
  right_thigh DECIMAL(5,2),
  neck DECIMAL(5,2),
  photo_url TEXT,
  notes TEXT,
  measured_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI_CONFIGS (API key por usuario)
CREATE TABLE ai_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  provider VARCHAR(20) NOT NULL DEFAULT 'openai',
  api_key VARCHAR(500) NOT NULL,
  model VARCHAR(50) DEFAULT 'gpt-4o-mini',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ROUTINES (rutinas generadas por IA)
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  days_per_week INTEGER NOT NULL DEFAULT 3,
  is_active BOOLEAN DEFAULT false,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ROUTINE_EXERCISES (ejercicios dentro de una rutina)
CREATE TABLE routine_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  day_number INTEGER NOT NULL,
  target_sets INTEGER NOT NULL DEFAULT 3,
  target_reps_min INTEGER,
  target_reps_max INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Usuario por defecto
INSERT INTO users (id, nombre, edad, cumpleaños, altura, peso_actual, descripcion, futuro_ideal)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Ramón',
  22,
  '2003-09-01',
  1.75,
  94,
  'Desarrollador apasionado por la tecnología y el fitness.',
  'Ser un profesional versátil en desarrollo full-stack y mantener un estilo de vida saludable.'
);

-- Ejercicios de calistenia
INSERT INTO exercises (name, description, type, difficulty, target_muscles, instructions) VALUES
('Flexiones de pecho', 'Ejercicio clásico de empuje horizontal. Trabaja pecho, hombros y tríceps.', 'calisthenics', 'beginner', '{chest,shoulders,triceps}', 'Manos separadas al ancho de hombros, cuerpo recto, baja el pecho hasta casi tocar el suelo y empuja hacia arriba.'),
('Flexiones diamante', 'Variante cerrada que enfatiza tríceps y pecho interno.', 'calisthenics', 'intermediate', '{triceps,chest,shoulders}', 'Forma un diamante con tus manos debajo del pecho. Baja manteniendo codos pegados al cuerpo.'),
('Flexiones declinadas', 'Variante con pies elevados que enfatiza la parte superior del pecho.', 'calisthenics', 'intermediate', '{chest,shoulders,triceps}', 'Coloca los pies en una silla, manos en el suelo. Baja y sube manteniendo el cuerpo recto.'),
('Dominadas (Pull-ups)', 'Ejercicio fundamental de espalda. Agarre prono, manos al ancho de hombros.', 'calisthenics', 'intermediate', '{back,biceps,forearms}', 'Cuélgate de la barra con agarre prono. Tira hacia arriba hasta que la barbilla pase la barra.'),
('Dominadas supinas (Chin-ups)', 'Variante con agarre supino que enfatiza bíceps.', 'calisthenics', 'intermediate', '{biceps,back,forearms}', 'Agarre supino (palmas hacia ti). Tira hacia arriba llevando el pecho a la barra.'),
('Fondos en paralelas (Dips)', 'Ejercicio compuesto para tríceps y pecho inferior.', 'calisthenics', 'intermediate', '{triceps,chest,shoulders}', 'Sujeta las barras paralelas, baja flexionando codos a 90°, sube sin bloquear.'),
('Sentadillas (Bodyweight Squats)', 'Ejercicio fundamental de piernas.', 'calisthenics', 'beginner', '{quads,glutes,hamstrings,core}', 'Pies al ancho de hombros, baja como si te sentaras en una silla, mantén el pecho erguido.'),
('Sentadillas búlgaras', 'Variante unilateral que intensifica el trabajo de piernas.', 'calisthenics', 'advanced', '{quads,glutes,hamstrings}', 'Coloca un pie atrás en una silla. Baja con la pierna delantera hasta que el muslo quede paralelo.'),
('Zancadas (Lunges)', 'Ejercicio unilateral para piernas y glúteos.', 'calisthenics', 'beginner', '{quads,glutes,hamstrings}', 'Da un paso al frente, baja ambas rodillas a 90°. Alterna las piernas.'),
('Plancha', 'Ejercicio isométrico para core.', 'calisthenics', 'beginner', '{core,shoulders,back}', 'Apoya antebrazos y puntas de pies. Cuerpo recto, contrae el abdomen.'),
('Plancha lateral', 'Variante unilateral para oblicuos.', 'calisthenics', 'intermediate', '{obliques,core,shoulders}', 'Apoyo en un antebrazo, cuerpo recto de lado. Mantén la posición.'),
('Burpees', 'Ejercicio explosivo de cuerpo completo.', 'calisthenics', 'intermediate', '{full_body,chest,quads,core}', 'De pie, baja a sentadilla, lleva pies atrás a plancha, explosión hacia arriba.'),
('Mountain Climbers', 'Ejercicio dinámico para cardio y core.', 'calisthenics', 'beginner', '{core,shoulders,hip_flexors}', 'En posición de plancha, lleva rodillas al pecho alternando rápidamente.'),
('Puente de glúteos (Glute Bridge)', 'Ejercicio para activar y fortalecer glúteos.', 'calisthenics', 'beginner', '{glutes,hamstrings,lower_back}', 'Acostado boca arriba, rodillas flexionadas. Eleva la cadera hacia arriba.'),
('Australian Pull-ups', 'Dominadas australianas con barra baja. Ideal para principiantes.', 'calisthenics', 'beginner', '{back,biceps,core}', 'Agarrar la barra a la altura del pecho con el cuerpo inclinado. Tira del pecho hacia la barra.'),

-- Ejercicios con mancuernas
('Press de hombros con mancuernas', 'Empuje vertical para desarrollo de hombros.', 'dumbbell', 'intermediate', '{shoulders,triceps}', 'Mancuernas a la altura de los hombros. Empuja hacia arriba hasta extender brazos.'),
('Remo con mancuerna a una mano', 'Ejercicio unilateral de espalda.', 'dumbbell', 'intermediate', '{back,biceps,core}', 'Apoya rodilla y mano en un banco. Rema la mancuerna hacia la cadera.'),
('Press de banca con mancuernas', 'Empuje horizontal con mancuernas para pecho.', 'dumbbell', 'intermediate', '{chest,shoulders,triceps}', 'Acostado en banco, mancuernas a los lados del pecho. Empuja hacia arriba.'),
('Curl de bíceps con mancuernas', 'Aislamiento de bíceps.', 'dumbbell', 'beginner', '{biceps,forearms}', 'De pie, palmas hacia arriba. Flexiona codos llevando las mancuernas al hombro.'),
('Peso muerto con mancuernas', 'Ejercicio compuesto para cadena posterior.', 'dumbbell', 'intermediate', '{hamstrings,glutes,lower_back,core}', 'Mancuernas al frente, empuja cadera atrás, baja manteniendo espalda recta.'),
('Elevaciones laterales', 'Aislamiento del hombro lateral.', 'dumbbell', 'beginner', '{shoulders,traps}', 'Mancuernas a los lados, eleva hasta la altura de los hombros con codos ligeramente flexionados.'),
('Sentadillas con mancuerna (Goblet Squat)', 'Sentadilla asistida con mancuerna al pecho.', 'dumbbell', 'beginner', '{quads,glutes,core}', 'Mancuerna en el pecho, baja en sentadilla manteniendo el codo dentro de las rodillas.'),
('Press francés con mancuerna', 'Extensión de tríceps acostado.', 'dumbbell', 'intermediate', '{triceps}', 'Acostado, mancuerna sobre la cabeza, flexiona codos llevando la mancuerna detrás de la cabeza.'),

-- Ejercicios con barra
('Remo con barra (Barbell Row)', 'Remo horizontal para espalda.', 'bar', 'intermediate', '{back,biceps,core}', 'Barra al suelo, espalda recta, rema la barra hacia el abdomen.'),
('Press militar con barra', 'Empuje vertical con barra.', 'bar', 'intermediate', '{shoulders,triceps,core}', 'Barra frente a los hombros, empuja hacia arriba.'),
('Peso muerto convencional', 'Ejercicio rey de cadena posterior.', 'bar', 'advanced', '{hamstrings,glutes,lower_back,traps,core}', 'Barra en el suelo, espalda recta, levanta empujando caderas hacia adelante.'),
('Sentadilla frontal con barra', 'Sentadilla con barra al frente.', 'bar', 'advanced', '{quads,glutes,core}', 'Barra apoyada en hombros frontales. Baja en sentadilla profunda.'),

-- Ejercicios con bandas
('Pull-aparts con banda', 'Aperturas con banda para hombros y espalda alta.', 'bands', 'beginner', '{shoulders,upper_back,rear_delts}', 'Banda al frente, estira hacia los lados.'),
('Sentadilla con banda', 'Sentadilla asistida con banda de resistencia.', 'bands', 'beginner', '{quads,glutes,hamstrings}', 'Pisa la banda, llévala a los hombros. Haz sentadilla sintiendo la resistencia.');

-- Sesión de ejemplo (hoy)
INSERT INTO workout_sessions (id, user_id, notes, performed_at, duration_minutes)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'Entrenamiento de empuje - sesión completa',
  CURRENT_DATE,
  45
);

-- Series de ejemplo
INSERT INTO workout_sets (session_id, exercise_id, reps, weight, rpe, sort_order)
SELECT
  '00000000-0000-0000-0000-000000000010',
  e.id,
  reps,
  weight,
  rpe,
  sort_order
FROM (VALUES
  ('Flexiones de pecho', 15, NULL, 8, 1),
  ('Flexiones de pecho', 12, NULL, 9, 2),
  ('Flexiones de pecho', 10, NULL, 10, 3),
  ('Press de hombros con mancuernas', 10, 12, 8, 4),
  ('Press de hombros con mancuernas', 8, 12, 9, 5),
  ('Press de hombros con mancuernas', 6, 14, 10, 6),
  ('Elevaciones laterales', 12, 6, 8, 7),
  ('Elevaciones laterales', 10, 6, 9, 8),
  ('Fondos en paralelas (Dips)', 10, NULL, 8, 9),
  ('Fondos en paralelas (Dips)', 8, NULL, 9, 10)
) AS data(name, reps, weight, rpe, sort_order)
JOIN exercises e ON e.name = data.name;

-- Medida corporal de ejemplo
INSERT INTO body_measurements (user_id, weight, waist, chest, left_arm, right_arm, measured_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  94,
  100,
  108,
  38,
  38,
  CURRENT_DATE
);
