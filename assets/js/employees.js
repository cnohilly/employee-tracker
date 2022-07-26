const { response } = require('express');
const db = require('../../db/connection');

// function to query for all employees with relevant data from other tables
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

// function to get an array list of employees and their ids to use for inquirer prompts
function getEmployeesList(){
    return new Promise((resolve,reject) => {
        const sql = `SELECT * FROM employees`;
        db.query(sql,(err,rows) => {
            if(err){
                reject(err);
                return;
            }
            const list = rows.map(row => ({name:`${row.first_name} ${row.last_name}`,value:row.id}));
            resolve({
                ok:true,
                data: list
            });
        });
    });
}

// function to get an array list of employees excluding the specific id
function getEmployeesListExcludingID(id){
    return new Promise((resolve,reject) => {
        const sql = `SELECT * FROM employees
                    WHERE id <> ?`;
        db.query(sql,id,(err,rows) => {
            if(err){
                reject(err);
                return;
            }
            const list = rows.map(row => ({name:`${row.first_name} ${row.last_name}`,value:row.id}));
            resolve({
                ok:true,
                data: list
            });
        });
    });
}

// function to get a list of the current managers
function getManagersList(){
    return new Promise((resolve,reject) => {
        const sql = `SELECT CONCAT(mng.first_name,' ', mng.last_name) AS name, mng.id
                    FROM employees emp
                    LEFT JOIN employees mng ON emp.manager_id = mng.id
                    WHERE emp.manager_id IS NOT NULL
                    GROUP BY mng.id`;
        db.query(sql,(err,rows) => {
            if(err){
                reject(err);
                return;
            }
            const list = rows.map(row => ({name:`${row.name}`,value:row.id}));
            resolve({
                ok:true,
                data:list
            });
        });
    });
}

// function to add an employee to the database using provided information
function addEmployee(first_name, last_name, role_id, manager_id) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                    VALUES (?,?,?,?)`;
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

// function to update the employee specified by id for the given column or field to the new supplied value
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

// function to query employees based on their manager
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
                data: rows
            });
        });
    });
}

// function to query employees based on the department they work for
function getEmployeesByDepartment(department_id){
    return new Promise((resolve, reject) => {
        const sql = `SELECT employees.id AS 'ID', employees.first_name AS 'First Name', employees.last_name AS 'Last Name', roles.title AS 'Title', roles.salary AS 'Salary'
                    FROM employees
                    LEFT JOIN roles ON employees.role_id = roles.id
                    WHERE roles.department_id = ?`;
        db.query(sql, department_id,(err, rows) => {
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

// function to remove an employee by the specified id
function removeEmployeeByID(id){
    return new Promise((resolve,reject) => {
        const sql = `DELETE FROM employees
                    WHERE id = ?`;
        db.query(sql,id,err => {
            if (err){
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: 'Employee deleted from the database.'
            });
        });
    });
}

module.exports = {getAllEmployees,getEmployeesList,getEmployeesListExcludingID,getManagersList,addEmployee,updateEmployee,getEmployeesByManager,getEmployeesByDepartment,removeEmployeeByID};