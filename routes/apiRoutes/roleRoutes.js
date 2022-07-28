const db = require('../../db/connection');
const router = require('express').Router();

router.get('/', (req,res) => {
    const sql = `SELECT id AS 'ID', title AS 'Title', salary AS 'Salary', department_id AS 'Dept. ID'
                FROM roles`;
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

router.get('/format', (req,res) => {
    const sql = `SELECT roles.id AS 'ID', roles.title AS 'Title', roles.salary AS 'Salary', departments.dept_name AS 'Dept. Name'
                FROM roles
                LEFT JOIN departments ON department_id = departments.id`;
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
    const sql = `SELECT id AS 'ID', title AS 'Title', salary AS 'Salary', department_id AS 'Dept. ID'
                FROM roles
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
    });
});

router.get('/:id/format', (req,res) => {
    const sql = `SELECT roles.id AS 'ID', roles.title AS 'Title', roles.salary AS 'Salary', departments.dept_name AS 'Dept. Name'
                FROM roles
                LEFT JOIN departments ON department_id = departments.id
                WHERE roles.id = ?`;
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
    });
});

module.exports = router;