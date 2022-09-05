import db from '../util/database';
import moment from "moment";
import Joi from 'joi';


interface Post {
    id?: number,
    title: string,
    content: string,
    userid: number,
    createdAt?: string,
    updatedAt?: string,
}


export function getDateTime() {
    let format = "YYYY-MM-DD HH:mm:ss"
    let date = new Date();
    return moment(date).format(format);
}

export async function checkPost(target: string, filter: string[]) {
    let option: string[] = filter;
    const query = `SELECT * FROM post WHERE ${target} = "${option}" `

    return db.query(query)
        .then((post) => post[0])
        .catch((err) => err)

}


export function topPosts(filter: any) {
    let target = filter['likes'] ? 'likes' : "dislikes";
    let limit_value = filter[target];
    let tableName = 'post' + target;
    let specificUser = filter.userid ? `where post.userid = ${filter.userid} ` : "";

    let query = `
        select  post.userid , content,title, count(*) as ${target} from  
        ${tableName}  join post on ${tableName}.postid = post.id 
        ${specificUser}
        group by  post.userid  , content , title 
        order by ${target} desc
        limit ${limit_value} ;
    `

    return db.query(query)
        .then((post) => post[0])
        .catch((err) => err);



}

export async function fetchAllPosts() {

    let posts: any = await db.query(`
    select * from post 
    `)

    let likedposts = await db.query(`
    select * from postlikes
    `)

    let dislikedposts = await db.query(`
    select * from postdislikes
    `)


    return posts[0];

}


export function createUpdatePost(post_detail: Post) {
    let { id, userid, title, content } = post_detail;
    if (id) {
        return db.execute(`
        update post 
        set  title = '${title}' , content = '${content}' , updatedAt = '${getDateTime()}'
        where id = ${id};
        `)
            .then((result) => result)
            .catch((err) => err)
    }
    else {
        return db.execute(`
        insert into post ( userid , title , content , createdAt , updatedAt )
        values ( '${userid}', '${title}' , '${content}' , '${getDateTime()}' , '${getDateTime()}' )
        `)
            .then((result) => result)
            .catch((err) => err)
    }
}



// function removeLike(userid: number, postid: number) {
//     return db.execute(`
//         delete from postlikes where userid = '${userid}' and postid = '${postid}' ;
//         `)
//         .then((result) => result)
//         .catch((err) => err)
// }



// function addLike(userid: number, postid: number) {
//     db.execute(`
//         insert into postlikes (  userid , postid , createdAt )
//         values ( '${userid}', '${postid}', '${getDateTime()}' );
//         `)
//         .then((result) => result)
//         .catch((err) => err)
// }



// function removeDislike(userid: number, postid: number) {
//     return db.execute(`
//         delete from postdislikes where userid = '${userid}' and postid = '${postid}' ;
//         `)
//         .then((result) => result)
//         .catch((err) => err)
// }



// function addDislike(userid: number, postid: number) {
//     return db.execute(`
//     insert into postdislikes (  userid , postid , createdAt )
//     values ( '${userid}', '${postid}' , '${getDateTime()}' );
//     `)
//         .then((result) => result)
//         .catch((err) => err)
// }



// function isPostLiked(userid: number, postid: number) {
//     return db.query(`
//     select * from postlikes where userid = '${userid}' and postid = '${postid}' ;
//     `)
//         .then((result) => result)
//         .catch((err) => err)
// }



// function isPostDisiked(userid: number, postid: number) {
//     return db.query(`
//     select * from postdislikes where userid = '${userid}' and postid = '${postid}' ;
//     `)
//         .then((result) => result)
//         .catch((err) => err)
// }




export async function likeDislikePostModel(userid: number, postid: number, option_like_dislike: string) {

    let table = "post" + option_like_dislike;
    const query = `insert into ${table}  (  userid , postid , createdAt )
    values ( '${userid}', '${postid}', '${getDateTime()}' );`

    return db.query(query)
        .then((post) => post[0])
        .catch((err) => err);


}


// Validation for Post data 
export function validatePost(post: Post) {
    const postSchema = {
        title: Joi.string().min(5).required(),
        content: Joi.string().min(10).required(),
        userid: Joi.number().required()
    }
    return Joi.validate(post, postSchema)
};
