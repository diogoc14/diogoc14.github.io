/**
 * Daniel Ramos, N.62396
 * Diogo Carvalho, N.62418
 */
precision mediump float;

varying float colorFunction;


void main()
{
    vec3 color;

    if (colorFunction == 0.0) {
        color = vec3(1.0, 0.0, 0.0);
    } else if (colorFunction == 1.0) {
        color = vec3(0.0, 1.0, 0.0);
    } else if (colorFunction == 2.0) {
        color = vec3(0.0, 0.0, 1.0);
    } else if (colorFunction == 3.0) {
        color = vec3(1.0, 1.0, 0.0);
    } else if (colorFunction == 4.0) {
        color = vec3(0.0, 1.0, 1.0);
    } else if (colorFunction == 5.0) {
        color = vec3(1.0, 0.0, 1.0);
    } else if (colorFunction == 6.0) {
        color = vec3(1.0, 1.0, 1.0);
    } else {
        color = vec3(0.36, 0.36, 0.36); // Default color
    }
    gl_FragColor = vec4(color, 0.01);
}
