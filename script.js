const transactionsUL = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const signalButton = document.querySelector('#signal');


const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'));

let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : [];

const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
        transaction.id !== ID);

    updateLocalStorage();
    init();
};

const switchSignals = signalButton.addEventListener('click', () => {
    inputTransactionAmount.value *= -1;
});

const addTransactionIntoDOM = ({ amount, name, id }) => {
    const operator = amount < 0 ? '-' : '+';
    const cssClass = amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(amount);
    const li = document.createElement('li');

    li.classList.add(cssClass);
    li.innerHTML = `
        ${name}
        <span>${operator} $ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `

    transactionsUL.append(li)
        // <li class="minus">
        //     Salário <span>-$400</span><button class="delete-btn">x</button>
        // </li>
};

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2);


const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({ amount }) => amount);
    const total = getTotal(transactionsAmounts);
    const income = getIncome(transactionsAmounts);
    const expense = getExpenses(transactionsAmounts);

    balanceDisplay.textContent = `$ ${total}`
    incomeDisplay.textContent = `$ ${income}`
    expenseDisplay.textContent = `$ ${expense}`
}

const init = () => {
    transactionsUL.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
}

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const generateId = () => Math.round(Math.random() * 10000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push(transaction = {
        id: generateId(),
        name: transactionName,
        amount: Number(transactionAmount)
    });
};

const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
};

const handleFormSubmit = event => {
    event.preventDefault();
    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

    if (isSomeInputEmpty) {
        return alert('All fields required.');
     };

    addToTransactionsArray(transactionName, transactionAmount);
    init();
    updateLocalStorage();
    cleanInputs();

}

const persistListedTransactions = () => {
    const persist = localStorage.getItem('transactions')

    if (persist) {
        init();
        updateLocalStorage();
    }
}

persistListedTransactions();

form.addEventListener('submit', handleFormSubmit);
