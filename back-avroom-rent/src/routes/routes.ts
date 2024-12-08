import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  loginUser,
  updateUserByID,
} from '../controllers/user.controller';
import { getAllDevices, createDevice } from '../controllers/device.controller';
import {
  createMovementByUser,
  getAllMovementByDevice,
  getAllMovement,
  getAllMovementByUser,
  returnDevice,
} from '../controllers/movement.controller';
import { expressAuthentication } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', loginUser);

router.get('/device', expressAuthentication('jwt'), getAllDevices);
router.post('/device', expressAuthentication('jwt'), createDevice);
router.get(
  '/device/:id/movement',
  expressAuthentication('jwt'),
  getAllMovementByDevice,
);

router.get('/user', expressAuthentication('jwt'), getAllUsers);
router.post('/user', expressAuthentication('jwt'), createUser);
router.put('/user/:id', expressAuthentication('jwt'), updateUserByID);

router.get('/movement', expressAuthentication('jwt'), getAllMovement);
router.get(
  '/movement/user/:id',
  expressAuthentication('jwt'),
  getAllMovementByUser,
);
// router.get('/movement/device/:id', expressAuthentication('jwt'), getAllMovementByDevice);
router.post(
  '/movement/:id',
  expressAuthentication('jwt'),
  createMovementByUser,
);
router.post(
  '/movement/:idMovement/return',
  expressAuthentication('jwt'),
  returnDevice,
);

export { router as deviceRoutes };
