let canvasWidth;
let canvasHeight;

const GameStatus = {
    Start: 0,
    Playing: 1,
    Over: 2
}

let gameStatus = GameStatus.Start;

function setup() {
    const idealWidth = (4 / 5) * windowWidth;
    const idealHeight = (4 / 5) * windowHeight;
    canvasWidth = idealWidth < 600 ? 600 : idealWidth;
    canvasHeight = idealHeight < 600 ? 600 : idealHeight;
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.style('display', 'block');
    textSize(60);
    textAlign(CENTER, CENTER);
    frameRate(10);
}

function windowResized() {
    const idealWidth = (4 / 5) * windowWidth;
    const idealHeight = (4 / 5) * windowHeight;
    canvasWidth = idealWidth < 600 ? 600 : idealWidth;
    canvasHeight = idealHeight < 600 ? 600 : idealHeight;
    resizeCanvas(canvasWidth, canvasHeight);
}

function draw() {
    background(49);

    switch (gameStatus) {
        case GameStatus.Start:
            displayStartPrompt();
            break;
        case GameStatus.Playing:
            playGame();
            break;
        case GameStatus.Over:
            break;
    }
}

function displayStartPrompt() {
    fill(random(140, 240));
    text('Press ↵ to play', (1/2)*canvasWidth, (1/2)*canvasHeight);
}

function playGame() {
    console.log("Playing game.")
}

function keyPressed() {
    if (keyCode === 13 && gameStatus === GameStatus.Start) { //ENTER
        gameStatus = GameStatus.Playing;
    }
}