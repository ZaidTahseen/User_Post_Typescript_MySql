import { fetchUsersDetail, CreateUser, checkUser, generateRsaToken, validateUser } from '../model/user_model';
import { Request, Response } from 'express';
import { userAuth } from '../middleware/user_auth';
import bcrypt from 'bcrypt';



// {{url}}/api/user?id=09
// {{url}}/api/user?skip=0&limit=10&sortBy=createdAt:asc
// {{url}}/api/user?skip=0&limit=10&sortBy=createdAt:desc
// {{url}}/api/user?id=11&skip=0&limit=10&sortBy=createdAt:desc
export async function getUsers(req: Request, res: Response) {
    try {
        let limit, skip, sort, userid;
        skip = parseInt(req.query.skip as any);
        limit = parseInt(req.query.limit as any);
        userid = parseInt(req.query.id as any);
        sort = req.query.sortBy as any;
        let userToken = userAuth(req, res);
        let filter: any = userToken === "u-token" ? ["*"] : ["name", "email", "id"];
        let users = await fetchUsersDetail(filter, skip, limit, sort, userid);
        res.status(200).send(users);

    }
    catch (err: any) {
        res.status(400).send({ message: err.message })
    }
}


export async function createUser(req: Request, res: Response) {
    try {
        const { error } = validateUser(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        let user: any = await checkUser('EMAIL', [req.body.email] )       
        if (user[0]) return res.status(400).send({ message: "User Already Created" });

        await CreateUser(req.body);
        res.status(201).send({ message: 'User Created Successfully' })
    }
    catch (err: any) {
        res.status(400).send({ message: err.message })
    }
}


export async function loginUser(req: Request, res: Response) {
    try {
        let recived_password = req.body.password;
        const user: any = await checkUser('EMAIL', [req.body.email]);
        if (user && user.length === 0) return res.status(400).send({ message: 'Invalid Email or Password' });

        const validPassword = await bcrypt.compare(recived_password, user[0].password);
        if (!validPassword) return res.status(400).send({ message: 'Invalid Email or Password' });

        const token = await generateRsaToken(user[0]);
        res.status(200).send({ message: "Logged In ", token });

    }
    catch (err: any) {
        res.status(400).send({ message: err.message })
    }
}







