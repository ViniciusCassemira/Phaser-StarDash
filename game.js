
var config = {
    type: Phaser.AUTO,
    width: 500,
    height: 500,
    parent:"game-container",
    physics: {
    default: 'arcade',
    arcade: {
        debug: false
    }
},
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var bombs;
var player;
var cursors;
let score = 0;
var gameOver = false;

const restartButton = document.getElementById("gameover-container");

function preload ()
{
    this.load.image('bg', 'assets/bg.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
}

function create ()
{
    this.add.image(250, 250, 'bg');
    // this.add.image(250, 250, 'bomb');
    
    player = this.physics.add.sprite(200,200,'');
    player.setCollideWorldBounds(true);
    player.setScale(1);
    
    cursors = this.input.keyboard.createCursorKeys();

    bombs = this.physics.add.group();
    
    stars = this.physics.add.group({
        key: 'star',
        repeat: 2
    })
    
    stars.children.iterate(function (child) {
        let randomX = Phaser.Math.Between(0, 500);
        let randomY = Phaser.Math.Between(0, 500);
        
        child.setPosition(randomX, randomY);
    });
    
    scoreText = this.add.text(0, 0, "Score: 0", { font: '"Press Start 2P"' });

    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(bombs, bombs);
    
    document.getElementById("buttonRestart").addEventListener('click', () => {
        restart.call(this);
    });
    
}

function update ()
{
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey('R'), 700)) {
        restart.call(this);
    }

    if (gameOver == true){
        restartButton.style.visibility = "visible";
        return;
    }else{
        restartButton.style.visibility = "hidden";
    }

    if (cursors.left.isDown){
        player.setVelocityX(-160);
    }else if (cursors.right.isDown){
        player.setVelocityX(160);
    }else{
        player.setVelocityX(0);
    }
    
    if (cursors.up.isDown){
        player.setVelocityY(-160);
    }else if (cursors.down.isDown){
        player.setVelocityY(160);
    }else{
        player.setVelocityY(0);
    }
}

function collectStar(player, star){
    star.disableBody(true, true);
    score ++;
    scoreText.setText('Score: ' + score);
    addStar();
}

function addStar(){
    let randomX = Phaser.Math.Between(0, 500);
    let randomY = Phaser.Math.Between(0, 500);

    let newStar = stars.create(randomX, randomY, 'star');

    if(score % 3 == 0){
        createBomb();
    }
}

function createBomb(){

    let randomX = Phaser.Math.Between(0, 500);
    let randomY = Phaser.Math.Between(0, 500);

    var bomb = bombs.create(randomX, randomY, 'bomb');
    bomb.setDisplaySize(32, 32);
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200),Phaser.Math.Between(-200, 200));
}

function hitBomb(){
    gameOver = true;
    this.physics.pause();
}

function restart(){
    score = 0;
    // scoreText.setText('Score: ' + score);
    gameOver = false;
    this.scene.restart();

}