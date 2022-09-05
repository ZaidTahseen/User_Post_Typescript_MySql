import jwt from 'jsonwebtoken';
import { public_key } from '../util/rsa_keys';

export function userAuth(req: any, res: any, next?: any) {

    let iss = "tahseenzaid";
    let sub = 'nodejsassignment';
    let aud = "webline seniors";
    let exp = '24h';

    let verifyOptions = {
        issuer: iss,
        subject: sub,
        audience: aud,
        expiresIn: exp,
        algorithm: "RS256"
    }

    try {
        
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded: any = jwt.verify(token, public_key, verifyOptions);
       
        req.body.userid = decoded.id
        if (req.url.split('').splice(0, 5).join('') === '/user') {
            return 'u-token'
        }
        else {
            next();
        }
    }

    catch (err) {
        if (req.url === '/user') {
            return 'u-empty'
        }
        else {
            res.status(401).send({ message: 'Please Authenticate' })
        }
    }
}