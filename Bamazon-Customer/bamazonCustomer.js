//Initialize mysql, cli-table and inquirer npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start purchase function after the connection is made to prompt the user
  startPurchase();
});

// function which prompts the user for what product and how many units the customer wants to buy
function startPurchase() {
  // query the database for all products available for sale
  connection.query("SELECT item_id, product_name, price FROM bamazon.products", function (err, results) {
    if (err) throw err;
    // console.log(results);
    // instantiate table
    var table = new Table({
      head: ['Product ID', 'Product Name', 'Price'],
      colWidths: [15, 60, 15],

    });

    // // table is an Array, so you can `push`, `unshift`, `splice` and friends 
    table.push(

      // function() {
      //   var itemsArray = [];
      //   for (var i = 0; i < results.length; i++) {
      //     itemsArray.push([results[i].item_id, results[i].product_name, results[i].price]);
      //   }
      //   push(itemsArray);

      [results[0].item_id, results[0].product_name, results[0].price],
      [results[1].item_id, results[1].product_name, results[1].price],
      [results[2].item_id, results[2].product_name, results[2].price],
      [results[3].item_id, results[3].product_name, results[3].price],
      [results[4].item_id, results[4].product_name, results[4].price],
      [results[5].item_id, results[5].product_name, results[5].price],
      [results[6].item_id, results[6].product_name, results[6].price],
      [results[7].item_id, results[7].product_name, results[7].price],
      [results[8].item_id, results[8].product_name, results[8].price],
      [results[9].item_id, results[9].product_name, results[9].price]
      // }
    );

    console.log(table.toString());

    inquirer
      .prompt([
        {
          name: "itemIDSelect",
          type: "input",
          message: "Please enter the Item ID of the product you'd like to purchase here:"
        },
        {
          name: "quantitySelect",
          type: "input",
          message: "How many units of the product would you like to buy?"
        }
      ])
      //If else statement to check if there is enough inventory to place customer order
      //If insufficient supply exists, console.log Insufficient quantity! and stop the order from going through(throw err)
      //If sufficient supply exists, update SQL database to reflect remaining quantity and console log total cost of purchase
      .then(function (answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_id === answer.itemIDSelect) {
            chosenItem = results[i];
          }
        }
        // determine if enough quantity exists for purchase
        if (chosenItem.stock_quantity > parseInt(answer.quantitySelect)) {
          // if there was enough product in stock, update db, let the user know, and start over
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: (stock_quantity - answer.quantitySelect)
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function (error) {
              if (error) throw err;
              console.log("Purchase complete! Your total cost is $" + (answer.quantitySelect * item_id.price) + ".");
              startPurchase();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Sorry we don't have that much quantity in stock. Please try again or come back in a few days to check in.");
          startPurchase();
        }

      })
  })
}