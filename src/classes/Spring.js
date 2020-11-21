import Phaser from 'phaser'
export default class Spring extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y, type)
    {
        super(scene, x, y)

        this.scene = scene
        this.setTexture('spring')
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.setPosition(x, y)
        this.setOrigin(0.5)
        this.body.setImmovable(true)
        this.body.allowGravity = false
        this.x = x + 8
        this.y = y + 8
        
        this.type = type

        this.displayWidth = 16
        this.displayHeight = 16

        this.body.setSize(16, 16)

        this.bounce = this.scene.tweens.add({
            targets: this,
            y: { from: this.y, to: this.y + 6 },
            ease: 'Bounce',
            duration: 90,
            repeat: 0,
            yoyo: true,
            paused: true
        })

        // Collision
        scene.physics.add.collider(scene.player, this, (p,tile) => {
            if (this.body.touching.up) {
                scene.player.body.velocity.y = -500
                this.bounce.play()
            }
        }, null, scene)


    }

    preUpdate (time, delta) {
        super.preUpdate(time, delta)

    }

}