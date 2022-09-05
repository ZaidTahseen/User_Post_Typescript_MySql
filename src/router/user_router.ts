import express from 'express';
import { getUsers, createUser, loginUser } from '../controller/user_controller' ;



const router: express.Router = express.Router();


// {{url}}/api/user?id=10 
router.get('/user', getUsers );

router.post('/user', createUser);

router.post('/user/login', loginUser);

export default router;