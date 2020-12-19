let snake = {
    body: [[0, 3], [0, 2], [0, 1], [0, 0]]
};
let apple = [0, 2];
let highScore = 0;
let gamesArray = [];
let nextDirection;
let left = 'left';
let up = 'up';
let right = 'right';
let down = 'down';

function makeGrid(rows = 10, cols = 10) {
    const cellCount = rows * cols;
    const gridElement = $('.grid').html('').css({
        height: 64 * rows + 2,
        width: 64 * cols + 2,
    });

    for (let i = 0; i < cellCount; i++) {
        let cells = $('<div class="cell"></div>');
        $('.grid').append(cells);
    }
}

makeGrid();

function drawSnake() {

    for (let i = 0; i < snake.body.length; i++) {
        let row = snake.body[i][0];
        let col = snake.body[i][1];
        let sum = (row * 10) + (col) + 1;
        $(`.cell:nth-child(${sum})`).addClass('snake').css('backgroundColor', 'green');
    }
}

drawSnake();
spawnApple();

$(document).keydown(function (event) { ///w,a,s,d work too.

    if (event.which === 37 || event.which === 65) { //left
        nextDirection = left;
    } else if (event.which === 38 || event.which === 87) { //up
        nextDirection = up;
    } else if (event.which === 39 || event.which === 68) { //right
        nextDirection = right;
    } else if (event.which === 40 || event.which === 83) { //down
        nextDirection = down;
    }
});

function checkingCollision() {
    for (let i = 1; i < snake.body.length; i++) {
        if (snake.body[0][0] == snake.body[i][0] &&
            snake.body[0][1] == snake.body[i][1]) {
            return true
        }

    }
    return false

};

let difficultyValue = document.getElementById('difficultyValue');
let difficulty = 250;

$('.easy').on('click', function () {
    difficulty = 'easy';
    $(difficultyValue).text(difficulty);
    updateDifficulty();
});


$('.medium').on('click', function () {
    difficulty = 'medium';
    $(difficultyValue).text(difficulty);
    updateDifficulty();
});

$('.hard').on('click', function () {
    difficulty = 'hard';
    $(difficultyValue).text(difficulty);
    updateDifficulty();
});

function updateDifficulty() {
    if (difficulty === 'easy') {
        difficulty = 500;
    } else if (difficulty === 'medium') {
        difficulty = 250;
    } else if (difficulty === 'hard') {
        difficulty = 150;
    };
}

function gameOperation() {

    const test = setInterval(function () {

        let row = snake.body[0][0];
        let col = snake.body[0][1];
        let snakeHead = [row, col];
        let collided = checkingCollision();
        let checkApple = checkEatApple();

        if (!checkApple && nextDirection) {
            snake.body.pop();
        }

        if (nextDirection === left) {
            snake.body.unshift([row, col - 1]);
            $(".cell").removeClass('snake').css("backgroundColor", "grey");
        } else if (nextDirection === up) {
            snake.body.unshift([row - 1, col]);
            $(".cell").removeClass('snake').css("backgroundColor", "grey");
        } else if (nextDirection === right) {
            snake.body.unshift([row, col + 1]);
            $(".cell").removeClass('snake').css("backgroundColor", "grey");
        } else if (nextDirection === down) {
            snake.body.unshift([row + 1, col]);
            $(".cell").removeClass('snake').css("backgroundColor", "grey");
        }

        if (snake.body[0][0] < 0 || snake.body[0][0] > 9) {
            nextDirection = '';
            alert('game over');
            updateGamesPlayed();
            averages();
            clearInterval(test);
        } else if (snake.body[0][1] < 0 || snake.body[0][1] > 9) {
            nextDirection = '';
            alert('game over');
            updateGamesPlayed();
            averages();
            clearInterval(test);
        } else if (collided) {
            alert('game over');
            updateGamesPlayed();
            averages();
            clearInterval(test);
        } else {
            drawApple();
            drawSnake();
            updateScore();
        }

    }, difficulty);

};


$('.startGame').on('click', function () {
    snake = {
        body: [[0, 3], [0, 2], [0, 1], [0, 0]]
    };

    //apple = [5, 5];
    spawnApple();
    nextDirection = right;
    drawSnake();
    drawApple();
    gameOperation();

});

function drawApple() {
    let row = apple[0];
    let col = apple[1];
    let sum = (row * 10) + (col) + 1;
    $(`.cell:nth-child(${sum})`).css('background-color', 'red');

}

drawApple();


function spawnApple(num = 0) {
    const row = Math.floor(Math.random() * Math.floor(9));
    const col = Math.floor(Math.random() * Math.floor(9));
    let sum = row + col;
    const isSnake = !!snake.body.find(arr => arr[0] === row && arr[1] === col);
    if (isSnake) {
        if (num < 100) {
            spawnApple(num += 1);
        }
    } else {
        apple = [row, col];
    }
}

function checkEatApple() {
    if (apple[0] == snake.body[0][0] && apple[1] == snake.body[0][1]) {
        spawnApple();
        return true;
    }
    return false;

}

function updateScore() {
    let highScoreVar = document.getElementById('highScore');
    let startValueVar = document.getElementById('currScore');
    let currValue = snake.body.length - 4;
    if (currValue > highScore) {
        highScore = currValue;
    }
    $(startValueVar).text(currValue);
    $(highScoreVar).text(highScore);
};

function updateGamesPlayed() {
    let currValue = snake.body.length - 4;
    gamesArray.unshift(currValue);
    let gameNumber = gamesArray.length;
    let gamesPlayed = $(`<p>Game #${gameNumber} Score = ${gamesArray[0]}</p>`).css('color', 'white');
    $('.recentGames').prepend(gamesPlayed);
}

function averages() {
    let averageSnakeLength = 0;
    let averageSnakeValue = document.getElementById('averageLength');
    averageSnakeLength = gamesArray.reduce((a, b) => a + b, 0) / gamesArray.length;
    $(averageSnakeValue).text(averageSnakeLength.toFixed(1));
    return averageSnakeLength;
}

// function spawnApple() {
//     const row = Math.floor(Math.random() * Math.floor(9));
//     const col = Math.floor(Math.random() * Math.floor(9));
//     for (let i = 1; i < snake.body.length; i++) {
//         if (row !== snake.body[i][0] &&
//             col !== snake.body[i][1]) {
//             apple = [row, col];
//         } else {
//             row = Math.floor(Math.random() * Math.floor(9));
//             col = Math.floor(Math.random() * Math.floor(9));
//         }

//     }

// }

