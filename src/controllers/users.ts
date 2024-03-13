import { Request, Response } from 'express';
import { createUser, getUserById, getUserByUsername } from "../models/User";
import logger from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  try {
    const {username} = req.body;

    if (!username) {
      return res.status(400).send("Make sure you have filled in correctly!");
    }

    const existingUser = await getUserByUsername(username);

    if (existingUser) return res.status(200).json(existingUser).end();

    const user = await createUser({ username });

    return res.status(200).json(user).end();
  } catch (error) {
    logger.log('error', error);
    return res.status(400).send("Make sure you have filled in correctly!");
  }
}

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await getUserById(userId).populate('products').exec();
    if(!user) return res.sendStatus(400);

    return res.status(200).json({
      user
    });
  } catch (error) {
    logger.log("error", error);
    return res.sendStatus(400);
  }
  
}