import { Request, Response } from 'express';

import {
    createUpdatePost,
    fetchAllPosts,
    likeDislikePostModel,
    validatePost,
    checkPost,
    topPosts
} from '../model/post_model';


// {{url}}/api/post/top?likes=1&userid=10
// {{url}}/api/post/top?dislikes=1&userid=10
export async function getTopPosts(req: Request, res: Response) {
    try {
        let posts = await topPosts(req.query);
        res.status(200).send(posts);
    }
    catch (err: any) {
        res.status(400).send({ message: err.message })
    }
}


export async function getPosts(req: Request, res: Response) {
    try {
        let posts = await fetchAllPosts();
        res.status(200).send(posts);
    }
    catch (err: any) {
        res.status(400).send({ message: err.message })
    }
}


export async function createOrUpdatePost(req: Request, res: Response) {
    try {
        const { error } = validatePost(req.body)
        if (error) return res.status(400).send({ message: error.details[0].message })

        await createUpdatePost(req.body);
        res.status(201).send({ message: 'Post Created Successfully' })
    }
    catch (err: any) {
        res.status(400).send({ message: err.message })
    }
}


// localhost:5500/api/post/13?likes=true
// localhost:5500/api/post/13?dislikes=true

export async function likeDislikePost(req: Request, res: Response) {
    
    try {
        let optionLikeDislike: string = "";

        const postNotAvailable: any = await checkPost('id', [req.params.postid]);
        if (!postNotAvailable[0]) return res.status(400).send({ message: 'Post Not Exist' });

        if (req.query.likes || req.query.dislikes) {
            optionLikeDislike = req.query.likes === "true" ? "likes" : "dislikes";
            await likeDislikePostModel(req.body.userid, parseInt(req.params.postid), optionLikeDislike )
            res.status(200).send({ message: `Post ${optionLikeDislike}` });
        }
        else {
            res.status(400).send({ message: "Incorrect request with params" });
        }
    }

    catch (err: any) {
        res.status(400).send({ message: err.message });
    }
}







