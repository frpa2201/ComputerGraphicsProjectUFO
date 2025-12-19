import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const globals = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ),
    loader: new GLTFLoader(),
    renderer: new THREE.WebGLRenderer({alpha: true}),
    controls: null,
    models: {
        city: null,
        ufo: null,
        cars: null,
    }
}