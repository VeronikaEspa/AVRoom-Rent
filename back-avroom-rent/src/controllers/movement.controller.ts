import { Request, Response } from 'express';
import { Movement } from '../models/movement.model';
import { Device } from '../models/device.model';
import { logger } from '../config/logger.config';

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

export const createMovementByUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { idDevice, loanDate, returnDateExpected } = req.body;

  try {
    const device = await Device.findOne({ id: idDevice });
    if (!device || !device.available) {
      res.status(400).json({ message: 'El dispositivo no está disponible.' });
      return;
    }

    const movement = new Movement({
      idUser: id,
      idDevice,
      loanDate,
      returnDateExpected,
      loanStatus: 'active',
    });

    await movement.save();
    device.available = false;
    await device.save();

    res.status(201).json(movement);
  } catch (error) {
    logger.error('Error al registrar el movimiento', error);
    res.status(500).json({ message: 'Error al registrar movimiento', error });
  }
};

export const returnDevice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { idMovement } = req.params;
  const { returnDateActual } = req.body;

  try {
    const movement = await Movement.findOne({ id: idMovement });
    if (!movement) {
      res.status(404).json({ message: 'Movimiento no encontrado.' });
      return;
    }

    if (movement.loanStatus === 'returned') {
      res.status(400).json({ message: 'Movimiento ya fue devuelto.' });
      return;
    }

    movement.returnDateActual = returnDateActual;
    movement.loanStatus = 'returned';

    const device = await Device.findOne({ id: movement.idDevice });
    if (device) {
      device.available = true;
      await device.save();
    }

    await movement.save();

    res
      .status(200)
      .json({ message: 'Dispositivo devuelto con éxito.', movement });
  } catch (error) {
    logger.error('Error al devolver el dispositivo', error);
    res
      .status(500)
      .json({ message: 'Error al devolver el dispositivo', error });
  }
};