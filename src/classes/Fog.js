import * as Phaser from 'phaser'

export default class Fog {
    constructor () {
        const frag = `
            #ifdef GL_ES
            precision highp float;
            #endif
            
            uniform vec2 resolution;
            uniform float time;
            
            void main( void )
            {   
                vec2 uv = gl_FragCoord.xy / (resolution.y);
                vec3 depth =  0.1 + 0.05 * cos(time + uv.xyx * 5.0 + vec3 (2, 2, 4));
                vec3 col = vec3(depth.r, depth.r, depth.r) * vec3 (depth.g, depth.g, depth.g) + vec3 (depth.b, depth.b, depth.b);
                gl_FragColor = vec4(col, 0.0);
            }
        `

        this.shader = new Phaser.Display.BaseShader('fog', frag, undefined,{})

        return this.shader
    }
}