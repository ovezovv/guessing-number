import express from 'express';
import usersRouter from './users';
import gameRouter from './game';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/game', gameRouter);

export default router;