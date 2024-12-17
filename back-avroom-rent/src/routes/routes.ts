import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  loginUser,
  updateUserByID,
} from '../controllers/user.controller';
import {
  getAllDevices,
  createDevice,
  getDevice,
} from '../controllers/device.controller';
import {
  createMovementByUser,
  getAllMovementByDevice,
  getAllMovement,
  getAllMovementByUser,
  // returnDevice,
} from '../controllers/movement.controller';
import { expressAuthentication } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas
router.post('/login', loginUser);
router.post('/users', createUser);

// Middleware de autenticación
router.use(expressAuthentication('jwt'));

// Rutas de usuarios
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserByID);

// Rutas de dispositivos
router.get('/devices', getAllDevices);
router.get('/devices/:id', getDevice);
router.post('/devices', createDevice);
router.get('/devices/:id/movements', getAllMovementByDevice);

// Rutas de movimientos
router.get('/movements', getAllMovement);
router.get('/movements/users/:id', getAllMovementByUser);
// router.get('/movements/device/:id', getMovementByDevice);
router.post('/movements/users/:id', createMovementByUser);
// router.post('/movements/:idMovement/return', returnDevice);

export { router as deviceRoutes };