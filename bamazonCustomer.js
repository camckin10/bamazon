//TO DO
//CONSOLE LOG RESPONSE


//dependencies 
var mysql = require("mysql");
var inquirer = require("inquirer");
var questions = require("./questions.js");

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
    //queryAllTable();
    customerInteraction();
});


function queryAllTable() {
    connection.query("SELECT * FROM bamazon.products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name);
            console.log(+" | " + res[i].price + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
    });
};
//call function to test it
queryAllTable();
//orderAndAdd();

//prompt message for user
//first prompt message--ID of product
//second prompt message--how many units of product
function dataProducts(results) {
    var productArray = [];
    for (var i = 0; i < results.length; i++) {
        productArray.push(results[i].product_name);
    }
    return productArray;
}

function customerInteraction() {
    // query the database for all items being sold
    connection.query("SELECT * FROM bamazon.products", function(err, results) {
        if (err) throw err;
        console.log(results, "flyingpigs");
        var products = dataProducts(results);
        console.log(products, "lasercats");
        console.log(results);
        // once  items shown, prompt the user for which item they want
        inquirer
            .prompt(questions(products))
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
//call function to test if it runs
//customerInteraction();

// However, if your store does have enough of the product, 
//you should fulfill the customer's order.
// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of 
//their purchase.

//run through with derek 2-20-18
function orderAndAdd() {
    // prompt for info about the product being ready for delivery
    inquirer
        .prompt([{
                name: "product",
                type: "input",
                message: "Is this the product you ordered?"
            },
            {
                name: "address",
                type: "input",
                message: "Do you want this product sent to your saved shipping address?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            // when finished prompting, insert a new product into the db with that info
            connection.query(
                "INSERT INTO bamazon SET ?", {
                    item_name: answer.item,
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity
                },
                function(err) {
                    if (err) throw err;
                    console.log("Your order has been sent  successfully!");
                    // re-prompt the user for if they want to buy something else
                    customerInteraction();

                }
            );
        })
}
//call function to test if it runs
//orderAndAdd();