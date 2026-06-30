import express from 'express';
import cors from 'cors';
import { authRouter } from './routers/auth.routes';
import { settingsRouter } from './routers/settings.routes';
import { tasksRouter } from './routers/tasks.routes';

// Permite serializar BigInt como string no JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use('/auth', authRouter);
app.use('/settings', settingsRouter);
app.use('/tasks', tasksRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});