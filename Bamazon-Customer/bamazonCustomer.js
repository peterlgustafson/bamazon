//Initialize mysql, cli-table and inquirer npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // username
  user: "root",

  // password & database
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log("Successful connection to mysql server");
  // run the start purchase function after the connection is made to prompt the user
  createTable();
});

// function which prompts the user for what product and how many units the customer wants to buy
function createTable() {
  // query the database for all products available for sale
  connection.query("SELECT item_id, product_name, price FROM products", function (err, results) {
    if (err) throw err;
    // console.log(results);
    // instantiate table
    var table = new Table({
      head: ['Product ID', 'Product Name', 'Price'],
      colWidths: [15, 60, 15],
    });
    //For Loop to Print all Results from bamazon database into cli table
    for (var i = 0; i < results.length; i++) {
      table.push([results[i].item_id, results[i].product_name, results[i].price]);
    }
    console.log(table.toString());
    startPurchase(results);
  })
}

//Function to prompt customer for what they want to buy and how many, taking results in as argument so that all choices from prev query can be user selection
function startPurchase(results) {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Please enter the Item ID of the Product you'd like to purchase here: \n(To exit press E)"
      }
    ])
    .then(function (answer) {
      var correct = false;
      if (answer.id == "E") {
        process.exit();
      }
      for (var i = 0; i < results.length; i++) {
        if (results[i].item_id === answer.id) {
          correct = true;
          var answerID = answer.id;
          var id = i;
          inquirer
          .prompt(
            {
              name: "quantity",
              type: "input",
              message: "How many units of the product would you like to buy?",
              //Validating to check that user submission is a number
              validate: function (value) {
                if (isNan(value) == false) {
                  return true;
                } else {
                  return false;
                }
              }
            })
            //Checking if there is sufficient quantity to complete purchase and updating database
            .then(function (answer) {
              if ((results[id].stock_quantity - answer.quantity) > 0) {
                connection.query("UPDATE products SET stock_quantity='" + (results[id].stock_quantity - answer.quantity) + "'WHERE item_id='" + answerID + "'", function (err, results2) {
                  console.log("Congratulations you successfully completed your purchase.");
                  createTable();
                })
              }
              else {
                console.log("We're sorry your order cannot be completed at this time due to insufficient stock.");
                startPurchase(results);
              }
            })

        }
      }

      if (id == results.length && correct == false) {
        console.log("Not a valid selection. Please try again.");
        startPurchase();
      }

    })

}
