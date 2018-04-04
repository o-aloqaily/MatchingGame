
let openCards = [];
let matchedCards = 0;
let isFirstCardClick = true;
let timerInterval = null;
let timer = 0;
document.addEventListener('DOMContentLoaded', gameLoaded);

// first method to execute when page is loaded.
function gameLoaded() {
  setShuffledCards();
  setListeners();
}

function startTimer() {
  timer = 0;
  const title = document.querySelector('#pageTitle');
  timerInterval = setInterval(function() {
    timer = timer + 1;
    title.innerHTML = timer;
  }, 1000);
}

function stopTimer() {
  const title = document.querySelector('#pageTitle');
  clearInterval(timerInterval);
  timerInterval = null;
  isFirstCardClick = true;
  title.innerHTML = 'Matching Game';

}

// sets cards.
function setShuffledCards() {
  let cards = document.getElementsByClassName('card');
  cards = [...cards]; // HTMLCollection --> Array
  cards = shuffle(cards);
  const deck = document.querySelector('.deck');
  deck.innerHTML = ''; // empty deck to refill it wuth shuffled cards
  for (let card of cards) {
    deck.appendChild(card);
  }
}

// shuffle, reset counter, reset stars, reset cards.
function restartGame() {
  gameLoaded();
  resetCards();
  resetCounter();
  resetStars();
  stopTimer();
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
// sets listeners for cards, restart button and playAgain button.

function setListeners() {
  const restartButton = document.querySelector('.restart');
  const playAgainBtn = document.querySelector('.playAgainBtn');
  let cards = document.getElementsByClassName('card');
  cards = [...cards]; // HTMLCollection --> Array


  restartButton.addEventListener('click', restartGame);
  playAgainBtn.addEventListener('click', playAgain);
  for (let card of cards) {
    card.addEventListener('click', cardClicked);
  }
}

function cardClicked() {
  if (isFirstCardClick) {
    isFirstCardClick = false;
    startTimer();
  }
  const cardIsNotAlreadyChosen = this != openCards[0];
  const cardIsNotMatched = this.classList[1] != 'match';
  if (openCards.length !== 2 && cardIsNotAlreadyChosen && cardIsNotMatched) {
    this.classList.add('open', 'show');
    openCards.push(this);
  }
  if (openCards.length === 2) {
    if (cardsMatching(openCards[0], openCards[1])) {
      cardsMatched();
    } else {
      disableClicks();
      alertUnmatched();
    }
  }
}

function cardsMatching(firstCard, secondCard) {
  const firstCardName = firstCard.children[0].classList[1].slice(3);
  const secondCardName = secondCard.children[0].classList[1].slice(3);
  if (firstCardName === secondCardName) {
    return true;
  } else {
    return false;
  }
}

function cardsMatched() {
  incrementCounter();
  openCards.forEach(function(card){
    console.log('a');
    card.classList.remove('open', 'show');
    card.classList.add('match');
  });
  openCards.pop();
  openCards.pop();
  matchedCards += 2;
  if (matchedCards === 16) {
    gameEnded();
  }
}


// make chosen cards red as an alert of unmatched cards, then call cardsDidNotMatch.
function alertUnmatched() {
  openCards.forEach(function(card){
    card.classList.remove('open');
    card.classList.add('unmatched');
  });
  setTimeout(cardsDidNotMatch, 1000);
}

function cardsDidNotMatch() {
  incrementCounter();
  openCards.forEach(function(card){
    card.classList.remove('open', 'show', 'unmatched');
  });
  openCards.pop();
  openCards.pop();
  enableClicks();
}

// hide all game elements, show congrats pop-up.
function gameEnded() {
  stopTimer();
  const congratsDesc = document.querySelector('#congratsDesc');
  const moves = document.querySelector('#moves').innerHTML;
  const stars = countStars();
  const gameContainer = document.querySelector('.container').style;
  const congratsContainer = document.querySelector('.congratsContainer').style;

  congratsDesc.innerHTML = `You won the game in ${timer} seconds with ${moves} moves and ${stars} stars, Challenge your friends!`;
  gameContainer.display = 'none';
  congratsContainer.display = 'flex';
}

/*
1. call gameLoaded() to shuffle cards and set new listeners for them.
2. hide congratulations pop-up and show the game elements again.
*/
function playAgain() {
  const gameContainer = document.querySelector('.container').style;
  const congratsContainer = document.querySelector('.congratsContainer').style;
  gameLoaded();
  resetCards();
  resetCounter();
  resetStars();
  gameContainer.display = 'flex';
  congratsContainer.display = 'none';

}

function incrementCounter() {
  const counterElementContent = document.getElementById('moves');
  counterElementContent.innerHTML = counterElementContent.innerHTML*1 + 1;
  console.log(counterElementContent.innerHTML);
  if (counterElementContent.innerHTML == 14) {
    decrementStar('thirdStar');
  }
  if (counterElementContent.innerHTML == 19) {
    decrementStar('secondStar');
  }
}

function resetCounter() {
  const counterElement = document.getElementById('moves');
  counterElement.innerHTML = 0;
}

function decrementStar(star) {
  console.log(2);
  let starElement = null;
  if(star === 'thirdStar'){
    starElement = document.getElementById('thirdStar');
  } else {
    starElement = document.getElementById('secondStar');
  }
  starElement.classList.remove('fa-star');
  starElement.classList.add('fa-star-o');
}

// if star element has class fa-star-o, then it should be reset to fa-star
function resetStars() {
  const thirdStar = document.getElementById('thirdStar');
  const secondStar = document.getElementById('secondStar');
  const thirdStarClasses = [...thirdStar.classList];
  const secondStarClasses = [...secondStar.classList];
  if(thirdStarClasses.includes('fa-star-o')) {
    thirdStar.classList.remove('fa-star-o');
    thirdStar.classList.add('fa-star');
  }
  if(secondStarClasses.includes('fa-star-o')) {
    secondStar.classList.remove('fa-star-o');
    secondStar.classList.add('fa-star');
  }
}

function countStars() {
  const thirdStar = document.getElementById('thirdStar');
  const secondStar = document.getElementById('secondStar');
  const thirdStarClasses = [...thirdStar.classList];
  const secondStarClasses = [...secondStar.classList];
  if (secondStarClasses.includes('fa-star-o')) {
    return 1;
  } else if (thirdStarClasses.includes('fa-star-o')) {
    return 2;
  } else {
    return 3;
  }

}

// next two functions handles disabling, enabling clicks when the user chooses 2 cards.
function disableClicks() {
  const deck = document.querySelector('.deck');
  deck.style.pointerEvents = 'none';
}

function enableClicks() {
  const deck = document.querySelector('.deck');
  deck.style.pointerEvents = 'auto';
}

function resetCards() {
  let cards = document.getElementsByClassName('card');
  cards = [...cards]; // HTMLCollection --> Array
  cards.forEach(function(card){
    const cardClasses = [...card.classList];
    if(cardClasses.includes('open') || cardClasses.includes('show')) {
      card.classList.remove('open', 'show');
    }
    if(cardClasses.includes('match')) {
      card.classList.remove('match');
    }
  });
  openCards = [];
  matchedCards = 0;
}



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
