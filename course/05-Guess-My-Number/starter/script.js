'use strict';

// strings
const correct = 'Correct Number!';
const tooHigh = 'Too High!';
const tooLow = 'Too Low!';
const noGuess = 'No Guess!';
const startGuessing = 'Start guessing...';
const youLost = 'You lost the game!';

// scores
let highScore = 0;
let score = 20;

// number
let myNumber;

// nodes
const messageNode = document.querySelector('.message');
const highScoreNode = document.querySelector('.highscore');
const scoreNode = document.querySelector('.score');
const guessNode = document.querySelector('.guess');

addEventListener('load', () => {
  myNumber = Math.floor(Math.random() * 20) + 1;
  score = 20;
});

document.querySelector('.again').addEventListener('click', () => {
  myNumber = Math.floor(Math.random() * 20) + 1;
  score = 20;
  scoreNode.textContent = score;
  guessNode.value = '';
  messageNode.textContent = startGuessing;
});

document.querySelector('.check').addEventListener('click', () => {
  const myGuess = parseInt(guessNode.value);

  if (score !== 0) {
    if (isNaN(myGuess)) {
      messageNode.textContent = noGuess;
    } else if (myGuess === myNumber) {
      messageNode.textContent = correct;

      if (score > highScore) {
        highScore = score;
        highScoreNode.textContent = highScore;
      }
    } else {
      score -= 1;
      scoreNode.textContent = score;
      if (score === 0) {
        messageNode.textContent = youLost;
      } else if (myGuess > myNumber) {
        messageNode.textContent = tooHigh;
      } else {
        messageNode.textContent = tooLow;
      }
    }
  }
});