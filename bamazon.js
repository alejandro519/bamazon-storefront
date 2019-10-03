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
  console.log("Showing all products in the store...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    // connection.end();
    itemSelection();
  });
}
function itemSelection() {
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
        message: "How many would you like to purchase (enter a quantity)",
      },
    ]).then(function(answers) {
      console.log("\nitemid: " + answers.itemid,  "\nitemqty: " + answers.itemqty);
      // console.log(answers)
      // var qty = inventory.stock_quantity;
      // console.log("current quantity: " + inventory.stock_quantity)
      queryItemsOnHand(answers);
    });
}

function queryItemsOnHand(answers) {
  var query = connection.query("SELECT * FROM products WHERE ?", 
    {
      id: answers.itemid
    }, 
    function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
  });

  // logs the actual query being run
  // console.log(query.sql);
  connection.end();
}









// function deleteProduct() {
//   console.log("Checking current inventory of itemid " + itemid);
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



//query the database to see the qty of the item selected - use workbench to initiate query
  //SELECT * FROM products WHERE id=1
//check if the qty selected is greater than the stock_qty
  // if qty selected is greater - display "insufficient qty"

//Otherwise this means updating the SQL database to reflect the remaining quantity.
//Once the update goes through, show the customer the total cost of their purchase.

