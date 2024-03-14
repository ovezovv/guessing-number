import express from 'express';
import { create, update } from '../controllers/game';

const gameRouter = express.Router();

gameRouter.post('/create', create);
gameRouter.put('/update', update);

export default gameRouter;
