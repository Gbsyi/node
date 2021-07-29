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

//Добавление новых домов
router.post('/requests',(req,res)=>{
    try{
        let {name,description,type} = req.body;
        if(!name || !description || !type){
            return res.json({
                type:"Missing",
                message:"Required fields are missing."
            });
        }
        pool.query('INSERT INTO `houses`(`name`, `description`, `type`) VALUES (?,?,?)',[name,description,type]).then((result)=>{
            res.json({
                type:"Success",
                response_args:result[0]
            });
        }).catch((e) =>{
            res.json({
                type:"Error",
                error:e
            });
        });

    }catch (e){
        res.status(500).json(e)
    }
});

//Вывод всех домов
router.get('/requests',(req,res) => {
    try{
        pool.query('SELECT * FROM `houses`').then((data) =>{
            res.json({
                type:"Success",
                result_args:data
            });
        }).catch((e) => {
            res.json({
                type: "Error",
                message: e
            });
        });
    }catch(e){
        res.json({
            type:"Error",
            error:e
        });
    }
});

//Изменение информации о доме
router.put('/requests/:id',(req,res) =>{
    try{
        let params = req.params;
        if(!params.id) return res.status(404).json({
            type:"Error",
            message:"Missing id."
        })
        let {name, description, type} = req.query;
        if(!name && !description && !type){
            return res.status(400).json({
                type:"Missing",
                message:"There must be at least one argument."
            })
        }
        let sql =`UPDATE houses SET ${name ? 'name=\'' + name + '\'' : ''} ${description ? `${!name ? '' : ','}description=\'` + description + '\'' : ''} ${type ? `${!name && !description ? '' : ','}type=\'`+type + '\'' : ''} WHERE houses.id = ${params.id} `;
        pool.query(sql)
        .then((result) => {
            if(result[0].changedRows == 0){
                return res.status(404).json({
                    type:"Error",
                    message:"Unknown id"
                })
            }
            res.status(201).json({
                type:"Success",
                response_args:result[0]
            });
        }).catch((e) => {
            if(e.code == 'ER_BAD_FIELD_ERROR'){
                return res.status(404).json({
                    type:"Error",
                    message:"Bad field"
                })
            }
            res.status(500).json({
                type:"Error",
                error:e
            });
        })
    }catch(e){
        res.json({
            type:"Error",
            error:e
        });
    }
});
router.delete('/requests/:id', (req,res) => {
    try{
        let id = req.params.id;
        if(!id) 
            return res.status(404).json({
                type:"Error",
                message:"Missing id."
            })
        pool.query("DELETE FROM `houses` WHERE `id`=?",[id]).then((result) =>{
            res.status(201).json({
                type:"Success",
                response_args:result[0]
            })
        }).catch((e) => {
            if(e.code == 'ER_BAD_FIELD_ERROR'){
                return res.status(404).json({
                    type:"Error",
                    message:"Bad field"
                })
            }
            res.status(500).json({
                type:"Error",
                error:e
            })
        });
    }catch(e){
        console.log(e.message)
        res.status(500).json({
            type:"Error",
            error:e
        })
    }
});

export default router;