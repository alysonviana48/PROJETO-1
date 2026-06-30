import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middlewares/auth.middleware';

export const settingsRouter = Router();

settingsRouter.use(authMiddleware);

// GET /settings
settingsRouter.get('/', async (req, res) => {
  try {
    let settings = await prisma.settings.findUnique({
      where: { userId: req.userId },
    });

    // Cria settings padrão se ainda não existir
    if (!settings) {
      settings = await prisma.settings.create({
        data: { userId: req.userId },
      });
    }

    return res.json(settings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar configurações' });
  }
});

// PUT /settings
settingsRouter.put('/', async (req, res) => {
  try {
    const { workTime, shortBreakTime, longBreakTime } = req.body as {
      workTime: number;
      shortBreakTime: number;
      longBreakTime: number;
    };

    const settings = await prisma.settings.upsert({
      where: { userId: req.userId },
      update: { workTime, shortBreakTime, longBreakTime },
      create: { userId: req.userId, workTime, shortBreakTime, longBreakTime },
    });

    return res.json(settings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar configurações' });
  }
});