/**
 * Daniel Ramos, N.62396
 * Diogo Carvalho, N.62418
 */

import { loadShadersFromURLS, loadShadersFromScripts, setupWebGL, buildProgramFromSources } from "../../libs/utils.js";
import { vec2, sizeof, flatten } from "../../libs/MV.js";
import { nfunctionsSet, functionsSet, probSet, posSet } from "./matrix.js";

/** @type {WebGL2RenderingContext} */
var gl;

/** @type {WebGLProgram} */
var drawProgram;

/** @type {WebGLProgram} */
var iterationProgram;

/** @type {HTMLCanvasElement} */
var canvas;

var aspect;

/** @type {WebGLBuffer} */
var aBuffer, bBuffer;

var nIterations = 50;
var currentIteration = 0;

const nPoints = 1000000;

var scale = 1.0;

var uBottomLeft;
var uTopRight;

var isMouseDown;

var deltaX;
var deltaY;

var offset = vec2(0.0, 0.0);

var currentFractal = -1;


/**
 * Handling functions
 */

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    aspect = canvas.width / canvas.height;

    // Setup the viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    uBottomLeft = vec2(-scale*aspect + offset[0] , -scale + offset[1]);
    uTopRight = vec2(scale*aspect + offset[0], scale + offset[1]);

}

function pickAndInitializeFractal(shaders, fractal) {
    currentFractal = fractal;
    currentIteration = 0;
    nIterations = 50;
    initializeFractal(shaders);
}

function handleMouseWheel(event) {
    const midPoint = vec2((uBottomLeft[0] + uTopRight[0])/2, (uBottomLeft[1] + uTopRight[1])/2);
    const areaWidthBy2 = (uTopRight[0] - uBottomLeft[0])/2;
    const areaHeightBy2 = (uTopRight[1] - uBottomLeft[1])/2;

    if (event.deltaY < 0) {
        scale *= 0.9; // Zoom in
        uBottomLeft = vec2((midPoint[0] - (areaWidthBy2*0.9)), (midPoint[1] - (areaHeightBy2*0.9)));
        uTopRight = vec2((midPoint[0] + (areaWidthBy2*0.9)), (midPoint[1] + (areaHeightBy2*0.9)));

    } else {
        scale *= 1.1; // Zoom out
        uBottomLeft = vec2(midPoint[0] - (areaWidthBy2*1.1), midPoint[1] - (areaHeightBy2*1.1));
        uTopRight = vec2(midPoint[0] + (areaWidthBy2*1.1), midPoint[1] + (areaHeightBy2*1.1));
    }
}

function handleKeyDown(shaders, event) {
    switch (event.key) {
        //Control the number of iterations in the fractal
        case "+":
            nIterations++; break;
        case "-":
            if (nIterations > 0) {
                currentIteration = 0;
                nIterations--;
                initializeFractal(shaders);
            }
            break;
        case "i":
            currentIteration = 0;
            nIterations = 0;
            initializeFractal(shaders); break;
        //Control the fractal changing
        case "1":
            pickAndInitializeFractal(shaders, 1); break;
        case "2":
            pickAndInitializeFractal(shaders, 2); break;
        case "3":
            pickAndInitializeFractal(shaders, 3); break;
        case "4":
            pickAndInitializeFractal(shaders, 4); break;
        case "5":
            pickAndInitializeFractal(shaders, 5); break;
        case "6":
            pickAndInitializeFractal(shaders, 6); break;
        case "7":
            pickAndInitializeFractal(shaders, 7); break;
        case "8":
            pickAndInitializeFractal(shaders, 8); break;
        case "9":
            pickAndInitializeFractal(shaders, 9); break;
        case "0":
            pickAndInitializeFractal(shaders, 0); break; 
    }

}

function handleMouseDown() {
    isMouseDown = 1;
}

function handleMouseUp() {
    isMouseDown = 0;
    deltaX = 0;
    deltaY = 0;
}

function handleMouseMove(event) {
    if (isMouseDown == 1) {
        deltaX = event.movementX;
        deltaY = event.movementY;
        offset = vec2((uBottomLeft[0] + uTopRight[0])/2, (uBottomLeft[1] + uTopRight[1])/2);
        const uWidth = uTopRight[0] - uBottomLeft[0];
        const uHeight = uTopRight[1] - uBottomLeft[1];
        uBottomLeft = vec2((uBottomLeft[0] - (deltaX / canvas.width) * uWidth), (uBottomLeft[1] + (deltaY / canvas.height) * uHeight));
        uTopRight = vec2((uTopRight[0] - (deltaX / canvas.width) * uWidth), (uTopRight[1] + (deltaY / canvas.height) * uHeight));

    }
}

/**
 * Function to initialize the fractal
 */

function initializeFractal(shaders) {
    drawProgram = buildProgramFromSources(gl, shaders["shader.vert"], shaders["shader.frag"]);
    iterationProgram = buildProgramFromSources(gl, shaders["iteration.vert"], shaders["iteration.frag"], ["vNewPosition", "vNewFunction"]);

    const vertices = [];
    const functions = [];

    for (let i = 0; i < nPoints; i++) {
        vertices.push(vec2(Math.random(), Math.random()));
        functions.push(1.0);
    }

    aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, (nPoints * sizeof["vec2"] + nPoints * 4), gl.STREAM_COPY);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    gl.bufferSubData(gl.ARRAY_BUFFER, nPoints * sizeof["vec2"], flatten(functions));


    bBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, flatten(data), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, (nPoints * sizeof["vec2"] + nPoints * 4), gl.STREAM_COPY);

}

/**
 * Setup function, ran when the program starts
 */

function setup(shaders) {
    // Setup
    canvas = document.getElementById("gl-canvas");
    gl = setupWebGL(canvas, { alpha: true });

    initializeFractal(shaders);

    window.addEventListener("resize", resize);
    resize();

    document.addEventListener("keydown", function(event) {
        handleKeyDown(shaders, event);
    });

    document.addEventListener("mousedown", function(event) {
        handleMouseDown();
    });

    document.addEventListener('mouseup', function(event) {
        handleMouseUp();
      }); 

    document.addEventListener('mousemove', function(event) {
        handleMouseMove(event);
    });

    canvas.addEventListener("wheel", handleMouseWheel);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Setup the background color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Call animate for the first time
    window.requestAnimationFrame(animate);
}

/**
 * Animate function, ran every frame
 */

function animate()
{
    document.getElementById("iterations").innerHTML = "Iterations: " + nIterations;
    document.getElementById("zoom").innerHTML = "Scale: " + scale.toFixed(2);
    document.getElementById("offset").innerHTML = "offset: (" + offset[0].toFixed(3) + ", " + offset[1].toFixed(3) + ")";
    document.getElementById("npoints").innerHTML = "Points: " + nPoints;


    
    
    window.requestAnimationFrame(animate);

    // Drawing code
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (currentFractal != -1) {
        gl.useProgram(drawProgram);
    
        const uBottomLeftLocation = gl.getUniformLocation(drawProgram, "uBottomLeft");
        gl.uniform2fv(uBottomLeftLocation, uBottomLeft);
        const uTopRightLocation = gl.getUniformLocation(drawProgram, "uTopRight");
        gl.uniform2fv(uTopRightLocation, uTopRight);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
        const vPosition = gl.getAttribLocation(drawProgram, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, sizeof["vec2"] + 4, 0);
        gl.enableVertexAttribArray(vPosition);
    
        const vFunction = gl.getAttribLocation(drawProgram, "vFunction");
        gl.vertexAttribPointer(vFunction, 1, gl.FLOAT, false, sizeof["vec2"] + 4, sizeof["vec2"]);
        gl.enableVertexAttribArray(vFunction);
    
    
        gl.drawArrays(gl.POINTS, 0, nPoints);
    
        // Iteration code
        if (currentIteration < nIterations) {
            gl.useProgram(iterationProgram);
    
            gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
            const vOldPosition = gl.getAttribLocation(iterationProgram, "vOldPosition");
            gl.vertexAttribPointer(vOldPosition, 2, gl.FLOAT, false, sizeof["vec2"] + 4, 0);
            gl.enableVertexAttribArray(vOldPosition);
    
            //** Sending the information of the function to the shader*/
            loadFractal();
            //** --------------------------------------------------- */
            const transformFeedback = gl.createTransformFeedback();
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
    
            gl.enable(gl.RASTERIZER_DISCARD);
    
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, bBuffer);
            gl.beginTransformFeedback(gl.POINTS);
            gl.drawArrays(gl.POINTS, 0, nPoints);
            gl.endTransformFeedback();
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    
            gl.disable(gl.RASTERIZER_DISCARD);
    
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
            gl.deleteTransformFeedback(transformFeedback);
    
    
            const temp = aBuffer;
            aBuffer = bBuffer;
            bBuffer = temp;
    
            currentIteration++;
        }
    }
}

function loadFractal() {
    if (currentFractal != -1) {
        const nFunctionsLocation = gl.getUniformLocation(iterationProgram, "nfuncs");
        const probabilitiesLocation = gl.getUniformLocation(iterationProgram, "p");
        offset[0] = posSet[currentFractal]["x"];
        offset[1] = posSet[currentFractal]["y"];
        scale = posSet[currentFractal]["scale"];
        //Resize
        resize(); 

        gl.uniform1i(nFunctionsLocation, nfunctionsSet[currentFractal]);
        gl.uniform1fv(probabilitiesLocation, probSet[currentFractal]);
    
        for (let i = 0; i < nfunctionsSet[currentFractal]; i++) {
            const uM = gl.getUniformLocation(iterationProgram, "m[" + i + "]");
            gl.uniformMatrix3fv(uM, false, flatten(functionsSet[currentFractal][i]));
        }
    }
}

loadShadersFromURLS(["shader.vert", "shader.frag", "iteration.vert", "iteration.frag"]).then(shaders => setup(shaders));