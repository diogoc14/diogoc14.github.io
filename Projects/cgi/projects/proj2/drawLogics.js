import * as CUBE from '../../libs/objects/cube.js';
import * as CYLINDER from '../../libs/objects/cylinder.js';

import { flatten } from "../../libs/MV.js";
import {modelView, multRotationY, multScale, multTranslation, popMatrix, pushMatrix, multRotationX, multRotationZ} from "../../libs/stack.js";

    
    /**
     * ARMACAO
     */

    function setColor(R,G,B, program, gl) {
        let vColor = gl.getUniformLocation(program, "vColor");
        gl.uniform3f(vColor,R,G,B);
        
    }

    function uploadModelView(program, gl)
    {
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mModelView"), false, flatten(modelView()));
    }

    function drawFramedCubes(E,L, program, gl, mode) {
        let translations = [
            [L/2-E/2,0,L/2-E/2],
            [L/2-E/2,0,-L/2+E/2],
            [-L/2+E/2,0,-L/2+E/2],
            [-L/2+E/2,0,L/2-E/2],
            [0,L/2-E/2,L/2-E/2],
            [0,L/2-E/2,-L/2+E/2],
            [0,-L/2+E/2,-L/2+E/2],
            [0,-L/2+E/2,L/2-E/2],
            [-L/2+E/2,-L/2+E/2,0],
            [-L/2+E/2,L/2-E/2,0],
            [L/2-E/2,L/2-E/2,0],
            [L/2-E/2,-L/2+E/2,0]
        ]

        let rotations = [
            [0,0],
            [0,0],
            [0,0],
            [0,0],
            [0,90],
            [0,90],
            [0,90],
            [0,90],
            [90,0],
            [90,0],
            [90,0],
            [90,0]
        ]

        
        for (let i = 0; i < translations.length; i++) {
            pushMatrix();
            multTranslation(translations[i]);
            multRotationX(rotations[i][0]);
            multRotationZ(rotations[i][1]);
            multScale([E,L,E]);
            uploadModelView(program, gl);
            CUBE.draw(gl, program, mode);
            popMatrix();
        }
    }

    //Armacao de cima

    function drawFramedPyramid(E, L, gl, program, mode) {
        let translations = [
            [0,((L*Math.sin(Math.PI/4))/2)+E/2,0],
            [0,-L/2+E/2,L/2-E/2],
            [0,-L/2+E/2,-L/2+E/2],
            [-L/2+E/2, -L/2+E/2 ,0],
            [L/2-E/2, -L/2+E/2 ,0],
            [-L/2+E/2, -(L-(L*Math.sin(Math.PI/3)))/2+E/2 , -(L*Math.sin(Math.PI/6))/2],
            [-L/2+E/2, -(L-(L*Math.sin(Math.PI/3)))/2+E/2 , (L*Math.sin(Math.PI/6))/2],
            [L/2-E/2, -(L-(L*Math.sin(Math.PI/3)))/2+E/2 , -(L*Math.sin(Math.PI/6))/2],
            [L/2-E/2, -(L-(L*Math.sin(Math.PI/3)))/2+E/2, (L*Math.sin(Math.PI/6))/2]
        ]

        let rotations = [
            [0,0],
            [0,0],
            [0,0],
            [0,90],
            [0,90],
            [30,0],
            [-30,0],
            [30,0],
            [-30,0]
        ]

        let scales = [
            [L,E,E],
            [L,E,E],
            [L,E,E],
            [L,E,E],
            [L,E,E],
            [E,L,E],
            [E,L,E],
            [E,L,E],
            [E,L,E]
        ]

        for (let i = 0; i < translations.length; i++) {
            pushMatrix();
            multTranslation(translations[i]);
            multRotationX(rotations[i][0]);
            multRotationY(rotations[i][1]);
            multScale(scales[i]);
            uploadModelView(program, gl);
            CUBE.draw(gl, program, mode);
            popMatrix();
        }

    }

    /*-------------------  END ARMACAO -------------------*/

    function floor(FH, FW, T1, L1, T2, L2, CH, L3, scaleFactor, program, gl) {
        let widthInElements = 0;
        let heightInElements = 0;
        multTranslation([0, -((FH+T1*L1+T2*L2+CH+L3)*0.5), 0]);
        multScale([scaleFactor,scaleFactor,scaleFactor]);
        pushMatrix();
        for (let i = -15; i < 15; i++) {
            for (let j = -15; j < 15; j++) {
                if ((j+i)%2 != 0)
                    setColor(0.75,0.75,0.75, program, gl);
                else
                    setColor(0.35,0.35,0.35, program, gl);
                pushMatrix();
                multTranslation([widthInElements, 0, heightInElements]);
                multScale([FW,FH,FW]);
                uploadModelView(program, gl);
                CUBE.draw(gl, program, gl.TRIANGLES);
                popMatrix();
                widthInElements=(FW*j);
            }
            heightInElements=(FW*i);
        }
        popMatrix();
    }

    function drawCubes(T1, L1, E1, FH,program, gl, mode) {
        setColor(1,1,0,program, gl);
        multTranslation([0, FH/2, 0]);
        pushMatrix();        
        for (let i = 0; i < T1; i++) {
            pushMatrix();
            multTranslation([0, L1 * i + L1 / 2, 0]);
            uploadModelView(program, gl);
            drawFramedCubes(E1,L1, program, gl, mode);
            popMatrix();
        }
    }

    function drawInnerCubes(T1, L1, T2, L2, E2, contraction, program, gl, mode) {
        //color
        setColor(1, 1, 0, program, gl);
        pushMatrix();
        multTranslation([0,T1*L1 - contraction,0]);
        for (let i = 0; i < T2; i++) {
            pushMatrix();
            multTranslation([0, L2*i + L2 / 2, 0]);
            uploadModelView(program, gl);
            drawFramedCubes(E2,L2, program, gl, mode);
            popMatrix();
        }
    }

    function drawCylinder(T2, L2, CD, CH, headRotation, program, gl) {
        setColor(0.55,0.55,0.55, program, gl);

        pushMatrix();
        multTranslation([0,T2*L2,0]);
        multRotationY(headRotation);
        pushMatrix();
        multTranslation([0,(CH/2),0]);
        multScale([CD,CH,CD]);
        uploadModelView(program, gl);
        CYLINDER.draw(gl,program,gl.TRIANGLES);
        popMatrix();
    }
    
    function drawArm(T3, L3, E3, T4, CH, program, gl, mode) {
        setColor(0.65,0.75,0, program, gl);
        pushMatrix();
        multTranslation([(-Math.round(T4)+1)*L3, CH+L3/2, 0]);
        pushMatrix();
        for (let i = 0; i < T3; i++) {
            pushMatrix();
            multTranslation([L3*i,0,0]);
            uploadModelView(program, gl);
            drawFramedPyramid(E3,L3, gl, program, mode);
            popMatrix();
        }
        popMatrix();
    }

    function weight(L3, program, gl) {
        setColor(1.0,1.0,1.0,program, gl);
        
        pushMatrix();
        multTranslation([L3,-L3,0]);
        multScale([L3,L3,L3]);
        uploadModelView(program, gl);
        CUBE.draw(gl, program, gl.TRIANGLES);
        popMatrix();
    }

    function clawBase(CLAWH, CLAWW, L3, sliderDisplacement, program, gl) {
        setColor(1.0, 0, 0, program, gl);
        pushMatrix();
        multTranslation([(sliderDisplacement-1)*L3, -(CLAWW/2+CLAWH/2) ,0]);
        pushMatrix(); 
        multScale([CLAWW,CLAWH,CLAWW]);
        uploadModelView(program, gl);
        CUBE.draw(gl, program, gl.TRIANGLES);
        popMatrix();
    }

    function claw(tipSize, program, gl) {
        setColor(1.0,1.0,1.0, program, gl);
        pushMatrix();
        multTranslation([0,-tipSize/2,0]);
        multScale([0.1, tipSize, 0.1]);
        uploadModelView(program, gl);
        CUBE.draw(gl, program, gl.TRIANGLES);
        popMatrix();
    }

    export function drawCrane(FW, FH, T1, L1, E1, T2, L2, E2, T3, L3, E3, T4, CD, CH, CLAWH, CLAWW, contraction, headRotation, sliderDisplacement, tipSize, scaleFactor, program, gl, mode) {
        floor(FH, FW, T1, L1, T2, L2, CH, L3, scaleFactor, program, gl);
        drawCubes(T1, L1, E1, FH, program, gl, mode);
        drawInnerCubes(T1, L1, T2, L2, E2, contraction, program, gl, mode);
        drawCylinder(T2, L2, CD, CH, headRotation, program, gl);
        drawArm(T3, L3, E3, T4, CH, program, gl, mode);
        weight(L3, program, gl);
        clawBase(CLAWH, CLAWW, L3,sliderDisplacement, program, gl);
        claw(tipSize, program, gl);
    }