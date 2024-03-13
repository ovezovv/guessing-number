import express from 'express';
import { register,  getUserInfo } from '../controllers/users';

const gameRouter = express.Router();

gameRouter.post('/create', register);

export default gameRouter;
