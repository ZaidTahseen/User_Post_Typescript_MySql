import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
const app = express();
import userRouter from './router/user_router';
import postRouter from './router/posts_router';


app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/api', userRouter);
app.use('/api', postRouter);

app.use('', (req: Request, res: Response) => {
	res.status(400).send({ message: "Route not found" })
});

const port = process.env.PORT;

app.listen(port, () => {
	console.log(`The App is Listening on port ${port}`);
});
