const inquirer = require("inquirer");
const db = require('./db/connection');
const { getAllEmployees, getEmployeesList, getEmployeesListExcludingID, getManagersList, addEmployee, updateEmployee, getEmployeesByManager, getEmployeesByDepartment, removeEmployeeByID } = require('./assets/js/employees');
const { getAllRoles, getRolesList, addRole } = require('./assets/js/roles');
const getDepartmentsList = require('./assets/js/departments');
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
        let employee_id, role_id, department_id, manager_id, questions;
        switch (index) {
            case 0: // get all employees
                return getAllEmployees().then(response => {
                    console.table(response.data);
                    return getMainMenu();
                });
                break;
            case 1: // add employee
                questions = [
                    {
                        type: 'input',
                        name: 'first_name',
                        message: "What is the employee's first name?"
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: "What is the employee's last name?"
                    }
                ]
                return getRolesList().then(response => {
                    questions = [...questions, {
                        type: 'list',
                        name: 'role_id',
                        message: "What is the employee's role?",
                        choices: response.data
                    }];
                    return getEmployeesList();
                }).then(response => {
                    questions = [...questions, {
                        type: 'confirm',
                        name: 'hasManager',
                        message: 'Does the employee have a manger?'
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: "Who is the employee's manager?",
                        choices: response.data,
                        when: (answers) => answers.hasManager,
                        default: null
                    }];
                    return inquirer.prompt(questions);
                }).then(answers => {
                    return addEmployee(answers.first_name, answers.last_name, answers.role_id, answers.manager_id);
                }).then(response => {
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 2: // update employee role
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
                break;
            case 3: // update employee manager
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
                        name: 'manager',
                        message: 'Which manager would you like to assign to the employee?',
                        choices: response.data
                    });
                }).then(answers => {
                    manager_id = answers.manager;
                    return updateEmployee('manager_id', employee_id, manager_id);
                }).then(response => {
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 4: // view employees by manager
                return getManagersList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'manager',
                        message: 'Which manager would you like to view the employees of?',
                        choices: response.data
                    });
                }).then(answers => {
                    manager_id = answers.manager;
                    return getEmployeesByManager(manager_id);
                }).then(response => {
                    console.table(response.data);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 5: // view employees by department
                return getDepartmentsList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'department',
                        message: 'Which department would you like to view the employees of?',
                        choices: response.data
                    });
                }).then(answers => {
                    department_id = answers.department;
                    return getEmployeesByDepartment(department_id);
                }).then(response => {
                    console.table(response.data);
                    return getMainMenu();
                });
                break;
            case 6: // remove employee
                return getEmployeesList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee would you like to delete?',
                        choices: response.data
                    });
                }).then(answers => {
                    employee_id = answers.employee;
                    return removeEmployeeByID(employee_id);
                }).then(response => {
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 7: // view all roles
                return getAllRoles().then(response => {
                    console.table(response.data);
                    return getMainMenu();
                });
                break;
            case 8: // add role
                questions = [
                    {
                        type: 'input',
                        name: 'title',
                        message: 'What is the title of the new role?'
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'What is the salary for the new role?'
                    }
                ];
                return getDepartmentsList().then(response => {
                    questions = [...questions, {
                        type: 'list',
                        name: 'department_id',
                        message: 'Which department is this role for?',
                        choices: response.data
                    }];
                    return inquirer.prompt(questions);
                }).then(answers => {
                    return addRole(answers.title,answers.salary,answers.department_id);
                }).then(response =>{
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
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
