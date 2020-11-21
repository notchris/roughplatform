import Phaser from 'phaser'
import MultiKey from './multikey'
export default class Player extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y)
    {
        super(scene, x, y)

        this.scene = scene
        this.setTexture('player')
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.setPosition(x, y)
        this.setOrigin(0.5)
        this.body.setBounce(0)
        this.body.setCollideWorldBounds(true)
        this.x = x
        this.y = y

        this.setDepth(3)

        const { LEFT, RIGHT, UP, A, D, W, SPACE, ENTER } = Phaser.Input.Keyboard.KeyCodes
        this.cursors = scene.input.keyboard.createCursorKeys()
        this.leftInput = new MultiKey(scene, [LEFT, A])
        this.rightInput = new MultiKey(scene, [RIGHT, D])
        this.jumpInput = new MultiKey(scene, [UP, W, SPACE])

        this.jumpInput.keys.forEach((key) => {
            key.on('down', () => {
                if (!this.body || !this.body.touching.down || !this.canMove) return
                this.body.setVelocityY(-330)
            })
        })

        this.canMove = false

        this.rect = new Phaser.Geom.Rectangle(0, 0, 16, 24)

    }

    death () {
        this.body.setVelocityX(0)
        this.body.setVelocityY(0)
        this.scene.cameras.main.shake(200, 0.005, false)
        this.canMove = false
        this.scene.time.delayedCall(200, () => {
            this.scene.scene.restart()
        }, null, this)
    }

    preUpdate (time, delta) {
        super.preUpdate(time, delta)

        this.rect.centerX = this.x
        this.rect.centerY = this.y
        
        if (!this.canMove) {
            this.body.setVelocityX(0)
            return
        }

        if (this.canMove && this.leftInput.isDown()) {
           this.body.setVelocityX(-160)
        }
        else if (this.canMove && this.rightInput.isDown()) {
            this.body.setVelocityX(160)
        } else {
            this.body.setVelocityX(0)
        }

    }

}