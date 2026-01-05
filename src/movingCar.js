import * as THREE from 'three';
import { globals } from "./globals.js";
import { CombinedPath } from './paths.js';


export class movingCar {
    constructor(model, combinedPath){
        /** @type {THREE.Group<THREE.Object3DEventMap>} */
        this.model = model;
        this.moving = false;
        this.timeSpentMoving = 0;
        /** @type {CombinedPath} */
        this.path = combinedPath;
    }

    update(deltaTime){
        if(this.moving){
            this.timeSpentMoving += deltaTime;
            const currentPose = this.path.getPose(this.timeSpentMoving);

            this.model.position.set(currentPose.x, currentPose.y, currentPose.z);
            if(currentPose.quaternion != null){
                this.model.setRotationFromQuaternion(currentPose.quaternion);
            }

            if(this.timeSpentMoving > this.path.totalDuration){
                this.moving = false;
                this.timeSpentMoving = 0;
            }
        }
    }

    startMoving(){
        this.moving = true;
    }
}