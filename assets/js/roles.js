const db = require('../../db/connection');

// function to query for all roles with relevant data from other tables
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

// function to get an array list of roles to use for inquirer prompts
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

// function to add a role with the provided information
function addRole(title, salary, department_id) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO roles (title,salary,department_id)
                    VALUES (?,?,?)`;
        params = [title, salary, department_id];
        db.query(sql, params, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: 'New role added to the database.'
            });
        });
    });
}

// function to remove a role of the specified id
function removeRoleByID(id) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM roles
                    WHERE id = ?`;
        db.query(sql, id, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: 'Role deleted from the database.'
            });
        });
    });
}

module.exports = { getAllRoles, getRolesList, addRole, removeRoleByID };