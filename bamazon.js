var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_db",
});

connection.connect(function (err) {
  if (err) throw err;
  //console log all of the items available for sale//
  console.log("connected as id " + connection.threadId + "\n");
  readProducts()
});

function readProducts() {
  console.log("Showing all products in the store...\n");
  connection.query("SELECT * FROM products", function (err, res) {
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
    ]).then(function (answers) {
      console.log("\nitemid: " + answers.itemid, "\nitemqty: " + answers.itemqty);
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
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        if (res[i].stock_quantity >= answers.itemqty) {
          console.log("\n-----------------------------")
          console.log("Please hold for processing...")
          console.log("-----------------------------\n")
        }
      }
    });
  connection.end();
}

// if (res[i].stock_quantity >= answers.itemqty) {
//   connection.query(
//     "UPDATE products SET ? WHERE ?",
//     [
//       {
//         id: answers.itemid
//       },
//       {
//         stock_quantity: stock_quantity - answers.itemqty
//       },
//     ],
//     function(error) {
//       if (error) throw err;
//       console.log("Item purchased successfully!");
//       readProducts();
//     }
//   );
// }
// else {
//   // if not enough items in inventory
//   console.log("Damn, you're greedy - not enough items in inventory. Try again...");
//   readProducts();
// }