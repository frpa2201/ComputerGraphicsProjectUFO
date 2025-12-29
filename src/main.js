import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { globals } from './globals.js';
import { objects } from './objects.js';
import { rendering } from './renderer.js';
import { viewing } from './viewing.js';
import { lighting } from './lighting.js';
import { fog } from './fog.js';
import { postprocessing } from './postprocessing.js';
import { animate } from './animation.js'

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
    
    fog.setUpFog();

    postprocessing.setUpPostProcessing();

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            globals.state.animationTrigger = true;
        }
    });

    document.onmousemove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    window.onresize = (e) => {
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix();
    }

    globals.loader.manager.onLoad = function(){
        renderer.setAnimationLoop( animate );
    }
}

window.onload = projectInit;