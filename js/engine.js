/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make 
 * writing app.js a little simpler to work with.
 */

// Global variables
var TILE_WIDTH = 101;
var TILE_HEIGHT = 83;
var TILE_HEIGHT_LAST = 191;
var CANVAS_WIDTH = 505;
var CANVAS_HEIGHT = 606;

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvasGlobal = canvas;
    doc.body.appendChild(canvas);
    
    
    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        // to show the timer on screen    
        if(timerOn){
            timerAcc += dt;
            if(timerAcc >= 1){
                timerAcc -= 1;
                timer--;
                if(timer === 0){
                    player.loseLife();
                }
            }
        }

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
        
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        if(isGameOver){
            return;
        }
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        if(player !== null){
            player.update(dt);
        }
    }


    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        
        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * TILE_WIDTH, row * TILE_HEIGHT);
            }
        }

        renderEntities();
        if(selectingPlayer){
            renderCharactersWhenSelecting();
        }
        
        ///////////////// draw stats ///////////////////////
        // lives
        for(var i = 0; i < lives; i++){
            ctx.drawImage(Resources.get('images/HeartSmall.png'), 10 + i*50, 0);
        }
        // set font
        this.ctx.font = 'bold 25px Arial';
        // level
        var levelText = "Level: " + level;
        this.ctx.fillText(levelText, (CANVAS_WIDTH - this.ctx.measureText(levelText).width)/2,30);
        // timer
        var timerText = "Timer: " + timer;
        this.ctx.fillText(timerText, CANVAS_WIDTH - 10 - this.ctx.measureText(timerText).width, 30);
        
        //////////////// draw Game Over message ////////////////
        if(isGameOver){
            this.ctx.font = 'italics 30px Arial';
            var gameOverTextLine1 = "Game Over!";
            if(winGame){
                gameOverTextLine1 = "You Win!";
            }
            var gameOverTextLine2 = "Press Enter To replay";
            var metrics1 = this.ctx.measureText(gameOverTextLine1);
            var metrics2 = this.ctx.measureText(gameOverTextLine2);
            var txtX1 = (CANVAS_WIDTH - metrics1.width)/2;
            var txtY1 = (CANVAS_HEIGHT)/2;
            var txtX2 = (CANVAS_WIDTH - metrics2.width)/2;
            var txtY2 = (CANVAS_HEIGHT)/2 + 40;
            this.ctx.fillText(gameOverTextLine1, txtX1, txtY1);
            this.ctx.fillText(gameOverTextLine2, txtX2, txtY2);
        }
        //////////////// draw select you player message ////////////////
        if(selectingPlayer){
            this.ctx.font = 'italics 30px Arial';
            var SelcetTextLine1 = "Select Your Player please!";
            var SelectTextLine2 = "Use Mouse To Select your player";
            var metrics11 = this.ctx.measureText(SelcetTextLine1);
            var metrics22 = this.ctx.measureText(SelectTextLine2);
            var txtX11 = (CANVAS_WIDTH - metrics11.width)/2;
            var txtY11 = (CANVAS_HEIGHT)/2;
            var txtX22 = (CANVAS_WIDTH - metrics22.width)/2;
            var txtY22 = (CANVAS_HEIGHT)/2 + 40;
            this.ctx.fillText(SelcetTextLine1, txtX11, txtY11);
            this.ctx.fillText(SelectTextLine2, txtX22, txtY22);
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        if(isGameOver){
            return;
        }
        
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        if(player !== null){
            player.render();
        }
    }
    // to show all player and user select player
    function renderCharactersWhenSelecting(){
        for(var i = 0; i < charactersNameList.length; i++){
            this.ctx.drawImage(Resources.get('images/' + charactersNameList[i] + '.png'), i * TILE_WIDTH, 5 * TILE_HEIGHT);
        }
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        onReset();
        
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Heart.png',
        'images/HeartSmall.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
