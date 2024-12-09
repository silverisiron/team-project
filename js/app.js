const cards = [
  "fa-leaf", "fa-leaf",
  "fa-cube", "fa-cube",
  "fa-anchor", "fa-anchor",
  "fa-diamond", "fa-diamond",
  "fa-bicycle", "fa-bicycle",
  "fa-paper-plane-o", "fa-paper-plane-o",
  "fa-bolt", "fa-bolt",
  "fa-bomb", "fa-bomb",
];
let openCards = [];
let matchedCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;

//_____/____LIST OF VARIABLES_____\______\\

const cardsList = document.querySelectorAll('.card'); // nodelist of cards
const stars = document.querySelector("ul.stars li"); // selects all stars
const reset = document.querySelector(".fa-repeat"); // restart button
const deck = document.querySelector('.deck');

//________//_______FUNCTIONS_______\\__________\\

// grid is created
function generateGrid(card) {
  return `<li class="card">
            <i class="fa ${card}"></i>
          </li>`;  // 수정: 템플릿 리터럴을 사용하여 문자열을 제대로 처리
}

//_______Shuffle function from http://stackoverflow.com/a/2450976________\\

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}

//_______________END GAME________________\\
function endGame () {
  stopClock(); // stop the clock when game ends
  // Show congrats message
}

//_______________START GAME________________\\
function startGame () {
  const deck = document.querySelector(".deck"); //shuffles deck
  let cardHTML = shuffle(cards).map(function(card) {
      return generateGrid(card);
  });
  deck.innerHTML = cardHTML.join(''); // generates grid
  moves = 0; // Reset moves counter
  document.querySelector('.moves').textContent = moves; // Reset the move count display
  resetStars(); // Reset stars visibility
  time = 0; // Reset time
  displayTime(); // Reset time display
  startClock(); // Start clock
}

startGame();

//______________MOVES ________________\\
function addMoves() {
  moves++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}

function checkScore() {
  if (moves === 2 || moves === 3 ) {
      hideStar();
      console.log('test checkscore');
  }
}

function hideStar() { // applies hide property to star
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
      if (star.style.display !== 'none') {
          star.style.display = 'none';
          break;
      }
  }
}

//_______________GAME FUNCTIONALITY________________\\

function evaluateClick(clickTarget) {
  return (
      clickTarget.classList.contains('card') &&
      !clickTarget.classList.contains('open') && // prevents clicking open card
      !clickTarget.classList.contains('match') && // prevents clicking on matched cards
      openCards.length < 2 && // prevents more than 2 cards firing event
      !openCards.includes(clickTarget) // prevents double click on one card
  );
}

deck.addEventListener('click', event => {
   const clickTarget = event.target;

   if (evaluateClick(clickTarget)) {
          if (clockOff) {
              startClock();
              clockOff = false;
          }
          toggleCard(clickTarget); //opens card
          openCards.push(clickTarget); // send to openCards array

       if (openCards.length === 2) {
          checkIfCardsMatch();
          addMoves();
          checkScore();
       }
   }
})

// toggles the card class on/off
function toggleCard(clickTarget) {
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
}

// fx checks for match
function checkIfCardsMatch() {
  if (openCards[0].firstElementChild.className ===
      openCards[1].firstElementChild.className) {
          openCards[0].classList.toggle('match');
          openCards[1].classList.toggle('match'); // card matched
          matchedCards.push(openCards[0]);
          matchedCards.push(openCards[1]); //send to matched cards array
          openCards = [];
  } else {
      setTimeout(function() {
          openCards.forEach(function(card) { //flips over card
              card.classList.remove('open', 'show');
           });
          openCards.length = 0; //empties openCards array
      }, 600);
  }
}

// Display time in minutes and seconds
function displayTime(){
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const clock = document.querySelector('.clock');
  if (seconds < 10) {
      clock.innerHTML = `${minutes}:0${seconds}`; // fixed template literal
  } else {
      clock.innerHTML = `${minutes}:${seconds}`; // fixed template literal
  }
}

// Start the clock
function startClock() {
  clockId = setInterval(() => {
      time++;
      displayTime();
  }, 1000);
}

function stopClock() { // stops clock
  clearInterval(clockId);
  clockOff = true;
}

//_______________Modal_______________\\

function toggleModal() {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
}

toggleModal(); //opens modal
toggleModal(); //closes modal

// Modal tests
moves = 16;
checkScore();

writeModalStats();
toggleModal();

function writeModalStats() {
  const timeStat = document.querySelector('.modal_time');
  const clockTime = document.querySelector('.clock').innerHTML;
  const movesStat = document.querySelector('.modal_moves');
  const starsStat = document.querySelector('.modal_stars');
  let stars = getStars();

  timeStat.innerHTML = `Time = ${clockTime}`;
  movesStat.innerHTML = `Moves = ${moves}`;
  starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
  const stars = document.querySelectorAll('.stars li');
  let starCount = 0;
  for (let star of stars) {
      if (star.style.display !== 'none') {
          starCount++;
      }
  }
  console.log(starCount);
  return starCount;
}

// Reset stars visibility (if necessary for game reset)
function resetStars() {
  const starList = document.querySelectorAll('.stars li');
  starList.forEach(star => star.style.display = 'inline'); // Reset all stars to visible
}
