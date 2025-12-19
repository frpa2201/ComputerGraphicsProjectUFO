import { globals } from "./globals.js"

export const objects = {
    loadObjects: function(){
        globals.loader.load(
            `models/city/scene.gltf`,
            function(gltf){
                //object = gltf.scene;
                globals.scene.add(gltf.scene);
            },
            function(xhr){
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function(error){
                console.log(error);
            }
        );
    }
}