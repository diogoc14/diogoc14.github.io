import { buildProgramFromSources, loadShadersFromURLS, setupWebGL } from "../../libs/utils.js";
import { ortho, lookAt, flatten, mult, rotateX, rotateY } from "../../libs/MV.js";
import {modelView, loadMatrix} from "../../libs/stack.js";
import * as CUBE from '../../libs/objects/cube.js';
import * as CYLINDER from '../../libs/objects/cylinder.js';
import { drawCrane } from "./drawLogics.js";

/** @type WebGLRenderingContext */
let gl;

let mode;               // Drawing mode (gl.LINES or gl.TRIANGLES)

const FRONT_VIEW = 1;
const TOP_VIEW = 2;
const LEFT_VIEW = 3;
const AXONOMETRIC_VIEW = 4;

let viewMode = AXONOMETRIC_VIEW;

//Floor width
const FW = 2.5;
//Floor height
const FH = 0.5;

const T1 = 7;
const L1 = 2;
const E1 = 0.1;
const T2 = 8;
const L2 = 1.7;
const E2 = E1;
const T3 = 21;
const L3 = L1;
const E3 = E1;
const T4 = T3/3;

//Cylinder diameter
const CD = L1 * 1.5;

//Cylinder height
const CH = L1/2;

//Claw height
const CLAWH = 0.2;

//Claw width
const CLAWW = L1;

//Base contraction level
let contraction = 0;
//head rotation level
let headRotation = 0;

//Camera rotation angles
let theta = -46; // Y axis
let gamma = 16; // X axis

//Slider displacement in the arm
let sliderDisplacement = T3;

//tip size
let tipSize = L3;

//Scale factor
let scaleFactor = 1.0;

//Camera distance from origin
const VP_DISTANCE = (FH + L1*T1 + L2*T2 + CH + L3);

let mview = lookAt([0,0,VP_DISTANCE], [0,0,0], [0,1,0]);
rotateView();

function rotateView() {
    mview = mult(rotateX(gamma), rotateY(theta), lookAt([0,0,VP_DISTANCE], [0,0,0], [0,1,0]));
}

function setup(shaders)
{
    let canvas = document.getElementById("gl-canvas");
    let aspect = canvas.width / canvas.height;

    gl = setupWebGL(canvas);

    let program = buildProgramFromSources(gl, shaders["shader.vert"], shaders["shader.frag"]);

    let mProjection = ortho(-VP_DISTANCE*aspect,VP_DISTANCE*aspect, -VP_DISTANCE, VP_DISTANCE,-3*VP_DISTANCE,3*VP_DISTANCE);

    mode = gl.LINES; 


    resize_canvas();
    window.addEventListener("resize", resize_canvas);

    canvas.addEventListener("wheel", function(event) {
        if (event.deltaY < 0)
            scaleFactor *= 1.1;
        else
            scaleFactor *= 0.9;
    })

    document.onkeydown = function(event) {
        switch(event.key) {
            case '0':
                changeMode();
                break;
            case '1':  // Front view
                mview = lookAt([VP_DISTANCE,0,0], [0,0,0], [0,1,0]);
                viewMode = FRONT_VIEW;
                break;
            case '2':  // Top view
                mview = lookAt([0,VP_DISTANCE,0], [0,0,0], [0,0,-1]);
                viewMode = TOP_VIEW;
                break;
            case '3':  // Left view
                mview = lookAt([0,0,VP_DISTANCE], [0,0,0], [0,1,0]);
                viewMode = LEFT_VIEW;
                break;
            case '4':  // Axonometric view
                viewMode = AXONOMETRIC_VIEW;
                rotateView();
                break;
            case 'r':  // Reset view params
                theta = -46;
                gamma = 16;
                scaleFactor = 1.0;
                rotateView();
                break;
            case 'i':  // Expand base
                expandBase();
                break;
            case 'k': // Contract base
                contractBase();
                break;
            case 'j': // Rotate CCW
                headRotation += 2;
                break;
            case 'l': // Rotate CW
                headRotation -= 2;
                break;
            case 'a': //Move slider outwards
                if (sliderDisplacement < T3)
                    sliderDisplacement += 0.1;
                break;
            case 'd': //Move slider inwards
                if (sliderDisplacement > T4 + 2*L3)
                    sliderDisplacement -= 0.1;  //TODO: Add limit
                break;
            case 'w': //Rise tip
                if (tipSize > L3)
                    tipSize -= 0.2;
                break;
            case 's': //Lower tip
                if (tipSize < T2*L2 - contraction + T1*L1)
                    tipSize += 0.2;
                break;
            case 'ArrowRight':
                if (viewMode == AXONOMETRIC_VIEW) {
                    theta -= 2;
                    rotateView();
                }
                break;
            case 'ArrowLeft':
                if (viewMode == AXONOMETRIC_VIEW) {
                    theta += 2;
                    rotateView();
                }
                break;
            case 'ArrowUp':
                if (viewMode == AXONOMETRIC_VIEW) {
                    gamma += 2;
                    rotateView();
                }
                break;
            case 'ArrowDown':
                if (viewMode == AXONOMETRIC_VIEW) {
                    gamma-= 2;
                    rotateView();
                }
                break;
        }
    }



    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    CUBE.init(gl);
    CYLINDER.init(gl);
    gl.enable(gl.DEPTH_TEST);   // Enables Z-buffer depth test
    
    window.requestAnimationFrame(render);

    function changeMode() {
        if (mode == gl.LINES) {
            mode = gl.TRIANGLES;
        } else {
            mode = gl.LINES;
        }
    }

    function contractBase() {
        let result = contraction + 0.3;
        if (result <= L2*T2) {
            contraction = result;
        }
    }
    function expandBase() {
        let result = contraction - 0.3;
        if (result >= 0) {
            contraction = result;
        }
    }


    function resize_canvas(event)
    {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        aspect = canvas.width / canvas.height;

        gl.viewport(0,0,canvas.width, canvas.height);
        mProjection = ortho(-VP_DISTANCE*aspect,VP_DISTANCE*aspect, -VP_DISTANCE, VP_DISTANCE,-3*VP_DISTANCE,3*VP_DISTANCE);
    }

    function render()
    {
        window.requestAnimationFrame(render);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.useProgram(program);
        
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mProjection"), false, flatten(mProjection));
    
        loadMatrix(mview);

        drawCrane(FW, FH, T1, L1, E1, T2, L2, E2, T3, L3, E3, T4, CD, CH, CLAWH, CLAWW, contraction, headRotation, sliderDisplacement, tipSize,scaleFactor, program, gl, mode);
    }
}

const urls = ["shader.vert", "shader.frag"];
loadShadersFromURLS(urls).then(shaders => setup(shaders))
