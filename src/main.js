import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { globals } from './globals.js';
import { objects } from './objects.js';
import { rendering } from './renderer.js';
import { viewing } from './viewing.js';
import { lighting } from './lighting.js';

function projectInit(){
    const scene = globals.scene;
    const camera = globals.camera;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    objects.loadObjects();

    const renderer = globals.renderer; 
    rendering.setUpRenderer();

    viewing.setUpCamera();

    lighting.setUpLighting();

    viewing.setUpControls();

    document.onmousemove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    window.onresize = (e) => {
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera.aspect = window.innerWidth / window.innerHeight
    }

    function animate() {
        renderer.render( scene, camera );
    }
    renderer.setAnimationLoop( animate );

}

window.onload = projectInit;