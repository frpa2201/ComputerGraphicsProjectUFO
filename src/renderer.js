import { globals } from "./globals.js";

export const rendering = {
    setUpRenderer: function(){
        globals.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( globals.renderer.domElement );
    }
}