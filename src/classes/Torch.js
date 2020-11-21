import Phaser from 'phaser'
import Fire from './Fire'
import PointLight from './PointLight'

export default class Torch extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y)
    {
        super(scene, x, y)

        this.scene = scene
        this.scene.add.existing(this)
        this.setPosition(x, y)
        this.setOrigin(0)
        this.x = x
        this.y = y
        this.width = 16
        this.height = 16

        this.displayWidth = 16
        this.displayHeight = 16

        this.fire = new Fire()
        this.fireShader = this.scene.add.shader(this.fire, this.x + this.width / 2, this.y - 3, 30, 40)
        this.fireShader.setDepth(2)
        const pointlight = new PointLight()
        this.pointlightShader = this.scene.add.shader(pointlight, 320, 240, 640, 480)
        this.pointlightShader.setDepth(1)
        this.pointlightShader.setUniform('pos.value', new Phaser.Math.Vector2(this.x + this.width / 2, (480 - this.y) - 8))
        this.setDepth(2)
    }

    preUpdate (time, delta) {

        super.preUpdate(time, delta)

    }

}