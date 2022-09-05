import express from 'express';
import { createOrUpdatePost, getPosts, likeDislikePost , getTopPosts } from '../controller/post_controller'
import { userAuth } from '../middleware/user_auth';


const router: express.Router = express.Router();

router.get('/post', userAuth, getPosts);

router.get('/post/top', userAuth, getTopPosts);

router.post('/post', userAuth, createOrUpdatePost);

router.post('/post/:postid', userAuth, likeDislikePost );

export default router;