module.exports =
    function questions(products) {
        return [{

                name: "choice",
                type: "rawlist",
                choices: products,
                message: "Welcome to Bamazon!",

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
        ]

    }