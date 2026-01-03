import * as THREE from 'three';
import { globals } from "./globals.js";
import { CombinedPath } from './paths.js';


export class movingCar {
    constructor(model, combinedPath){
        /** @type {THREE.Group<THREE.Object3DEventMap>} */
        this.model = model;
        this.moving = false;
        this.movingStartTime = 0;
        /** @type {CombinedPath} */
        this.path = combinedPath;
    }

    update(timeSeconds){
        if(this.moving){
            const timeSpentMoving = timeSeconds - this.movingStartTime;
            const currentPose = this.path.getPose(timeSpentMoving);

            this.model.position.set(currentPose.x, currentPose.y, currentPose.z);
            if(currentPose.quaternion != null){
                this.model.setRotationFromQuaternion(currentPose.quaternion);
            }

            if(timeSpentMoving > this.path.totalDuration){
                this.moving = false;
            }
        }
    }

    startMoving(timeSeconds){
        this.movingStartTime = timeSeconds;
        this.moving = true;
    }
}