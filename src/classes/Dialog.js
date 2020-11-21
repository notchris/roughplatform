import Phaser from 'phaser'

export default class Dialog extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y, array)
    {
        super(scene, x, y)

        this.scene = scene
        this.scene.add.existing(this)
        this.font = 'Sriracha'
        this.pending = false

        this.array = array
        this.messages = JSON.parse(JSON.stringify(this.array))
        this.current = 0

        // Container
        this.container = this.scene.add.image(20, 360, 'dialog')
        this.container.setOrigin(0).setDepth(4)

        // Text
        this.padding = 8
        this.text = this.scene.add.text(
            this.container.x + this.padding,
            this.container.y + this.padding,
            '', {
                fontFamily: this.font,
                fontSize: 20,
                color: '#ffffff'
            }
        ).setDepth(5)
        this.pendingText = this.scene.add.text(
            this.container.x + 600 - this.padding,
            this.container.y + 100 - this.padding,
            'Press Enter', {
                fontFamily: this.font,
                fontSize: 14,
                color: '#ffff00',
                align: 'right'
            }
        ).setDepth(5)

        this.pendingText.x -= this.pendingText.displayWidth
        this.pendingText.y -= this.pendingText.displayHeight
        this.pendingTextTween = this.scene.tweens.add({
            targets: this.pendingText,
            alpha: { from: 0.3, to: 1.0 },
            ease: 'Linear',
            duration: 500,
            repeat: -1,
            yoyo: true
        })

        this.text.typing = this.scene.plugins.get('rexTextTyping').add(this.text, {
            speed: 50,
            typeMode: 0
        })
        this.text.typing.on('complete', (typing, txt) => {
            this.pending = true
        })

    

        this.nextDialog()

        // On enter key
        this.scene.enterInput.keys[0].on('down', (event) => { 
            // Waiting for user
            if (this.pending && this.current < this.messages.length) {
                this.nextDialog()
                this.pending = false
            // Allow user to skip to full message
            } else if (!this.pending && this.current < this.messages.length) {
                this.text.typing.stop()
                this.text.text = this.messages[this.current - 1]
                this.pending = true
            // Destroy on final message and then do whatever
            } else if (this.pending && this.current === this.messages.length) {
                this.pending = false
                this.pendingTextTween.stop()
                this.text.destroy()
                this.pendingText.destroy()
                this.container.destroy()
                this.scene.player.canMove = true
                this.scene.dialog = null
                this.scene.enterInput.keys[0].off('down', null, this)
                this.destroy()
            }
        })
        
        return this

    }

    nextDialog () {
        this.text.typing.start(this.messages[this.current])
        this.current += 1
    }

    preUpdate (time, delta) {
        super.preUpdate(time, delta)
        this.scene.player.canMove = false
        this.pendingText.setVisible(this.pending)
    }

}