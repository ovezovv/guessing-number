import express from 'express';
import { register,  getUserInfo } from '../controllers/users';

const usersRouter = express.Router();

usersRouter.post('/create', register);
usersRouter.get('/:userId', getUserInfo);

export default usersRouter;
