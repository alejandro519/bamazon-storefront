var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_db",
});

connection.connect(function(err) {
  if (err) throw err;
  //console log all of the items available for sale//
  console.log("connected as id " + connection.threadId + "\n");
  readProducts()
});

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    // connection.end();
    itemSelection(res);
  });
}
function itemSelection(inventory) {
  console.log("\nWelcome to Bamazon! Get ready to choose an item.\n");
  inquirer
    .prompt([
      {
        name: "itemid",
        type: "number",
        message: "Which item would you like to purchase today? (choose by item id)",
      },
      {
        name: "itemqty",
        type: "number",
        message: "How many would you like to purchase (enter a number)",
      },
    ]).then(function(answers) {
      console.log("itemid: " + answers.itemid)
      console.log(inventory)
      var qty = inventory.stock_quantity;
      console.log("current quantity: " + inventory.stock_quantity)
    });
}

//query the database to see the qty of the item selected - use workbench to initiate query
  //SELECT * FROM products WHERE id=1
//check if the qty selected is greater than the stock_qty
  // if qty selected is greater - display "insufficient qty"

//Otherwise this means updating the SQL database to reflect the remaining quantity.
//Once the update goes through, show the customer the total cost of their purchase.

// function deleteProduct() {
//   console.log("Deleting all strawberry icecream...\n");
//   connection.query(
//     "SELECT * FROM products WHERE ?",
//     {
//       id: answers.itemid
//     },
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " products deleted!\n");
//       // Call readProducts AFTER the DELETE completes
//       readProducts();
//     }
//   );
// }