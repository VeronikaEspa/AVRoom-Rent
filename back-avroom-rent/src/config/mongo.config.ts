import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { config } from './environment.config';
import { logger } from './logger.config';

dotenv.config();

const MONGO_URI = config.mongo || process.env.MONGO_URI || '';

if (!MONGO_URI) {
  throw new Error('MONGO_URI no está definida en las variables de entorno.');
}

let isConnected = false;

const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    const connection = await mongoose.connect(MONGO_URI, {
      connectTimeoutMS: 10000,
    });
    isConnected = connection.connection.readyState === 1;
    logger.info('Conexión exitosa a MongoDB');
  } catch (error) {
    logger.error('Error al conectar con MongoDB:', error);
    throw error;
  }
};

export { connectToDatabase, mongoose };
