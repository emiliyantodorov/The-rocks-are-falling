const tank = document.querySelector(".tank");
const btnStartBossFight = document.querySelector(".cta-boss");
const sectionBoss = document.querySelector(".section-boss");
const boss1 = document.querySelector(".boss-1");
const boss1Pic = document.querySelector(".boss-1__img-wrapper img");
const tankHealth = document.querySelector(".tank__health");
const gameOverPanel = document.querySelector(".game-over-panel");

let isBossStillALive = true;
let repeatAnimation = null;

class Tank {
    constructor(live, isFireing) {
        this.live = live || 100;
        this.isFireing = isFireing;
    }

    static moveLeft() {
        if (tank.dataset.move === "left" && tank.offsetLeft > (tank.offsetWidth / 2)) {
            let curPos = Tank.getPosX();
            tank.style.left = `${curPos - 7}px`;
        }
    }

    static moveRight() {
        if (tank.dataset.move === "right" && (tank.offsetLeft + (tank.offsetWidth / 2)) < sectionBoss.offsetWidth) {
            let curPos = Tank.getPosX();
            tank.style.left = `${curPos + 7}px`;
        }
    }

    static getPosX() {
        return tank.offsetLeft;
    }

    static getPosY() {
        return tank.offsetTop;
    }
}

function bossEnd(isBossLive) {
    if (isBossLive === true) {
        clearInterval(repeatAnimation);
        tank.remove();
        gameOverPanel.style.display = "flex";
        btnStartBossFight.style.display = "none";
        document.querySelector(".game-over-panel__game-over").style.display = "block"
    } else if (isBossLive === false) {
        isBossStillALive = false;
        boss1Pic.setAttribute("src", "images/explosion.gif");
        setTimeout(() => {
            boss1.remove();
        }, 800);
        cancelAnimationFrame(repeatAnimation);
    }
}

function startMovingTheTank(evt) {
    const targetKey = evt.key;

    if (targetKey === "ArrowLeft" || targetKey === "a") {
        return tank.dataset.move = "left";
    }
    if (targetKey === "ArrowRight" || targetKey === "d") {
        return tank.dataset.move = "right";
    }

    repeatAnimation = requestAnimationFrame(startMovingTheTank);
}

function stopTheTank() {
    tank.dataset.move = "undefined";
}

const newBoss = {
    health: 100
};

const myTank = {
    health: 100
};

function moveBoss(boss) {
    return boss.style.left = `${getRandomNumber(sectionBoss.offsetWidth)}px`;
}

function update() {
    Tank.moveLeft();
    Tank.moveRight();

    requestAnimationFrame(update);
}

function isTouched(a, b) {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();

    if (rectA.right > rectB.left && rectA.left < rectB.right &&
        rectA.top + 30 < rectB.bottom && rectA.bottom - 10 > rectB.top) {
        return true;
    }
    return false;
}

function isHittingTheEl(bullet, elName, name) {
    if (isTouched(bullet, boss1Pic) && name === "fireball") { // fireball hits the boss
        boss1Pic.setAttribute("src", "images/hit-rock.gif");
        newBoss.health -= 5; // remove %  from boss health
        if (newBoss.health <= 0) {
            bossHealth.style.width = "0%";
            bossEnd(false);
        } else {
            bossHealth.style.width = `${newBoss.health}%`;
        }
        bullet.remove();
    } else if (isTouched(bullet, tank) && name === "thunder") { // thunder hits the tank
        myTank.health -= 34;
        if (myTank.health <= 0) {
            tankHealth.style.width = "0%";
            bossEnd(true);
        } else {
            tankHealth.style.width = `${myTank.health}%`;
        }
        bullet.remove();
    }

    animRepeat = requestAnimationFrame(isHittingTheEl.bind(null, bullet, elName, name));
}

function moveTheFireball(fireball) {
    // 1 - decrease current fireball.y
    fireball.style.top = `${(Tank.getPosY() + 40)}px`;
    isHittingTheEl(fireball, boss1, "fireball")
}

function moveTheBossBullet(bullet) {
    // 1 - increase current bullet
    bullet.style.top = `${sectionBoss.offsetHeight * 2 - 50}px`;
    isHittingTheEl(bullet, tank, "thunder");
}

////
// FIRE START
const createElement = (tagName, className, source = null) => {
    const newEl = document.createElement(tagName);
    newEl.setAttribute("class", className);
    if (source !== null) {
        newEl.setAttribute("src", source);
    }

    return newEl;
};

const setCoordinatesXAndY = (el, x, y) => {
    el.style.left = x;
    el.style.top = y;
    return el;
};

function fire(newEl, isTheBossFiring) {
    sectionGameBoard.appendChild(newEl);
    // 4 - move the fireball
    if (isTheBossFiring === false) {
        moveTheFireball(newEl);
        // 5 - delete the fireball
        setTimeout(() => {
            newEl.remove();
        }, 1000)
    } else {
        // moveTheFireball(newEl);
        // console.log(boss1.top);
        moveTheBossBullet(newEl);
        setTimeout(() => {
            newEl.remove();
        }, 1000)
    }
}

// END OF FIRE

function startBossFight() {
    gameOverPanel.style.display = "none";
    setInterval(moveBoss.bind(null, boss1), 1300);
    let bossFires = setInterval(() => { // boss is firing every 1300ms if he is alive
        fire(setCoordinatesXAndY(createElement("img", "thunder", "images/thunder.gif"), `${boss1.offsetLeft + sectionBoss.offsetLeft + (boss1.offsetWidth / 2)}px`, `${113}%`)); // `${sectionBoss.offsetTop + 110}px`
        if (isBossStillALive === false) {
            cancelAnimationFrame(update);
            clearInterval(bossFires);
        }
    }, 600);
    repeatAnimation = requestAnimationFrame(update);
}

//////////////////////////////////////////////////////////////////////
document.addEventListener("keydown", startMovingTheTank);
document.addEventListener("keyup", stopTheTank);
btnStartBossFight.addEventListener("click", startBossFight);

// media here: min-width: 992px than we need click event listener
const lg = window.matchMedia("(min-width: 992px)");

document.addEventListener("click", () => {
    if (lg.matches) {
        fire(setCoordinatesXAndY(createElement("img", "fireball", "images/fireball-pic-24fr.gif"), `${tank.offsetLeft + sectionBoss.offsetLeft}px`, `${185}%`), false); // y: `${(660 * 2) - 120}px`
    }
});

///////////////////////////////////
// MOBILE NAVIGATION
const leftStick = document.querySelector(".mobile-stick--left");
const fireStick = document.querySelector(".mobile-stick--fire");
const rightStick = document.querySelector(".mobile-stick--right");

// left stick
leftStick.addEventListener("touchstart", () => {
    tank.dataset.move = "left";
});

leftStick.addEventListener("touchend", () => {
    tank.dataset.move = "undefined"
});

// right stick
rightStick.addEventListener("touchstart", () => {
    tank.dataset.move = "right";
});

rightStick.addEventListener("touchend", () => {
    tank.dataset.move = "undefined";
});

// fire stick
fireStick.addEventListener("click", ()=> {
    fire(setCoordinatesXAndY(createElement("img", "fireball", "images/fireball-pic-24fr.gif"), `${tank.offsetLeft + sectionBoss.offsetLeft}px`, `${185}%`), false); // y: `${(660 * 2) - 120}px`
});




