# frontend-nanodegree-arcade-game-master

the game is select yor player and move player and run away from enemy until arrive the water will win

## Getting Started

to load this game the frist step load index.html in your favorite browser then should select your player with click with mouse on player
then start play the game you should move player Up or Down or Left or Right with arrow in keyboard
and run away from ememy that appear from the left in the screen and we will move between this enemy and don't collision with it
if we win we should move to water without collision with the enemy and there are lives and timer we should end the
level fast because if timer finish we will die and the lives will finish and will lose the game. 

## Running the tests

the player should player fast and run away enemy and protect the heart from losed it if touched enemy

### Break down into end to end tests

if _all_ enemy didn't touch you and arrive the water will win but else you will lose the game

### And coding style tests

there are function to check the collision with player

```
if(player !== null){
        if(this.x + this.width >= player.x + player.marginLeft && this.x <= player.x + player.width - player.marginRight && this.y === player.y){
            player.loseLife();
        }
    }
```
to show all player and user select player
```
function renderCharactersWhenSelecting(){
    for(var i = 0; i < charactersNameList.length; i++){
        this.ctx.drawImage(Resources.get('images/' + charactersNameList[i] + '.png'), i * TILE_WIDTH, 5 * TILE_HEIGHT);
    }
}
```
## Deployment

Add additional notes about how to deploy this on a live system

## Built With

1. JavaScript
2. html5
3. OOP JavaScript

## Contributing

i added class player in the app.js file and the the function to select player
and the function in player the lose player and win we win if touch water and we lose if touch the enemy
and check collision with player and Draw the enemy on the screen, required method for game and This listens for mouse presses to select your player
and in the engine.js file i added draw stats the level and timer and number of heart and draw Game Over message
and draw select you player message and to show all player and user select player.

## Instructions
there are the instruction to win in this game the frist you should secelct your player to game start and mus't touch the enemy
and run away from it and play fast becouse there are the timer and number of lives if finsih
we will die and must go to the water to win and move to another level.