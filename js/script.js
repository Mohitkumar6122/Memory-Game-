"use strict";

let cards = document.getElementsByClassName("card");
const deck = document.getElementById("card-deck");
const movesCnt = document.querySelector(".moves");
const stars = document.querySelectorAll(".fa-star");
const timer = document.querySelector(".timer");
const matchedCard = document.getElementsByClassName("match");
const starsList = document.querySelectorAll(".stars li");
const closeicon = document.querySelector(".close");
const modal = document.getElementById("popup1");
const winner = document.querySelector(".popup");

// GLOBAL DECLARATIONS
let moves = 0;
var openedCards = [];
let sec = 0,
  min = 0;
let interval;

const newGame = function (cards) {
  // THIS METHOD WORKS SAME BUT IS NOT PREFERED
  // DUE TO THE USE OF INNER HTML

  // deck.innerHTML = "";
  // let html = ``;
  // [...cards].forEach((cur) => {
  //    html += `
  //     <li class='card' type='${cur.type}'>
  //       <i class="fa fa-${cur.type}"></i>
  //     </li>
  //   `;
  //   cur.classList = ['card'];
  // })
  // deck.innerHTML = html;

  // remove child nodes
  while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
  }
  // shuffles and adds new nodes(child)
  [...cards].forEach((cur) => {
    var x = document.createElement("li");
    x.setAttribute("type", `${cur.type}`);
    x.classList.add("card");
    var y = document.createElement("i");
    y.classList.add(`fa`, `fa-${cur.type}`);
    x.appendChild(y);
    deck.appendChild(x);
  });
};

setInterval(() => {
  cards = document.getElementsByClassName("card");
}, 500);

// Fisher–Yates Shuffle
// for more info visit : https://bost.ocks.org/mike/shuffle/
// INPUT -> NODELIST , O/P -> NODELIST
const shuffle = function (cards) {
  let arrayOfNodes = [...cards];
  var m = arrayOfNodes.length,
    t,
    i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = arrayOfNodes[m];
    arrayOfNodes[m] = arrayOfNodes[i];
    arrayOfNodes[i] = t;
  }
  // converts array to Node list
  var fragment = document.createDocumentFragment();
  arrayOfNodes.forEach(function (item) {
    fragment.appendChild(item.cloneNode());
  });
  return fragment.childNodes;
};

//timer
const updateTime = function () {
  interval = setInterval(() => {
    ++sec;
    if (sec == 60) ++min, (sec = 0);
    timer.textContent = ` ${min} min ${sec} sec`;
  }, 1000);
};
// starts new Game with shuffled Cards
const startGame = function () {
  cards = shuffle(cards);
  newGame(cards);
  moves = 0;
  openedCards = [];
  (sec = 0), (min = 0);
  timer.textContent = `0 min 0 sec`;
  movesCnt.textContent = "0";
  for (var i = 0; i < stars.length; i++) {
    stars[i].style.color = "#FFD700";
    stars[i].style.visibility = "visible";
  }
  [...cards].map((cur) =>
    cur.classList.remove("open", "show", "match", "disabled")
  );
  clearInterval(interval);
  updateTime();
};
window.onload = startGame();

// starts new game evry time window reloads

const disable = function () {
  [...cards].map((cur) => {
    cur.classList.add("disabled");
  });
};

const enable = function () {
  [...cards].map((cur) => {
    cur.classList.remove("disabled");
  });
  [...matchedCard].forEach((cur) => cur.classList.add("disabled"));
};

// updates moves count
const updateMoves = function () {
  movesCnt.textContent = moves;
  displayScore();
};

const congratulations = function () {
  if (matchedCard.length == 16) {
    winner.scrollIntoView();
    clearInterval(interval);
    const finalTime = timer.innerText;
    //show congratulations modal
    modal.classList.add("show");
    //declare star rating variable
    var starRating = document.querySelector(".stars").innerHTML;
    //showing move, rating, time on modal
    document.getElementById("finalMove").innerHTML = moves;
    document.getElementById("starRating").innerHTML = starRating;
    document.getElementById("totalTime").innerHTML = finalTime;
    //closeicon on modal
    closeModal();
  }
};
const closeModal = function () {
  closeicon.addEventListener("click", function (e) {
    modal.classList.remove("show");
    startGame();
  });
};
//for player to play Again
const playAgain = function () {
  modal.classList.remove("show");
  startGame();
};
// displays score
const displayScore = function () {
  // you can modify score to diffrent moves options
  if (moves > 12 && moves <= 20) {
    stars[2].style.visibility = "collapse";
  } else if (moves > 20 && moves <= 50) {
    stars[1].style.visibility = "collapse";
  } else if (moves > 50) stars[0].style.visibility = "collapse";
};

// displaysa a card
deck.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.id == "card-deck") return;
  const curCard = e.target;
  e.target.classList.toggle("show");
  e.target.classList.toggle("open");
  e.target.classList.toggle("disabled");
  if (!openedCards.length) {
    // curCard.classList.add('disabled');
    openedCards.push(curCard);
  } else if (openedCards[openedCards.length - 1].type == curCard.type) {
    ++moves;
    const formerCard = openedCards[openedCards.length - 1];
    formerCard.classList.add("match", "disabled");
    curCard.classList.add("match", "disabled");
    formerCard.classList.remove("open", "show");
    curCard.classList.remove("open", "show");
    openedCards = [];
  } else {
    ++moves;
    const formerCard = openedCards[openedCards.length - 1];
    formerCard.classList.add("unmatched");
    curCard.classList.add("unmatched");
    disable();
    setTimeout(() => {
      curCard.classList.remove("show", "open", "unmatched");
      formerCard.classList.remove("show", "open", "unmatched");
      enable();
      openedCards = [];
    }, 1200);
  }
  congratulations();
  updateMoves();
});

