"use strict";

const account1 = {
  owner: "Abhinav Sorate",
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  currency: "INR",
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  currency: "USD",
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  currency: "EUR",
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  transactions: [430, 1000, 700, 50, 90],
  currency: "GBP",
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerTransactions = document.querySelector(".transactions");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const currenciesMap = new Map([
  ["USD", "$"],
  ["EUR", "€"],
  ["INR", "₹"],
  ["GBP", "£"],
]);

const transactions = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Function to display transations
const displayTransactions = (transactions, sort = false) => {
  containerTransactions.innerHTML = "";

  const trans = sort
    ? transactions.slice().sort((a, b) => a - b)
    : transactions;

  trans.forEach((trans, i) => {
    const type = trans > 0 ? "deposit" : "withdrawal";
    const element = `
    <div class="transactions__row">
      <div class="transactions__type transactions__type--${type}">
      ${i + 1} deposit
      </div>
      <div class="transactions__value">${trans}</div>
    </div>
    `;
    containerTransactions.insertAdjacentHTML("afterbegin", element);
  });
};

// Functions to display current balalnce
const calcDisplayBalance = (account, currencies) => {
  account.balance = account.transactions.reduce(
    (total, trans) => total + trans,
    0
  );

  labelBalance.textContent = `${account.balance} ${currencies.get(
    account.currency
  )}`;
};

// Function to display summary
const calcDisplaySummary = (account, currencies) => {
  const transIn = account.transactions
    .filter((num) => num > 0)
    .reduce((total, trans) => total + trans, 0);

  labelSumIn.textContent = `${transIn} ${currencies.get(account.currency)}`;

  const transOut = account.transactions
    .filter((num) => num < 0)
    .reduce((total, trans) => total + trans, 0);

  labelSumOut.textContent = `${Math.abs(transOut)} ${currencies.get(
    account.currency
  )}`;

  const interest = account.transactions
    .filter((trans) => trans > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int > 1) //ignoring interest less than 1
    .reduce((total, int) => (total += int), 0);

  labelSumInterest.textContent = `${interest} ${currencies.get(
    account.currency
  )}`;
};

// Funtion to create usernames
const createUsernames = (accounts) => {
  accounts.forEach((account) => {
    const nameArr = account.owner.toLowerCase().split(" ");
    account.userName =
      nameArr[0].slice(0, 2) + nameArr[nameArr.length - 1].slice(0, 3);
  });
};

createUsernames(accounts);

// FUnction to update User Interface
const updateUI = (account, currencies = currenciesMap) => {
  displayTransactions(account.transactions);
  calcDisplayBalance(account, currencies);
  calcDisplaySummary(account, currencies);
};

let currentAccount;
// Impliment login functionality
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); // Remove pointer from field

    // Update UI
    updateUI(currentAccount);
  }
});

// Impliment transfer functionality
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    // Do the transfer
    currentAccount.transactions.push(-amount);
    receiverAcc.transactions.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  // reset the fields
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
});

// Impliment loan functionality
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.transactions.some((trans) => trans >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.transactions.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

// Impliment account close functionality
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );

    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  labelWelcome.textContent = "Log in to get started";
  inputCloseUsername.value = inputClosePin.value = "";
});

// Impliment transactions sort functionality
let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayTransactions(currentAccount.transactions, !sorted);
  sorted = !sorted;
});
