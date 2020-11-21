import * as Phaser from 'phaser'

export default class Fire {
    constructor () {
        const frag = `
            #ifdef GL_ES
            precision highp float;
            #endif
            
            uniform vec2 resolution;
            uniform float time;
            varying vec2 fragCoord;

            float hash2D(vec2 x) {
                return fract(sin(dot(x, vec2(13.454, 7.405)))*12.3043);
            }
            
            float voronoi2D(vec2 uv) {
                vec2 fl = floor(uv);
                vec2 fr = fract(uv);
                float res = 1.0;
                for( int j=-1; j<=1; j++ ) {
                    for( int i=-1; i<=1; i++ ) {
                        vec2 p = vec2(i, j);
                        float h = hash2D(fl+p);
                        vec2 vp = p-fr+h;
                        float d = dot(vp, vp);
                        
                        res +=1.0/pow(d, 8.0);
                    }
                }
                return pow( 1.0/res, 1.0/16.0 );
            }

            void main( void )
            {   
                vec2 uv = fragCoord.xy / resolution.xy;
                float up0 = voronoi2D(uv * vec2(6.0, 4.0) + vec2(0,-time * 2.0)  );
                float up1 = 0.5 + voronoi2D(uv * vec2(6.0, 4.0) + vec2(42,-time * 2.0) + 30.0 );
                float finalMask = up0 * up1 + (1.0-uv.y);
               
                finalMask += (1.0-uv.y)* 0.5;
                finalMask *= 0.7-abs(uv.x - 0.5);
            
                vec3 dark = mix( vec3(0.0), vec3( 1.0, 0.4, 0.0),  step(0.8,finalMask) ) ;
                vec3 light = mix( dark, vec3( 1.0, 0.8, 0.0),  step(0.95, finalMask) ) ;
                
                
                gl_FragColor = vec4(light, 0.0);
            }
        `

        this.shader = new Phaser.Display.BaseShader('fire', frag, undefined,{})

        return this.shader
    }
}