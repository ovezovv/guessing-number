import { Request, Response } from 'express';
import { User, createUser, deleteUserById, getUserByEmail, getUserById, getUserBySessionToken, getUserByUsername, updateUserById } from "../models/User";
import { authentication, random } from "../helpers";
import logger from '../utils/logger';
import { UserFollowers } from '../models/User/Followers';
import { UserFollowings } from '../models/User/Followings';
import { LikedPeople } from '../models/User/LikedPeople';
import { LikedProducts } from '../models/User/LikedProducts';
import { getProductById } from '../models/Product';

export const register = async (req: Request, res: Response) => {
  try {
    const {email, password, username} = req.body;

    if (!password || !username) {
      return res.status(400).send("Make sure you have filled in correctly!");
    }

    const existingUser = await getUserByUsername(username);

    if (existingUser) return res.status(400).send("Make sure you have filled in correctly!");

    const salt = random();
    const sessionToken = authentication(salt, username);
    const cookieExpireTime = new Date(new Date().getTime() + 60 * 60 * 1000);
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
        sessionToken
      }
    });

    res.cookie('FASHIONSOCIAL-AUTH', sessionToken, {
      domain: 'localhost',
      path: '/',
      expires: cookieExpireTime
    });

    return res.status(200).json(user).end();
  } catch (error) {
    logger.log('error', error);
    return res.status(400).send("Make sure you have filled in correctly!");
  }
}

// Change domain when it is uploaded to the server
export const login = async (req: Request, res: Response) => {
  try {
    let user;
    const {email, password, username} = req.body;

    if (!username || !password) return res.sendStatus(400);

    if (!username) {
      user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    } else {
      user = await getUserByUsername(username).select('+authentication.salt +authentication.password');
    }

    if (!user) return res.sendStatus(400);

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) return res.sendStatus(403);

    const salt = random();
    const cookieExpireTime = new Date(new Date().getTime() + 60 * 60 * 1000);
    user.authentication.sessionToken = authentication(salt, user._id.toString());
    await user.save();

    res.cookie('FASHIONSOCIAL-AUTH', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
      expires: cookieExpireTime
    })

    return res.status(200).json({
      result: "Succesfully logged in!",
      auth: {
        token: user.authentication.sessionToken,
        cookieTitle: 'FASHIONSOCIAL-AUTH'
      }
    }).end();
  } catch (error) {
    logger.log("error", error);
    return res.sendStatus(400)
  }
}

export const getUserByToken = async (req: Request, res: Response) => {
  try {
    const {sessionToken} = req.params;
    if (!sessionToken) return res.sendStatus(400);

    const user = await getUserBySessionToken(sessionToken);
    if (!user) return res.sendStatus(400);

    return res.status(200).json({
      result: "Successfully user was logged out",
      userId: user._id
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
};

export const getUserDetailsBySessionToken = async (req: Request, res: Response) => {
  try {
    const { cookie } = req.headers;
    const token = cookie?.slice(19, cookie.length);

    if(!token) return res.sendStatus(400);

    const user = await getUserBySessionToken(token);
    if (!user) return res.sendStatus(400);

     res.status(200).json({
      result: "Successfully user was fetched!",
      user
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
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

export const updatePassword = async (req: Request, res: Response) => {
  try {
    let existingUser;
    const {email, password, username} = req.body;

    if ((!email && !username) || !password) return res.sendStatus(400);

    if (!username) {
      existingUser = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    } else {
      existingUser = await getUserByUsername(username).select('+authentication.salt +authentication.password');
    }

    if (!existingUser) return res.sendStatus(400);

    const salt = random();
    await updateUserById(existingUser._id, {
      authentication: {
        salt,
        password: authentication(salt, password)
      }
    });
    
    logger.log('info', "Successfully user's password was updated");
    return res.status(200).json({
      result: "User's password was updated",
      userId: existingUser._id
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const {avatar, username, email, description, productLink} = req.body;
    if (!username) return res.sendStatus(400);

    const user = await getUserByUsername(username);

    if (!user) return res.sendStatus(400);

    user.set({
      avatar: avatar ?? user.avatar,
      username,
      email,
      description,
      productLink
    })

    await user.save();
    
    logger.log('info', "Successfully user's details were updated");
    return res.status(200).json({
      result: "User's profile was updated",
      user
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
}

export const followPeople = async (req: Request, res: Response) => {
  try {
    const followingId = req.params.id;
    const following = await getUserById(followingId);

    const sessionToken = req.cookies['FASHIONSOCIAL-AUTH'];
    const user = await getUserBySessionToken(sessionToken);

    if(!user || !following) return res.sendStatus(400);

    if ( user.username === following.username) return res.status(200).json({
      result: "You aren't able follow yourself!"
    }).end();

    const isExist = await UserFollowings.findOne({userId: user._id, username: following.username });

    if ( isExist ) {
      return res.status(200).json({
        result: "You have already followed!"
      }).end();
    } else {
      const newFollowingData = new UserFollowings({
        userId: user._id,
        username: following.username
      })
  
      const newFollowerData = new UserFollowers({
        userId: following._id,
        username: user.username
      })
  
      const newFollowing = await newFollowingData.save();
      const newFollower = await newFollowerData.save();
  
      user.followings.push(newFollowing._id);
      await user.save();
  
      following.followers.push(newFollower._id);
      await following.save();
  
      return res.status(200).json({
        result: "You have followed!"
      }).end();
    }

  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
}

export const likePeople = async (req: Request, res: Response) => {
  try {
    const peopleId = req.params.id;
    const people = await getUserById(peopleId);

    const sessionToken = req.cookies['FASHIONSOCIAL-AUTH'];
    const user = await getUserBySessionToken(sessionToken);

    if(!user || !people) return res.sendStatus(400);

    const isExist = await LikedPeople.findOne({userId: user._id, username: people.username });

    if ( isExist ) return res.status(200).json({
      result: "You have already liked this person!"
    }).end();

    const likedPeopleData = new LikedPeople({
      userId: user._id,
      username: people.username
    });
    const likedPeople = await likedPeopleData.save();

    user.likedPeople.push(likedPeople._id);
    await user.save();

    return res.status(200).json({
      result: "You have just liked people!"
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
}

export const likeProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await getProductById(productId);

    const sessionToken = req.cookies['FASHIONSOCIAL-AUTH'];
    const user = await getUserBySessionToken(sessionToken);

    if(!user || !product) return res.sendStatus(400);

    const isExist = await LikedProducts.findOne({userId: user._id, productId: product._id });

    if ( isExist ) return res.status(200).json({
      result: "You have already liked this product!"
    }).end();

    const likedProductData = new LikedProducts({
      userId: user._id,
      productId: product._id
    });
    const likedProduct = await likedProductData.save();

    user.likedProducts.push(likedProduct._id);
    await user.save();

    return res.status(200).json({
      result: "You have just liked product!"
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const sessionToken = req.cookies['FASHIONSOCIAL-AUTH'];
    const user = await getUserBySessionToken(sessionToken).select('+authentication.salt +authentication.password');

    if (!user) return res.sendStatus(400);

    await updateUserById(user._id, {
      authentication: {
        salt: user.authentication.salt,
        password: user.authentication.password
      }
    });

    res.clearCookie('FASHIONSOCIAL-AUTH')

    logger.log('info', "Successfully user was logged out");
    return res.status(200).json({
      result: "Successfully user was logged out",
      userId: user._id
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const {userId} = req.body;
    if (!userId) return res.sendStatus(400);

    const user = await getUserById(userId);
    if (!user) return res.sendStatus(400);

    await deleteUserById(userId)

    logger.log('info', "Successfully user was deleted");
    return res.status(200).json({
      result: "Successfully user was deleted",
      userId
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
}

export const getUserEmails = async (req: Request, res: Response) => {
  try {    
    const users = await User.find();
    const userEmails = users.map((user) => ({
      userId: user._id,
      username: user.username,
      email: user.email
    }));

    return res.status(200).json({
      result: "Successfully these are registered user's emails",
      users: userEmails
    }).end();
  } catch (error) {
    logger.log('error', error);
    return res.sendStatus(400)
  }
}
