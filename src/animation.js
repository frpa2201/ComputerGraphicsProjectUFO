import * as THREE from 'three';
import { globals } from './globals.js';

const clock = new THREE.Clock();
const _vec3 = new THREE.Vector3();

const UFO_PROPERTIES = {
    start: new THREE.Vector3(-300, 150, -270), // Starts high and far left
    hover: new THREE.Vector3(-10, 80, -270),   // The stopping point (above car)
    end:   new THREE.Vector3(300, 300, -270),  // Exits high and right
    speed: 60 // Units per second
}

const CAR_PROPERTIES = {
    startingAbductionSpeed: 1, 
    abductionSpeed: 1,
    acceleration: 0.2, 
    rotationSpeed: { x: 1, y: 0.5, z: 2.5 },
    heightLimit: 100
}

let currentState = 'IDLE'

function resetAnimation() {
    globals.state.animationTrigger = false;
    currentState = 'IDLE';
    
    // Reset Car
    const car = globals.models.cars;
    car.visible = true;
    car.position.y = 0; // Or original ground height
    car.rotation.set(0,0,0);
    CAR_PROPERTIES.abductionSpeed = CAR_PROPERTIES.startingAbductionSpeed;

    // Reset Beam
    if(globals.ufoBeam.deactivate) globals.ufoBeam.deactivate();
}

function animate(time) {
    const timeSeconds = time * 0.001;
    const deltaTime = clock.getDelta();
    globals.composer.render();
 
    updateUFOFrame(deltaTime)
    updateCarFrame(deltaTime)

    if(globals.ufoBeam.update) globals.ufoBeam.update(deltaTime);
}

function moveObjectTowards(object, targetVector, step) {
    const currentPos = object.position;
    const distance = currentPos.distanceTo(targetVector);

    if (distance <= step) {
        // We are close enough to snap to the target
        currentPos.copy(targetVector);
        return true; // Reached target
    } else {
        // Calculate direction: (Target - Current)
        _vec3.subVectors(targetVector, currentPos).normalize();
        
        // Move: Current + (Direction * Step)
        currentPos.addScaledVector(_vec3, step);
        return false; // Not reached yet
    }
}

function updateUFOFrame(deltaTime) {
    const ufo = globals.models.ufo;
    const moveStep = UFO_PROPERTIES.speed * deltaTime;

    // Check Trigger to start
    if (globals.state.animationTrigger && currentState === 'IDLE') {
        currentState = 'APPROACHING';
        ufo.position.copy(UFO_PROPERTIES.start);
    }

    switch (currentState) {
        case 'IDLE':
            break;

        case 'APPROACHING':
            // Move towards hover point
            const reachedHover = moveObjectTowards(ufo, UFO_PROPERTIES.hover, moveStep);
            
            if (reachedHover) {
                currentState = 'HOVERING';
                // Safe check for beam activation
                if(globals.ufoBeam.activate) globals.ufoBeam.activate();
            }
            break;

        case 'HOVERING':
            // Waiting for car...
            break;

        case 'CLOSING':
        // 1. UFO stays still
        // 2. We check if the beam is done closing
        if (globals.ufoBeam.isFullyClosed && globals.ufoBeam.isFullyClosed()) {
            currentState = 'LEAVING';
        }
        break;

        case 'LEAVING':
            // Move towards end point
            const reachedEnd = moveObjectTowards(ufo, UFO_PROPERTIES.end, moveStep);

            if (reachedEnd) {
                resetAnimation();
            }
            break;
    }
}

function updateCarFrame(deltaTime) {
    if (globals.state.animationTrigger && currentState === 'HOVERING') {
        const car = globals.models.cars;
        
        if (car.position.y < CAR_PROPERTIES.heightLimit) {
            
            car.position.y += CAR_PROPERTIES.abductionSpeed * deltaTime;
            CAR_PROPERTIES.abductionSpeed += CAR_PROPERTIES.abductionSpeed * deltaTime;

            car.rotation.x += CAR_PROPERTIES.rotationSpeed.x * deltaTime;
            car.rotation.y += CAR_PROPERTIES.rotationSpeed.y * deltaTime;
            car.rotation.z += CAR_PROPERTIES.rotationSpeed.z * deltaTime;
        }

        else {
            car.visible = false;
            
            if(globals.ufoBeam.deactivate) globals.ufoBeam.deactivate();
            
            currentState = 'CLOSING';
        }
    }
}

export { animate };