import db from '../util/database';
import bcrypt from 'bcrypt';
import { private_key } from '../util/rsa_keys';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { getDateTime } from '../model/post_model'


interface User {
    id?: number,
    name: string,
    email: string,
    password: string,
    marital_status: number,
    mobile: number,
    city: string
}



export function fetchUsersDetail(filter: string[], skip: number, limit: number, sort: string, userid: number) {

    let paging: string = ` limit ${skip} , ${limit} `;;
    let sorting: string = "";
    let condition = "";

    if (sort) {
        let parts = sort.split(':');
        sorting = `order by ${parts[0]} ${parts[1]}`
    }

    if (Number.isNaN(limit) || Number.isNaN(skip)) {
        paging = "";
    }

    if (userid) {
        condition = `where id = ${userid}`
    }
    console.log(userid);


    const query = `
        select ${filter} from user 
        ${condition}
        ${sorting}
        ${paging} ;
    `
    return db.query(query)
        .then((user) => {
            return user[0]
        })
        .catch((err) => {
            return err
        })

}


//Check a user Exist in the user table or not
export async function checkUser(target: string, filter: string[]) {
    let option: string[] = filter;
    const query = `SELECT * FROM user WHERE ${target} = "${option}" `;
    return db.query(query)
        .then((user) => user[0])
        .catch((err) => err);
}


// create a new user in the user table
export async function CreateUser(user_detail: User) {
    let { name, email, password, marital_status, mobile, city } = user_detail

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt)

    const query = `
        insert into user(name, email, password, marital_status , mobile , city , createdAt)
        values ( '${name}' , '${email}' , '${hashed_password}' , '${marital_status}', '${mobile}' , '${city}' , '${getDateTime()}' );
    `

    return db.execute(query)
        .then((result) => result)
        .catch((err) => err)
}


// return JWT-RSA Token , 
export async function generateRsaToken(userInfo: User) {

    let payload: any = {};

    payload.id = userInfo.id;
    payload.name = userInfo.name;
    payload.email = userInfo.email;

    let iss = "tahseenzaid";
    let sub = 'nodejsassignment';
    let aud = "webline seniors";
    let exp = '24h';

    let options: jwt.SignOptions = {
        issuer: iss,
        subject: sub,
        audience: aud,
        expiresIn: exp,
        algorithm: "RS256"
    }


    const token = await jwt.sign(payload, private_key, options);
    return token;

}



export function validateUser(user: User) {
    const userSchema = {
        name: Joi.string().min(4).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(5).max(255).required(),
        marital_status: Joi.equal([0, 1]).required(),
        mobile: Joi.number().min(10).required(),
        city: Joi.string().min(3).max(20).required()
    }
    return Joi.validate(user, userSchema)
}