// dependecies
const inquirer = require("inquirer")
const mysql = require("mysql")


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeeDB"
});


// connection
connection.connect(function (err) {
    if (err) throw err
    console.log("Connected as Id"+ connection.threadId)
    start();
});
// Prompt
function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: ["View Employees?","View Employees By Roles?", "View Emplyees By Deparments","Update Employee", "Add Employee?", "Add Role?", "Add Department?"]
        }
    ]).then(function (evr) {
        switch (evr.choice) {
            case "View All Employees?":
                viewAllEmp();
                break;

            case "View All Employee's By Roles?":
                viewAllRoles();
                break;
            case "View all Emplyees By Deparments":
                viewAllDept();
                break;

            case "Add Employee?":
                addEmp();
                break;

            case "Update Employee":
                updateEmp();
                break;

            case "Add Role?":
                addRole();
                break;

            case "Add Department?":
                addDept();
                break;

        }
    })
}


// How to choose manager
let managersArr = [];
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }

    })
    return managersArr;
}
// Add Employee
function addEmp() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter first name "
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter last name "
        },
        {
            name: "role",
            type: "list",
            message: "What is their role? ",
            choices: selectRole()
        },
        {
            name: "choice",
            type: 
            message: "Managers name?",
            choices: selectManager()
        }
    ]).then(function (evr) {
        var roleId = selectRole().indexOf(evr.role) + 1
        var managerId = selectManager().indexOf(evr.choice) + 1
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: evr.firstName,
                last_name: evr.lastName,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.table(evr)
                start()
            })

    })
}
// Employee Update
function updateEmp() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function (err, res) {
        // console.log(res)
        if (err) throw err
        console.log(res)
        inquirer.prompt([
            {
                name: "lastName",
                type: "",
                choices: function () {
                    var lastName = [];
                    for (var i = 0; i < res.length; i++) {
                        lastName.push(res[i].last_name);
                    }
                    return lastName;
                },
                message: "What is the Employee's last name? ",
            },
            {
                name: "role",
                type: "",
                message: "What is the Employees new title? ",
                choices: selectRole()
            },
        ]).then(function (evr) {
            var roleId = selectRole().indexOf(evr.role) + 1
            connection.query("UPDATE employee SET WHERE ?",
                {
                    last_name: evr.lastName

                },
                {
                    role_id: roleId

                },
                function (err) {
                    if (err) throw err
                    console.table(evr)
                    start()
                })

        });
    });

}
// Employee Role Add
function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function (err, res) {
        inquirer.prompt([
            {
                name: "Title",
                type: "input",
                message: "What is their role title?"
            },
            {
                name: "Salary",
                type: "input",
                message: "What is their salary?"

            }
        ]).then(function (res) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: res.Title,
                    salary: res.Salary,
                },
                function (err) {
                    if (err) throw err
                    console.table(res);
                    start();
                }
            )

        });
    });
}
// Add Dept
function addDept() {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What Department would you like to add?"
        }
    ]).then(function (res) {
        let query = connection.query(
            "INSERT INTO department SET ? ",
            {
                name: res.name

            },
            function (err) {
                if (err) throw err
                console.table(res);
                start();
            }
        )
    })
}