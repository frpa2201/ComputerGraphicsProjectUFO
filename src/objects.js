import { globals } from "./globals.js"

export const objects = {
    loadObjects: function(){
        loadCity();
        loadUfo();
        loadCar();
    }
}

//Functions for loading 3d models
function loadCity () {
    globals.loader.load(
        `models/city/scene.gltf`,
        function(gltf){
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

function loadUfo () {
    globals.loader.load(
        `models/ufo/scene.gltf`,
        function(gltf){
            const root = gltf.scene;
            root.scale.set(3,3,3)
            root.position.set(-10, 80, -270)
            globals.scene.add(root);
            globals.models.city = root;
        },
        function(xhr){
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error){
            console.log(error);
        }
    );
}

function loadCar () {
    globals.loader.load(
        `models/car/scene.gltf`,
        function(gltf){
            gltf.scene.scale.set(2,2,2);
            gltf.scene.position.set(-10, 12, -270);
            gltf.scene.rotateY(90);
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