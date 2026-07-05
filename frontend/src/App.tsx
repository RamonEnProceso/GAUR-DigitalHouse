import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WorkoutList from './pages/WorkoutList';
import WorkoutDetail from './pages/WorkoutDetail';
import WorkoutLog from './pages/WorkoutLog';
import Exercises from './pages/Exercises';
import ExerciseDetail from './pages/ExerciseDetail';
import Measurements from './pages/Measurements';
import MeasurementForm from './pages/MeasurementForm';
import Routines from './pages/Routines';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workouts" element={<WorkoutList />} />
        <Route path="/workouts/new" element={<WorkoutLog />} />
        <Route path="/workouts/:id" element={<WorkoutDetail />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route path="/measurements" element={<Measurements />} />
        <Route path="/measurements/new" element={<MeasurementForm />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
