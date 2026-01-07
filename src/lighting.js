import * as THREE from 'three';
import { globals } from "./globals.js"

// Configuration settings
const BEAM_SETTINGS = {
    height: 30,
    topRadius: 2,
    botRadius: 5,
    maxAngle: Math.PI / 8
}

export const lighting = {
    setUpLighting: function() {
        const topLight = new THREE.DirectionalLight(0xD6DCE3, 0.8);
        topLight.position.set(500, 500, 500);
        topLight.castShadow = true;
        globals.scene.add(topLight);

        const ambientLight = new THREE.AmbientLight(0x333333, 1.0);
        globals.scene.add(ambientLight);
    }
}

//List and function to store and toggle window lights from button in main
let allWindowLights = [];

export function toggleWindowLights() {
    allWindowLights.forEach(light => {
        light.visible = !light.visible;
    });
}

export function windowLights() {
    //Building 1
    const positionsB1 = [
        //{ x: -277, y: 108, z: -40 },
        //{ x: -277, y: 102,  z: -48 },
        { x: -277, y: 95,  z: -65 }, 
        //{ x: -277, y: 89,  z: -43 }, 
        { x: -277, y: 82,  z: -50 }, 
        //{ x: -277, y: 76,  z: -55 }, 
    ];
    positionsB1.forEach((pos) => {
    const light = new THREE.RectAreaLight(0xfffee0, 10, 2, 2);
        
        light.position.set(pos.x, pos.y, pos.z);
        light.lookAt(-500, pos.y, pos.z);
        
        globals.scene.add(light);
        allWindowLights.push(light);
    })

    const positionsB2 = [
        //{ x: -200, y: 108,  z: -16 },
        { x: -175, y: 92,  z: -16 }, 
        //{ x: -195, y: 82,  z: -16 }, 
        { x: -180, y: 75, z: -16 },
        //{ x: -205, y: 56,  z: -16 }, 
    ];
    positionsB2.forEach((pos) => {
    const light = new THREE.RectAreaLight(0xfffee0, 10, 2, 2);
        
        light.position.set(pos.x, pos.y, pos.z);
        light.lookAt(pos.x, pos.y, 500);
        
        globals.scene.add(light);
        allWindowLights.push(light);
    })

    const positionsB3 = [
        //{ x: -297, y: 108, z: -75 },
        { x: -290, y: 102,  z: -75 },
        //{ x: -305, y: 95,  z: -75 }, 
        //{ x: -282, y: 89,  z: -75 }, 
        { x: -292, y: 76,  z: -75 }, 
    ];
    positionsB3.forEach((pos) => {
    const light = new THREE.RectAreaLight(0xfffee0, 10, 2, 2);
        
        light.position.set(pos.x, pos.y, pos.z);
        light.lookAt(pos.x, pos.y, 500);
        
        globals.scene.add(light);
        allWindowLights.push(light);
    })
}

export function UFOSpotlight() {
    // 1. Create the Group
    const UFOBeamGroup = new THREE.Group();

    // 2. Create the Light (The actual illumination)
    const UFOBeam = new THREE.SpotLight(0x00ff00, 1, 300, 0, 0.5)
    UFOBeam.position.set(0, 0, 0);
    UFOBeam.castShadow = true;
    UFOBeam.target.position.set(0, -BEAM_SETTINGS.height, 0);

    UFOBeamGroup.add(UFOBeam);
    UFOBeamGroup.add(UFOBeam.target)

    // 3. Create the Mesh (The visible green beam)
    const geometry = new THREE.CylinderGeometry(
        BEAM_SETTINGS.topRadius,
        BEAM_SETTINGS.botRadius,
        BEAM_SETTINGS.height,
        32, // radial segments
        1,  // height segments
        true // open ended
    );

    // Shift geometry so it grows from the top down
    geometry.translate(0, -BEAM_SETTINGS.height / 2, 0);

    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
    });

    const UFOBeamMesh = new THREE.Mesh(geometry, material);
    
    // FIX: Scale the MESH, not the Light
    UFOBeamMesh.scale.set(0, 1, 0); 
    
    UFOBeamGroup.add(UFOBeamMesh);

    let beamProgress = 0;
    let isOpen = false;

    // custom methods
    UFOBeamGroup.activate = () => { isOpen = true; };
    UFOBeamGroup.deactivate = () => { isOpen = false; };
    UFOBeamGroup.isFullyClosed = () => {
    return beamProgress <= 0;
};

    UFOBeamGroup.update = (deltaTime) => {
        // beam appearing speed
        const speed = 0.7;

        if (isOpen) {
            beamProgress += deltaTime * speed;
        } else {
            beamProgress -= deltaTime * speed;
        }

        // clamp
        beamProgress = Math.max(0, Math.min(1, beamProgress));

        // easing
        const ease = 1 - Math.pow(1 - beamProgress, 3);

        UFOBeamMesh.scale.set(ease, 1, ease);

        UFOBeam.angle = BEAM_SETTINGS.maxAngle * ease;
    };

    UFOBeamGroup.position.y = 0;

    return UFOBeamGroup;
}