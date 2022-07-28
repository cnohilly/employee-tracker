const db = require('../../db/connection');
const router = require('express').Router();

router.get('/', (req,res) => {
    const sql = `SELECT id AS 'ID', first_name AS 'First Name', last_name AS 'Last Name', role_id AS 'Role ID', manager_id AS 'Manager ID'
                FROM employees`;
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
    const sql = `SELECT emp.id AS 'ID', emp.first_name AS 'First Name', emp.last_name AS 'Last Name', roles.title AS 'Title', departments.dept_name AS 'Department',
                 roles.salary AS 'Salary', CONCAT(mng.first_name, ' ', mng.last_name) AS 'Manager'
                FROM employees emp
                LEFT JOIN roles ON emp.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees mng ON emp.manager_id = mng.id`;
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
    const sql = `SELECT id AS 'ID', first_name AS 'First Name', last_name AS 'Last Name', role_id AS 'Role ID', manager_id AS 'Manager ID'
                FROM employees
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
    const sql = `SELECT emp.id AS 'ID', emp.first_name AS 'First Name', emp.last_name AS 'Last Name', roles.title AS 'Title', departments.dept_name AS 'Department',
                roles.salary AS 'Salary', CONCAT(mng.first_name, ' ', mng.last_name) AS 'Manager'
                FROM employees emp
                LEFT JOIN roles ON emp.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees mng ON emp.manager_id = mng.id
                WHERE emp.id = ?`;
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