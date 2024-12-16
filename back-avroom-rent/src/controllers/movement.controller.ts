import { Request, Response } from 'express';
import { Movement } from '../models/movement.model';
import { Device } from '../models/device.model';
import { logger } from '../config/logger.config';
import { User } from '../models/user.model';

export const getAllMovement = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const movements = await Movement.find();
    res.status(200).json(movements);
  } catch (error) {
    logger.error('Error al obtener movimientos', error);
    res.status(500).json({ message: 'Error al obtener movimientos', error });
  }
};

export const getAllMovementByUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const movements = await Movement.find({ idUser: id }).populate('idDevice');
    res.status(200).json(movements);
  } catch (error) {
    logger.error(`Error al obtener movimientos para el usuario ${id}`, error);
    res.status(500).json({ message: 'Error al obtener movimientos', error });
  }
};

export const getAllMovementByDevice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: 'El ID del dispositivo es requerido.' });
    return;
  }

  try {
    const movements = await Movement.find({ idDevice: id }).exec();

    if (!movements || movements.length === 0) {
      res.status(200).json([]);
      return;
    }

    const movementsWithDetails = await Promise.all(
      movements.map(async (movement) => {
        const user = await User.findOne({ id: movement.idUser }).exec();
        const device = await Device.findOne({ id: movement.idDevice }).exec();

        return {
          ...movement.toObject(),
          userName: user?.username || 'Usuario no encontrado',
          deviceName: device?.name || 'Dispositivo no encontrado',
        };
      }),
    );

    res.status(200).json(movementsWithDetails);
  } catch (error) {
    logger.error(
      `Error al obtener movimientos para el dispositivo con id ${id}`,
      error,
    );
    res.status(500).json({ message: 'Error al obtener los movimientos' });
  }
};


export const createMovementByUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id: userIdFromParams } = req.params;
  const { deviceId, loanDate, returnDateExpected } = req.body;

  try {
    const device = await Device.findOne({ id: deviceId });
    const user = await User.findOne({ id: userIdFromParams });

    if (!device) {
      res.status(404).json({ message: 'Dispositivo no encontrado.' });
      return;
    }

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado.' });
      return;
    }

    if (!device.available) {
      res.status(400).json({ message: 'El dispositivo no está disponible.' });
      return;
    }

    const movement = new Movement({
      idUser: userIdFromParams,
      idDevice: deviceId,
      loanDate,
      returnDateExpected,
      loanStatus: 'active',
    });
    

    await movement.save();

    // El hook post-save en el modelo Movement se encargará de cambiar el estado del dispositivo
    res.status(201).json(movement);
    return;
  } catch (error) {
    logger.error('Error al registrar el movimiento', error);
    res.status(500).json({ message: 'Error al registrar movimiento', error });
    return;
  }
};
