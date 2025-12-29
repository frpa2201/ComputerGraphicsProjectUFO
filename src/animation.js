import * as THREE from 'three';
import { globals } from './globals.js';

const UFO_PROPERTIES = {
    circleArea: new THREE.Vector3(-10, 80, -270),
    radius: 40,
    circlesPerSecond: 0.1,
    pause: 1,
    approachSpeed: 0.1,
    leaveSpeed: 0.2
}

const CAR_PROPERTIES = {
    abductionSpeed: 0.2, 
    driveSpeed: 0.5,
    rotationSpeed: { x: 0.02, y: 0.1, z: 0.05 },
    heightLimit: 70
}

/*
function animate(time) {
    let timeSeconds = time * 0.001;

    // render scene using composer to be able to use postprocessing features
    globals.composer.render();  
        
    // temporary ufo spinning logic
    let ufoCircling = new THREE.Vector3(-10, 80, -270);
    let circlesPerSecond = 0.1;
        
    ufoCircling.x = ufoCircling.x + 40 * Math.cos(2*Math.PI*circlesPerSecond*timeSeconds);
    ufoCircling.z = ufoCircling.z + 40 * Math.sin(2*Math.PI*circlesPerSecond*timeSeconds);
        
    globals.models.ufo.position.set(ufoCircling.x, 80, ufoCircling.z)
}*/

function animate(time) {
    const timeSeconds = time * 0.001;
    globals.renderer.render(globals.scene, globals.camera);
 
    updateUFOFrame(timeSeconds)
    updateCarFrame(timeSeconds)
}

function updateUFOFrame(timeSeconds) {
    //add switch cases/states for animation??
    if (globals.state.animationTrigger) {

    const flightAngle = 2*Math.PI*UFO_PROPERTIES.circlesPerSecond*timeSeconds;

    const x = UFO_PROPERTIES.circleArea.x + UFO_PROPERTIES.radius * Math.cos(flightAngle);
    const z = UFO_PROPERTIES.circleArea.z + UFO_PROPERTIES.radius * Math.sin(flightAngle);

    globals.models.ufo.position.set(x, UFO_PROPERTIES.circleArea.y, z);
    }
}

function updateCarFrame(timeSeconds) {
    if (globals.state.animationTrigger) {
        const car = globals.models.cars;
        
        if (car.position.y < CAR_PROPERTIES.heightLimit) {
            
            car.position.y += CAR_PROPERTIES.abductionSpeed;

            car.rotation.x += CAR_PROPERTIES.rotationSpeed.x;
            car.rotation.y += CAR_PROPERTIES.rotationSpeed.y;
            car.rotation.z += CAR_PROPERTIES.rotationSpeed.z;
        }

        else {
            car.visible = false;
        }
    }
}

export { animate };