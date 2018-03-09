//Initialize mysql and inquirer npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("Successful connection to mysql server");
    // run the create table function after the connection is made to prompt the user
    createTable();
})

//Function to Create table with cli table that displays all item ids, product names and prices
var createTable = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        var table = new Table({
            head: ['Product ID', 'Product Name', 'Price'],
            colWidths: [14, 60, 14],
        });
        //For Loop to Print all Results from bamazon database into cli table
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, "$" + res[i].price]);
        }
        console.log(table.toString());
        startPurchase(res);
    })
}

//Function to prompt customer for what they want to buy and how many, taking results in as argument so that all choices from prev query in user selection
var startPurchase = function (res) {
    inquirer.prompt([{
        type: "input",
        name: "choice",
        message: "Please enter the Item ID of the product you'd like to purchase. [Exit with E]"
    }]).then(function (answer) {
        var validChoice = false;
        if (answer.choice == "E") {
            process.exit();
        }
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == answer.choice) {
                validChoice = true;
                var productID = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: "input",
                    name: "quant",
                    message: "How many would you like to purchase?",
                    //Validate method to validate that user input is a number
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                //Function to check if there's sufficient quantity to complete purchase and print order statement
                }).then(function (answer) {
                    if ((res[id].stock_quantity - answer.quant) > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - answer.quant) + "'WHERE item_id='" + productID + "'", function (err, res2) {
                            console.log("Your order has been completed. Your total cost is $" + (answer.quant * res[id].price) + ".");
                            createTable();
                        })
                    } else {
                        console.log("We're sorry, we cannot complete your order at this time due to insufficient stock.");
                        startPurchase(res);
                    }
                })

            }
        }
        //If Statement to check if user input is a valid entry of product id in products db and not E to exit
        if (i == res.length && validChoice == false) {
            console.log("Please try again. That's not a valid selection.");
            startPurchase(res);
        }
    })
}
