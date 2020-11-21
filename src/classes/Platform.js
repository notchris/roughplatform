import Phaser from 'phaser'
export default class Platform extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y, width, height, texture, props)
    {
        super(scene, x, y)

        this.scene = scene
        //this.setTexture(texture)
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.setTexture(texture)
        this.props = props
        this.setPosition(x, y)
        this.setOrigin(0)
        this.body.setImmovable(true)
        this.body.allowGravity = false
        this.x = x
        this.y = y
        this.setDepth(4)
        this.body.setSize(width, height)

        // Collision
        scene.physics.add.collider(scene.player, this, (p,tile) => {
            if (this.props.falling) {
                this.setAlpha(0.5)
                this.scene.time.delayedCall(200, () => {
                    this.body.allowGravity = true
                    this.scene.time.delayedCall(1000, () => {
                        this.destroy()
                    })
                }, null, this)
            } 
            
            if (this.props.path) {
                //
            }

        }, null, scene)

        // Moving Platforms
        this.currentPath = 1
        if (this.props.path) {
            this.path = this.scene.paths[this.props.path_id]
            this.setPosition(this.path[0].x, this.path[0].y)
            if (this.props.path_active) {
                this.scene.physics.moveToObject(this, {
                    x: this.path[this.currentPath].x,
                    y: this.path[this.currentPath].y
                }, this.props.path_speed || 20)
            }

        }


    }

    preUpdate (time, delta) {
        super.preUpdate(time, delta)
        if (!this.path) return
        let distance = Phaser.Math.Distance.Between(this.x, this.y, this.path[this.currentPath].x, this.path[this.currentPath].y)
        if (this.body.speed > 0) {
            if (distance < 2) {
                this.body.reset(this.x, this.y)
                this.currentPath += 1
                if (this.currentPath === this.path.length) {
                    this.currentPath = 0
                    if (this.props.path_repeat) {
                        if (this.props.path_yoyo) this.path.reverse()
                        this.scene.physics.moveToObject(this, {
                            x: this.path[this.currentPath].x,
                            y: this.path[this.currentPath].y
                        }, this.props.path_speed || 20)
                    }
                    return
                }
                this.scene.physics.moveToObject(this, {
                    x: this.path[this.currentPath].x,
                    y: this.path[this.currentPath].y
                }, this.props.path_speed || 20)
            }
        }
    }

}