const isPC = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return false;
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return false;
    }
    return true;
};

const minWidth = 400;
const minHeight = 400;

const GameStatus = {
    Start: 0,
    Playing: 1,
}

const Playing = {
    Setup: 0,
    Show: 1,
    Ask: 2,
    Wait: 3,
    Evaluate: 4,
    Correct: 5,
    Incorrect: 6
}

const LEVELS = {
    E: {
        upperLimit: 9,
        initTimeInS: 1,
        calcTimeInS: 5,
        toString: () => "EASY",
        R: 0,
        G: 200,
        B: 0
    },
    M: {
        upperLimit: 25,
        initTimeInS: 1,
        calcTimeInS: 3,
        toString: () => "MEDIUM",
        R: 200,
        G: 200,
        B: 0
    },
    H: {
        upperLimit: 50,
        initTimeInS: 1,
        calcTimeInS: 2,
        toString: () => "HARD",
        R: 200,
        G: 0,
        B: 0
    },
    I: {
        upperLimit: 99,
        initTimeInS: .5,
        calcTimeInS: 1,
        toString: () => "IMPOSSIBLE",
        R: 0,
        G: 0,
        B: 0
    },
}