import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { globals } from './globals.js';
import { objects } from './objects.js';
import { rendering } from './renderer.js';
import { viewing } from './viewing.js';
import { lighting,windowLights,toggleWindowLights } from './lighting.js';
import { fog } from './fog.js';
import { postprocessing } from './postprocessing.js';

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
    windowLights();

    viewing.setUpControls();
    
    fog.setUpFog();

    postprocessing.setUpPostProcessing();

    // Select the existing buttons from the DOM
    const ufoBtn = document.getElementById('ufo-btn');
    const lightBtn = document.getElementById('light-btn');
    
    ufoBtn.addEventListener('click', () => {
        if(globals.modelClasses.ufo != null){
            globals.modelClasses.ufo.startAnimation();
            ufoBtn.innerText = "DISPATCHED!";
            setTimeout(() => { ufoBtn.innerText = "SEND IN UFO"; }, 2000);
        }
    });

    lightBtn.addEventListener('click', () => {
        toggleWindowLights();
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

    const clock = new THREE.Clock();

    function animate(time) {
        const timeSeconds = time * 0.001;
        const deltaTime = clock.getDelta();
        globals.composer.render();

        //animation.updateLogic(timeSeconds);
     
        objects.update(deltaTime);

        // displaying camera coordinates
        const tempdiv = document.getElementById('tempdiv');
        const cameraPos = globals.camera.position;
        tempdiv.innerText = cameraPos.x + "\n" + cameraPos.y + "\n" + cameraPos.z + "\n";
        
    }

    globals.loader.manager.onLoad = function(){
        objects.setUpObjects();
        renderer.setAnimationLoop( animate );
    }
}

window.onload = projectInit;