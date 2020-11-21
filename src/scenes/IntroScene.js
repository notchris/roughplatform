import Phaser from 'phaser'
import rough from 'roughjs/bundled/rough.esm'
import Player from '../classes/Player'
import Platform from '../classes/Platform'
import Torch from '../classes/Torch'
import Fire from '../classes/Fire'
import Dialog from '../classes/Dialog'
import Fog from '../classes/Fog'
import MultiKey from '../classes/multikey'

export default class IntroScene extends Phaser.Scene {

    constructor() {
        super({ key: "IntroScene" })
    }

    init (data) {
        console.log('init')
        this.mapId = 0;
        this.registry.set('mapId', 0);
        this.map = require(`../../maps/0.json`)
        this.mapProps = {}
        this.map.properties = this.map.properties || []
        this.map.properties.forEach((p) => {
            this.mapProps[p.name] = p.value
        })
        if (this.mapProps.bg_fill) {
            this.mapProps.bg_fill = '#' + this.mapProps.bg_fill.substring(3)
        }
        if (this.mapProps.bg_fill2) {
            this.mapProps.bg_fill2 = '#' + this.mapProps.bg_fill2.substring(3)
        }

        this.platforms = this.map.layers.filter((l) => l.name === 'platforms')[0] || {}
        this.platforms.objects = this.platforms.objects || [];

        this.obstacles = this.map.layers.filter((l) => l.name === 'obstacles')[0] || {}
        this.obstacles.objects = this.obstacles.objects || [];

        this.kidneyArr = this.map.layers.filter((l) => l.name === 'kidney')[0] || {}
        this.kidneyArr.objects = this.kidneyArr.objects || [];
        this.kidney = this.kidneyArr.objects[0] || null;


        this.spawn = this.map.layers.filter((l) => l.name === 'spawn')[0].objects[0]
        this.flag = this.map.layers.filter((l) => l.name === 'flag')[0].objects[0]

        this.springs = this.map.layers.filter((l) => l.name === 'springs')[0] || {}
        this.springs.objects = this.springs.objects || [];

        this.torches = this.map.layers.filter((l) => l.name === 'torches')[0] || {}
        this.torches.objects = this.torches.objects || [];

        this.pathList = this.map.layers.filter((l) => l.name === 'paths')[0] || {}
        this.pathList.objects = this.pathList.objects || [];

        this.paths = {};

        // Fix paths
        this.pathList.objects.forEach((path) => {
            let props = {}
            path.properties = path.properties || []
            path.properties.forEach((p) => {
                props[p.name] = p.value
            })
            let arr = []
            path.polyline.forEach((pt) => {
                arr.push({
                    x: pt.x + path.x,
                    y: pt.y + path.y
                })
            })
            this.paths[props.id] = arr;
        })
    }

    preload () {

        // Platforms
        this.platforms.objects.forEach((o, i) => {
            if (!this.textures.exists(`platform_${this.mapId}_${i}`)) {
                let props = {}
                o.properties = o.properties || []
                o.properties.forEach((p) => {
                    props[p.name] = p.value
                })
                if (props.fill) {
                    props.fill = '#' + props.fill.substring(3)
                }
                if (props.fillColor) {
                    props.fillColor = '#' + props.fillColor.substring(3)
                }
                const c = document.createElement('canvas')
                c.width = o.width
                c.height = o.height
                const rc = rough.canvas(c)

                
                rc.rectangle(0, 0, o.width, o.height, {
                    strokeWidth: 0,
                    fillStyle: 'solid',
                    fill: props.fill || '#FFFFFF'
                })
                rc.rectangle(0, 0, o.width, o.height, {
                    stroke: 'black',
                    strokeWidth: 3,
                    fillStyle: props.fillStyle || 'solid',
                    fill: props.fillColor || '#CCCCCC',
                    hachureAngle: Phaser.Math.Between(20, 80),
                    hachureGap: props.hachureGap || 10
                })
                this.textures.addCanvas(`platform_${this.mapId}_${i}`, c)
            }
        })

    }
    
    create () {
        const { ENTER } = Phaser.Input.Keyboard.KeyCodes
        this.enterInput = new MultiKey(this, [ENTER])
    
        const maskShape = new Phaser.Geom.Circle(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            this.sys.game.config.height / 2
        )
        const maskGfx = this.add.graphics()
        .fillCircleShape(maskShape)
        .generateTexture('mask');
        this.mask = this.add.image(0, 0, 'mask')
        .setPosition(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
        );
        this.cameras.main.setMask(
            new Phaser.Display.Masks.BitmapMask(this, this.mask)
        )

        // Event Mask
        const transitionConfig = {
            ease: 'Expo.easeInOut',
            from: 0,
            start: 0,
            to: 2,
        }
        this.tweens.add({
            duration: 2000,
            scaleX: transitionConfig,
            scaleY: transitionConfig,
            targets: this.mask
        })
        this.time.delayedCall(1000, () => {
            this.player.canMove = true;
        }, null, this)

        // BG
        //this.bg = this.add.image(320, 240, 'scenebg');
        const bg = this.add.image(0, 0, 'trees')
        bg.setOrigin(0)

        // Fog
        const fog = new Fog()
        this.fogShader = this.add.shader(fog, 0, 0, 640, 480)
        this.fogShader.setOrigin(0)
        this.fogShader.setDepth(3)

        this.cameras.main.setBounds(0, 0, this.map.width * this.map.tilewidth, this.map.height * this.map.tilewidth)
        this.physics.world.setBounds(0, 0, this.map.width * this.map.tilewidth, this.map.height * this.map.tilewidth)

        // Player
        this.player = this.add.image(this.spawn.x, this.spawn.y, 'player')
        this.player.setDepth(6)

        // Tent
        this.tent = this.add.image(400,254, 'tent').setDepth(1)

        // Platforms
        this.platforms.objects.forEach((o, i) => {
            let props = {}
            o.properties = o.properties || []
            o.properties.forEach((p) => {
                props[p.name] = p.value
            })
            new Platform(this, o.x, o.y, o.width, o.height, `platform_${this.mapId}_${i}`, props)
            if (props.has_grass) {
                const c = document.createElement('canvas')
                c.width = 640
                c.height = 20
                const rc = rough.canvas(c)
                rc.rectangle(0,4, 640, 20, {
                    fill: '#828D5F',
                    fillStyle: 'hachure',
                    hachureAngle: 0,
                    hachureGap: 8,
                    stroke: 'transparent',
                    strokeWidth: 2,
                    bowing: 9.0
                })
                
                rc.rectangle(0,4, 640, 20, {
                    fill: '#4C642F',
                    fillStyle: 'hachure',
                    hachureAngle: 10,
                    hachureGap: 8,
                    stroke: 'transparent',
                    strokeWidth: 2,
                    bowing: 0.0
                })
                this.textures.addCanvas(`platform_grass_${this.mapId}_${i}`, c)

                this.add.image(o.x, o.y - 5, `platform_grass_${this.mapId}_${i}`).setOrigin(0).setDepth(0)


                
            } 
        })

        // Torches
        this.torches.objects.forEach((o,i) => {
            new Torch(this, o.x, o.y, 4, 30)
        })


        // Start Scene / UI
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBackgroundColor('#000000')
        this.cameras.main.fadeIn(1000)

        // Start Dialog
        this.dialog = new Dialog(this, 0, 0, ['Well...', 'I guess this is as good a place as any.', 'First thing tomorrow...'])


    }

    update () {

    }

}