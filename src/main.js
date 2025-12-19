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

    function animate(time) {
        let timeSeconds = time * 0.001;
        renderer.render( scene, camera );
        

        // temporary ufo spinning logic
        let ufoCircling = new THREE.Vector3(-10, 80, -270);
        let circlesPerSecond = 0.1;
        ufoCircling.x = ufoCircling.x + 40 * Math.cos(2*Math.PI*circlesPerSecond*timeSeconds);
        ufoCircling.z = ufoCircling.z + 40 * Math.sin(2*Math.PI*circlesPerSecond*timeSeconds);
        globals.models.ufo.position.set(ufoCircling.x, 80, ufoCircling.z)
        

    }

    globals.loader.manager.onLoad = function(){
        renderer.setAnimationLoop( animate );
    }
    

}

window.onload = projectInit;