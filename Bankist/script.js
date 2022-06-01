"use strict";

const account1 = {
  owner: "Abhinav Sorate",
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  currency: "INR",
  interestRate: 1.2,
  pin: 1111,
  transactionsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-05-27T17:01:17.194Z",
    "2021-07-11T23:36:17.929Z",
    "2021-07-12T10:51:36.790Z",
  ],
  locale: "en-IN",
};

const account2 = {
  owner: "Jessica Davis",
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  currency: "USD",
  interestRate: 1.5,
  pin: 2222,
  transactionsDates: [
    "2021-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2021-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-06-01T18:49:59.371Z",
    "2021-07-26T12:01:20.894Z",
  ],
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  currency: "EUR",
  interestRate: 0.7,
  pin: 3333,
  transactionsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-05-27T17:01:17.194Z",
    "2021-07-11T23:36:17.929Z",
    "2021-07-12T10:51:36.790Z",
  ],
  locale: "de-DE",
};

const account4 = {
  owner: "Sarah Smith",
  transactions: [430, 1000, 700, 50, 90],
  currency: "GBP",
  interestRate: 1,
  pin: 4444,
  transactionsDates: [
    "2021-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2021-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-06-01T18:49:59.371Z",
    "2021-07-26T12:01:20.894Z",
  ],
  locale: "en-GB",
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

// Function to format transaction dates
const formatTransactionDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// Funtion to format currency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// Function to display transations
const displayTransactions = (account, sort = false) => {
  containerTransactions.innerHTML = "";

  const trans = sort
    ? account.transactions.slice().sort((a, b) => a - b)
    : account.transactions;

  trans.forEach((trans, i) => {
    const type = trans > 0 ? "deposit" : "withdrawal";

    const date = new Date(account.transactionsDates[i]);
    const displayDate = formatTransactionDate(date, account.locale);

    const formattedTrans = formatCur(trans, account.locale, account.currency);

    const element = `
    <div class="transactions__row">
      <div class="transactions__type transactions__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="transactions__date">${displayDate}</div>
      <div class="transactions__value">${formattedTrans}</div>
    </div>
    `;
    containerTransactions.insertAdjacentHTML("afterbegin", element);
  });
};

// Functions to display current balalnce
const calcDisplayBalance = (account) => {
  account.balance = account.transactions.reduce(
    (total, trans) => total + trans,
    0
  );

  labelBalance.textContent = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
};

// Function to display summary
const calcDisplaySummary = (account) => {
  const transIn = account.transactions
    .filter((num) => num > 0)
    .reduce((total, trans) => total + trans, 0);

  labelSumIn.textContent = formatCur(transIn, account.locale, account.currency);

  const transOut = account.transactions
    .filter((num) => num < 0)
    .reduce((total, trans) => total + trans, 0);

  labelSumOut.textContent = formatCur(
    Math.abs(transOut),
    account.locale,
    account.currency
  );

  const interest = account.transactions
    .filter((trans) => trans > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int > 1) //ignoring interest less than 1
    .reduce((total, int) => (total += int), 0);

  labelSumInterest.textContent = formatCur(
    interest,
    account.locale,
    account.currency
  );
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
const updateUI = (account) => {
  displayTransactions(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
};

// Function for logOut timer functionality
const startLogOutTimer = () => {
  let time = 120;
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;
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

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); // Remove pointer from field

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

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

    // Add transfer date
    currentAccount.transactionsDates.push(new Date().toISOString());
    receiverAcc.transactionsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
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
    setTimeout(() => {
      // Add movement
      currentAccount.transactions.push(amount);

      // Add loan date
      currentAccount.transactionsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
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
  displayTransactions(currentAccount, !sorted);
  sorted = !sorted;
});
