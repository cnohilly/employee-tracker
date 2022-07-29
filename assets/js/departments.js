const db = require('../../db/connection');

function getAllDepartments() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id AS 'ID', dept_name AS 'Name'
                    FROM departments`;
        db.query(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                data: rows
            })
        })
    });
}

function getDepartmentsList() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM departments`;
        db.query(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const list = rows.map(row => ({ name: `${row.dept_name}`, value: row.id }));
            resolve({
                ok: true,
                data: list
            });
        });
    });
}

function addDepartment(dept_name){
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO departments (dept_name)
                    VALUES (?)`;
        db.query(sql, dept_name, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: 'New department added to the database.'
            });
        });
    });
}

module.exports = { getAllDepartments, getDepartmentsList };