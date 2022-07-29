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

module.exports = { getAllDepartments, getDepartmentsList };