import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { globals } from './globals.js';
import { objects } from './objects.js';
import { rendering } from './renderer.js';
import { viewing } from './viewing.js';
import { lighting,windowLights } from './lighting.js';
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

    //AI help to create a nice button
    const ufoBtn = document.createElement('button');
    ufoBtn.innerText = "SEND IN UFO";

    //Positioning
    ufoBtn.style.position = 'absolute';
    ufoBtn.style.bottom = '30px';   // Changed from top to bottom
    ufoBtn.style.left = '30px';
    ufoBtn.style.zIndex = '1000';

    //Styling
    ufoBtn.style.padding = '14px 28px';
    ufoBtn.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
    ufoBtn.style.fontWeight = 'bold';
    ufoBtn.style.fontSize = '14px';
    ufoBtn.style.letterSpacing = '1px';
    ufoBtn.style.color = '#ffffff';
    ufoBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent black
    ufoBtn.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    ufoBtn.style.borderRadius = '30px'; // Rounded pill shape
    ufoBtn.style.cursor = 'pointer';
    ufoBtn.style.backdropFilter = 'blur(4px)'; // Blurs the 3D scene behind the button
    ufoBtn.style.transition = 'all 0.3s ease'; // Smooth animation for hover

    //Hover Effects
    ufoBtn.onmouseenter = () => {
        ufoBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        ufoBtn.style.color = '#000000';
        ufoBtn.style.transform = 'scale(1.05)';
    };
    ufoBtn.onmouseleave = () => {
        ufoBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        ufoBtn.style.color = '#ffffff';
        ufoBtn.style.transform = 'scale(1)';
    };

    document.body.appendChild(ufoBtn);

    //Click Action
    ufoBtn.addEventListener('click', () => {
        if(globals.modelClasses.ufo != null){
            globals.modelClasses.ufo.startAnimation();
            
            // Visual feedback on click
            ufoBtn.innerText = "DISPATCHED!";
            setTimeout(() => { ufoBtn.innerText = "SEND IN UFO"; }, 2000);
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