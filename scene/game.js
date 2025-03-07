export default class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameScene'});
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
    }

    create() {
        this.add.image(250, 250, 'bg');
        this.player = this.physics.add.sprite(200, 200, '');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1);

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        // this.cursors = this.input.keyboard.createCursorKeys();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 2
        });

        this.bombs= this.physics.add.group({
            key: 'star',
            repeat: 2
        });

        this.score = 0;
        this.scoreText = this.add.text(0, 0, "Score: 0", { fontSize: '16px' });

        this.stars.children.iterate(function (child) {
            let randomX = Phaser.Math.Between(0, 500);
            let randomY = Phaser.Math.Between(0, 500);
            child.setPosition(randomX, randomY);
        });

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.collider(this.bombs, this.bombs);

        this.restartButton = document.getElementById("gameover-container");
        document.getElementById("buttonRestart").addEventListener('click', () => {
            this.restart();
        });

        this.playerPosition = document.getElementById("player-position");

    }

    update() {
        this.playerPosition.textContent = `X: ${this.player.x.toFixed(1)}Y: ${this.player.y.toFixed(1)}`;

        if (this.input.keyboard.checkDown(this.input.keyboard.addKey('R'), 700)) {
            this.restart();
        }

        if (this.gameOver) {
            // this.restartButton.style.visibility = "visible";
            this.restart();
            this.scene.start('GameOver')
            // this.scene.start('MainMenu');
        } else {
            this.restartButton.style.visibility = "hidden";
        }

        if (this.keyA.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.keyD.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }
        if (this.keyW.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.keyS.isDown) {
            this.player.setVelocityY(160);
        } else {
            this.player.setVelocityY(0);
        }
        // if (this.cursors.left.isDown) {
        //     this.player.setVelocityX(-160);
        // } else if (this.cursors.right.isDown) {
        //     this.player.setVelocityX(160);
        // } else {
        //     this.player.setVelocityX(0);
        // }
        // if (this.cursors.up.isDown) {
        //     this.player.setVelocityY(-160);
        // } else if (this.cursors.down.isDown) {
        //     this.player.setVelocityY(160);
        // } else {
        //     this.player.setVelocityY(0);
        // }
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
        this.addStar();
    }

    addStar() {
        let randomX = Phaser.Math.Between(0, 500);
        let randomY = Phaser.Math.Between(0, 500);

        this.stars.create(randomX, randomY, 'star');

        if (this.score % 3 === 0) {
            this.createBomb();
        }
    }

    createBomb() {
        let randomX = this.player.x > 250 ? Phaser.Math.Between(0, 250) : Phaser.Math.Between(251, 500);
        let randomY = this.player.y > 250 ? Phaser.Math.Between(0, 250) : Phaser.Math.Between(251, 500);

        var bomb = this.bombs.create(randomX, randomY, 'bomb');
        bomb.setDisplaySize(32, 32);
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
    }

    hitBomb() {
        this.player.setVelocity(0, 0);
        this.physics.pause();
        this.gameOver = true;
    }

    restart() {
        this.scene.restart();
        this.gameOver = false;
        this.score = 0;
    }
}