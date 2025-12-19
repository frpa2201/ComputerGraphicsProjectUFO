import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { globals } from "./globals.js"

export const viewing = {
    setUpCamera: function(){
        globals.camera.position.set(350, 350, -350);
    },
    setUpControls: function(){
        globals.controls = new OrbitControls(globals.camera, globals.renderer.domElement);
    }
}