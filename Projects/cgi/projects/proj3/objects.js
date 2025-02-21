/**
 * Daniel Ramos, N62396
 * Diogo Carvalho, N62418
 */

import * as BUNNY from '../../libs/objects/bunny.js';
import * as COW from '../../libs/objects/cow.js';
import * as CUBE from '../../libs/objects/cube.js';
import * as CYLINDER from '../../libs/objects/cylinder.js';
import * as PYRAMID from '../../libs/objects/pyramid.js';
import * as SPHERE from '../../libs/objects/sphere.js';
import * as TORUS from '../../libs/objects/torus.js';

/**
 * OBJECTS
 */

let ANIMATION_SPEED = 0.3;

let X_AXIS = 0;
let Y_AXIS = 1;
let Z_AXIS = 2;

export let highlightMaterial = {
    Ka: [0,0,0],
    Kd: [0,0,0],
    Ks: [0,0,0],
    Ke: [255,255,255],
    shininess: 0.0,
}

let ground = {
    scene: {
        translation: [0.0, -0.55, 0.0],
        rotation: [0.0, 0.0, 0.0],
        scale:[4.0, 0.1, 4.0],
        geometry: CUBE
    },
    material: {
        Ka: [175,175,90],
        Kd: [100,100,60],
        Ks: [0,0,0],
        Ke: [0,0,0],
        shininess: 0.0,
    },
    selected: false
}

let object1 = {
    scene: {
        translation: [1.0, 0.0, 1.0],
        rotation: [0.0, 0.0, 0.0],
        scale:[1.0, 1.0, 1.0],
        geometry: BUNNY
    },
    material: {
        Ka: [0,100,150],
        Kd: [0,100,150],
        Ks: [200, 200, 200],
        Ke: [0,0,0],
        shininess: 100,
    },
    selected: false
}


let object2 = {
    scene: {
        translation: [-1.0, 0.0, 1.0],
        rotation: [0.0, 0.0, 0.0],
        scale:[1.0, 1.0, 1.0],
        geometry: COW
    },
    material: {
        Ka: [150,150,150],
        Kd: [150,150,150],
        Ks: [200,200,200],
        Ke: [0,0,0],
        shininess: 100,
    },
    selected: false
}

let object3 = {
    scene: {
        translation: [1.0, 0.0, -1.0],
        rotation: [0.0, 0.0, 0.0],
        scale:[1.0, 1.0, 1.0],
        geometry: SPHERE
    },
    material: {
        Ka: [50,150,50],
        Kd: [50,150,50],
        Ks: [200,200,200],
        Ke: [0,0,0],
        shininess: 100,
    },
    selected: false
}

let object4 = {
    scene: {
        translation: [-1.0, 0.0, -1.0],
        rotation: [0.0, 0.0, 0.0],
        scale:[1.0, 1.0, 1.0],
        geometry: CUBE
    },
    material: {
        Ka: [150, 75, 75],
        Kd: [150, 75, 75],
        Ks: [200,200,200],
        Ke: [0,0,0],
        shininess: 100,
    },
    selected: false
}

export let objects = [ground, object1, object2, object3, object4];

/**
 * LIGHTS
 */


let light1 = {
    scene: {
        translation: [3.0, 0.0, 0.0],
        rotation: [0.0, 0.0, 0.0],
        scale:[0.1, 0.1, 0.1],
        geometry: SPHERE
    },
    properties: {
        ambient: [51, 51, 51],
        diffuse: [76, 76, 76],
        specular: [255,255,255],
        directional: true,
        active: true
    },
    animationAxis: Y_AXIS
}

let light2 = {
    scene: {
        translation: [0.0, 3.0, 0.0],
        rotation: [0.0, 0.0, 0.0],
        scale:[0.1, 0.1, 0.1],
        geometry: SPHERE
    },
    properties: {
        ambient: [51, 51, 51],
        diffuse: [76, 76, 76],
        specular: [255,255,255],
        directional: true,
        active: true
    },
    animationAxis: Z_AXIS
}

let light3 = {
    scene: {
        translation: [0.0, 0.0, 3.0],
        rotation: [0.0, 0.0, 0.0],
        scale:[0.1, 0.1, 0.1],
        geometry: SPHERE
    },
    properties: {
        ambient: [51, 51, 51],
        diffuse: [76, 76, 76],
        specular: [255,255,255],
        directional: true,
        active: true
    },
    animationAxis: X_AXIS
}

let light1material = {
    Ka: [0, 0, 0],
    Kd: [0, 0, 0],
    Ks: [0, 0, 0],
    Ke: light1.properties.diffuse,
    shininess: 0.0,
}

let light2material = {
    Ka: [0, 0, 0],
    Kd: [0, 0, 0],
    Ks: [0, 0, 0],
    Ke: light2.properties.diffuse,
    shininess: 0.0,
}

let light3material = {	
    Ka: [0, 0, 0],
    Kd: [0, 0, 0],
    Ks: [0, 0, 0],
    Ke: light3.properties.diffuse,
    shininess: 0.0,
}

export function updateMaterial() {
    light1material.Ke = light1.properties.diffuse;
    light2material.Ke = light2.properties.diffuse;
    light3material.Ke = light3.properties.diffuse;
}


export let lights = [light1, light2, light3];
export let lightmaterials = [light1material, light2material, light3material];
