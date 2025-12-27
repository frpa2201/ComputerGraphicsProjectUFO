import * as THREE from 'three';
import { globals } from "./globals.js"
import { EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

export const postprocessing = {
    setUpPostProcessing: function(){
        globals.composer = new EffectComposer(globals.renderer);
        const renderPass = new RenderPass(globals.scene, globals.camera);
        globals.composer.addPass(renderPass);

        setUpFilmGrain();
    },
   

}


function setUpFilmGrain(){
        const filmPass = new FilmPass(
            0.25,   // Noise intensity (0.0 to 1.0)
            false   // Grayscale (false to keep color)
        );

        globals.composer.addPass(filmPass);
}