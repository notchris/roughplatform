import * as Phaser from 'phaser'

export default class PointLight {
    constructor () {
        const frag = `
            #ifdef GL_ES
            precision highp float;
            #endif
            
            uniform vec2 resolution;
            uniform vec2 pos;
            uniform float size;
            uniform float spread;
            varying vec2 fragCoord;
            
            void main( void )
            {   
                vec2 uv = fragCoord.xy / resolution.y;
                vec3 col = vec3(1.0, 0.5, 0.0);
                
                float lightY =  (size * resolution.y);
                vec3 lightPos = vec3(pos.x, lightY, pos.y);
                
                vec3 lightDir = lightPos - vec3(fragCoord.x, 0.0, fragCoord.y);
                float diffuse = max(dot(normalize(lightDir), vec3(0.0, 1.0, 0.0)), 0.0);
                
                gl_FragColor = vec4(col, spread) * diffuse;
            }
        `

        this.shader = new Phaser.Display.BaseShader('pointlight', frag, undefined, {
            pos: {type: '2f', value: {x: 0, y: 0}},
            size: {type: '1f', value: 0.01},
            spread: {type: '1f', value: 0.01}
        })

        return this.shader
    }

    update () {
        console.log(this.shader.uniforms)
    }
}