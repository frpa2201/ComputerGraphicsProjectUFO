import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function projectInit(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let object;

    let controls;

    let objToRender = 'city';

    const loader = new GLTFLoader();

    loader.load(
        `models/${objToRender}/scene.gltf`,
        function(gltf){
            object = gltf.scene;
            scene.add(object);
        },
        function(xhr){
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error){
            console.log(error);
        }
    );

    const renderer = new THREE.WebGLRenderer({alpha: true}); 
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera.position.set(350, 350, -350);


    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(500,500,500);
    topLight.castShadow = true;
    scene.add(topLight);


    const ambientLight = new THREE.AmbientLight(0x333333, 5);
    scene.add(ambientLight);

    controls = new OrbitControls(camera, renderer.domElement);

    document.onmousemove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    window.onresize = (e) => {
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera.aspect = window.innerWidth / window.innerHeight
    }

    function animate() {
        renderer.render( scene, camera );
    }
    renderer.setAnimationLoop( animate );

}

window.onload = projectInit;