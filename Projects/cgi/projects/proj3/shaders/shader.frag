/**
 * Daniel Ramos, N62396
 * Diogo Carvalho, N62418
 */

precision highp float;
const int MAX_LIGHTS = 8;

struct LightInfo {
vec4 pos;
vec3 Ia;
vec3 Id;
vec3 Is;
};

struct MaterialInfo {
vec3 Ka;
vec3 Kd;
vec3 Ks;
vec3 Ke;
float shininess;
};

uniform LightInfo uLight[MAX_LIGHTS]; // The array of lights present in the scene
uniform MaterialInfo uMaterial; // The material of the object being drawn
uniform int uNLights;

varying vec3 fNormal;
varying vec3 fLights[MAX_LIGHTS];
varying vec3 fViewer;



void main() {

    vec3 res = vec3(0.0, 0.0,0.0);
    if (uMaterial.Ke != vec3(0.0, 0.0, 0.0)) {
        res = uMaterial.Ke;
    } else {
        for (int i = 0; i < MAX_LIGHTS; i++) {
            if (i >= uNLights)
                break;
            vec3 L = normalize(fLights[i]);
            vec3 V = normalize(fViewer);
            vec3 N = normalize(fNormal);
            vec3 H = normalize(L+V);

            vec3 ambientColor = uLight[i].Ia * uMaterial.Ka;
            vec3 diffuseColor = uLight[i].Id * uMaterial.Kd;
            vec3 specularColor = uLight[i].Is * uMaterial.Ks;

            float diffuseFactor = max( dot(L,N), 0.0 );
            vec3 diffuse = diffuseFactor * diffuseColor;

            float specularFactor = pow(max(dot(N,H), 0.0), uMaterial.shininess);
            vec3 specular = specularFactor * specularColor;
            if( dot(L,N) < 0.0 ) {
                specular = vec3(0.0, 0.0, 0.0);
            }
            res = res + (ambientColor + diffuse + specular);
        }
    }

    gl_FragColor = vec4(res, 1.0);
}
