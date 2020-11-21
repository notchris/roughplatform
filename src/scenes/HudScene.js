import Phaser from 'phaser';

export default class HudScene extends Phaser.Scene {

    constructor() {
        super({key: "HudScene"});
    }

    preload () {
    }

    create () {

        this.font = 'Permanent Marker';
        
        // Player Name
        this.playerName = this.add.text(20, 20, 'Player', {
            fontFamily: this.font,
            fontSize: 18,
            color: '#ffffff',
            align: 'left'
        });
        
        this.playerName.setDepth(5)
       // this.playerName.alpha = 0.7;
        this.playerName.setScrollFactor(0);
        this.playerName.setStroke('#000', 5);
        //this.playerName.setShadow(2, 2, '#333333', 3, true, false);

        // Lives Count
        this.lives = this.add.text(100, 20, 'x3', {
            fontFamily: this.font,
            fontSize: 18,
            color: '#00ff00',
            align: 'left'
        });
        this.lives.setScrollFactor(0);
        this.lives.setDepth(5)
        //this.lives.alpha = 0.7;
        this.lives.setStroke('#000', 5);
        //this.lives.setShadow(2, 2, '#333333', 3, true, false);

        // Weapon
        this.weapon = this.add.image(590, 33, 'item_gun')
        this.weapon.setTintFill(0xffffff)
        this.weapon.setScale(0.5, 0.5);
        this.weapon.setScrollFactor(0);
        this.weapon.setDepth(5)
        this.weapon.alpha = 0.7;

        // Shield
        this.shield = this.add.image(590, 56, 'item_shield')
        this.shield.setTintFill(0x00ff00)
        this.shield.setScale(0.5, 0.5);
        this.shield.setScrollFactor(0);
        this.shield.setDepth(5)
        this.shield.alpha = 0.7;
        this.shield.setVisible(false);

        // Ammo
        this.ammo = this.add.text(600, 20, '12', {
            fontFamily: this.font,
            fontSize: 16,
            color: '#ffffff',
            align: 'right'
        });
        this.ammo.setScrollFactor(0);
        this.ammo.setDepth(5)
        this.ammo.setStroke('#000', 5);

        // Score
        this.score = this.add.text(20, 45, '0', {
            fontFamily: this.font,
            fontSize: 12,
            color: '#999999'
        });
        this.score.setScrollFactor(0);
        this.score.setDepth(5)
        //this.score.alpha = 0.7;
        this.score.setStroke('#000', 5);
        //this.score.setShadow(2, 2, '#333333', 3, true, false);

        // Clock
        this.clock = this.add.text(320, 20, '0', {
            fontFamily: this.font,
            fontSize: 18,
            color: '#ffffff',
            align: 'center'
        });
        this.clock.setScrollFactor(0);
        this.clock.setDepth(5)
        //this.clock.alpha = 0.7;
        this.clock.setStroke('#000', 5);
        //this.clock.setShadow(2, 2, '#333333', 3, true, false);
    }

    update () {
    }

}