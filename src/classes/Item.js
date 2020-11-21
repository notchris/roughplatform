import Phaser from 'phaser'
export default class Item extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y, type)
    {
        super(scene, x, y)

        this.scene = scene
        this.setTexture('kidney')
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.setPosition(x, y)
        this.setOrigin(0.5)
        this.body.setImmovable(true)
        this.body.allowGravity = false
        this.x = x
        this.y = y
        
        this.type = type

        this.displayWidth = 24
        this.displaySize = 24

        this.body.setSize(24, 24)
        // Collision
        scene.physics.add.overlap(scene.player, this, (p,tile) => {
            this.destroy()
        }, null, scene)

        /*this.tween = this.scene.tweens.add({
            targets: this,
            y: { from: this.y, to: this.y + 6 },
            ease: 'Quad.easeIn',
            duration: 2000,
            repeat: -1,
            yoyo: true
        })*/

    }

    preUpdate (time, delta) {
        super.preUpdate(time, delta)

    }

}