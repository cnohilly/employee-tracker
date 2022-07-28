const inquirer = require("inquirer");
const db = require('./db/connection');
const getAllEmployees = require('./assets/js/employees');

const mainMenuChoices = [   // index #
    'View All Employees',   // 1
    'Add Employee',         // 2
    'Update Employee Role', // 3
    'Update Employee Manager', // 4
    'View Employees by Manager', // 5
    'View Employees by Department', // 6
    'Remove Employee',  // 7
    'View All Roles', // 8
    'Add Role', // 9
    'Remove Role', // 10
    'View All Departments', // 11
    'Add Department', // 12
    'Remove Department', // 13
    'Quit']; // 14
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
            case 0:
                getAllEmployees().then(response =>{
                    //console.log(response.fields.map(field => {return field.name;}));
                    console.table(response.data);
                    return getMainMenu();
                });
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
