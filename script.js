const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const popup_container = document.querySelector(".popup");
const text_popup = document.getElementById("textPopup");
const amount_popup = document.getElementById("amountPopup");

/* const  testTransactions = [
    {id: 1, text: 'Flowers', amount: -20},
    {id: 2, text: 'Salary', amount: 3000},
    {id: 3, text: 'Book', amount: -30},
    {id: 4, text: 'Food', amount: -100}
]; */

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if(text.value && amount.value) {
        const transaction = {
            id: generateID(),
            text: text.value.charAt(0).toUpperCase() + text.value.slice(1),
            amount: +amount.value
        };

        transactions.push(transaction);
        
        addTransactionDOM(transaction);
        
        updateValues();

        updateLocalStorage();

        //reset fields after updating
        text.value = '';
        amount.value = '';
       
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
    let randomNumber =  Math.floor(Math.random() * 1000000000);
    /* const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let selectedLetter = letters[Math.floor(Math.random() * letters.length)];  */
    
    return randomNumber /* + selectedLetter */;
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    //Get sign
    const sign = transaction.amount < 0 ? '-' : '+';
    
    const item = document.createElement('li');

    //Add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span><button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
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

    const expense = (amounts
                    .filter(item => item < 0)
                    .reduce((acc, item) => (acc += item), 0) * -1)
                    .toFixed(2);

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

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Toggle Popup
function togglePopup(field, message) {
    if(field.value.trim() === '') {
        message.classList.add("show");
    } else {
        message.classList.remove("show");
    }
}


// Init app
function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}
init();

form.addEventListener('submit', addTransaction);
