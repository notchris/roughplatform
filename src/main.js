import './style.css'
import Phaser from 'phaser'
import Loading from './scenes/Loading'
import IntroScene from './scenes/IntroScene'
import MainScene from './scenes/MainScene'
import FlashPlugin from 'phaser3-rex-plugins/plugins/flash-plugin.js'
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js'
import TextTypingPlugin from 'phaser3-rex-plugins/plugins/texttyping-plugin.js'

import WebFont from 'webfontloader'

let game
const LEVELS = 7
const sel = document.querySelector('.level select')
const dev = document.querySelector('#dev')
for (let i = 0; i < LEVELS; i += 1) {
    const o = document.createElement('option')
    o.innerHTML = i + 1
    o.value = i + 1
    sel.appendChild(o)
}


const config = {
    width: 640,
    height: 480,
    type: Phaser.WEBGL,
    parent: 'render',
    scene: [Loading, IntroScene, MainScene],
    plugins: {
        global: [
        {
            key: 'rexFlash',
            plugin: FlashPlugin,
            start: true
        },{
            key: 'rexMoveTo',
            plugin: MoveToPlugin,
            start: true
        },{
            key: 'rexTextTyping',
            plugin: TextTypingPlugin,
            start: true
        }]
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    }
}

WebFont.load({
    google: {
      families: ['Sriracha']
    },
    fontactive: (familyName, fvd) => {
        game = new Phaser.Game(config)
    }
})

sel.addEventListener('change', (e) => {
    game.scene.start('MainScene', {
        mapId: parseInt(e.target.value)
    })
})
dev.addEventListener('click', (e) => {
    game.scene.start('MainScene', {
        mapId: 0
    })
})