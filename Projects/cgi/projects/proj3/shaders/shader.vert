/**
 * Daniel Ramos, N62396
 * Diogo Carvalho, N62418
 */

const int MAX_LIGHTS = 8;

struct LightInfo {
vec4 pos;
vec3 Ia;
vec3 Id;
vec3 Is;
};

attribute vec4 vPosition;   //Vertex position in modelling coordinates
attribute vec3 vNormal;     //Vertex normal in modelling coordinates

uniform mat4 mModelView;    //model-view transformation
uniform mat4 mNormals;      //model-view transformation for normals
uniform mat4 mView;         //view transformation (for points)
uniform mat4 mViewNormals;  //view transformation (for vectors)
uniform mat4 mProjection;   //projection matrix
uniform int uNLightsv;
uniform vec4 lightPositions[MAX_LIGHTS];      //Light position in camera space

varying vec3 fNormal;       //normal vector in camera space
varying vec3 fLights[MAX_LIGHTS]; //Light vectors in camera space
varying vec3 fViewer;       //View vector in camera space

void main()
{
    // compute position in camera frame
    vec3 posC = (mModelView * vPosition).xyz;
    // compute normal in camera frame
    fNormal = (mNormals * vec4(vNormal, 0.0)).xyz;
    // compute light vector in camera frame
    for (int i = 0; i < MAX_LIGHTS; i++) {
        if (i >= uNLightsv)
            break;
        if (lightPositions[i].w == 0.0)
            fLights[i] = normalize((mViewNormals * lightPositions[i]).xyz);
        else
            fLights[i] = normalize((mView * lightPositions[i]).xyz - posC);
    }
    // Compute the view vector
    fViewer = -posC; // Perspective projection
    // Compute vertex position in clip coordinates (as usual)
    gl_Position = mProjection * mModelView * vPosition;
}
