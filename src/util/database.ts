import mysql from 'mysql2';

const pool = mysql.createPool({
    host: process.env.HOST ,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})


// Export as promise to deal asyncronous operations
export default pool.promise();
