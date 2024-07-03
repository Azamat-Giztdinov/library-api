import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import _ from 'lodash';

const prisma = new PrismaClient();
const EMAIL_SECRET = process.env.EMAIL_SECRET || 'secret_key';

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

interface JwtPayload {
  userId: number;
  role: number;
}


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
export const register = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email
      }
    });

    jwt.sign(
      {
        user: _.pick(user, 'id'),
      },
      EMAIL_SECRET,
      {
        expiresIn: '1d',
      },
      (err, emailToken) => {
        const url = `http://${process.env.DOMAIN}/users/confirm/${emailToken}`;
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Подтверждение электронной почты',
          html: `
            <h1>Подтверждение электронной почты</h1>
            <p>Здравствуйте, ${username},</p>
            <p>Пожалуйста, подтвердите вашу электронную почту, перейдя по дзанной <a href="${url}">ссылке</a></p>
          `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error occurred:', error.message);
            return res.status(500).json({ error: 'Failed to send confirmation email' });
          }
          console.log('Message sent: %s', info.messageId);
          res.json(user);
        });
      }
    )
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: 'User already exists' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: '1h'
  });

  res.json({ token });
};

export const updateUserConfirm = async (req: Request, res: Response) => {
  try {
    const decodedToken = jwt.verify(req.params.token, EMAIL_SECRET) as JwtPayload & { user: { id: number } };
    
    const userId = decodedToken.user.id;
    
    await prisma.user.update({
      where: { id: userId },
      data: { confirmed: true }
    });

    res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid token or user does not exist' });
  }
};


export const me = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, username: true, email: true, role: true }
  });

  res.json(user);
};



