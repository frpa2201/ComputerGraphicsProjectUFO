import { mat4, vec3, quat, glMatrix } from 'gl-matrix'
import { WebGLUtils } from '../Common/webgl-utils.js'
import { initShaders } from '../Common/initShaders.js';
import { utils } from './utils.js'
import { geometry } from './geometry.js';


class Shape {
    matWorld = mat4.create();
    scaleVec = vec3.create();
    rotation = quat.create();
    

    constructor(pos, scale, rotationAxis, rotationAngle, vao, numIndices){
        this.pos = pos;
        this.scale = scale;
        this.rotationAxis = rotationAxis;
        this.rotationAngle = rotationAngle;
        this.vao = vao;
        this.numIndices = numIndices;
    }

    draw(gl, matWorldUniform){
        quat.setAxisAngle(this.rotation, this.rotationAxis, this.rotationAngle);
        vec3.set(this.scaleVec, this.scale, this.scale, this.scale);

        mat4.fromRotationTranslationScale(
            this.matWorld,
            /* rotation= */ this.rotation,
            /* position= */ this.pos,
            /* scale= */    this.scaleVec
        )
        

        gl.uniformMatrix4fv(matWorldUniform, false, this.matWorld);
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}



function lab2(){
    /**
    * @type {HTMLCanvasElement}
    */
    const canvas = document.getElementById('gl-canvas');
    var gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
        alert('webgl not available');
    }

    
    const cubeBuffer = utils.createStaticVertexBuffer(gl, geometry.CUBE_VERTICES);
    const cubeIndexBuffer = utils.createStaticIndexBuffer(gl, geometry.CUBE_INDICES);
    const specialCubeColorBuffer = utils.createStaticVertexBuffer(gl, geometry.CUBE_COLOR_SPECIAL);
    const fifteenColorsCubeColorBuffer = utils.createStaticVertexBuffer(gl, geometry.CUBE_FIFTEEN_COLORS);

    const tableInterLeavedBuffer = utils.createStaticVertexBuffer(gl, geometry.TABLE_VERTICES);
    const tableIndexBuffer = utils.createStaticIndexBuffer(gl, geometry.TABLE_INDICES);

    if(!cubeBuffer || !cubeIndexBuffer || !specialCubeColorBuffer || !fifteenColorsCubeColorBuffer ||
        !tableInterLeavedBuffer || !tableIndexBuffer
    ){
        utils.showError("failed to create some buffer");
        return;
    }

    const program = initShaders(gl, 'vertex-shader', 'fragment-shader');

    const vertexPositionAttrLoc = gl.getAttribLocation(program, "vPosition");
    const vertexColorAttrLoc = gl.getAttribLocation(program, 'vertexColor');

    const matWorldUniform = gl.getUniformLocation(program, "matWorld");
    const matViewUniform = gl.getUniformLocation(program, "matView");
    const matProjUniform = gl.getUniformLocation(program, "matProj");

    if(vertexPositionAttrLoc < 0 || vertexColorAttrLoc < 0 ||
        matWorldUniform == null || matViewUniform == null || matProjUniform == null
    ){
        utils.showError('Failed to get vertex position or vertex color attrib location');
        return;
    }

    // create all VAOs
    const cubeVertexArrayBuffers = [];
    const grayTableVao = utils.create3dPosColorInterLeavedBufferVao(
        gl, tableInterLeavedBuffer, tableIndexBuffer,
        vertexPositionAttrLoc, vertexColorAttrLoc
    );
    const specialCubeVao = utils.createPositionIndexColorBufferVao(
        gl, cubeBuffer, cubeIndexBuffer, specialCubeColorBuffer,
        vertexPositionAttrLoc, vertexColorAttrLoc
    );
    cubeVertexArrayBuffers.push(specialCubeVao);
    for(let colorIndex = 0; colorIndex < 16; colorIndex++){
        let colorBufferIndex = geometry.CUBE_VERTEX_NUMB * 3 * Uint8Array.BYTES_PER_ELEMENT * colorIndex; 

        cubeVertexArrayBuffers.push(
            utils.createPositionIndexColorBufferVao(
                gl, cubeBuffer, cubeIndexBuffer, fifteenColorsCubeColorBuffer,
                vertexPositionAttrLoc, vertexColorAttrLoc, colorBufferIndex
            )
        )
    }
    
    cubeVertexArrayBuffers.forEach(function(vao){
        if(!vao){
            utils.showError("failed to create Vao");
            return;
        }
    });

    // establish positions and scales
    const CUBE_COUNT = 16;
    const [CUBE_SCALES, CUBE_POSITIONS, CUBE_ROTATIONS] = geometry.getCubeValuesSpacedOut();

    var shapes = [];
    
    const UP_VEC = vec3.fromValues(0, 1, 0);
    // table
    shapes.push(new Shape(
        vec3.fromValues(0, 0, 0), 1, UP_VEC, 0, grayTableVao, geometry.TABLE_INDICES.length
    ));
    // cubes
    for(let i = 0; i < CUBE_COUNT; i++){
        shapes.push(new Shape(
            vec3.fromValues(CUBE_POSITIONS[i][0], CUBE_POSITIONS[i][1], CUBE_POSITIONS[i][2]), 
            CUBE_SCALES[i], 
            UP_VEC, 
            CUBE_ROTATIONS[i], 
            cubeVertexArrayBuffers[i], 
            geometry.CUBE_INDICES.length
        ));
    }

    const matView = mat4.create();
    const matProj = mat4.create();

    
    const lookAtVec = vec3.create();
    var yaw = 45;
    var pitch = -30;
    var radius = 20;
    var fovy = 80;
    const cameraUp = vec3.fromValues(0, 1, 0);
    const eyeVec = vec3.create();

    const defaultYawPitchRadiusFovy = [yaw, pitch, radius, fovy];
    const defaultLookAtVec = vec3.create();

    const ROTATION_DEGREES_PER_PIXEL = 0.2;
    const PAN_DISTANCE_PER_PIXEL = 0.004;
    const ZOOM_SPEED = 0.05;

    var cubesRendered = 16;

    let lastFrameTime = performance.now();
    const render = function(){
        const thisFrameTime = performance.now();
        const dt = (thisFrameTime - lastFrameTime) / 1000;
        lastFrameTime = thisFrameTime;

        
        var yawRadians = glMatrix.toRadian(yaw);
        var pitchRadians = glMatrix.toRadian(pitch);

        // the math is to calculate the position of a object with a certain angle and radius away from the lookAtVec
        // but since we are looking AT the lookAtVec with this angle, it is multiplicated by -1
        eyeVec[0] = lookAtVec[0] + radius * Math.cos(yawRadians) * Math.cos(pitchRadians) * -1;
        eyeVec[1] = lookAtVec[1] + radius * Math.sin(pitchRadians) * (-1);
        eyeVec[2] = lookAtVec[2] + radius * -Math.sin(yawRadians) * Math.cos(pitchRadians) * -1;
        
        
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;
    
        
        gl.clearColor(0.02, 0.02, 0.02, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
    
        mat4.lookAt(
            matView,
            /* pos= */      eyeVec,
            /* lookAt= */   lookAtVec,
            /* up= */       cameraUp
        );
        mat4.perspective(
            matProj,
            /* fovy= */ glMatrix.toRadian(fovy),
            /* aspectRatio= */ canvas.width / canvas.height,
            /* near, far= */ 0.1, 100.0
        );
        
        
        // set view matrix and projection matrix
        gl.uniformMatrix4fv(matViewUniform, false, matView);
        gl.uniformMatrix4fv(matProjUniform, false, matProj);
    
        shapes[0].draw(gl, matWorldUniform);
        for(let i = 1; i <= cubesRendered; i++){


            shapes[i].draw(gl, matWorldUniform);
        }
        //shapes.forEach((shape) => shape.draw(gl, matWorldUniform));

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);


    function rotateCamera(dx, dy){
        yaw += dx;

        // keep yaw in range (-180, 180]
        if(yaw > 180){
            yaw -= 360;
        }
        else if(yaw <= -180){
            yaw += 360
        }

        let tempPitch = pitch + dy;

        // keep pitch in range (-90, 90)
        if(tempPitch > -90 && tempPitch < 90){
            pitch = tempPitch;
        }
        
    }

    function panCamera(dx, dy){
        let forward = vec3.subtract(vec3.create(), eyeVec, lookAtVec);
        let forwardNorm = vec3.normalize(vec3.create(), forward);;

        let right = vec3.cross(vec3.create(), forward, cameraUp);
        let rightNorm = vec3.normalize(vec3.create(), right);

        let upNorm = vec3.cross(vec3.create(), forwardNorm, rightNorm);

        let panX = vec3.create();
        vec3.scale(panX, rightNorm, dx);

        let panY = vec3.create();
        vec3.scale(panY, upNorm, dy * -1);

        vec3.add(lookAtVec, lookAtVec, panX);
        vec3.add(lookAtVec, lookAtVec, panY);
    }
    
    // rotate and pan
    canvas.onmousedown = function(event){
        var shiftPressed = event.shiftKey;
        var prevMousePosX = event.clientX;
        var prevMousePosY = event.clientY;

        window.onmousemove = function(event){
            let currentMousePosX = event.clientX;
            let currentMousePosY = event.clientY;

            let dx = currentMousePosX - prevMousePosX;
            let dy = currentMousePosY - prevMousePosY;

            if(shiftPressed){
                let dx_distance = dx * PAN_DISTANCE_PER_PIXEL * radius;
                let dy_distance = dy * PAN_DISTANCE_PER_PIXEL * radius;

                panCamera(dx_distance, dy_distance);
            } 
            else {
                // multiplication by -1 since the mouse moves the opposite direction
                let dx_degrees = dx * ROTATION_DEGREES_PER_PIXEL * -1;
                let dy_degrees = dy * ROTATION_DEGREES_PER_PIXEL * -1;

                rotateCamera(dx_degrees, dy_degrees);
            }
            

            prevMousePosX = currentMousePosX;
            prevMousePosY = currentMousePosY;
        }
        
    }
    window.onmouseup = function(){
        window.onmousemove = null;
    }

    // zoom
    canvas.onwheel = function(event){
        event.preventDefault()

        fovy += event.deltaY * ZOOM_SPEED;
        console.log(fovy)

        fovy = Math.max(0.1, fovy);
    }

    const resetButton = document.getElementById('reset-view-button');
    resetButton.onclick = function(){
        [yaw, pitch, radius, fovy] = defaultYawPitchRadiusFovy;
        vec3.copy(lookAtVec, defaultLookAtVec);
    }


    const slider = document.getElementById('slide');
    slider.oninput = function(event){
        cubesRendered = event.target.value;
    }
}

window.onload = function(){lab2();}




