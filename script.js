const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const text_popup = document.getElementById("text-popup");
const amount_popup = document.getElementById("amount-popup");

/* const  testTransactions = [
    {id: 1, text: 'Flowers', amount: -20},
    {id: 2, text: 'Salary', amount: 3000},
    {id: 3, text: 'Book', amount: -30},
    {id: 4, text: 'Food', amount: -100}
]; */

const localStorageTransactions = JSON.parse(
    localStorage.getItem("transactions")
);

let transactions =
    localStorage.getItem("transactions") !== null
        ? localStorageTransactions
        : [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value && amount.value) {
        const transaction = {
            id: generateID(),
            text: text.value.charAt(0).toUpperCase() + text.value.slice(1),
            amount: +amount.value,
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        //reset fields after updating
        text.value = "";
        amount.value = "";

        //hide popups
        amount_popup.classList.remove("show");
        text_popup.classList.remove("show");
    } else {
        togglePopup(text, text_popup);
        togglePopup(amount, amount_popup);
    }
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    //Get sign
    const sign = transaction.amount < 0 ? "-" : "+";

    const item = document.createElement("li");

    //Add class based on value
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.setAttribute("id", transaction.id);
    item.innerHTML = `
        <span class="edit-text">${transaction.text}</span>
        <span class="edit-amount">${sign}${Math.abs(transaction.amount)}</span>
        <button class="btn-icon delete" contentEditable="false" onclick="removeTransaction(${
            transaction.id
        })">x</button>
        <button class="btn-icon edit" title="edit" contentEditable="false" onclick="editTransaction(${
            transaction.id
        })">&#9998;</button>
        <button class="btn-icon save" title="save" contentEditable="false" onclick="saveTransaction(${
            transaction.id
        })">&#10004;</button>
    `;

    list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    //console.log(total);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts
            .filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `€${total}`;
    money_plus.innerText = `€${income}`;
    money_minus.innerText = `€${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

// Edit transaction
function editTransaction(id) {
    const transactionToEdit = document.getElementById(id);
    transactionToEdit.setAttribute("contentEditable", "true");
    transactionToEdit.focus();
}

//Save transaction after edit
function saveTransaction(id) {
    const transactionToSave = document.getElementById(id);
    transactionToSave.setAttribute("contentEditable", "false");

    //Update text
    const textEl = transactionToSave.getElementsByClassName("edit-text")[0];
    const textToUpdate = textEl.innerText;

    //Update amount
    const amountEl = transactionToSave.getElementsByClassName("edit-amount")[0];
    const amountToUpdate = +amountEl.innerText;

    let transactionToUpdate = transactions.filter(
        transaction => transaction.id === id
    );

    transactionToUpdate = {
        id: generateID(),
        text: textToUpdate,
        amount: amountToUpdate,
    };

    transactions.push(transactionToUpdate);

    addTransactionDOM(transactionToUpdate);

    removeTransaction(id);

    updateValues();
    updateLocalStorage();

    init();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Toggle Popup
function togglePopup(field, message) {
    if (field.value.trim() === "") {
        message.classList.add("show");
    } else {
        message.classList.remove("show");
    }
}

// Init app
function init() {
    list.innerHTML = "";

    transactions.forEach(addTransactionDOM);
    updateValues();
}
init();

form.addEventListener("submit", addTransaction);