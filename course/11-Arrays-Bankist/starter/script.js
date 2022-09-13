'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementDates: [
    '2022-05-01T15:40:01Z',
    '2022-06-01T15:40:01Z',
    '2022-01-07T11:10:01Z',
    '2022-05-06T08:20:01Z',
    '2022-05-02T15:40:01Z',
    '2022-05-04T15:40:01Z',
    '2022-08-01T15:40:01Z',
    '2022-01-15T19:30:01Z',
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementDates: [
    '2022-05-01T15:40:01Z',
    '2022-06-01T15:40:01Z',
    '2022-01-07T11:10:01Z',
    '2022-05-06T08:20:01Z',
    '2022-05-02T15:40:01Z',
    '2022-05-04T15:40:01Z',
    '2022-08-01T15:40:01Z',
    '2022-01-15T19:30:01Z',
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementDates: [
    '2022-05-01T15:40:01Z',
    '2022-06-01T15:40:01Z',
    '2022-01-07T11:10:01Z',
    '2022-05-06T08:20:01Z',
    '2022-05-02T15:40:01Z',
    '2022-05-04T15:40:01Z',
    '2022-08-01T15:40:01Z',
    '2022-01-15T19:30:01Z',
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  movementDates: [
    '2022-05-01T15:40:01Z',
    '2022-06-01T15:40:01Z',
    '2022-01-07T11:10:01Z',
    '2022-05-06T08:20:01Z',
    '2022-05-02T15:40:01Z',
  ],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

let loggedInAccountIndex = null;
let shouldSort = false;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//
const createUsernames = (accounts) => {
  accounts.map((account) => {
    const username = account.owner.toLowerCase().split(' ').map((partialName) => partialName.charAt(0)).join('');
    account.username = username;
  });
};
createUsernames(accounts);

//
const createMoney = (amount) => {
  const options = {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol', 
  }
  return new Intl.NumberFormat('en-US', options).format(amount);
}

//
const createDate = (date) => {
  const now = Date.now();
  const newDate = new Date(date);

  let timePassed = Math.floor((now - newDate) / (1000 * 60 * 60 * 24));
  switch (timePassed) {
    case 0: timePassed = 'Today';
      break;
    case 1: timePassed = 'Yesterday';
      break;
    default: timePassed = `${timePassed} days ago`
  }

  const i18n = new Intl.DateTimeFormat(window.navigator.language).format(newDate);
  return `${i18n}, ${timePassed}`
};

// 
const displayMovements = (account, shouldSort) => {
  const movements = account.movements;
  const dates = account.movementDates;
  const arr = movements.slice();
  if (shouldSort) arr.sort((a, b) => a - b);

  containerMovements.innerHTML = '';
  arr.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${createDate(dates[i])}</div>
        <div class="movements__value">${createMoney(movement)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//
const calculateDisplayBalance = (movements) => {
  const balance = movements.reduce((acc, val) => { return acc + val}, 0);
  labelBalance.textContent = createMoney(balance);
};

//
const createNow = () => {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
  const i18n = new Intl.DateTimeFormat(window.navigator.language, options).format(now);
  labelDate.textContent = i18n;
};

//
const startLogoutTimer = () => {
  let time = 100;
  const interval = setInterval(() => {
    --time;

    let timeInMinutes = time / 60;
    let displayTime = timeInMinutes;
    if (timeInMinutes < 1.0) {
      displayTime = `${time} seconds`;
    } else {
      displayTime = `${Math.floor(timeInMinutes)} minute ${time % 60} seconds`;
    }
    labelTimer.textContent = displayTime;

    if (time === 0) {
      loggedInAccountIndex = null;
      containerApp.style.opacity = 0;
      clearInterval(interval);
    }
  }, 1000)
}

//
btnSort.addEventListener('click', () => {
  shouldSort = !shouldSort;
  displayMovements(accounts[loggedInAccountIndex], shouldSort);
});

//
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value.trim());

  if (!isNaN(amount) && amount > 0) {
    const isEligible = accounts[loggedInAccountIndex].movements.some((movement) => movement >= (amount * 0.10));

    if (isEligible) {
      accounts[loggedInAccountIndex].movements.push(amount);
      accounts[loggedInAccountIndex].movementDates.push(new Date().toISOString());
      displayMovements(accounts[loggedInAccountIndex], shouldSort);
      calculateDisplayBalance(accounts[loggedInAccountIndex].movements);
    }
  }

  inputLoanAmount.value = '';
});

//
btnLogin.addEventListener('click', (event) => {
  event.preventDefault();

  const username = inputLoginUsername.value;
  const pin = inputLoginPin.value;


  // const account = accounts.find((account) => {
  //   return account.username === username.toLowerCase().trim() && account.pin === parseInt(pin.trim());
  // });

  const account = accounts[0];

  if (account) {
    containerApp.style.opacity = 100;

    displayMovements(account, shouldSort);
    calculateDisplayBalance(account.movements);
    labelWelcome.textContent = `Welcome back ${account.owner}`;
    createNow();

    loggedInAccountIndex = accounts.findIndex((uniqueAccount) => {
      return uniqueAccount.pin === account.pin && uniqueAccount.username === account.username
    });
    startLogoutTimer();
  }

  inputLoginUsername.value = '';
  inputLoginPin.value = '';
});

//
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();

  const to = inputTransferTo.value.toLowerCase().trim();
  const amount = Number(inputTransferAmount.value);

  if (!isNaN(amount) && amount > 0) {
    accounts[loggedInAccountIndex].movements.push(-amount);
    accounts[loggedInAccountIndex].movementDates.push(new Date().toISOString());
    const toIndex = accounts.findIndex((account) => to === account.username);
    accounts[toIndex].movements.push(amount);
    accounts[toIndex].movementDates.push(new Date().toISOString());

    displayMovements(accounts[loggedInAccountIndex], shouldSort);
    calculateDisplayBalance(accounts[loggedInAccountIndex].movements);

    inputTransferAmount.value = '';
    inputTransferTo.value = '';
  }
});
