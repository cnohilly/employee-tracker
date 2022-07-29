const inquirer = require("inquirer");
const db = require('./db/connection');
const { getAllEmployees, getEmployeesList, getEmployeesListExcludingID, getManagersList, addEmployee, updateEmployee, getEmployeesByManager, getEmployeesByDepartment, removeEmployeeByID } = require('./assets/js/employees');
const { getAllRoles, getRolesList, addRole, removeRoleByID } = require('./assets/js/roles');
const { getAllDepartments, getDepartmentsList, addDepartment, removeDepartmentByID } = require('./assets/js/departments');
const cTable = require('console.table');

// list of choices for the main menu
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
// the main menu to be passed to inquirer
const mainMenu = [
    {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: mainMenuChoices
    }
];

// using promises when connecting to the database
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

// main menu for user to decide what action to take regarding the database
const getMainMenu = () => {
    // prompts the user with the main menu
    return inquirer.prompt(mainMenu).then(data => {
        // gets the index of the choice the user selected
        const index = mainMenuChoices.indexOf(data.choice);
        // variable declarations
        let employee_id, role_id, department_id, manager_id, questions;
        // switch statement using the index
        switch (index) {
            case 0: // get all employees
                return getAllEmployees().then(response => {
                    // prints the query response in a formatted table and returns to the main menu
                    console.table(response.data);
                    return getMainMenu();
                }).catch(err => { throw err; });
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
                // gets the list of roles to use for the question choices
                return getRolesList().then(response => {
                    questions = [...questions, {
                        type: 'list',
                        name: 'role_id',
                        message: "What is the employee's role?",
                        choices: response.data
                    }];
                    // gets the list of employees to get for the question choices
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
                    // prompts the user with the questions
                    return inquirer.prompt(questions);
                }).then(answers => {
                    // creates the new employee based on the user's responses
                    return addEmployee(answers.first_name, answers.last_name, answers.role_id, answers.manager_id);
                }).then(response => {
                    // logs the successful response and returns to main menu
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 2: // update employee role
                // gets employee list to use for question choices
                return getEmployeesList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee would you like to update?',
                        choices: response.data
                    });
                }).then(answers => {
                    // saves id variable and gets role list to use for question choices
                    employee_id = answers.employee;
                    return getRolesList();
                }).then(response => {
                    // prompts for which new role to assign
                    return inquirer.prompt({
                        type: 'list',
                        name: 'role',
                        message: 'Which role would you like to assign to the employee?',
                        choices: response.data
                    });
                }).then(answers => {
                    // updates the role for the employee based on user responses
                    role_id = answers.role;
                    return updateEmployee('role_id', employee_id, role_id);
                }).then(response => {
                    // logs the successful response and returns to main menu
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 3: // update employee manager
                // gets list of employees to use for question choices
                return getEmployeesList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee would you like to update?',
                        choices: response.data
                    });
                }).then(answers => {
                    // saves id and passes to get list of employees excluding the employee being altered
                    employee_id = answers.employee;
                    return getEmployeesListExcludingID(employee_id);
                }).then(response => {
                    // prompts the user for which manager to assign to the employee
                    return inquirer.prompt({
                        type: 'list',
                        name: 'manager',
                        message: 'Which manager would you like to assign to the employee?',
                        choices: response.data
                    });
                }).then(answers => {
                    // saves the id and updates the manager for the employee
                    manager_id = answers.manager;
                    return updateEmployee('manager_id', employee_id, manager_id);
                }).then(response => {
                    // logs the successful response and returns to main menu
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 4: // view employees by manager
                // gets list of managers to use for question choices
                return getManagersList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'manager',
                        message: 'Which manager would you like to view the employees of?',
                        choices: response.data
                    });
                }).then(answers => {
                    // saves the id and retrieves the list of employees for the manager
                    manager_id = answers.manager;
                    return getEmployeesByManager(manager_id);
                }).then(response => {
                    // prints the query response in a formatted table and returns to the main menu
                    console.table(response.data);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 5: // view employees by department
                // gets list of departments to use for question choices
                return getDepartmentsList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'department',
                        message: 'Which department would you like to view the employees of?',
                        choices: response.data
                    });
                }).then(answers => {
                    // retrieves the list of employees for a specific department
                    department_id = answers.department;
                    return getEmployeesByDepartment(department_id);
                }).then(response => {
                    // prints the query response in a formatted table and returns to the main menu
                    console.table(response.data);
                    return getMainMenu();
                });
                break;
            case 6: // remove employee
                // gets list of employees to use for question choices
                return getEmployeesList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee would you like to delete?',
                        choices: response.data
                    });
                }).then(answers => {
                    // removes the employee selected by the user from the database
                    employee_id = answers.employee;
                    return removeEmployeeByID(employee_id);
                }).then(response => {
                    // logs the successful response and returns to the main menu
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 7: // view all roles
                return getAllRoles().then(response => {
                    // prints the query response in a formatted table and returns to the main menu
                    console.table(response.data);
                    return getMainMenu();
                }).catch(err => { throw err; });
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
                // gets list of departments to use for question choices
                return getDepartmentsList().then(response => {
                    questions = [...questions, {
                        type: 'list',
                        name: 'department_id',
                        message: 'Which department is this role for?',
                        choices: response.data
                    }];
                    return inquirer.prompt(questions);
                }).then(answers => {
                    // adds role to the database based on user input
                    return addRole(answers.title, answers.salary, answers.department_id);
                }).then(response => {
                    // logs successful response and returns to main menu
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 9: // remove role
                // gets list of roles for user to select from
                return getRolesList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'role',
                        message: 'Which role would you like to delete?',
                        choices: response.data
                    });
                }).then(answers => {
                    // removes role that the user specified from the database
                    role_id = answers.role;
                    return removeRoleByID(role_id);
                }).then(response => {
                    // logs successful response and returns to main menu
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 10: // view all department
                return getAllDepartments().then(response => {
                    // prints the query response in a formatted table and returns to the main menu
                    console.table(response.data);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 11: // add department
                questions = [
                    {
                        type: 'input',
                        name: 'dept_name',
                        message: 'What is the name of the new department?'
                    }
                ];
                // prompts the user for new department name
                return inquirer.prompt(questions).then(answers => {
                    // adds department to the database
                    return addDepartment(answers.dept_name);
                }).then(response => {
                    // prints successful response and returns to main menu
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 12: // remove department
                // gets list of departments for question choices
                return getDepartmentsList().then(response => {
                    return inquirer.prompt({
                        type: 'list',
                        name: 'department',
                        message: 'Which department would you like to delete?',
                        choices: response.data
                    });
                }).then(answers => {
                    // removes the department the user specified from the database
                    department_id = answers.department;
                    return removeDepartmentByID(department_id);
                }).then(response => {
                    // prints successful response and returns to main menu
                    console.log(response.message);
                    return getMainMenu();
                }).catch(err => { throw err; });
                break;
            case 13: // quit
                return;

        }
    });
};

connect().then(response => {
    return getMainMenu();
}).then(() => {
    // exits the application
    process.exit();
}).catch(err => {
    throw err;
});
