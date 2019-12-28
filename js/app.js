/*
 * Create a list that holds all of your cards
 */
var cards = ["fa fa-anchor", "fa fa-bolt", "fa fa-bomb", "fa fa-bicycle",
    "fa fa-cube", "fa fa-diamond", "fa fa-leaf", "fa fa-paper-plane-o",
    "fa fa-anchor", "fa fa-bolt", "fa fa-bomb", "fa fa-bicycle",
    "fa fa-cube", "fa fa-diamond", "fa fa-leaf", "fa fa-paper-plane-o",
];


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

 // Added sound effects
var flip = new Audio('sounds/open.wav')
var sameCards = new Audio('sounds/match.wav')
var unmatch = new Audio('sounds/unmatch.wav')
var endGame = new Audio('sounds/win.wav')
var background = new Audio('sounds/background.mp3')


// Create a deck with shuffled cards and adding eventlistener
function initGame() {
    background.play();
    background.loop = true;
    const deck = document.querySelector('#deck');
    deck.innerHTML = "";
    const newDeck = document.createElement('ul');
    newDeck.classList.add('deck');
    
    // shuffle the card list
    let shuffleAllCards = shuffle(cards);
    for (let i = 0; i < shuffleAllCards.length; i++) {
        const list = document.createElement('li');
        list.classList.add('card');
        list.innerHTML = `<i class="${shuffleAllCards[i]}"></i>`;
        newDeck.appendChild(list);
    }
    deck.append(newDeck);

    deck.addEventListener('click', onclick);
}

initGame();

// Clear both arrays
var openCards = [];
var matchCards= [];

// Opening cards to check if they match or not
function onclick(e) {
    flip.play();
    let card = e.target;

    if (card.classList.contains("card") && !card.classList.contains("open", "show", "match")) {
        openCards.push(card);
        card.classList.add("open", "show");
            
        //if match, stays open
        if (openCards.length === 2) {
            
            // To prevent open more cards while matching
            deck.classList.add("stop-event");
            // Moves start counting when matching first pairs
            moveCount();
            if (openCards[0].innerHTML === openCards[1].innerHTML) {
                sameCards.play();
                openCards[0].classList.add("match");               
                openCards[1].classList.add("match");

                matchCards.push(openCards[0]);
                matchCards.push(openCards[1]);

                openCards = [];
                deck.classList.remove("stop-event");
            } else {
                unmatch.play();
                //if unmatch, hide
                setTimeout (function() {
                    openCards.forEach(function(card) {

                        openCards[0].classList.remove("open");               
                        openCards[1].classList.remove("open");
                        openCards[0].classList.remove("show");               
                        openCards[1].classList.remove("show");

                    });

                    openCards = [];
                    deck.classList.remove("stop-event");
                }, 1000);               
            } congrats();
        }
    }   
};


// Setup timer
var second = 0, minute = 0; hour = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
    
    interval = setInterval(function(){
        timer.innerHTML = minute+"mins "+second+"secs";
        second++;
        if(second == 60){
            minute++;
            second = 0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}

// Setup stars rating and moves
const stars = document.querySelectorAll(".fa-star");
let starsList = document.querySelectorAll(".stars li");

let moves = 0;
const movesCounter = document.querySelector(".moves");
movesCounter.innerHTML = moves;
function moveCount() {
     moves++;
    if (moves == 1) {
        movesCounter.innerHTML = `1  Move`;
        second = 0;
        minute = 0; 
        hour = 0;
        // Timer starts when first move is made
        startTimer();
    } else {
        movesCounter.innerHTML = `${moves}  Moves`;
    }

    // A first star is removed over 16 moves
    if (moves > 8 && moves < 16) {
        for (var i = 0; i < 3; i++) {
            if (i > 1) {
                stars[i].style.visibility = "collapse";
            }
        }
    }
    // A second star is removed when over 20 moves
    else if (moves > 20) {
    for (var i = 0; i < 3; i++) {
        if (i > 0) {
                stars[i].style.visibility = "collapse";
            }
        }
    }
   
}

// Restarting the game
const restart = document.querySelector(".restart");

function startGame() {
    // reset a new card deck
    initGame();

    // reset the timer
    second = 0;
    minute = 0; 
    hour = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0mins 0secs";
    clearInterval(interval);

    // reset moves
    moves = 0;
    movesCounter.innerHTML = `0`;

    // reset the star ratings
    for (var i = 0; i < stars.length; i++) {
        stars[i].style.color = "FFD700";
        stars[i].style.visibility = "visible";
    }

    // clear the cards arrays
    openCards = [];
    matchCards = [];
    
}

// Restarting the game when clicking on the restart
restart.addEventListener("click", startGame);


// Setup modal after completing the game
const popup = document.querySelector('.popup');

function congrats() {
    
    // All cards opened game finished
    if (matchCards.length === 16) {
        endGame.play();
        // Showing the stats to the player
        totalTime = timer.innerHTML;
        var starRating = document.querySelector(".stars").innerHTML;
        
        document.getElementById("timeRating").innerHTML = totalTime;
        document.getElementById("movesRating").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;

        popup.style.display = 'block';
        // Stop timer
        clearInterval(interval);
        
    }
}

// Setup replay button in the modal
const playAgain = document.querySelector('.button');

playAgain.addEventListener('click', function () {
    // Restart a new game
    popup.style.display = 'none';
    startGame();   
})

