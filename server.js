const express = require('express');
const db = require('./db/connection');
const routes = require('./routes');
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Add after Express middleware
app.use(routes);

// home page for application
app.get('/', (req, res) => {
    res.send('Connected!');
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});





const mainMenuChoices = [
    'View All Employees', 
    'Add Employee', 
    'Update Employee Role',
    'Update Employee Manager',
    'View Employees by Manager',
    'View Employees by Department', 
    'Remove Employee',
    'View All Roles', 
    'Add Role',
    'Remove Role', 
    'View All Departments', 
    'Add Department', 
    'Remove Department',
    'Quit'];
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
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}!`);
                resolve({
                    ok: true
                });
            });
        });
    });
}

const getMainMenu = () => {
    inquirer.prompt(mainMenu).then(data => {
        return data;
    });
};


// connect().then(response => {
//     return getMainMenu();
// }).then(data => {
//     console.log(data);
// }).catch(err => {
//     console.log(err);
// });

// Start server after DB connection
// db.connect(err => {
//     if (err) throw err;
//     console.log('Database connected.');
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// });
getMainMenu();