import * as THREE from 'three';
import { globals } from "./globals.js"

export const lighting = {
    setUpLighting: function(){
        const topLight = new THREE.DirectionalLight(0xffffff, 1);
        topLight.position.set(500,500,500);
        topLight.castShadow = true;
        globals.scene.add(topLight);
    
    
        const ambientLight = new THREE.AmbientLight(0x333333, 5);
        globals.scene.add(ambientLight);
    }
}