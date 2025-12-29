import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

export const globals = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ),
    loader: new GLTFLoader(),
    renderer: new THREE.WebGLRenderer({alpha: true}),
    /** @type {EffectComposer | null} */
    composer: null,
    controls: null,
    
    models: {
        /** @type {THREE.Group<THREE.Object3DEventMap> | null} */
        city: null,
        /** @type {THREE.Group<THREE.Object3DEventMap> | null} */
        ufo: null,
        /** @type {THREE.Group<THREE.Object3DEventMap> | null} */
        cars: null,
    },

    state: {
        animationTrigger: false
    }
}