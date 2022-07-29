const inquirer = require("inquirer");
const db = require('./db/connection');
const { getAllEmployees, getEmployeesList, getEmployeesListExcludingID, addEmployee, updateEmployee, getEmployeesByManager, getEmployeesByDepartment } = require('./assets/js/employees');
const getRolesList = require('./assets/js/roles');
const cTable = require('console.table');

const mainMenuChoices = [   // index #
    'View All Employees',   // 0
    'Add Employee',         // 1
    'Update Employee Role', // 2
    'Update Employee Manager', // 3
    'View Employees by Manager', // 4
    'View Employees by Department', // 5
    'Remove Employee',  // 6
    'View All Roles', // 7
    'Add Role', // 8
    'Remove Role', // 9
    'View All Departments', // 10
    'Add Department', // 11
    'Remove Department', // 12
    'Quit']; // 13
const mainMenu = [
    {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: mainMenuChoices
    }
];

const connect = () => {
    return new Promise((resolve, reject) => {
        db.connect(err => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Database connected.');
            resolve({
                ok: true
            });
        });
    });
}

const getMainMenu = () => {
    return inquirer.prompt(mainMenu).then(data => {
        const index = mainMenuChoices.indexOf(data.choice);
        let employee_id,role_id,department_id,manager_id;
        switch (index) {
            case 0: // get all employees
                return getAllEmployees().then(response => {
                    console.table(response.data);
                    return getMainMenu();
                });
                break;
            case 1: // add employee
                return addEmployee('Chris', 'Nohilly', 2, '').then(response => {
                    console.log(response.message);
                    return getMainMenu();
                });
                break;
            case 2: // update employee role
                employee_id ='', role_id='';
                return getEmployeesList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee would you like to update?',
                        choices: response.data
                    });
                }).then(answers => {
                    employee_id = answers.employee;
                    return getRolesList();
                }).then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'role',
                        message: 'Which role would you like to assign to the employee?',
                        choices: response.data
                    });
                }).then(answers => {
                    role_id = answers.role;
                    return updateEmployee('role_id', employee_id, role_id);
                }).then(response => {
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
            case 3: // update employee manager
                employee_id ='', manager_id='';
                return getEmployeesList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee would you like to update?',
                        choices: response.data
                    });
                }).then(answers => {
                    employee_id = answers.employee;
                    return getEmployeesListExcludingID(employee_id);
                }).then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'role',
                        message: 'Which manager would you like to assign to the employee?',
                        choices: response.data
                    });
                }).then(answers => {
                    manager_id = answers.role;
                    return updateEmployee('manager_id', employee_id, manager_id);
                }).then(response => {
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
            case 4: // view employees by manager
                getEmployeesByManager(3).then(response => {
                    console.table(response.data);
                    return getMainMenu();
                });
                break;
            case 5: // view employees by department
                getEmployeesByDepartment(2).then(response => {
                    console.table(response.data);
                    return getMainMenu();
                });
                break;
            case 6: // remove employee
                break;
            case 7: // view all roles
                break;
            case 8: // add role
                break;
            case 9: // remove role
                break;
            case 10: // view all department
                break;
            case 11: // add department
                break;
            case 12: // remove department
                break;
            case 13: // quit
                return;

        }
    });
};

connect().then(response => {
    return getMainMenu();
}).then(() => {
    process.exit();
}).catch(err => {
    throw err;
});
