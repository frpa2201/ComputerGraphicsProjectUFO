import * as THREE from 'three';
import { globals } from "./globals.js"

export const lighting = {
    setUpLighting: function(){
        const topLight = new THREE.DirectionalLight(0xD6DCE3, 0.3);
        topLight.position.set(500,500,500);
        topLight.castShadow = true;
        globals.scene.add(topLight);
    
    
        const ambientLight = new THREE.AmbientLight(0x333333, 2);
        globals.scene.add(ambientLight);
    }
}

export function UFOSpotlight () {
    globals.models.ufo
    const UFOBeamGroup = new THREE.Group()

    const UFOBeam = new THREE.SpotLight(
        0x00ff00,    //color
        1,           //intensity
        300,         //distance
        Math.PI/10,    //angle
        0.5          //penumbra
    );

    UFOBeam.position.set(0,0,0);
    UFOBeam.castShadow = true;
    UFOBeam.target.position.set(0, 0, 0);

    UFOBeamGroup.add(UFOBeam);
    UFOBeamGroup.add(UFOBeam.target)

    const coneHeight = 30;
    const coneRadius = Math.tan(UFOBeam.angle)*coneHeight
    const cone = new THREE.ConeGeometry(
        coneRadius,    //radius
        coneHeight,         //height
        32,          //radial segments
        1,           //height segments
        true,        //open ended
    );

    cone.translate(0, -coneHeight/2, 0);
    //cone.rotateX(-Math.PI);

    //chatgpt test-------------------------------------------------------------------------------
    //The mesh is the visible
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,      // beam color 
        transparent: true,    // transparency
        opacity: 0.12,        // strength
        depthWrite: false,    // depth
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending, // glow
        fog: true             // fog
    });

    const UFOBeamMesh = new THREE.Mesh(cone,material);
    UFOBeamMesh.position.y = 8;
    UFOBeamGroup.add(UFOBeamMesh);

    return UFOBeamGroup;
}

function beamFog () {
    const UFOBeamFog = new THREE.FogExp2(0x000000, 0.002);
}