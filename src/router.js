import Router from 'express';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "mysql",
    database: "testdb",
    password: "mysql"
});

const router = new Router();

router.post('/requests',(req,res)=>{
    try{
        let {name,description,type} = req.body;
        if(!name || !description || !type){
            return res.json({
                type:"Error",
                message:"Required fields are missing."
            })
        }
        pool.query('INSERT INTO `houses`(`name`, `description`, `type`) VALUES (?,?,?)',[name,description,type]).then((result)=>{
            res.json({
                type:"Success",
                response_args:result[0]
            })
        }).catch((e) =>{
            res.json({
                type:"Error",
                message:e.message
            })
        })

    }catch (e){
        res.status(500).json(e)
    }
});
router.get('/requests',(req,res) => {
    try{
        pool.query('SELECT * FROM `houses`').then((data) =>{
            res.json({
                type:"Success",
                result_args:data
            })
        }).catch((e) => {
            res.json({
                type: "Error",
                message: e.message
            })
        });
    }catch(e){
        res.json({
            type:"Error",
            message:e.message
        })
    }
});
router.put('/requests');
router.delete('/requests');

export default router;