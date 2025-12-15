export const utils = {
    showError: function(errorText){
        const errorBoxDiv = document.getElementById('error-box');
        const errorTextElement = document.createElement('p');
        errorTextElement.innerText = errorText;
        errorBoxDiv.appendChild(errorTextElement);
        console.log(errorText);
    },

    createStaticVertexBuffer: function(gl, data){
        const buffer = gl.createBuffer();
        if(!buffer){
            utils.showError("failed to create buffer");
            return null;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return buffer;
    },

        
    createStaticIndexBuffer: function(gl, data){
        const buffer = gl.createBuffer();
        if(!buffer){
            utils.showError("failed to create buffer");
            return null;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return buffer;
    },


    createPositionIndexColorBufferVao: function(
        gl, 
        positionBuffer, indexBuffer, colorBuffer,
        positionAttribLocation, colorAttribLocation,
        colorOffset = 0){
        const vao = gl.createVertexArray();
        if(!vao){
            utils.showError("failed to allocate VAO for two buffers")
            return null;
        }

        gl.bindVertexArray(vao);

        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(
            positionAttribLocation, 3, gl.FLOAT, false, 0, 0
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(
            colorAttribLocation, 3, gl.UNSIGNED_BYTE, true, 0, colorOffset
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
        return vao;
    },

    create3dPosColorInterLeavedBufferVao: function(
        gl, 
        vertexColorBuffer, indexBuffer,
        positionAttribLocation, colorAttribLocation){
        const vao = gl.createVertexArray();
        if(!vao){
            utils.showError("failed to allocate VAO for two buffers")
            return null;
        }

        gl.bindVertexArray(vao);

        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);

        // interleaved format: (x, y, z, r, g, b) (all f32)
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
        gl.vertexAttribPointer(
            positionAttribLocation, 3, gl.FLOAT, false, 
            6 * Float32Array.BYTES_PER_ELEMENT, 0
        );
        gl.vertexAttribPointer(
            colorAttribLocation, 3, gl.FLOAT, false, 
            6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bindVertexArray(null);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return vao;
    }
}




