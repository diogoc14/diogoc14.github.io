/**
 * Daniel Ramos, N.62396
 * Diogo Carvalho, N.62418
 */
attribute vec2 vPosition;
attribute float vFunction;

uniform vec2 uBottomLeft;
uniform vec2 uTopRight;

varying float colorFunction;

void main() 
{
    vec2 size = uTopRight - uBottomLeft;
    vec2 tmp = (vPosition - uBottomLeft) * 2.0 / size - vec2(1.0, 1.0);
    
    colorFunction = vFunction;
    gl_PointSize = 1.3;
    gl_Position = vec4(tmp, 0.0, 1.0);
}