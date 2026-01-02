import * as THREE from 'three';
import { globals } from "./globals.js"
import { UFOSpotlight } from "./lighting.js";
export const objects = {
    loadObjects: function(){
        loadCity();
        loadUfo();
        loadCar();
        loadSimpleCars();
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
            gltf.scene.scale.set(3,3,3)
            gltf.scene.position.set(-10, 80, -270)

            globals.scene.add(gltf.scene);
            globals.models.ufo = gltf.scene;
            
            const beamGroup = UFOSpotlight();
            globals.models.ufo.add(beamGroup)

            const beamLight = UFOSpotlight();
            //globals.models.ufo.add(beamLight.)
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

function loadSimpleCars () {
    globals.loader.load(
        `models/car_simple/scene.gltf`,
        function(gltf){
            gltf.scene.scale.set(2,2,2);
            gltf.scene.position.set(-5, 0.3, 0);
            gltf.scene.rotateY(0);

            // --- NEW CODE STARTS HERE ---

            // Configuration for the lights
            // You will need to tweak 'y' (height) and 'x' (width) to match your specific car model
            const lightConfig = {
                color: 0xfffee0,    // Slightly yellow for realism
                intensity: 20.0,     // Low intensity for "feint" effect
                dist: 20,           // Range of the light
                angle: 2.5,         // Beam width
                penumbra: 0.5,      // Soft edges
                x_offset: 0.5,      // How far left/right from center
                y_offset: 0.0,      // How high up
                z_offset: -2.5      // How far forward (front of bumper)
            };

            // Helper to create a single headlight
            function createHeadlight(x, y, z) {
                const spotLight = new THREE.SpotLight(lightConfig.color, lightConfig.intensity);
                
                // Light shape properties
                spotLight.distance = lightConfig.dist;
                spotLight.angle = lightConfig.angle;
                spotLight.penumbra = lightConfig.penumbra;
                spotLight.decay = 2; // Physical decay

                // Position the light relative to the car's center
                spotLight.position.set(x, y, z);

                // IMPORTANT: The light needs a target to aim at. 
                // We place the target slightly in front of the light.
                spotLight.target.position.set(x - 10, y, z - 30);
                
                // Add the target to the hierarchy so it moves with the car
                //gltf.scene.add(spotLight.target);
                
                return spotLight;
            }

            // Create Left and Right headlights
            // Note: We use +x and -x for left/right symmetry
            const leftLight = createHeadlight(lightConfig.x_offset, lightConfig.y_offset, lightConfig.z_offset);
            const rightLight = createHeadlight(-lightConfig.x_offset, lightConfig.y_offset, lightConfig.z_offset);

            // Add lights to the car mesh (Mesh becomes the parent)
            gltf.scene.add(leftLight);
            gltf.scene.add(rightLight);

            // --- NEW CODE ENDS HERE ---

            globals.scene.add(gltf.scene);
            globals.models.simpleCars = [gltf.scene];
        },
        function(xhr){
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error){
            console.log(error);
        }
    );
}