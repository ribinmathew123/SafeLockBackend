import express from 'express';
import { userSignup,userLogin ,saveData,dataInfo,deleteData} from '../controllers/userController.js';
import { isAuthenticated } from "../Middlewares/middleware.js";

const userRouter = express.Router();

userRouter.post('/user-login', userLogin);

userRouter.post('/user-signup', userSignup);
userRouter.post('/save/:userId',isAuthenticated, saveData);
userRouter.get('/save/:userId',isAuthenticated, dataInfo);
userRouter.delete('/save/:id', isAuthenticated,deleteData);


export default userRouter;