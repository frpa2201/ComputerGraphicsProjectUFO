import * as THREE from 'three';
import { globals } from "./globals.js"
import { UFOSpotlight } from "./lighting.js";
import { movingCar } from './movingCar.js';
import { CombinedPath, CubicBezierPath, LinearPath, StandingStillPath } from './paths.js';
import { UFO } from './UFO.js';
export const objects = {
    loadObjects: function(){
        loadCity();
        loadUfo();
        loadCar();
        loadMovingCars();
    },

    setUpObjects: function(){
        setUpMovingCars();
        setUpUFO();
    },

    update: function(deltaTime){
        updateMovingCars(deltaTime);
        updateUFO(deltaTime);
    }
}

//Functions for loading 3d models
function loadCity () {
    globals.loader.load(
        `models/city/scene.gltf`,
        function(gltf){
            globals.scene.add(gltf.scene);
            globals.models.city = gltf.scene;
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

            // calculate actual center 
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const center = box.getCenter(new THREE.Vector3());

            // alter object space
            gltf.scene.children.forEach(child => {
                child.position.x -= center.x;
                child.position.y -= center.y;
                child.position.z -= center.z;
            });

            gltf.scene.scale.set(3,3,3)
            gltf.scene.position.set(-300, 150, -270);
            globals.scene.add(gltf.scene);
            globals.models.ufo = gltf.scene;
            
            const beamGroup = UFOSpotlight();
            globals.models.ufo.add(beamGroup)

            globals.ufoBeam = beamGroup;
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
            globals.models.cars = gltf.scene;
        },
        function(xhr){
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error){
            console.log(error);
        }
    );
}

function loadMovingCars () {
    globals.loader.load(
        `models/car_simple/scene.gltf`,
        function(gltf){
            gltf.scene.scale.set(2,2,2);
            gltf.scene.position.set(-5, 0.3, 0);

            const lightConfig = {
                color: 0xfffee0,    
                intensity: 20.0,     
                dist: 20,           // range
                angle: 2.5,         // beam width
                penumbra: 0.5,     
                x_offset: 0.5,      
                y_offset: 0.0,      
                z_offset: -2.5      
            };

            
            function createHeadlight(x, y, z) {
                const spotLight = new THREE.SpotLight(lightConfig.color, lightConfig.intensity);
                
                spotLight.distance = lightConfig.dist;
                spotLight.angle = lightConfig.angle;
                spotLight.penumbra = lightConfig.penumbra;
                spotLight.decay = 2; 

                spotLight.position.set(x, y, z);

                spotLight.target.position.set(x - 10, y, z - 30);
                
                return spotLight;
            }

            // create left and right headlights
            const leftLight = createHeadlight(lightConfig.x_offset, lightConfig.y_offset, lightConfig.z_offset);
            const rightLight = createHeadlight(-lightConfig.x_offset, lightConfig.y_offset, lightConfig.z_offset);

            // add lights to the car mesh 
            gltf.scene.add(leftLight);
            gltf.scene.add(rightLight);
            
            function cloneAndAddCars(car, carNumber){
                let cars = [car];
                for(let i = 0; i < carNumber-1; i++){
                    cars.push(car.clone());
                }
                cars.forEach(car => {
                    globals.scene.add(car);
                    globals.models.movingCars.push(car);
                });
            }

            cloneAndAddCars(gltf.scene, 4);
        },
        function(xhr){
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error){
            console.log(error);
        }
    );
}

function setUpMovingCars(){

    const car1points = [
        new THREE.Vector3(-199.1, 0.3, -43.17),
        new THREE.Vector3(-199.1, 0.3, -68.8),
        new THREE.Vector3(-191.0, 0.3, -80.3),
        new THREE.Vector3(-152.1, 0.3, -80.3)
    ]
    const car1path = new CombinedPath();
    car1path.add(new LinearPath(5, car1points[0], car1points[1], true, true));
    car1path.add(new StandingStillPath(1.5, car1points[1]));
    car1path.add(new CubicBezierPath(6, car1points[1], new THREE.Vector3(-200, 0.3, -80), new THREE.Vector3(-199, 0.3, -81), car1points[2], true, false));
    car1path.add(new LinearPath(6, car1points[2], car1points[3], false, false));

    const car1 = new movingCar(globals.models.movingCars[0], car1path);
    globals.modelClasses.movingCars.push(car1);


    const car2path = new CombinedPath();
    car2path.add(new LinearPath(30, new THREE.Vector3(-76.1, 0.3, -0.6), new THREE.Vector3(-76.1, 0.3, -444), false, false));

    const car2 = new movingCar(globals.models.movingCars[1], car2path);
    globals.modelClasses.movingCars.push(car2);

    const car3points = [
        new THREE.Vector3(-111, 0.3, -198.8),
        new THREE.Vector3(-92, 0.3, -198.8),
        new THREE.Vector3(-80.7, 0.3, -190.8),
        new THREE.Vector3(-80.7, 0.3, 160)
    ] 
    const car3path = new CombinedPath();
    car3path.add(new LinearPath(5, car3points[0], car3points[1], false, true));
    car3path.add(new StandingStillPath(1.5, car3points[1]));
    car3path.add(new CubicBezierPath(4, car3points[1], new THREE.Vector3(-84.1, 0.3, -198.5), new THREE.Vector3(-81, 0.3, -194.5), car3points[2], true, false));
    car3path.add(new LinearPath(30, car3points[2], car3points[3], false, false));
    const car3 = new movingCar(globals.models.movingCars[2], car3path);
    globals.modelClasses.movingCars.push(car3);


    const car4points = [
        new THREE.Vector3(-150, 0.3, -84.0),
        new THREE.Vector3(-188, 0.3, -84.0),
        new THREE.Vector3(-304.9, 0.3, -84.0)
    ]
    const car4path = new CombinedPath();
    car4path.add(new LinearPath(5, car4points[0], car4points[1], false, true));
    car4path.add(new StandingStillPath(1.5, car4points[1]));
    car4path.add(new LinearPath(16, car4points[1], car4points[2], true, false));
    const car4 = new movingCar(globals.models.movingCars[3], car4path);
    globals.modelClasses.movingCars.push(car4);

}

function updateMovingCars(deltaTime){
    globals.modelClasses.movingCars.forEach((movingCar) => {

        if(!movingCar.moving){
            movingCar.startMoving(deltaTime);
        }
        movingCar.update(deltaTime);

    })
}

function setUpUFO(){
    const ufo = new UFO(globals.models.ufo);    
    globals.modelClasses.ufo = ufo;
}

function updateUFO(deltaTime){
    globals.modelClasses.ufo.update(deltaTime);
}