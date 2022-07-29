const db = require('../../db/connection');

// function to query for all the departments with relevant information
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

// function to get an array list of all of the departments and their id to use for inquirer prompts
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

// function to add a department to the database using the department name passed in
function addDepartment(dept_name) {
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

// function to delete the department for the given id from the database
function removeDepartmentByID(id) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM departments
                    WHERE id = ?`;
        db.query(sql, id, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: 'Department deleted from the database.'
            });
        });
    });
}

module.exports = { getAllDepartments, getDepartmentsList, addDepartment, removeDepartmentByID };