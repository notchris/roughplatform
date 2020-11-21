import Phaser from 'phaser'
import rough from 'roughjs/bundled/rough.esm'
export default class Loading extends Phaser.Scene {
  constructor() {
    super({key: "Loading"})
}

    preload() {

        // BG Test
        this.load.image('trees', '../src/assets/backgrounds/trees.png')

        // Player
        let c, rc
        c = document.createElement('canvas')
        c.width = 16
        c.height = 24
        rc = rough.canvas(c)
        rc.rectangle(0, 0, 16, 24, {
            stroke: 'black',
            strokeWidth: 3,
            fillStyle: 'solid',
            fill: '#E083FF',
        })
        this.textures.addCanvas('player', c)

        // Dialog
        let dialog, dialogrc
        dialog = document.createElement('canvas')
        dialog.width = 600
        dialog.height = 100
        dialogrc = rough.canvas(dialog)
        dialogrc.rectangle(0, 0, 600, 100, {
            stroke: 'black',
            strokeWidth: 12,
            fillStyle: 'solid',
            roughness: 2.0,
            fill: '#000000',
        })
        this.textures.addCanvas('dialog', dialog)

        // Kidney
        let b
        b = document.createElement('canvas')
        b.width = 24
        b.height = 24
        let bx = b.getContext('2d')
        bx.strokeStyle = 'black'
        bx.lineWidth = '2'
        bx.fillStyle = '#FF8095'
        let p = new Path2D('M13.61,23.55C6.89,23.55,4,17.97,4,12S7.23,0.41,13.95,0.41c3.11,0,5.16,0.9,5.85,3.08C20.46,5.56,19,6.77,17,8c0.83,0.49,2.16,2.41,2.16,4c0,1.56-1.24,3.54-2.16,4c2.11,1.21,3.68,2.87,3,5C19.31,23.18,16.72,23.55,13.61,23.55z')
        bx.fill(p)
        bx.stroke(p)
        this.textures.addCanvas('kidney', b)

        // Flag
        let flag, rcC
        flag = document.createElement('canvas')
        flag.width = 25
        flag.height = 15
        rcC = rough.canvas(flag)
        rcC.rectangle(0, 0, 25, 15, {
            stroke: 'black',
            strokeWidth: 3,
            fillStyle: 'solid',
            fill: '#FF0000',
        })
        this.textures.addCanvas('flag', flag)

        // Pole
        let pole, rcD
        pole = document.createElement('canvas')
        pole.width = 4
        pole.height = 60
        rcD = rough.canvas(pole)
        rcD.rectangle(0, 0, 4, 60, {
            stroke: 'black',
            strokeWidth: 0,
            fillStyle: 'solid',
            fill: '#999999',
        })
        this.textures.addCanvas('pole', pole)

        // Spike
        let spike, rcSpike
        spike = document.createElement('canvas')
        spike.width = 16
        spike.height = 16
        rcSpike = rough.canvas(spike)
        rcSpike.path('M16,0H0l8,16L16,0', {
            stroke: 'black',
            strokeWidth: 2,
            fillStyle: 'solid',
            fill: '#EEEEEE',
        })
        this.textures.addCanvas('spike', spike)

        // Torch
        let torch, rcT
        torch = document.createElement('canvas')
        torch.width = 16
        torch.height = 12
        rcT = rough.canvas(torch)
        rcT.rectangle(0, 0, 16, 2, {
            stroke: 'black',
            strokeWidth: 0,
            fillStyle: 'solid',
            fill: 'black',
        })
        rcT.rectangle(6, 0, 4, 12, {
            stroke: 'black',
            strokeWidth: 0,
            fillStyle: 'solid',
            fill: 'black',
        })
        this.textures.addCanvas('torchPole', torch)


        // Hills
        let hills, hrc
        hills = document.createElement('canvas')
        hills.width = 480
        hills.height = 480
        let hsA = 'M7.26,441h465.47L240,39L7.26,441'
        hrc = rough.canvas(hills)
        hrc.path(hsA, {
            stroke: '#666666',
            strokeWidth: 0,
            fillStyle: 'solid',
            fill: '#FFFFFF'
        })
        hrc.path(hsA, {
            stroke: '#666666',
            strokeWidth: 2,
            fillStyle: 'zigzag',
            fill: '#666666'
        })
        this.textures.addCanvas('hills', hills)

        // Cloud A
        let cloudA, cloudArc
        cloudA = document.createElement('canvas')
        cloudA.width = 348
        cloudA.height = 164
        let cloudAPath = 'M348,107.5a54.5,54.5,0,0,1-94.87,36.61,77.55,77.55,0,0,1-81.57-1.43A73,73,0,0,1,71,145.07,42.48,42.48,0,1,1,49.61,71.59,73,73,0,0,1,154.85,26.84,77.51,77.51,0,0,1,287.16,53.37,53,53,0,0,1,293.5,53,54.5,54.5,0,0,1,348,107.5Z'
        cloudArc = rough.canvas(cloudA)
        cloudArc.path(cloudAPath, {
            stroke: '#666666',
            strokeWidth: 0,
            fillStyle: 'solid',
            fill: '#EEEEEE',
        })
        cloudArc.path(cloudAPath, {
            stroke: '#666666',
            strokeWidth: 4,
            fillStyle: 'hachure',
            fillWeight: 4,
            fill: '#DDDDDD',
        })
        this.textures.addCanvas('cloudA', cloudA)

        // Cloud B
        let cloudB, cloudBrc
        cloudB = document.createElement('canvas')
        cloudB.width = 291
        cloudB.height = 124
        let cloudBPath = 'M2.29,123.5A41,41,0,0,1,58.37,74.12l.32.14.24-.25A45.72,45.72,0,0,1,91.5,60.5q1.14,0,2.25.06l.43,0,.09-.41a76,76,0,0,1,148.46,0l.09.4h.41l1.27,0a46.06,46.06,0,0,1,46,46,45.53,45.53,0,0,1-3.26,17Z'
        cloudBrc = rough.canvas(cloudB)
        cloudBrc.path(cloudBPath, {
            stroke: '#666666',
            strokeWidth: 0,
            fillStyle: 'solid',
            fill: '#EEEEEE',
        })
        cloudBrc.path(cloudBPath, {
            stroke: '#666666',
            strokeWidth: 4,
            fillStyle: 'hachure',
            fillWeight: 4,
            fill: '#DDDDDD',
        })
        this.textures.addCanvas('cloudB', cloudB)

        // Cloud C
        let cloudC, cloudCrc
        cloudC = document.createElement('canvas')
        cloudC.width = 329
        cloudC.height = 139
        let cloudCPath = 'M329,125a40.09,40.09,0,0,1-2.52,14H14.9A61.28,61.28,0,0,1,0,99C0,64.21,29.33,36,65.5,36a67.34,67.34,0,0,1,30,7A86,86,0,0,1,236.42,31.37,55.53,55.53,0,0,1,311,83.5a56.67,56.67,0,0,1-.55,7.75A39.93,39.93,0,0,1,329,125Z'
        cloudCrc = rough.canvas(cloudC)
        cloudCrc.path(cloudCPath, {
            stroke: '#666666',
            strokeWidth: 0,
            fillStyle: 'solid',
            fill: '#EEEEEE',
        })
        cloudCrc.path(cloudCPath, {
            stroke: '#666666',
            strokeWidth: 4,
            fillStyle: 'hachure',
            fillWeight: 4,
            fill: '#DDDDDD',
        })
        this.textures.addCanvas('cloudC', cloudC)

        // Spring
        let spring, springrc
        let springPath = `M19.97,26.57h-7.95v-10.6H5.62L16,5.59l10.38,10.38h-6.41V26.57z`
        spring = document.createElement('canvas')
        spring.width = 32
        spring.height = 32
        springrc = rough.canvas(spring)
        springrc.rectangle(0, 0, 32, 32, {
            stroke: 'black',
            strokeWidth: 4,
            fillStyle: 'solid',
            fill: '#333333',
        })
        springrc.path(springPath, {
            stroke: '#666666',
            strokeWidth: 0,
            fillStyle: 'solid',
            fill: '#FFFFFF',
            roughness: 0.2
        })
        this.textures.addCanvas('spring', spring)

        // Tent
        let tent, tentrc
        let tentPath = `M40 2 72 26V74H52V46H28V74H8V26L40 2Z`
        let tentPathB = `M23 44H47V68H59V32L35 14 11 32V68H23V44M3 76V28L35 4 67 28V76H3Z`
        tent = document.createElement('canvas')
        tent.width = 72
        tent.height = 78
        tentrc = rough.canvas(tent)
        tentrc.path(tentPathB, {
            stroke: '#000000',
            strokeWidth: 2,
            fillStyle: 'solid',
            fill: '#000000',
        })
        tentrc.path(tentPath, {
            stroke: '#000000',
            strokeWidth: 2,
            fillStyle: 'solid',
            fill: '#FF0000',

        })
        this.textures.addCanvas('tent', tent)

        // TentB

    }

    create() {
        this.scene.start('MainScene', {
            mapId: 1
        })
    }

    update() {

    }
}
