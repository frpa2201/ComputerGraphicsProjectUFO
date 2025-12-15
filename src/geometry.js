
const temp_cube_vertex_numb = 24;


let colors = [
    [142, 64, 42],
    [6, 57, 113],
    [138, 102, 66],
    [73, 126, 118],
    [76, 145, 65],
    [108, 112, 89],
    [146, 43, 62],
    [62, 59, 50],
    [137, 129, 118],
    [106, 95, 49],
    [114, 20, 34],
    [28, 84, 45],
    [71, 74, 81],
    [179, 70, 33],
    [71, 75, 78]
]
let temp_cube_color = [];
for(let i = 0; i < 15; i++){
    let color = colors[i];

    for(let j = 0; j < temp_cube_vertex_numb; j++){
        temp_cube_color.push(color[0], color[1], color[2]);
    }
}



export const geometry = {
    CUBE_VERTEX_NUMB: temp_cube_vertex_numb,

    // Cube geometry
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL 
    CUBE_VERTICES: new Float32Array([
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0, 
        1.0, 1.0, -1.0, 
        1.0, -1.0, -1.0, 

        // Top face
        -1.0, 1.0, -1.0, 
        -1.0, 1.0, 1.0, 
        1.0, 1.0, 1.0, 
        1.0, 1.0, -1.0, 

        // Bottom face
        -1.0, -1.0, -1.0, 
        1.0, -1.0, -1.0, 
        1.0, -1.0, 1.0, 
        -1.0, -1.0, 1.0, 

        // Right face
        1.0, -1.0, -1.0, 
        1.0, 1.0, -1.0, 
        1.0, 1.0, 1.0, 
        1.0, -1.0, 1.0, 

        // Left face
        -1.0, -1.0, -1.0, 
        -1.0, -1.0, 1.0, 
        -1.0, 1.0, 1.0, 
        -1.0, 1.0, -1.0
    ]),

    CUBE_INDICES: new Uint16Array([
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ]),

    CUBE_COLOR_SPECIAL: new Uint8Array([
        // Front face
        0, 0, 255,
        255, 0, 255,
        255, 255, 255,
        0, 255, 255,

        // Back face
        0, 0, 0,
        0, 255, 0, 
        255, 255, 0, 
        255, 0, 0, 

        // Top face
        0, 255, 0, 
        0, 255, 255, 
        255, 255, 255, 
        255, 255, 0, 

        // Bottom face
        0, 0, 0, 
        255, 0, 0, 
        255, 0, 255, 
        0, 0, 255, 

        // Right face
        255, 0, 0, 
        255, 255, 0, 
        255, 255, 255, 
        255, 0, 255, 

        // Left face
        0, 0, 0, 
        0, 0, 255, 
        0, 255, 255, 
        0, 255, 0
    ]),

    CUBE_FIFTEEN_COLORS: new Uint8Array(temp_cube_color),

    // vertex buffer format: XYZ RGB (interleaved)
    TABLE_VERTICES: new Float32Array([
        // Top face
        -10.0, 0.0, -10.0, 0.2, 0.2, 0.2, 
        -10.0, 0.0, 10.0, 0.2, 0.2, 0.2, 
        10.0, 0.0, 10.0, 0.2, 0.2, 0.2,  
        10.0, 0.0, -10.0, 0.2, 0.2, 0.2
    ]),
    TABLE_INDICES: new Uint16Array([
        0, 1, 2,        0, 2, 3
    ]),


    // cube values for the cube to be stacked on top of each other, creating a tower
    getCubeValuesStack: function(){
        const CUBE_COUNT = 16;
        const CUBE_SCALES = [];
        for(let i = CUBE_COUNT; i > 0; i--){
            CUBE_SCALES.push(i / CUBE_COUNT);
        }
        const CUBE_POSITIONS = [ [0, 0 + CUBE_SCALES[0], 0] ];
        for(let i = 0; i < CUBE_COUNT - 1; i++){
            CUBE_POSITIONS.push([0, CUBE_POSITIONS[i][1] + CUBE_SCALES[i] + CUBE_SCALES[i+1], 0]);
        }
        const CUBE_ROTATIONS = [];
        for(let i = 0; i < CUBE_COUNT; i++){
            CUBE_ROTATIONS.push(0);
        }
        return [CUBE_SCALES, CUBE_POSITIONS, CUBE_ROTATIONS];
    },

    // cube values for them being spaced out
    getCubeValuesSpacedOut: function(){
        const CUBE_COUNT = 16;
        const CUBE_SCALES = [];
        for(let i = CUBE_COUNT; i > 0; i--){
            CUBE_SCALES.push(i / CUBE_COUNT);
        }
        const CUBE_POSITIONS = [
            [1, CUBE_SCALES[0], 3],
            [6, CUBE_SCALES[1], -7],
            [3, CUBE_SCALES[2], -8],
            [-2, CUBE_SCALES[3], -5],
            [-7, CUBE_SCALES[4], -1],
            [4, CUBE_SCALES[5], 4],
            [-3, CUBE_SCALES[6], 1],
            [1, CUBE_SCALES[7], 9],
            [6, CUBE_SCALES[8], 5],
            [-6, CUBE_SCALES[9], 7],
            [3, CUBE_SCALES[10], -4],
            [7, CUBE_SCALES[11], 8],
            [1, CUBE_SCALES[12], 6],
            [3, CUBE_SCALES[13], 1],
            [7, CUBE_SCALES[14], -3],
            [4, CUBE_SCALES[15], 7]
        ];
        const CUBE_ROTATIONS = [];
        for(let i = 0; i < 16000; i+= 1000){
            CUBE_ROTATIONS.push(i % Math.PI);
        }
        return [CUBE_SCALES, CUBE_POSITIONS, CUBE_ROTATIONS];
    }
}


