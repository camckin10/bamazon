//test.js

//TO DO
//CONSOLE LOG RESPONSE
//CONNECTION TO DATABASE REALLY WORKING??


//dependencies 
var mysql = require("mysql");
var inquire = require("inquirer");


//connecting to mySQL database, and displaying all'bamazon' table 
//contents
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    queryAllTable();
});

function customerInteraction() {
    // query the database for all items being sold
    connection.query("SELECT * FROM bamazon.products", function(err, results) {
        if (err) throw err;
        // once  items shown, prompt the user for which item they want
        inquirer
            .prompt([{
                    name: "choice",
                    type: "rawlist",
                    choices: function dataProducts() {
                        var productArray = [];
                        for (var i = 0; i < results.length; i++) {
                            productArray.push(results[i].product_name);
                        }
                        return productArray;
                    },
                    message: "Welcome to Bamazon!"

                },
                {
                    name: "number",
                    type: "input",
                    message: "What is the ID number of the product?"
                },
                {
                    name: "name",
                    type: "input",
                    message: "What is the name of the product?"
                }
            ])
            .then(function(answer) {
                // get the information of the chosen item
                var chosenProduct;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenProduct = results[i];
                    }
                }

                // determine if there is enough product in stock
                if (chosenProduct.correct_product < parseInt(answer.price)) {
                    // if there is enough product, let the user know, and begin again
                    connection.query(
                        "UPDATE auctions SET ? WHERE ?", [{
                                correct_product: answer.price
                            },
                            {
                                id: chosenProduct.id
                            },
                        ],
                        function(error) {
                            if (error) throw err;
                            console.log("Your order has been placed!");
                            //start();
                            customerInteraction();
                        }
                    );
                } else {
                    // bid wasn't high enough, so apologize and start over
                    console.log("Insufficent quantity!");
                    //start();
                    customerInteraction();
                }
            });
    });
}