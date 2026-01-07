import * as THREE from 'three';

function easingHelper(t, smoothStart, smoothEnd) {
    // clamp 
    t = Math.max(0, Math.min(1, t));

    if (smoothStart && smoothEnd) {
        // ease In Out: 3t^2 - 2t^3
        return t * t * (3 - 2 * t);
    } else if (smoothStart) {
        // ease In: t^2
        return t * t;
    } else if (smoothEnd) {
        // ease Out: 1 - (1-t)^2
        return 1 - (1 - t) * (1 - t);
    }

    return t;
}

// base class
class PathSegment {
    constructor(duration) {
        this.duration = duration;
    }

    getPose(localTime) {
        return { x: 0, y: 0, z: 0, quaternion: null };
    }
}

export class LinearPath extends PathSegment {
    constructor(duration, startPos, endPos, smoothStart = false, smoothEnd = false) {
        super(duration);
        this.startPos = startPos.clone();
        this.endPos = endPos.clone();
        this.smoothStart = smoothStart;
        this.smoothEnd = smoothEnd;

        // calculate orientation since a straight line has constant rotation
        this.quaternion = new THREE.Quaternion();
        if (!startPos.equals(endPos)) {
            const lookMatrix = new THREE.Matrix4();
            lookMatrix.lookAt(startPos, endPos, new THREE.Vector3(0, 1, 0));
            this.quaternion.setFromRotationMatrix(lookMatrix);
        }
    }

    getPose(localTime) {
        // normalize 
        const rawT = localTime / this.duration;
        const t = easingHelper(rawT, this.smoothStart, this.smoothEnd);

        // interpolate
        const currentPos = new THREE.Vector3().lerpVectors(this.startPos, this.endPos, t);

        return {
            x: currentPos.x,
            y: currentPos.y,
            z: currentPos.z,
            quaternion: this.quaternion // constant rotation for a line
        };
    }
}

export class StandingStillPath extends PathSegment {
    constructor(duration, pos) {
        super(duration);
        this.pos = pos.clone();
    }

    getPose(localTime) {
       
        return {
            x: this.pos.x,
            y: this.pos.y,
            z: this.pos.z,
            quaternion: null 
        };
    }
}

export class CubicBezierPath extends PathSegment {
    constructor(duration, startPos, cp1, cp2, endPos, smoothStart = false, smoothEnd = false) {
        super(duration);
        this.startPos = startPos;
        this.cp1 = cp1;
        this.cp2 = cp2;
        this.endPos = endPos;
        this.smoothStart = smoothStart;
        this.smoothEnd = smoothEnd;
        this.quaternion = new THREE.Quaternion();
        this.bezierCurve = new THREE.CubicBezierCurve3(startPos, cp1, cp2, endPos);
    }

    getPose(localTime) {
        const rawT = localTime / this.duration;
        const t = easingHelper(rawT, this.smoothStart, this.smoothEnd);

        const currentPos = this.bezierCurve.getPoint(t);
        const t2 = t + 0.001;
        if(t2 <= 1){
            const forwardPos = this.bezierCurve.getPoint(t2);
            const lookMatrix = new THREE.Matrix4();

            lookMatrix.lookAt(currentPos, forwardPos, new THREE.Vector3(0, 1, 0));
            this.quaternion.setFromRotationMatrix(lookMatrix);
        }

        return {
            x: currentPos.x,
            y: currentPos.y,
            z: currentPos.z,
            quaternion: this.quaternion
        };
    }
}

export class CombinedPath {
    constructor() {
        this.segments = [];
        this.totalDuration = 0;
    }

    add(paths) {
        if (!Array.isArray(paths)) {
            paths = [paths];
        }

        paths.forEach(path => {
            this.segments.push({
                path: path,
                startTime: this.totalDuration,
                endTime: this.totalDuration + path.duration
            });
            this.totalDuration += path.duration;
        });
    }

    getPose(timeSeconds) {
        // no paths
        if (this.segments.length === 0) return { x: 0, y: 0, z: 0, quaternion: null };

        // if before start
        if (timeSeconds <= 0) {
            return this.segments[0].path.getPose(0);
        }
        // if after end
        if (timeSeconds >= this.totalDuration) {
            const lastSeg = this.segments[this.segments.length - 1];
            return lastSeg.path.getPose(lastSeg.path.duration);
        }

        // find active segment
        const activeSegment = this.segments.find(
            seg => timeSeconds >= seg.startTime && timeSeconds < seg.endTime
        );

        if (activeSegment) {
            const localTime = timeSeconds - activeSegment.startTime;
            return activeSegment.path.getPose(localTime);
        }
        
        return { x: 0, y: 0, z: 0, quaternion: null };
    }
}