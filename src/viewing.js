import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { globals } from "./globals.js"

export const viewing = {
    setUpCamera: function(){
        globals.camera.position.set(-67.4, 110.4, -352.6);
        //globals.camera.lookAt(new THREE.Vector3(-135, 296, -141));
        //globals.camera.rotation.setFromVector3(new THREE.Vector3(2.83, 0.22, 3.07));
    },
    setUpControls: function(){
        globals.controls = new OrbitControls(globals.camera, globals.renderer.domElement);
        globals.controls.target.set(-135, 30, -141)
        globals.controls.update();
    }
}