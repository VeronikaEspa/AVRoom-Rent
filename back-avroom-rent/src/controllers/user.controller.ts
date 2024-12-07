import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.utils';
import { logger } from '../config/logger.config';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  console.log(password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('Intento de inicio de sesión con email inexistente', {
        email,
      });
      res.status(400).json({ message: 'Email o contraseña incorrectos' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Contraseña incorrecta para el usuario', { email });
      res.status(400).json({ message: 'Email o contraseña incorrectos' });
      return;
    }

    const token = generateToken({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    logger.info('Usuario autenticado con éxito', {
      userId: user.id,
      email: user.email,
    });
    res.status(200).json({ token });
  } catch (error) {
    logger.error('Error al autenticar usuario', { error, email });
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAllUsers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find();
    logger.info('Usuarios recuperados con éxito');
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error al obtener los usuarios', { error });
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Intento de crear un usuario con email existente', { email });
      res.status(400).json({ message: 'El email ya está registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      dateCreation: new Date(),
      role,
    });

    await newUser.save();

    logger.info('Usuario creado con éxito', {
      userId: newUser.id,
      email: newUser.email,
    });
    res.status(201).json(newUser);
  } catch (error) {
    logger.error('Error al crear usuario', { error });
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: 'Error interno del servidor', error: error.message });
    } else {
      res.status(400).json({ message: 'Error al crear usuario', error });
    }
  }
};
