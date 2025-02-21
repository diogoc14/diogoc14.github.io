/**
 * Daniel Ramos, N62396
 * Diogo Carvalho, N62418
 */

import { buildProgramFromSources, loadShadersFromURLS, setupWebGL } from '../../libs/utils.js';
import { length, flatten, inverse, mult, normalMatrix, perspective, lookAt, vec4, vec3, vec2, mat4, subtract, add, scale, rotate, rotateX, rotateY, rotateZ, translate, normalize} from '../../libs/MV.js';
import { pushMatrix, popMatrix, multTranslation, multScale, multRotationX, multRotationY, multRotationZ, modelView } from '../../libs/stack.js';

import * as dat from '../../libs/dat.gui.module.js';

import * as BUNNY from '../../libs/objects/bunny.js';
import * as COW from '../../libs/objects/cow.js';
import * as CUBE from '../../libs/objects/cube.js';
import * as CYLINDER from '../../libs/objects/cylinder.js';
import * as PYRAMID from '../../libs/objects/pyramid.js';
import * as SPHERE from '../../libs/objects/sphere.js';
import * as TORUS from '../../libs/objects/torus.js';

import * as STACK from '../../libs/stack.js';

import * as OBJECTS from '../proj3/objects.js';

let X_AXIS = 0;
let Y_AXIS = 1;
let Z_AXIS = 2;

function normalize255(v) {
    return v.map(x => x/255);
}


function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

function setup(shaders) {

    const canvas = document.getElementById('gl-canvas');
    const gl = setupWebGL(canvas);

    BUNNY.init(gl);
    COW.init(gl);
    CUBE.init(gl);
    CYLINDER.init(gl);
    PYRAMID.init(gl);
    SPHERE.init(gl);
    TORUS.init(gl);

    const program = buildProgramFromSources(gl, shaders['shader.vert'], shaders['shader.frag']);

    // Camera  
    let camera = {
        eye: vec3(0,0,5),
        at: vec3(0,0,0),
        up: vec3(0,1,0),
        fovy: 45,
        aspect: 1, // Updated further down
        near: 0.1,
        far: 20
    }

    let options = {
        backface_culling: true,
        zbuffer: true,
        animatelights: false,
        animationSpeed: 0.5,
        showLights: false
    }

    let nlights = OBJECTS.lights.length;

    let selected = 1;
    let selectedObject = OBJECTS.objects[selected];


    /**------------------------------ RIGHT GUI ------------------------------ */

    const gui = new dat.GUI();

    /** OPTIONS properties */

    const optionsGui = gui.addFolder("options");
    optionsGui.add(options, "backface_culling").name("Backface Culling").onChange(function() {
        if (options.backface_culling)
            gl.enable(gl.CULL_FACE);
        else
            gl.disable(gl.CULL_FACE);
    });
    optionsGui.add(options, "zbuffer").name("zBuffer").onChange(function() {
        if (options.zbuffer)
            gl.enable(gl.DEPTH_TEST);
        else
            gl.disable(gl.DEPTH_TEST);
    });
    optionsGui.add(options, "showLights").name("showLights");
    optionsGui.add(options, "animatelights").name("animateLights");
    optionsGui.add(options, "animationSpeed").min(0.1).max(1).step(0.01).name("Animation speed");

    /** CAMERA properties */

    const cameraGui = gui.addFolder("camera");

    cameraGui.add(camera, "fovy").min(1).max(100).step(1).listen();
    cameraGui.add(camera, "aspect").min(0).max(10).step(0.01).listen().domElement.style.pointerEvents = "none";
    
    cameraGui.add(camera, "near").min(0.1).max(20).step(0.01).listen().onChange( function(v) {
        camera.near = Math.min(camera.far-0.5, v);
    });

    cameraGui.add(camera, "far").min(0.1).max(20).step(0.01).listen().onChange( function(v) {
        camera.far = Math.max(camera.near+0.5, v);
    });

    // eye

    const eye = cameraGui.addFolder("eye");
    eye.add(camera.eye, 0).step(0.05).listen().domElement.style.pointerEvents = "none";;
    eye.add(camera.eye, 1).step(0.05).listen().domElement.style.pointerEvents = "none";;
    eye.add(camera.eye, 2).step(0.05).listen().domElement.style.pointerEvents = "none";;

    // at

    const at = cameraGui.addFolder("at");
    at.add(camera.at, 0).step(0.05).listen().domElement.style.pointerEvents = "none";;
    at.add(camera.at, 1).step(0.05).listen().domElement.style.pointerEvents = "none";;
    at.add(camera.at, 2).step(0.05).listen().domElement.style.pointerEvents = "none";;

    // up

    const up = cameraGui.addFolder("up");
    up.add(camera.up, 0).step(0.05).listen().domElement.style.pointerEvents = "none";;
    up.add(camera.up, 1).step(0.05).listen().domElement.style.pointerEvents = "none";;
    up.add(camera.up, 2).step(0.05).listen().domElement.style.pointerEvents = "none";;

    /** LIGHTS properties */

    //light1
    const lightGui = gui.addFolder("lights");
    let light1Folder = lightGui.addFolder("light1");
    light1Folder.add(OBJECTS.lights[0].scene.translation, 0).listen().step(0.01).name("X");
    light1Folder.add(OBJECTS.lights[0].scene.translation, 1).listen().step(0.01).name("Y");
    light1Folder.add(OBJECTS.lights[0].scene.translation, 2).listen().step(0.01).name("Z");
    light1Folder.addColor(OBJECTS.lights[0].properties, "ambient");
    light1Folder.addColor(OBJECTS.lights[0].properties, "diffuse").onChange(function() {
        OBJECTS.updateMaterial();
    });
    light1Folder.addColor(OBJECTS.lights[0].properties, "specular");
    light1Folder.add(OBJECTS.lights[0].properties, "directional");
    light1Folder.add(OBJECTS.lights[0].properties, "active");

    //light2
    let light2Folder = lightGui.addFolder("light2");
    light2Folder.add(OBJECTS.lights[1].scene.translation, 0).listen().step(0.01).name("X");
    light2Folder.add(OBJECTS.lights[1].scene.translation, 1).listen().step(0.01).name("Y");
    light2Folder.add(OBJECTS.lights[1].scene.translation, 2).listen().step(0.01).name("Z");
    light2Folder.addColor(OBJECTS.lights[1].properties, "ambient");
    light2Folder.addColor(OBJECTS.lights[1].properties, "diffuse").onChange(function() {
        OBJECTS.updateMaterial();
    });
    light2Folder.addColor(OBJECTS.lights[1].properties, "specular");
    light2Folder.add(OBJECTS.lights[1].properties, "directional");
    light2Folder.add(OBJECTS.lights[1].properties, "active");

    //light3
    let light3Folder = lightGui.addFolder("light3");
    light3Folder.add(OBJECTS.lights[2].scene.translation, 0).listen().step(0.01).name("X");
    light3Folder.add(OBJECTS.lights[2].scene.translation, 1).listen().step(0.01).name("Y");
    light3Folder.add(OBJECTS.lights[2].scene.translation, 2).listen().step(0.01).name("Z");
    light3Folder.addColor(OBJECTS.lights[2].properties, "ambient");
    light3Folder.addColor(OBJECTS.lights[2].properties, "diffuse").onChange(function() {
        OBJECTS.updateMaterial();
    });
    light3Folder.addColor(OBJECTS.lights[2].properties, "specular");
    light3Folder.add(OBJECTS.lights[2].properties, "directional");
    light3Folder.add(OBJECTS.lights[2].properties, "active");


    /**--------------------------------- END --------------------------------- */

    /**------------------------------- LEFT GUI ------------------------------ */

    
    const objectGUI = new dat.GUI();
    objectGUI.domElement.id = "object-gui";
    
    let selectListElements = ['Bunny', 'Cow', 'Cube', 'Cylinder', 'Pyramid', 'Sphere', 'Torus'];
    let objectMap = { 'Bunny': BUNNY, 'Cow': COW, 'Cube': CUBE, 'Cylinder': CYLINDER, 'Pyramid': PYRAMID, 'Sphere': SPHERE, 'Torus': TORUS };
    let selectedElement = { selectedOption: getKeyByValue(objectMap, selectedObject.scene.geometry) };
    
    const selectList = objectGUI.add(selectedElement, 'selectedOption', selectListElements).name("name");
    selectList.onChange(function() { 
        selectedObject.scene.geometry = objectMap[selectedElement.selectedOption];
    });

    function updateObjectGUI(newObject) {
        while (objectGUI.__controllers.length > 0) {
            objectGUI.remove(objectGUI.__controllers[0]);
        }

        const selectedElement = { selectedOption: getKeyByValue(objectMap, newObject.scene.geometry) };

        const selectList = objectGUI.add(selectedElement, 'selectedOption', selectListElements).name("name");
        selectList.onChange(function () {
            newObject.scene.geometry = objectMap[selectedElement.selectedOption];
        });

        // Add selectList as the first element in the objectGUI folder
        objectGUI.__ul.insertBefore(selectList.domElement.parentNode.parentNode, objectGUI.__ul.firstChild);
    }
    
    /** TRANSFORM properties of the object */

    const transformFolder = objectGUI.addFolder("transform");

    const positionFolder = transformFolder.addFolder("position");
    const rotationFolder = transformFolder.addFolder("rotation");
    const scaleFolder = transformFolder.addFolder("scale");
    updateTransformFolder(selectedObject);


    function updateTransformFolder(newObject) {
        // Remove all existing controls
        while(positionFolder.__controllers.length > 0) {
            positionFolder.remove(positionFolder.__controllers[0]);
        }
        while(rotationFolder.__controllers.length > 0) {
            rotationFolder.remove(rotationFolder.__controllers[0]);
        }
        while(scaleFolder.__controllers.length > 0) {
            scaleFolder.remove(scaleFolder.__controllers[0]);
        }

        // Add new position controls tied to the new object
        positionFolder.add(newObject.scene.translation, 0).min(-1).max(1).name("X");
        positionFolder.add(newObject.scene.translation, 1).name("Y").domElement.style.pointerEvents = "none";
        positionFolder.add(newObject.scene.translation, 2).min(-1).max(1).name("Z");

        // Add new rotation controls tied to the new object
        rotationFolder.add(newObject.scene.rotation, 0).name("X").domElement.style.pointerEvents = "none";
        rotationFolder.add(newObject.scene.rotation, 1).min(-180).max(180).name("Y");
        rotationFolder.add(newObject.scene.rotation, 2).name("Z").domElement.style.pointerEvents = "none";

        // Add new scale controls tied to the new object
        scaleFolder.add(newObject.scene.scale, 0).min(0).max(1).name("X");
        scaleFolder.add(newObject.scene.scale, 1).min(0).max(1).name("Y");
        scaleFolder.add(newObject.scene.scale, 2).min(0).max(1).name("Z");



    }

    /** MATERIAL properties of the object */

    const materialFolder = objectGUI.addFolder("material");
    updateMaterialFolder(selectedObject);


    function updateMaterialFolder(newObject) {
        // Remove all existing controls
        while(materialFolder.__controllers.length > 0) { 
          materialFolder.remove(materialFolder.__controllers[0]);
        }
      
        // Add new controls tied to the new object
        materialFolder.addColor(newObject.material, "Ka").listen();
        materialFolder.addColor(newObject.material, "Kd").listen();
        materialFolder.addColor(newObject.material, "Ks").listen();
        materialFolder.add(newObject.material, "shininess").min(0).max(300).step(1).listen();
      }
    /**--------------------------------- END --------------------------------- */
    // matrices
    let mView, mProjection;

    let down = false;
    let lastX, lastY;


    gl.clearColor(0.73, 0.73, 0.73, 1.0);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.DEPTH_TEST);


    resizeCanvasToFullWindow();

    window.addEventListener('resize', resizeCanvasToFullWindow);

    function changeSelected(selectNumb) {
        if (selected == selectNumb)
            selectedObject.selected = !selectedObject.selected;
        else {
            selected = selectNumb;
            selectedObject.selected = false;
            selectedObject = OBJECTS.objects[selected];
            selectedObject.selected = true;
        }
        
    }


    window.addEventListener('keydown', function(event) {
        if (event.target.tagName.toLowerCase() === 'input') {
            return;
        }
    
        switch(event.key) {
            case '1':
                changeSelected(1);
                updateMaterialFolder(selectedObject);
                updateTransformFolder(selectedObject);
                updateObjectGUI(selectedObject);
                break;
            case '2':
                changeSelected(2);
                updateMaterialFolder(selectedObject);
                updateTransformFolder(selectedObject);
                updateObjectGUI(selectedObject);
                break;
            case '3':
                changeSelected(3);
                updateMaterialFolder(selectedObject);
                updateTransformFolder(selectedObject);
                updateObjectGUI(selectedObject);
                break;
            case '4':
                changeSelected(4);
                updateMaterialFolder(selectedObject);
                updateTransformFolder(selectedObject);
                updateObjectGUI(selectedObject);
                break;
        }
    })

    window.addEventListener('wheel', function(event) {

        
        if(!event.altKey && !event.metaKey && !event.ctrlKey) { // Change fovy
            const factor = 1 - event.deltaY/1000;
            camera.fovy = Math.max(1, Math.min(100, camera.fovy * factor)); 
        }
        else if(event.metaKey || event.ctrlKey) {
            // move camera forward and backwards (shift)

            const offset = event.deltaY / 1000;

            const dir = normalize(subtract(camera.at, camera.eye));

            const ce = add(camera.eye, scale(offset, dir));
            const ca = add(camera.at, scale(offset, dir));
            
            // Can't replace the objects that are being listened by dat.gui, only their properties.
            camera.eye[0] = ce[0];
            camera.eye[1] = ce[1];
            camera.eye[2] = ce[2];

            if(event.ctrlKey) {
                camera.at[0] = ca[0];
                camera.at[1] = ca[1];
                camera.at[2] = ca[2];
            }
        }
    });

    function inCameraSpace(m) {
        const mInvView = inverse(mView);

        return mult(mInvView, mult(m, mView));
    }

    canvas.addEventListener('mousemove', function(event) {
        if(down) {
            const dx = event.offsetX - lastX;
            const dy = event.offsetY - lastY;

            if(dx != 0 || dy != 0) {
                const d = vec2(dx, dy);
                const axis = vec3(-dy, -dx, 0);

                const rotation = rotate(0.5*length(d), axis);

                let eyeAt = subtract(camera.eye, camera.at);                
                eyeAt = vec4(eyeAt[0], eyeAt[1], eyeAt[2], 0);
                let newUp = vec4(camera.up[0], camera.up[1], camera.up[2], 0);

                eyeAt = mult(inCameraSpace(rotation), eyeAt);
                newUp = mult(inCameraSpace(rotation), newUp);
                
                console.log(eyeAt, newUp);

                camera.eye[0] = camera.at[0] + eyeAt[0];
                camera.eye[1] = camera.at[1] + eyeAt[1];
                camera.eye[2] = camera.at[2] + eyeAt[2];

                camera.up[0] = newUp[0];
                camera.up[1] = newUp[1];
                camera.up[2] = newUp[2];

                lastX = event.offsetX;
                lastY = event.offsetY;
            }

        }
    });

    canvas.addEventListener('mousedown', function(event) {
        down=true;
        lastX = event.offsetX;
        lastY = event.offsetY;
        gl.clearColor(0.70, 0.73, 0.70, 1.0);
    });

    canvas.addEventListener('mouseup', function(event) {
        down = false;
        gl.clearColor(0.73, 0.73, 0.73, 1.0);
    });

    window.requestAnimationFrame(render);

    function resizeCanvasToFullWindow()
    {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        camera.aspect = canvas.width / canvas.height;

        gl.viewport(0,0,canvas.width, canvas.height);
    }

    
    function uploadModelView(program, gl)
    {
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mModelView"), false, flatten(modelView()));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mNormals"), false, flatten(normalMatrix(STACK.modelView())));

    }

    function uploadMaterial(program, gl, material) {
        let KaLocation = gl.getUniformLocation(program, "uMaterial.Ka");
        gl.uniform3fv(KaLocation, vec3(normalize255(material.Ka)));

        let KdLocation = gl.getUniformLocation(program, "uMaterial.Kd");
        gl.uniform3fv(KdLocation, vec3(normalize255(material.Kd)));

        let KsLocation = gl.getUniformLocation(program, "uMaterial.Ks");
        gl.uniform3fv(KsLocation, vec3(normalize255(material.Ks)));

        let KeLocation = gl.getUniformLocation(program, "uMaterial.Ke");
        gl.uniform3fv(KeLocation, vec3(normalize255(material.Ke)));


        let shininessLocation = gl.getUniformLocation(program, "uMaterial.shininess");
        gl.uniform1f(shininessLocation, material.shininess);
    }

    function drawObjects() {
        for (let i = 0; i < OBJECTS.objects.length; i++) {
            let object = OBJECTS.objects[i];
            pushMatrix();
            multTranslation(object.scene.translation);
            multRotationY(object.scene.rotation[1]);
            multScale(object.scene.scale);
            uploadModelView(program, gl);
            uploadMaterial(program, gl, object.material);
            object.scene.geometry.draw(gl, program, gl.TRIANGLES);
            if (object.selected) {
                uploadMaterial(program, gl, OBJECTS.highlightMaterial);
                object.scene.geometry.draw(gl, program, gl.LINES);
            }
            popMatrix();
        }
    }

    function animateLight(light, angle) {
        let newPosition = [0,0,0];
        let currentTransformation = mult(inverse(mView), STACK.modelView()); // Current transformation in world coordinates

        let rotation = mat4();
        switch (light.animationAxis) {
            case X_AXIS:
                rotation = rotateX(angle);
                break;
            case Y_AXIS:
                rotation = rotateY(angle);
                break;
            case Z_AXIS:
                rotation = rotateZ(angle);
                break;
        }

        let transformedTranslation = mult(rotation, currentTransformation);
        newPosition[0] = transformedTranslation[0][3];
        newPosition[1] = transformedTranslation[1][3];
        newPosition[2] = transformedTranslation[2][3];

        Object.assign(light.scene.translation, newPosition);
    }

    function drawLights(activeLights, activeLightMaterials) {
        for (let i = 0; i < activeLights.length; i++) {
            let light = activeLights[i];
            pushMatrix();
            multTranslation(light.scene.translation);
            multRotationX(light.scene.rotation[0]);
            multRotationY(light.scene.rotation[1]);
            multRotationZ(light.scene.rotation[2]);
            if (options.animatelights)
                animateLight(light, options.animationSpeed);
            multScale(light.scene.scale);
            uploadModelView(program, gl);
            uploadMaterial(program, gl, activeLightMaterials[i]);
            if (options.showLights)
                light.scene.geometry.draw(gl, program, gl.TRIANGLES);
            popMatrix();
        }
    }

    function render(time)
    {
    
        window.requestAnimationFrame(render);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);

        mView = lookAt(camera.eye, camera.at, camera.up);
        STACK.loadMatrix(mView);

        mProjection = perspective(camera.fovy, camera.aspect, camera.near, camera.far);

        let activeLights = [];
        let activeLightMaterials = [];

        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mModelView"), false, flatten(STACK.modelView()));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mNormals"), false, flatten(normalMatrix(STACK.modelView())));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mView"), false, flatten(mView));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mViewNormals"), false, flatten(normalMatrix(mView)));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mProjection"), false, flatten(mProjection));
        
        for(let i = 0; i < nlights; i++) {
            if(OBJECTS.lights[i].properties.active) {
                activeLights.push(OBJECTS.lights[i]);
                activeLightMaterials.push(OBJECTS.lightmaterials[i]);
            }
        }

        let nActiveLights = activeLights.length;

        for (let i = 0; i < nActiveLights; i++) {
            let posLocation = gl.getUniformLocation(program, "uLight[" + i + "].pos");
            let posToSend = vec4(0.0, 0.0, 0.0, 0.0);
            if(activeLights[i].properties.directional) {
                posToSend = vec4(activeLights[i].scene.translation, 0.0);
            }
            else {
                posToSend = vec4(activeLights[i].scene.translation, 1.0);
            }
            let ia = vec3(normalize255(activeLights[i].properties.ambient));
            let id = vec3(normalize255(activeLights[i].properties.diffuse));
            let is = vec3(normalize255(activeLights[i].properties.specular));

            //Frag
            gl.uniform4fv(posLocation, posToSend);
            let IaLocation = gl.getUniformLocation(program, "uLight[" + i + "].Ia");
            gl.uniform3fv(IaLocation, ia);

            let IdLocation = gl.getUniformLocation(program, "uLight[" + i + "].Id");
            gl.uniform3fv(IdLocation, id);

            let IsLocation = gl.getUniformLocation(program, "uLight[" + i + "].Is");
            gl.uniform3fv(IsLocation, is);

            //Vert
            let posLocationv = gl.getUniformLocation(program, "lightPositions["+ i +"]");
            gl.uniform4fv(posLocationv, posToSend);

        }
        gl.uniform1i(gl.getUniformLocation(program, "uNLights"), nActiveLights);
        gl.uniform1i(gl.getUniformLocation(program, "uNLightsv"), nActiveLights);
        drawObjects();
        drawLights(activeLights, activeLightMaterials);
    }
}

const urls = ['shader.vert', 'shader.frag'];

loadShadersFromURLS(urls).then( shaders => setup(shaders));