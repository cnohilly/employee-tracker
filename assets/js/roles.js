const db = require('../../db/connection');

function getAllRoles() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT roles.id AS 'ID', roles.title AS 'Title', departments.dept_name AS 'Department', roles.salary as 'Salary'
                    FROM roles
                    LEFT JOIN departments ON departments.id = roles.department_id`;
        db.query(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                data: rows
            });
        });
    });
}

function getRolesList() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM roles`;
        db.query(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const list = rows.map(row => ({ name: `${row.title}`, value: row.id }));
            resolve({
                ok: true,
                data: list
            });
        });
    });
}

module.exports = {getAllRoles, getRolesList};