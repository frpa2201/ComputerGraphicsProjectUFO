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

    // Attach custom methods to the group
    // (If your editor underlines these in red, you can ignore it in JavaScript)
    UFOBeamGroup.activate = () => { isOpen = true; };
    UFOBeamGroup.deactivate = () => { isOpen = false; };
    UFOBeamGroup.isFullyClosed = () => {
    return beamProgress <= 0;
};

    // The animation loop function
    UFOBeamGroup.update = (deltaTime) => {
        //Speed of the beam appearing
        const speed = 0.7;

        if (isOpen) {
            beamProgress += deltaTime * speed;
        } else {
            beamProgress -= deltaTime * speed;
        }

        // Clamp between 0 and 1
        beamProgress = Math.max(0, Math.min(1, beamProgress));

        // Smooth easing
        const ease = 1 - Math.pow(1 - beamProgress, 3);

        // Animate the Mesh width
        UFOBeamMesh.scale.set(ease, 1, ease);

        // Animate the Light angle
        UFOBeam.angle = BEAM_SETTINGS.maxAngle * ease;
    };

    UFOBeamGroup.position.y = 0;

    return UFOBeamGroup;
}