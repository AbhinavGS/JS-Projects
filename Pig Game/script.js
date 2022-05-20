'use strict';

//selecting elements
const player0Ele = document.querySelector('.player--0');
const player1Ele = document.querySelector('.player--1');
const rollBtn = document.querySelector('.btn--roll');
const holdBtn = document.querySelector('.btn--hold');
const newGameBtn = document.querySelector('.btn--new');
const player0CurrentScoreEle = document.querySelector('#current--0');
const player1CurrentScoreEle = document.querySelector('#current--1');
const player0TotalScoreEle = document.querySelector('#score--0');
const player1TotalScoreEle = document.querySelector('#score--1');
const diceImgEle = document.querySelector('.dice');

let scoresArr, currentScore, activePlayer;

let gameIsOn = true;

const init = function () {
  gameIsOn = true;
  scoresArr = [0, 0];
  currentScore = 0;
  activePlayer = 0;

  //setting all scores 0
  player0CurrentScoreEle.textContent = 0;
  player1CurrentScoreEle.textContent = 0;
  player0TotalScoreEle.textContent = 0;
  player1TotalScoreEle.textContent = 0;

  diceImgEle.classList.add('hidden');
  player0Ele.classList.remove('player--winner');
  player1Ele.classList.remove('player--winner');
  player0Ele.classList.add('player--active');
  player1Ele.classList.remove('player--active');
};

init();

const switchPlayer = function () {
  document.querySelector(`#current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0; //active player will change
  player0Ele.classList.toggle('player--active');
  player1Ele.classList.toggle('player--active');
};

rollBtn.addEventListener('click', function () {
  if (gameIsOn) {
    let diceValue = Math.trunc(Math.random() * 6 + 1); //1 to 6

    diceImgEle.src = `dice-${diceValue}.png`;
    diceImgEle.classList.remove('hidden');

    if (diceValue != 1) {
      currentScore += diceValue;
      document.querySelector(`#current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer();
    }
  }
});

holdBtn.addEventListener('click', function () {
  if (gameIsOn) {
    scoresArr[activePlayer] += currentScore;
    document.querySelector(`#score--${activePlayer}`).textContent =
      scoresArr[activePlayer];
  }
  // if score is greater than specific value i.e 21 here
  if (scoresArr[activePlayer] >= 21) {
    // Finish the game
    gameIsOn = false;
    diceImgEle.classList.add('hidden');

    document
      .querySelector(`.player--${activePlayer}`)
      .classList.add('player--winner');
    document
      .querySelector(`.player--${activePlayer}`)
      .classList.remove('player--active');
  } else {
    // Switch to the next player
    switchPlayer();
  }
});

newGameBtn.addEventListener('click', init);
