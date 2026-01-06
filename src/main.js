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

    //AI help to create a nice button
    function createStyledButton(text, leftOffset) {
        const btn = document.createElement('button');
        btn.innerText = text;
        
        btn.style.position = 'absolute';
        btn.style.bottom = '30px';
        btn.style.left = leftOffset; // Dynamic position
        btn.style.zIndex = '1000';
        
        //Styling
        btn.style.padding = '14px 28px';
        btn.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '14px';
        btn.style.letterSpacing = '1px';
        btn.style.color = '#ffffff';
        btn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        btn.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        btn.style.borderRadius = '30px';
        btn.style.cursor = 'pointer';
        btn.style.backdropFilter = 'blur(4px)';
        btn.style.transition = 'all 0.3s ease';

        //Hover Effects
        btn.onmouseenter = () => {
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            btn.style.color = '#000000';
            btn.style.transform = 'scale(1.05)';
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            btn.style.color = '#ffffff';
            btn.style.transform = 'scale(1)';
        };

        document.body.appendChild(btn);
        return btn;
    }

    //UFO Button 
    const ufoBtn = createStyledButton("SEND IN UFO", "30px");
    
    ufoBtn.addEventListener('click', () => {
        if(globals.modelClasses.ufo != null){
            globals.modelClasses.ufo.startAnimation();
            ufoBtn.innerText = "DISPATCHED!";
            setTimeout(() => { ufoBtn.innerText = "SEND IN UFO"; }, 2000);
        }
    });

    //Lights Button 
    const lightBtn = createStyledButton("TOGGLE LIGHTS", "200px");

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