let canvasWidth;
let canvasHeight;
let onPC = isPC();

let term, result, level, highScore;
let userNum = 0, num = 0, score = 0, waitTimeout = 0, countDownTime = 0, timeRemaining = 0;
let gameStatus = GameStatus.Start, playingStatus = Playing.Setup;

function calculateWH() {
    const idealWidth = (4 / 5) * windowWidth;
    const idealHeight = (4 / 5) * windowHeight;
    canvasWidth = idealWidth < minWidth ? minWidth : idealWidth;
    canvasHeight = idealHeight < minHeight ? minHeight : idealHeight;
}

function setup() {
    calculateWH();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.style('display', 'block');
    textAlign(CENTER, CENTER);
    frameRate(10);
    level = getItem('level') ? LEVELS[getItem('level')] : LEVELS.E;
    highScore = getItem(`hs-${level.toString()[0]}`) ? getItem(`hs-${level.toString()[0]}`) : 0;

    if (!onPC) {
        alert(`Sorry, this page is not supported on phones and tablets yet.`)
        noLoop();
    }
}

function windowResized() {
    calculateWH()
    resizeCanvas(canvasWidth, canvasHeight);
}

function draw() {
    background(49);
    showLevel();
    showHighScore();

    switch (gameStatus) {
        case GameStatus.Start:
            displayStartPrompt();
            break;
        case GameStatus.Playing:
            playGame();
            break;
    }
}

function showLevel() {
    fill(level.R, level.G, level.B);
    textSize(20);
    text(level, (.9) * canvasWidth, (.05) * canvasHeight);
}

function showHighScore() {
    fill(200, 170, 0);
    textSize(20);
    text(`HS: ${highScore}`, (.08) * canvasWidth, (.05) * canvasHeight);
}

function showScore() {
    fill(200);
    textSize(20);
    text(`S: ${score}`, (.08) * canvasWidth, (.08) * canvasHeight);
}

function displayStartPrompt() {
    fill(random(140, 240));
    textSize(60);
    text('Press ↵ to start', (1 / 2) * canvasWidth, (1 / 2) * canvasHeight);
    fill(240);
    textSize(20);
    text(`${howToChangeLevels()}`
        , (1 / 2) * canvasWidth, (.9) * canvasHeight);
}

function levelDetails() {
    return `${level.initTimeInS} second${plr(level.initTimeInS)} to read the initial number,\n${level.calcTimeInS} second${plr(level.calcTimeInS)} to calculate the result.`
}

function howToChangeLevels() {
    const otherLevels = Object.values(LEVELS).filter(l => l.toString() != level.toString());
    let levelsText = "Press ";
    otherLevels.forEach(e => {
        levelsText += `${e.toString()[0]} for ${e.toString()}, `;
    })
    return levelsText.substring(0, levelsText.length - 2);
}

function plr(num) {
    return num == 1 ? '' : 's';
}

function showNum(val) {
    fill(240);
    textSize(200);
    text(val, (1 / 2) * canvasWidth, (1 / 2) * canvasHeight);
}

function showTyped(val) {
    fill(200);
    textSize(90);
    text(val, (1 / 2) * canvasWidth, (.75) * canvasHeight);
}

function showTimeRemaining() {
    setColorBasedOnTimeRemaining();
    textSize(50);
    const seconds = timeRemaining / 1000;
    text(+seconds.toFixed(1), (1 / 2) * canvasWidth, (.9) * canvasHeight)
}

function setColorBasedOnTimeRemaining() {
    const calcTimeInMs = level.calcTimeInS * 1000;
    if (timeRemaining > (2 / 3) * calcTimeInMs) {
        fill(0, 200, 0);
    }
    else if (timeRemaining > (1 / 3) * calcTimeInMs) {
        fill(200, 200, 0);
    }
    else {
        fill(200, 0, 0);
    }
}

function showIncorrect(val) {
    fill(200, 0, 0);
    textSize(90);
    text(val != 0 ? val : `:(`, (1 / 2) * canvasWidth, (.75) * canvasHeight);
}

function showCorrect(val) {
    fill(0, 200, 0);
    textSize(90);
    text(val, (1 / 2) * canvasWidth, (.75) * canvasHeight);
}

function playGame() {
    switch (playingStatus) {
        case Playing.Setup:
            playingStatus = Playing.Show;
            setTimeout(() => {
                playingStatus = Playing.Ask;
            }, level.initTimeInS * 1000);
            break;
        case Playing.Show:
            showNum(num);
            break;
        case Playing.Ask:
            term = floor(random(1, level.upperLimit));
            result = num + term;

            showNum(`+ ${term}`);

            countDownTime = new Date();
            countDownTime.setSeconds(countDownTime.getSeconds() + level.calcTimeInS);

            playingStatus = Playing.Wait;
            waitTimeout = setTimeout(() => {
                playingStatus = Playing.Evaluate;
            }, level.calcTimeInS * 1000);
            break;
        case Playing.Wait:
            showNum(`+ ${term}`);

            timeRemaining = countDownTime.getTime() - new Date().getTime();
            showTimeRemaining();

            if (userNum != 0) {
                showTyped(userNum);
            }
            if (userNum === result) {
                clearTimeout(waitTimeout);
                playingStatus = Playing.Correct;
                showCorrect(userNum);
            }
            break;
        case Playing.Evaluate:
            if (userNum === result) {
                playingStatus = Playing.Correct;
            }
            else {
                playingStatus = Playing.Incorrect;
                setTimeout(() => {
                    score = 0;
                    userNum = 0;
                    playingStatus = Playing.Setup;
                    gameStatus = GameStatus.Start;
                }, 1000);
            }

            break;
        case Playing.Correct:
            score += 1;
            if (score >= highScore) {
                highScore = score;
                storeItem(`hs-${level.toString()[0]}`, highScore);
            }
            userNum = 0;
            num = result;
            playingStatus = Playing.Setup;
            break;
        case Playing.Incorrect:
            showNum(result);
            showIncorrect(userNum);
            break;
    }
    showScore();
}

function keyPressed(e) {

    if (keyCode === 13 && gameStatus === GameStatus.Start) { //ENTER
        gameStatus = GameStatus.Playing;
        num = floor(random(1, level.upperLimit));
    }
    else if (gameStatus === GameStatus.Start
        && Object.keys(LEVELS).includes(e.key.toUpperCase())) {
        level = LEVELS[e.key.toUpperCase()];
        highScore = getItem(`hs-${e.key.toUpperCase()}`) ? getItem(`hs-${e.key.toUpperCase()}`) : 0;
        storeItem('level', e.key.toUpperCase());
    }
    else if (playingStatus === Playing.Wait) {
        const num0 = 48, keypad0 = 96;
        if (keyCode === 8) {    //backspace
            userNum = floor(userNum / 10);
        }
        else if (keyCode >= num0 && keyCode <= num0 + 9) {
            userNum = userNum * 10 + (keyCode - num0);
        }
        else if (keyCode >= keypad0 && keyCode <= keypad0 + 9) {
            userNum = userNum * 10 + (keyCode - keypad0);
        }
    }
}