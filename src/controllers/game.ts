import { Request, Response } from "express";
import { getUserById } from "../models/User";
import { generatePoint, getRandomDecimal } from "../utils/service";
import { Game } from "../models/Game";
import { Chat } from "../models/Chat";
import logger from "../utils/logger";
import { checkAndCreateUser } from "../utils/user";



export const create = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body

    const user = await getUserById(userId);

    if(!user) return res.status(400).send("Make sure you have filled in correctly!");

    const player1 = await checkAndCreateUser('CPU 1');
    const player2 = await checkAndCreateUser('CPU 2');
    const player3 = await checkAndCreateUser('CPU 3');
    const player4 = await checkAndCreateUser('CPU 4');

    const players = [player1, player2, player3, player4]

    const gamePlayers = players.map(player => ({
      username: player.username,
      point: 100,
      multiplier: getRandomDecimal()
    }))

    gamePlayers.push({
      username: user.username,
      point: user.points,
      multiplier: 0,
    })


    const game = new Game({
      players: gamePlayers,
      winNumber: getRandomDecimal()
    });
    await game.save();

    const chat = new Chat({
      gameId: game._id,
      message: `Chat is started in ${game._id}`
    });
    await chat.save();

    return res.status(200).json({
      game,
      chat
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.status(400).send("Make sure you have filled in correctly!");
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const { username, gameId, point, multiplier } = req.body

    const game = await Game.findById(gameId);

    const updatedPlayer = {
      username,
      point,
      multiplier
    }

    if(game){
      game.players[4].point = point
      game.players[4].multiplier = multiplier
      await game.save()
    }

    const updateGame = await Game.findById(gameId)

    return res.status(200).json({
      game: updateGame
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.status(400).send("Make sure you have filled in correctly!");
  }
}