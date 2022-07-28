const db = require('../../db/connection');

const router = require('express').Router();

router.get('/', (req,res) => {
    const sql = `SELECT id AS 'ID', dept_name AS 'Department Name'
                FROM departments`;
    db.query(sql, (err,rows) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message:'success',
            data: rows
        });
    });
});

router.get('/:id', (req,res) => {
    const sql = `SELECT id AS 'ID', dept_name AS 'Department Name'
                FROM departments
                WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err,row) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message:'success',
            data: row
        });
    })
})

module.exports = router;