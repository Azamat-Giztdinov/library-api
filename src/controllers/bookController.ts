import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addBook = async (req: Request, res: Response) => {
  const { title, author, publicationDate, genres } = req.body;
  
  try {
    const book = await prisma.book.create({
      data: {
        title,
        author,
        publicationDate: new Date(publicationDate),
        genres
      }
    });
    res.json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  const books = await prisma.book.findMany();
  res.json(books);
};

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = await checkbook(id);

  if (!book) return res.sendStatus(404);

  res.json(book);
};

export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { title, author, publicationDate, genres } = req.body;
  if(!await checkbook(id)) return res.sendStatus(404);

  const book = await prisma.book.update({
    where: { id: Number(id) },
    data: {
      title,
      author,
      publicationDate: new Date(publicationDate),
      genres
    }
  });

  res.json(book);
};

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!await checkbook(id)) return res.sendStatus(404);

  await prisma.book.delete({
    where: { id: Number(id) }
  });

  res.sendStatus(204);
};


const checkbook = async (id: String) => {
  return await prisma.book.findUnique({
    where: {id: Number(id)}
  })
} 