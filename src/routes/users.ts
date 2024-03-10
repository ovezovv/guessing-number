import express from 'express';
import { register, login, updatePassword, logout, deleteUser, getUserByToken, getUserDetailsBySessionToken, updateUser, followPeople, likePeople, likeProduct, getUserInfo, getUserEmails } from '../controllers/users';
import { isAuthenticated } from '../middlewares';

const usersRouter = express.Router();

usersRouter.post('/sign-up', register);
usersRouter.post('/sign-in', login);
usersRouter.get('/token/:sessionToken', getUserByToken);

usersRouter.get('/emails', isAuthenticated, getUserEmails);

usersRouter.get('/details', getUserDetailsBySessionToken);
usersRouter.get('/:userId', getUserInfo);

usersRouter.put('/update-password', isAuthenticated, updatePassword);
usersRouter.put('/update-user', isAuthenticated, updateUser);

usersRouter.post('/follow/:id', isAuthenticated, followPeople);
usersRouter.post('/like-people/:id', isAuthenticated, likePeople);
usersRouter.post('/like-product/:id', isAuthenticated, likeProduct);

usersRouter.post('/logout', isAuthenticated, logout);
usersRouter.delete('/delete', isAuthenticated, deleteUser);

export default usersRouter;
