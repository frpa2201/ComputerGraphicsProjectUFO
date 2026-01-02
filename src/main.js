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

const MAX_WIDTH = 854;
const MAX_HEIGHT = 480;

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

    function resizeCanvas(width, height){
        if(width > MAX_WIDTH){
            width = MAX_WIDTH;
        }
        if(height > MAX_HEIGHT){
            height = MAX_HEIGHT;
        }

        renderer.setSize( width, height );
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix();
        renderer.domElement.style.width = "100vw";
        renderer.domElement.style.height = "100vh";
    }

    resizeCanvas(window.innerWidth, window.innerHeight);
    window.onresize = (e) => {
        resizeCanvas(window.innerWidth, window.innerHeight);
    }

    globals.loader.manager.onLoad = function(){
        renderer.setAnimationLoop( animate );
    }
}

window.onload = projectInit;