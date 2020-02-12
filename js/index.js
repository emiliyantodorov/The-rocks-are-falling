var sound = new Howl({
    src: ['sounds/kamani.mp3']
});
sound.play();
document.addEventListener("mousedown", evt => evt.preventDefault());

const body = document.body;
const sectionGameBoard = document.querySelector(".section-game-board");
const sectionGameStart = document.querySelector(".section-start-game");
const hero = document.querySelector(".hero");
const title = document.querySelector("h2");
const cta = document.querySelectorAll(".cta");
const scoreEl = document.querySelector(".score-box__score");
const livesEl = document.querySelector(".lives-box__lives");
const rocksArr = ["images/stone-smile-1.png", "images/stone-smile-2.png", "images/stone-smile-4.png", "images/stone-smile-5.png", "images/stone-smile-6.png", "images/stone-smile-7.png"];
const gameOverTitle = document.querySelector(".game-over");

let animRepeat = null;
let isTheGameOver = false;

function getRandomNumber(endNum) {
    return Math.floor(Math.random() * endNum);
}

function gameOver() {
    document.querySelectorAll(".rock").forEach(rock => rock.remove());
    let counter = 0;
    let tempFontSize = 19;
    const gameOverInterval = setInterval(() => {
        gameOverTitle.style.fontSize = `${tempFontSize}px`;
        tempFontSize *= 2;
        counter += 1;
        if (counter === 3) {
            clearInterval(gameOverInterval);
        }
    }, 300);
    // show the "GAME OVER" text to the user
    gameOverTitle.style.display = "block";
    return isTheGameOver = true;
}

function decreaseLives(livesEl) {
    const result = +livesEl.innerHTML - 1;
    livesEl.innerHTML = result;
    return result;
}

function createRock() {
    const rock = document.createElement("div");
    rock.setAttribute("class", "rock");
    let tempBg = `url(${rocksArr[getRandomNumber(6)]}) center/contain no-repeat`;
    // console.log(tempBg);
    rock.style.background = tempBg;
    return rock;
}

function moveTheRock(curRock) {
    curRock.style.top = `${(curRock.offsetTop) + 4}px`;
    if (curRock.offsetTop > sectionGameStart.offsetHeight) {
        curRock.remove(); // remove current rock

        if (+decreaseLives(livesEl) === 0) {
            return gameOver();
        }
    }

    animRepeat = requestAnimationFrame(moveTheRock.bind(null, curRock));
}

function removeRock(rock) {
    return rock.remove();
}

function addPoint(el) {
    let curPoints = +el.innerHTML;
    if (curPoints === 1) {

    }
    return el.innerHTML = curPoints + 1;
}

// MAIN FUNCTION
function main() {
    const testRock = createRock(); // create rock

    testRock.addEventListener("click", (evt) => { // remove current rock on user click and add point to the user
        const $target = evt.target;
        document.querySelector(".tink").play(); //play tink sound when rock is broken
        $target.style.background = `url(images/explosion.gif) center/contain no-repeat`;
        setTimeout(() => {
            removeRock($target);
        }, 500);
        addPoint(scoreEl);
    });

    testRock.style.left = `${getRandomNumber((body.offsetWidth - 100))}px`;

    body.appendChild(testRock);

    moveTheRock(testRock); // start to animate the current rock
}

let titleLetters = "Камъните Падат".split("");
let counter = 0;

titleLetters.forEach(letter => { // Create all separate letters
    const curLetter = document.createElement("span");
    curLetter.classList.add("letter");
    curLetter.innerText = letter;

    title.append(curLetter);
});

let counter2 = 0;
const allLetters = document.querySelectorAll(".letter"); // Animate all letters

let lettersInterval = setInterval(() => {
    allLetters[counter2].style.top = "0";
    allLetters[counter2].style.opacity = "1";
    counter2++;
    if (counter2 === allLetters.length) {
        clearInterval(lettersInterval);
    }

}, 350);

cta.forEach(button => {
    button.addEventListener("click", () => {
        livesEl.innerText = 3;
        scoreEl.innerText = 0;
        hero.style.display = "none";
        gameOverTitle.style.display = "none";
        let repeat = setInterval(() => {
            if (isTheGameOver === true) {
                isTheGameOver = false;

                return clearInterval(repeat);
            }
            main();
        }, 800);
    });
});

// let audio = new Audio("sounds/kamani.mp3");
// audio.play();














