import * as THREE from 'three';
import { globals } from "./globals.js";
import { CombinedPath, LinearPath, StandingStillPath } from './paths.js';

const UFO_PROPERTIES = {
    start: new THREE.Vector3(60, 120, -100), 
    hover: new THREE.Vector3(-176, 80, -187),   // The stopping point (above car)
    end:   new THREE.Vector3(-350, 300, -130),  // Exits high and right
    spinningSpeed: 0.13,
    approachTime: 8,
    hoveringTime: 12,
    leavingTime: 5,
    speed: 60 // Units per second
}

const CAR_PROPERTIES = {
    startingAbductionSpeed: 0.2, 
    abductionSpeed: 0.2,
    acceleration: 0.01, 
    rotationSpeed: { x: 1, y: 0.5, z: 2.5 },
    heightLimit: 80
}
// 1. Define distinct states
const STATE = {
    IDLE: 0,
    APPROACHING: 1,
    HOVERING: 2,
    LEAVING: 3
};

export class UFO {
    constructor(model) {
        /** @type {THREE.Group} */
        this.model = model;
        
        this.setDefaultValues();    

        this.setUpPaths();
    }

    setDefaultValues(){
        this.currentState = STATE.IDLE;
        this.stateTimer = 0; 
        this.beamActive = false; 
        globals.models.cars.position.set(-176, 0, -187)
    }

    // 2. The main update loop acts as a router
    update(deltaTime) {
        // Accumulate time for the current state
        this.stateTimer += deltaTime;
        this.model.rotateY(deltaTime * UFO_PROPERTIES.spinningSpeed * 2 * Math.PI);
        

        switch (this.currentState) {
            case STATE.APPROACHING:
                this.handleApproaching();
                break;
            case STATE.HOVERING:
                this.handleHovering(deltaTime);
                break;
            case STATE.LEAVING:
                this.handleLeaving();
                break;
        }
    }

    // 3. Helper to switch states cleanly
    setState(newState) {
        this.currentState = newState;
        this.stateTimer = 0; // Reset timer for the new state
        
        // Optional: specific setup for entering a state
        if (newState === STATE.LEAVING) {
             this.beamActive = false; // Safety cleanup
             globals.ufoBeam.deactivate();
        }
    }

    // --- State Handlers ---

    handleApproaching() {
        const pose = this.approachPath.getPose(this.stateTimer);
        this.model.position.set(pose.x, pose.y, pose.z);

        if (this.stateTimer >= this.approachPath.duration) {
            this.setState(STATE.HOVERING);
        }
    }

    handleHovering(deltaTime) {
        const pose = this.hoveringPath.getPose(this.stateTimer);
        this.model.position.set(pose.x, pose.y, pose.z);

        // 0s to 3s: Wait
        // 2s to 5s: Beam On
        // 5s+: Beam Off and waiting to leave

        if (this.stateTimer > 3.0 && this.stateTimer < 9.5) {
            if (!this.beamActive) {
                this.beamActive = true;
                globals.ufoBeam.activate();
            }
            this.updateCarFrame(deltaTime);
        } 
        else if (this.stateTimer >= 9.5 && this.beamActive) {
            this.beamActive = false;
            globals.ufoBeam.deactivate();
        }
        globals.ufoBeam.update(deltaTime);
        
        // Transition to next state
        if (this.stateTimer >= this.hoveringPath.duration) {
            this.setState(STATE.LEAVING);
        }

        
    }

    handleLeaving() {
        const pose = this.leavingPath.getPose(this.stateTimer);
        this.model.position.set(pose.x, pose.y, pose.z);

        if (this.stateTimer >= this.leavingPath.duration) {
            this.setState(STATE.IDLE);
            this.setDefaultValues();
        }
    }

    startAnimation() {
        if (this.currentState === STATE.IDLE) {
            this.setState(STATE.APPROACHING);
        }
    }

    updateCarFrame(deltaTime) {
        const car = globals.models.cars;
        
        if (car.position.y < CAR_PROPERTIES.heightLimit) {
            
            car.position.y += CAR_PROPERTIES.abductionSpeed * deltaTime;
            CAR_PROPERTIES.abductionSpeed += CAR_PROPERTIES.abductionSpeed * deltaTime;

            car.rotation.x += CAR_PROPERTIES.rotationSpeed.x * deltaTime;
            car.rotation.y += CAR_PROPERTIES.rotationSpeed.y * deltaTime;
            car.rotation.z += CAR_PROPERTIES.rotationSpeed.z * deltaTime;
            console.log("he")
        }
        else {
            car.visible = false;
        }
        
    }

    setUpPaths() {
        this.approachPath = new LinearPath(
            UFO_PROPERTIES.approachTime, 
            UFO_PROPERTIES.start, 
            UFO_PROPERTIES.hover, 
            false, 
            true
        );
        this.hoveringPath = new StandingStillPath(
            UFO_PROPERTIES.hoveringTime, 
            UFO_PROPERTIES.hover
        ); 
        this.leavingPath = new LinearPath(
            UFO_PROPERTIES.leavingTime, 
            UFO_PROPERTIES.hover, 
            UFO_PROPERTIES.end, 
            true, 
            false
        );
    }

}