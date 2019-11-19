// Global variables
var level = 1;
var MAX_LEVEL = 15;
var lives = 3;
var timerOn = false;
var timerAcc = 0;
var TIMER_MAX = 30;
var timer = TIMER_MAX;
var isGameOver = false;
var winGame = false;
var currentPlayerSprite;
var selectingPlayer = true;
var charactersNameList = ['char-boy', 'char-cat-girl', 'char-horn-girl', 'char-pink-girl', 'char-princess-girl'];
var canvasGlobal;

// on select player
function onSelectPlayer(index){
    currentPlayerSprite = 'images/' + charactersNameList[index] + '.png';
    selectingPlayer = false;
    onReset();
}

// on reset
function onReset(){
    timerAcc = 0;
    timer = TIMER_MAX;
    timerOn = false;
    if(selectingPlayer){
        player = null;
    } else  {
        player = new Player(2*TILE_WIDTH , 5*TILE_HEIGHT);
    }
    
    allEnemies = [];
    for(var i = 0; i < 3; i++){
        allEnemies.push(new Enemy(Math.random()*(CANVAS_WIDTH - TILE_WIDTH), (i+1)*TILE_HEIGHT));
    }
}



// Player constructor function
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.marginLeft = 17;
    this.marginRight = 17;
    this.width = 67;
    this.sprite = currentPlayerSprite;
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// the player is lose life when touched the enemy
Player.prototype.loseLife = function(){
    lives--;
    if(lives > 0){
        onReset();                  
    } else {
        isGameOver = true;
        winGame = false;
        timerOn = false;
    }
}
// the player is win if finish all level
Player.prototype.win = function(){
    level++;
    if(level === MAX_LEVEL){
        isGameOver = true;
        winGame = true;
        timerOn = false;
    } else {
        onReset();
    }
}

// Handle Player Input (left,right,up,down)
Player.prototype.handleInput = function(direction) {
    timerOn = true;
    switch(direction){
        case 'left':
            if(this.x > 0){
                this.x -= TILE_WIDTH;
            }
            break;
        case 'right':
            if(this.x < CANVAS_WIDTH - TILE_WIDTH){
                this.x += TILE_WIDTH;
            }
            break;
        case 'up':
            if(this.y > 0){
                this.y -= TILE_HEIGHT;
                if(this.y === 0){
                    this.win();
                }
            }
            break;
        case 'down':
            if(this.y < CANVAS_HEIGHT - TILE_HEIGHT_LAST){
                this.y += TILE_HEIGHT;
            }
            break;
    }
};

// Enemies our player must avoid
var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 101;
    this.hspeed = this.getRandomHspeed();
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.hspeed;
    if(this.x > CANVAS_WIDTH){
        this.reset();
    }
    
    // check collision with player
    if(player !== null){
        if(this.x + this.width >= player.x + player.marginLeft && this.x <= player.x + player.width - player.marginRight && this.y === player.y){
            player.loseLife();
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// reset enemy at starting position
// set hspeed, x, and y
Enemy.prototype.reset = function() {
    this.x = - TILE_WIDTH;
    var yIndex = 1 + Math.floor( Math.random()*3 );
    this.y = TILE_HEIGHT * yIndex;
    this.hspeed = this.getRandomHspeed();
};
// show enemy random on the canvas
Enemy.prototype.getRandomHspeed = function(){
    var minSpeed, maxSpeed;
    minSpeed = 2 + level;
    maxSpeed = minSpeed + 3;
    return minSpeed + Math.random()*(maxSpeed - minSpeed);
};

// declaring object refrences
var allEnemies = [];
var player;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    // move the player after select it
    if(player !== null){
        if(!isGameOver && e.keyCode >= 37 && e.keyCode <= 40){
            player.handleInput(allowedKeys[e.keyCode]);
        }
    }
    // if game over and press enter play again
    if(isGameOver && e.keyCode === 13){
        location.reload();
    }
});
// This listens for mouse presses to select your player
document.addEventListener('click', function(e){
    if(selectingPlayer){
        var rect = canvasGlobal.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;
        if(my >= 5 * TILE_HEIGHT){
            if(mx >= 0 && mx < CANVAS_WIDTH){
                onSelectPlayer(Math.floor(mx/TILE_WIDTH));
            }
        }
    }
});