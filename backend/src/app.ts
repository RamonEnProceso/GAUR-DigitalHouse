import express from 'express';
import cors from 'cors';

import indexRoutes from './routes/index.routes.js';

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api', indexRoutes);

export default app;