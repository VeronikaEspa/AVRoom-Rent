import { Request, Response } from 'express';
import { Device } from '../models/device.model';
import { logger } from '../config/logger.config';

export const getAllDevices = async (
  _req: Request,
  res: Response,
): Promise<void> => {

  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (error) {
    logger.error('Error al obtener los dispositivos', error);
    res.status(500).json({ message: 'Error al obtener dispositivos', error });
  }
};

export const getDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "El ID del dispositivo es requerido" });
    return;
  }

  try {
    const device = await Device.findOne({ id: id });

    if (!device) {
      res.status(404).json({ message: `Dispositivo con ID ${id} no encontrado` });
      return;
    }

    res.status(200).json(device);
  } catch (error) {
    logger.error("Error al obtener el dispositivo:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el dispositivo", error });
  }
};

export const createDevice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const newDevice = new Device(req.body);
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    logger.error('Error al crear dispositivo:', error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: 'Error interno del servidor', error: error.message });
    } else {
      res.status(400).json({ message: 'Error al crear dispositivo', error });
    }
  }
};
