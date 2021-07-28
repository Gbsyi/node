import express from 'express';
import mysql from 'mysql2/promise';
import router from './src/router.js';

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "mysql",
    database: "Lager",
    password: "mysql"
});

const app = express();

app.use(express.json());
app.use('/api',router);

app.get('/', (req,res) => {
    res.send('Hi')
});

app.listen('8080', ()=>{
    console.log('Сервер запущен');
});