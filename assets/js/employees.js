const { response } = require('express');
const db = require('../../db/connection');

//   'View All Employees',   // 1
//   'Add Employee',         // 2
//   'Update Employee Role', // 3
//   'Update Employee Manager', // 4
//   'View Employees by Manager', // 5
//   'View Employees by Department', // 6
//   'Remove Employee',  // 7

function getAllEmployees() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT emp.id AS 'ID', emp.first_name AS 'First Name', emp.last_name AS 'Last Name', roles.title AS 'Title', departments.dept_name AS 'Department',
                     roles.salary AS 'Salary', CONCAT(mng.first_name, ' ', mng.last_name) AS 'Manager'
                    FROM employees emp
                    LEFT JOIN roles ON emp.role_id = roles.id
                    LEFT JOIN departments ON roles.department_id = departments.id
                    LEFT JOIN employees mng ON emp.manager_id = mng.id`;
        db.query(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: 'List of all employees retrieved.',
                data: rows
            });
        });
    });
}

function addEmployee(first_name, last_name, role_id, manager_id) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                    VALUES (?,?,?)`;
        const params = [first_name, last_name, role_id, manager_id || null];
        db.query(sql, params, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: 'Employee added to the database.',
            });
        });
    });
}

function updateEmployee(field, id, value) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE employees
                    SET ${field} = ?
                    WHERE id = ?`;
        const params = [value, id];
        db.query(sql, params, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: `Employee ${field} updated for employee ID #${id}.`,
            });
        });
    });
}

function getEmployeesByManager(manager_id){
    return new Promise((resolve, reject) => {
        const sql = `SELECT employees.id AS 'ID', employees.first_name AS 'First Name', employees.last_name AS 'Last Name', roles.title AS 'Title', departments.dept_name AS 'Department',
                     roles.salary AS 'Salary'
                    FROM employees
                    LEFT JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN departments ON roles.department_id = departments.id
                    WHERE employees.manager_id = ?`;
        db.query(sql, manager_id,(err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: 'List of all employees retrieved.',
                fields: fields,
                data: rows
            });
        });
    });
}

function getEmployeesByDepartment(department_id){
    return new Promise((resolve, reject) => {
        const sql = `SELECT employees.id AS 'ID', employees.first_name AS 'First Name', employees.last_name AS 'Last Name', roles.title AS 'Title', roles.salary AS 'Salary'
                    FROM employees
                    LEFT JOIN roles ON employees.role_id = roles.id
                    WHERE roles.department_id = ?`;
        db.query(sql, manager_id,(err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: 'List of all employees retrieved.',
                fields: fields,
                data: rows
            });
        });
    });
}

module.exports = {getAllEmployees,addEmployee,updateEmployee,getEmployeesByManager,getEmployeesByDepartment};