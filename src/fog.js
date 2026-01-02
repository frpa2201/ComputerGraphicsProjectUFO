import * as THREE from 'three';
import { globals } from "./globals.js"

export const fog = {
    setUpFog: function(){
        //globals.scene.fog = new THREE.Fog(0xffffff, 100, 500)
        globals.scene.fog = new THREE.FogExp2(0x636363, 0.007);  // fogDensity
        
        THREE.ShaderChunk.fog_fragment = /* glsl */ `
        #ifdef USE_FOG
            vec3 fogOrigin = cameraPosition;
            vec3 fogDirection = normalize(vWorldPosition2 - fogOrigin);
            float fogDepth = distance(vWorldPosition2, fogOrigin);

            // Controls how strictly the fog hugs the ground. 
            // Higher = lower to ground. Lower = taller fog banks.
            float fogHeightFalloff = 0.02;

            float fogDirY = fogDirection.y;
            if (abs(fogDirY) < 0.0001) { 
                fogDirY = 0.0001;
            }

            // https://iquilezles.org/articles/fog/ 
            float fogFactor = fogDensity/ fogHeightFalloff * exp(-fogOrigin.y * fogHeightFalloff) * (
                (1.0 - exp(-fogDepth * fogDirY * fogHeightFalloff)) / fogDirY);
            fogFactor = saturate(fogFactor);

            gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
        #endif
        `

        THREE.ShaderChunk.fog_pars_fragment = /* glsl */ `
        #ifdef USE_FOG
            uniform vec3 fogColor;
            varying vec3 vWorldPosition2;
            varying float vFogDepth;
            #ifdef FOG_EXP2
                uniform float fogDensity;
            #else
                uniform float fogNear;
                uniform float fogFar;
            #endif
        #endif
        `

        THREE.ShaderChunk.fog_vertex = /* glsl */ `
        #ifdef USE_FOG
            vFogDepth = - mvPosition.z;
            vWorldPosition2 = worldPosition.xyz;
        #endif
        `

        THREE.ShaderChunk.fog_pars_vertex = /* glsl */ `
        #ifdef USE_FOG
            varying float vFogDepth;
            varying vec3 vWorldPosition2;
        #endif
        `

    }
}