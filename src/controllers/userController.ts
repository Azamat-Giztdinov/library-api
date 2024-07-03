import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { role }
  });
  
  res.json(user);
};
