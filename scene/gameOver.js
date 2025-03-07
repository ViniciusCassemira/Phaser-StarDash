export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    preload() {
        this.load.image('cat', 'assets/catGameOver.png');
    }

    create() {
        this.add.text(100, 130, 'Game Over', { fontSize: '60px', fill: '#fff' });
        this.add.image(250,270, 'cat').setDisplaySize(150, 150);
        this.add.text(150, 370, 'Press enter to restart');
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        // this.input.on('pointerdown', () => {
        //     this.scene.start('GameScene');
        // });
    }

    update(){
        if(this.keyEnter.isDown){
            this.scene.start('GameScene');
        }
    }
}