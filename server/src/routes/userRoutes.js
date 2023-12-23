import express from 'express';
import * as usersController from '../controllers/user.js';
import { authenticateJWT } from '../middleware/jwtAuth.js';

const router = express();

router.get('/', usersController.getUsers);
router.get('/me', authenticateJWT, usersController.getLoggedInUser);
router.get('/:id', usersController.getUser);
router.post("/", usersController.createUser);
router.patch("/:id", usersController.updateUser);
router.delete('/:id', usersController.deleteUser);



export default router;
