/**
 * Daniel Ramos, N.62396
 * Diogo Carvalho, N.62418
 */
attribute vec2 vOldPosition;

varying vec2 vNewPosition;
varying float vNewFunction;

#define MAX_FUNCS 7

uniform mat3 m[MAX_FUNCS]; // array de matrizes com as funções lineares
uniform float p[MAX_FUNCS]; // array com as probabilidades
uniform int nfuncs; // número de funções do IFS



void main() {
    float r = fract(sin(dot(vOldPosition.xy, vec2(12.9898,78.233))) * 43758.5453123);
    for (int i = 0; i < MAX_FUNCS; i++) {
        if (i < nfuncs && r < p[i]) {
            vec3 temp = m[i] * vec3(vOldPosition, 1);
            vNewPosition = temp.xy;
            vNewFunction = float(i);
            break;
        }
    }
}