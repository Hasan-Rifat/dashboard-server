import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import uploader from '../../middlewares/multer';

const router = express.Router();

router.get('/', UserController.getAllUsers);
router.post('/login', UserController.login);
router.post(
  '/create-user',
  uploader.single('image'),
  //   validateRequest(UserValidation.create),
  UserController.createUser
);

router.get('/logout', UserController.logOut);
router.get('/refresh-token', UserController.refreshAccessToken);
router.get('/:id', UserController.getUserById);
router.patch(
  '/:id',
  validateRequest(UserValidation.update),
  UserController.updateUser
);
router.delete('/:id', UserController.deleteUser);
router.get('/active-account/:token', UserController.activeAccount);
export const UserRoutes = router;
