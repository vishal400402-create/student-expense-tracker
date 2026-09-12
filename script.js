// ===============================
// Get HTML Elements
// ===============================

const button = document.getElementById("addButton");
const clearButton = document.getElementById("clearButton");

const expenseName = document.getElementById("expenseName");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const expenseDate = document.getElementById("expenseDate");

const expenseCount = document.getElementById("expenseCount");
const expenseList = document.getElementById("expenseList");
const total = document.getElementById("total");

const filterCategory = document.getElementById("filterCategory");
const searchInput = document.getElementById("searchInput");


// ===============================
// Load Expenses
// ===============================

let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];


// -1 means we are adding a new expense
let editIndex = -1;


// ===============================
// Show Expenses
// ===============================

function showExpenses() {

    expenseList.innerHTML = "";

    let totalAmount = 0;

    const searchText =
        searchInput.value.toLowerCase();


    // Filter expenses
    const filteredExpenses = expenses.filter(function(expense) {

        const categoryMatch =
            filterCategory.value === "All" ||
            expense.type === filterCategory.value;


        const searchMatch =
            expense.name
                .toLowerCase()
                .includes(searchText);


        return categoryMatch && searchMatch;

    });


    // Empty message
    if (filteredExpenses.length === 0) {

        const emptyMessage =
            document.createElement("li");

        emptyMessage.textContent =
            "No expenses found.";

        emptyMessage.className =
            "empty-message";

        expenseList.appendChild(emptyMessage);

    }


    // Display expenses
    filteredExpenses.forEach(function(expense) {

        const listItem =
            document.createElement("li");


        // Expense information
        const expenseInfo =
            document.createElement("div");

        expenseInfo.className =
            "expense-info";


        const expenseNameText =
            document.createElement("div");

        expenseNameText.className =
            "expense-name";

        expenseNameText.textContent =
            `${expense.name} - ₹${expense.price}`;


        const expenseDetails =
            document.createElement("div");

        expenseDetails.className =
            "expense-details";

        expenseDetails.textContent =
            `${expense.type} • ${expense.date}`;


        expenseInfo.appendChild(expenseNameText);
        expenseInfo.appendChild(expenseDetails);


        // Edit button
        const editButton =
            document.createElement("button");

        editButton.textContent = "Edit";

        editButton.className = "edit-btn";


        editButton.addEventListener(
            "click",
            function() {

                const index =
                    expenses.indexOf(expense);

                editIndex = index;


                expenseName.value =
                    expense.name;

                amount.value =
                    expense.price;

                category.value =
                    expense.type;

                expenseDate.value =
                    expense.date;


                button.textContent =
                    "Update Expense";


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        // Delete button
        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";

        deleteButton.className =
            "delete-btn";


        deleteButton.addEventListener(
            "click",
            function() {

                const index =
                    expenses.indexOf(expense);

                expenses.splice(index, 1);


                localStorage.setItem(
                    "expenses",
                    JSON.stringify(expenses)
                );


                showExpenses();

            }
        );


        // Add everything to list
        listItem.appendChild(expenseInfo);

        listItem.appendChild(editButton);

        listItem.appendChild(deleteButton);

        expenseList.appendChild(listItem);


        // Calculate total
        totalAmount =
            totalAmount + expense.price;

    });


    // Update dashboard
    total.textContent =
        totalAmount;

    expenseCount.textContent =
        filteredExpenses.length;

}


// ===============================
// Add / Update Expense
// ===============================

button.addEventListener(
    "click",
    function() {

        const name =
            expenseName.value.trim();

        const price =
            Number(amount.value);

        const type =
            category.value;

        const date =
            expenseDate.value;


        // Validation
        if (
            name === "" ||
            price <= 0 ||
            date === ""
        ) {

            alert(
                "Please enter expense name, amount and date."
            );

            return;
        }


        // =========================
        // Update Existing Expense
        // =========================

        if (editIndex !== -1) {

            expenses[editIndex] = {

                name: name,
                price: price,
                type: type,
                date: date

            };


            editIndex = -1;

            button.textContent =
                "Add Expense";

        }


        // =========================
        // Add New Expense
        // =========================

        else {

            const newExpense = {

                name: name,
                price: price,
                type: type,
                date: date

            };


            expenses.push(newExpense);

        }


        // Save to LocalStorage
        localStorage.setItem(
            "expenses",
            JSON.stringify(expenses)
        );


        // Clear form
        expenseName.value = "";

        amount.value = "";

        expenseDate.value = "";


        // Refresh display
        showExpenses();

    }
);


// ===============================
// Category Filter
// ===============================

filterCategory.addEventListener(
    "change",
    function() {

        showExpenses();

    }
);


// ===============================
// Search
// ===============================

searchInput.addEventListener(
    "input",
    function() {

        showExpenses();

    }
);


// ===============================
// Clear All
// ===============================

clearButton.addEventListener(
    "click",
    function() {

        if (expenses.length === 0) {
            return;
        }


        const confirmDelete =
            confirm(
                "Are you sure you want to delete all expenses?"
            );


        if (!confirmDelete) {
            return;
        }


        expenses = [];

        editIndex = -1;


        localStorage.removeItem(
            "expenses"
        );


        button.textContent =
            "Add Expense";


        showExpenses();

    }
);


// ===============================
// Initial Load
// ===============================

showExpenses();