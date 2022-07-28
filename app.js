const inquirer = require("inquirer");
const db = require('./db/connection');
const { getAllEmployees, addEmployee, updateEmployee, getEmployeesByManager, getEmployeesByDepartment } = require('./assets/js/employees');

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
    inquirer.prompt(mainMenu).then(data => {
        const index = mainMenuChoices.indexOf(data.choice);
        switch (index) {
            case 0: // get all employees
                getAllEmployees().then(response => {
                    console.table(response.data);
                    return getMainMenu();
                });
                break;
            case 1: // add employee
                addEmployee('Chris', 'Nohilly', 2, '').then(response => {
                    console.log(response.message);
                    return getMainMenu();
                });
                break;
            case 2: // update employee role
                updateEmployee('role_id', 1, 4).then(response => {
                    console.log(response.message);
                    return getMainMenu();
                });
                break;
            case 3: // update employee manager
                updateEmployee('manager_id', 1, 3).then(response => {
                    console.log(response.message);
                    return getMainMenu();
                });
                break;
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
                break;

        }
    });
};

connect().then(response => {
    return getMainMenu();
}).then(data => {
    console.log(data);
}).catch(err => {
    throw err;
});
