import Phaser from 'phaser'
export default class Flag extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y)
    {
        super(scene, x, y)

        this.scene = scene
        this.setTexture('pole')
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.setPosition(x, y)
        this.setOrigin(1)
        this.body.setImmovable(true)
        this.body.allowGravity = false
        this.x = x
        this.y = y

        this.displayWidth = 4
        this.displaySize = 60

        this.body.setSize(4, 60)
        // Collision
        scene.physics.add.overlap(scene.player, this, (p,tile) => {
            scene.player.canMove = false
            const current = this.scene.registry.get('mapId')
            this.scene.scene.start('MainScene', {
                mapId: current + 1
            })
        }, null, scene)

        // Flag Rope
        this.count = 0
        this.rope = scene.add.rope(this.x + 10, this.y - 50, 'flag', null, 10)
        return this

    }

    preUpdate (time, delta) {
        super.preUpdate(time, delta)
        this.count += 0.05
        let points = this.rope.points
        for (let i = 4; i < points.length; i += 1) {
            points[i].y = Math.sin(i * 0.12 + this.count) * 6
        }
        this.rope.setDirty()
    }

}