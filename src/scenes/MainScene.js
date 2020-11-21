import Phaser from 'phaser'
import rough from 'roughjs/bundled/rough.esm'
import Player from '../classes/Player'
import Platform from '../classes/Platform'
import Obstacle from '../classes/Obstacle'
import Item from '../classes/Item'
import Flag from '../classes/Flag'
import Spring from '../classes/Spring'
import Torch from '../classes/Torch'
import Dialog from '../classes/Dialog'
import Fog from '../classes/Fog'
import MultiKey from '../classes/multikey'

export default class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: "MainScene" })
    }

    init (data) {
        console.log('init')
        this.mapId = data.mapId;
        this.registry.set('mapId', data.mapId);
        this.map = require(`../../maps/${this.mapId}.json`)
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
        //const fills = ['hachure', 'solid', 'zigzag', 'cross-hatch', 'dots', 'sunburst', 'dashed', 'zigzag-line']
        

        if (this.textures.exists('scenebg')) {
            this.textures.remove('scenebg')
        }

        // Background
        let bg, bgrc
        bg = document.createElement('canvas')
        bg.width = 640
        bg.height = 480
        bgrc = rough.canvas(bg)
        bgrc.rectangle(0, 0, 640, 480, {
            fillStyle: 'solid',
            fill: this.mapProps.bg_fill || '#222222',
        })
        bgrc.rectangle(0, 0, 640, 480, {
            fillStyle: this.mapProps.bg_style || 'solid',
            fill: this.mapProps.bg_fill2 || '#333333',
            stroke: 'black',
            strokeWidth: this.mapProps.bg_fillWeight
        })
        this.textures.addCanvas('scenebg', bg)


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
        this.bg = this.add.image(0, 0, 'scenebg');
        this.bg.setOrigin(0)
        // Mask
        const fog = new Fog()
        this.fogShader = this.add.shader(fog, 0, 0, 640, 480)
        this.fogShader.setOrigin(0)
        this.fogShader.setDepth(3)

        // Clouds
        /*let cloudRect = new Phaser.Geom.Rectangle(0, 100, 640, 300)
        this.clouds = [];
        const cloudArr = ['cloudA', 'cloudB', 'cloudC'];
        for (let i = 0; i < 8; i += 1) {
            const cloud = this.add.image(300,300, cloudArr[Math.floor(Math.random() * cloudArr.length)])
            cloud.setAlpha(Phaser.Math.FloatBetween(0.3, 0.8))
            const sc = Phaser.Math.FloatBetween(0.2, 0.5)
            cloud.setScale(sc, sc)
            cloud.speed = Phaser.Math.FloatBetween(0.05, 0.3)
            this.clouds.push(cloud)
            Phaser.Geom.Rectangle.Random(cloudRect, cloud)
        }*/

        // Hills
        /*for (let i = 0; i < 3; i += 1) {
            const cArr = [0x538B00,0x729500,0x729F52,0x8C9F52,0x3D9F6A]
            const hill = this.add.image(
                i * 150,
                Phaser.Math.Between(400,600),
                'hills'
            )
            hill.setTint(cArr[Math.floor(Math.random() * cArr.length)])
        }*/


        this.cameras.main.setBounds(0, 0, this.map.width * this.map.tilewidth, this.map.height * this.map.tilewidth)
        this.physics.world.setBounds(0, 0, this.map.width * this.map.tilewidth, this.map.height * this.map.tilewidth)

        // Player
        this.player = new Player(this, this.spawn.x, this.spawn.y)
        this.player.setDepth(6)

        // Springs
        this.springs.objects.forEach((o, i) => {
            new Spring(this, o.x, o.y)
        })

        // Platforms
        this.platforms.objects.forEach((o, i) => {
            let props = {}
            o.properties = o.properties || []
            o.properties.forEach((p) => {
                props[p.name] = p.value
            })
            new Platform(this, o.x, o.y, o.width, o.height, `platform_${this.mapId}_${i}`, props)
        })

        // Obstacles
        this.obstacles.objects.forEach((o, i) => {
            let props = {}
            o.properties = o.properties || []
            o.properties.forEach((p) => {
                props[p.name] = p.value
            })
            new Obstacle(this, o.x, o.y, o.width, o.height, props.texture, props.direction)
        })

        // Item Test
        if (this.kidney) {
            new Item(this, this.kidney.x, this.kidney.y, 'kidney')
        }

        // Flag
        new Flag(this, this.flag.x, this.flag.y)

        // Torches
        this.torches.objects.forEach((o,i) => {
            new Torch(this, o.x, o.y, 4, 30)
        })


        // Start Scene / UI
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBackgroundColor('#000000')
        this.cameras.main.fadeIn(1000)

        // Start Dialog
        //this.dialog = new Dialog(this, 0, 0, ['Hello World', 'This is a test to see if i suck', 'lets dooooo ittt yea.', 'ok im done'])


    }

    update () {
        if (this.clouds) {
            this.clouds.forEach((c) => {
                c.x -= c.speed;
            })
        }

    }

}