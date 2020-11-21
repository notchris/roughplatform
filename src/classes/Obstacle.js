import Phaser from 'phaser'
export default class Obstacle extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y, width, height, texture, direction)
    {
        super(scene, x, y)

        this.scene = scene
        this.texture = texture
        this.direction = direction

        if (this.texture) {
            this.setTexture(this.texture)
            this.spike = this.texture.key === 'spike'
        }

        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.setPosition(x, y)
        this.setOrigin(0)
        this.body.setImmovable(true)
        this.body.allowGravity = false
        this.x = x
        this.y = y

        this.setDepth(6)

        this.displayWidth = width
        this.displaySize = height

        this.body.setSize(width, height)

        if (this.spike) {
            const s = new Phaser.Geom.Triangle(0, 0, 16, 0, 8, 16)
            const t = Phaser.Geom.Triangle.CenterOn(s, this.x + 8, this.y + 6)
            this.spikeShape = t
        }

        // Collision
        scene.physics.add.overlap(scene.player, this, (p,tile) => {
            if (this.spike) {
                const c = Phaser.Geom.Intersects.RectangleToTriangle(scene.player.rect, this.spikeShape)
                if (c) {
                    scene.player.death()

                }
            } else {
                scene.player.death()
            }
        }, null, scene)

    }

    preUpdate (time, delta) {
        super.preUpdate(time, delta)

    }

}