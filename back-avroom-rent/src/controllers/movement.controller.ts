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
  const {
    deviceId,
    loanDate,
    returnDateExpected,
    description,
    returnDateActual,
    type,
  } = req.body;

  try {
    // Validar que el campo 'type' esté presente y sea válido
    if (!type || !['loan', 'return'].includes(type)) {
      res.status(400).json({
        message: 'Tipo de movimiento inválido. Debe ser "loan" o "return".',
      });
      return;
    }

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

    if (type === 'loan') {
      // Manejo de Préstamo

      if (!device.available) {
        res
          .status(400)
          .json({ message: 'El dispositivo no está disponible para préstamo.' });
        return;
      }

      // Crear un nuevo movimiento de préstamo
      const newMovement = new Movement({
        idUser: userIdFromParams,
        idDevice: deviceId,
        loanDate: loanDate ? new Date(loanDate) : new Date(),
        returnDateExpected: returnDateExpected
          ? new Date(returnDateExpected)
          : undefined,
        description: description || '',
        loanStatus: 'active',
      });

      await newMovement.save();

      // Actualizar la disponibilidad del dispositivo a 'no disponible'
      device.available = false;
      await device.save();

      res.status(201).json({
        message: 'Préstamo registrado exitosamente.',
        movement: newMovement,
      });
      return;
    } else if (type === 'return') {
      // Manejo de Devolución

      // Buscar un movimiento activo para este usuario y dispositivo
      const activeMovement = await Movement.findOne({
        idUser: userIdFromParams,
        idDevice: deviceId,
        loanStatus: 'active',
      });

      if (!activeMovement) {
        res.status(400).json({
          message:
            'No se encontró un movimiento de préstamo activo para este dispositivo y usuario.',
        });
        return;
      }

      // Actualizar el movimiento con la información de devolución
      activeMovement.returnDateActual = returnDateActual
        ? new Date(returnDateActual)
        : new Date();
      activeMovement.loanStatus = 'returned';
      activeMovement.description = description || activeMovement.description;

      await activeMovement.save();

      // Actualizar la disponibilidad del dispositivo a 'disponible'
      device.available = true;
      await device.save();

      res.status(200).json({
        message: 'Devolución registrada exitosamente.',
        movement: activeMovement,
      });
      return;
    }
  } catch (error) {
    logger.error('Error al registrar el movimiento', error);
    res
      .status(500)
      .json({ message: 'Error al registrar movimiento', error: error });
    return;
  }
};