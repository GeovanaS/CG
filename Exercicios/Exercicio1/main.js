// WebGL2 - Multiple Objects - List
// from https://webgl2fundamentals.org/webgl/webgl-multiple-objects-list.html

  "use strict";

var vs = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fs = `#version 300 es
precision mediump float;

// Passed in from the vertex shader.
in vec4 v_color;

uniform vec4 u_colorMult;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult;
}
`;

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");

  var sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(gl, 10, 12, 6);
  var cubeBufferInfo   = flattenedPrimitives.createCubeBufferInfo(gl, 20);
  var coneBufferInfo   = flattenedPrimitives.createTruncatedConeBufferInfo(gl, 10, 0, 20, 12, 1, true, false);

  // setup GLSL program
  var programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  var sphereVAO = twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);
  var cubeVAO   = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);
  var coneVAO   = twgl.createVAOFromBufferInfo(gl, programInfo, coneBufferInfo);

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(60);

  // Uniforms for each object.
  var sphereUniforms = {
    u_colorMult: [0.5, 1, 0.5, 1],
    u_matrix: m4.identity(),
  };
  var cubeUniforms = {
    u_colorMult: [1, 0.5, 0.5, 1],
    u_matrix: m4.identity(),
  };
  var coneUniforms = {
    u_colorMult: [0.5, 0.5, 1, 1],
    u_matrix: m4.identity(),
  };
  var sphereTranslation = [  0, 0, 0];
  var cubeTranslation   = [-40, 0, 0];
  var coneTranslation   = [ 40, 0, 0];

  var objectsToDraw = [
    {
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
      uniforms: sphereUniforms,
    },
    {
      programInfo: programInfo,
      bufferInfo: cubeBufferInfo,
      vertexArray: cubeVAO,
      uniforms: cubeUniforms,
    },
    {
      programInfo: programInfo,
      bufferInfo: coneBufferInfo,
      vertexArray: coneVAO,
      uniforms: coneUniforms,
    },
  ];

  
  function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
    var matrix = m4.translate(viewProjectionMatrix,
        translation[0],
        translation[1],
        translation[2]);
    matrix = m4.xRotate(matrix, xRotation);
    return m4.yRotate(matrix, yRotation);
  }

  requestAnimationFrame(drawScene);
  
  var senS = 0;
  var cosS = 0;
  var senCube = 0;
  var cosCube = 0;
  var senCone = 0;
  var cosCone = 0;

  //Setup a ui
 webglLessonsUI.setupSlider("#Sphere_Sin",{slide: updateSphere(0),max: 360});
 webglLessonsUI.setupSlider("#Sphere_Cos",{slide: updateSphereC(0),max:360});
 webglLessonsUI.setupSlider("#Cube_Sin",{slide: updateCube(0),max:360});
 webglLessonsUI.setupSlider("#Cube_Cos",{slide: updateCubeC(0),max:360});
 webglLessonsUI.setupSlider("#Cone_Sin",{slide: updateCone(0),max:360});
 webglLessonsUI.setupSlider("#Cone_Cos",{slide: updateConeC(0),max:360});
 webglLessonsUI.setupSlider("#Angle", {slide: updateAngle, max: 360});
  
function updateSphere(event,ui){
  return function(event,ui) {
    sphereTranslation[event] = ui.value;
    senS = degToRad(ui.value);
  }
   requestAnimationFrame(drawScene);
}
   
function updateSphereC(event,ui){
  return function(event,ui) {
    sphereTranslation[event] = ui.value;
    cosS = degToRad(ui.value);
  }
   requestAnimationFrame(drawScene);
}  

function updateCube(event,ui){
  return function(event,ui){
    cubeTranslation[event] = ui.value;
    senCube = degToRad(ui.value);
  }
  requestAnimationFrame(drawScene);
}  
  
 function updateCubeC(event,ui){
  return function(event,ui){
    cubeTranslation[event] = ui.value;
    cosCube = degToRad(ui.value);
  }
  requestAnimationFrame(drawScene);
}   

  function updateCone(event,ui){
  return function(event,ui){
    coneTranslation[event] = ui.value;
    senCone = degToRad(ui.value);
  }
  requestAnimationFrame(drawScene);
} 
  
 function updateConeC(event,ui){
  return function(event,ui){
    coneTranslation[event] = ui.value;
    cosCone = degToRad(ui.value);
  }
  requestAnimationFrame(drawScene);
}  
  
function updateAngle(event, ui) {
    var angleInDegrees = 360 - ui.value;
    senS = angleInDegrees * Math.PI / 180;
    cosS = angleInDegrees * Math.PI / 180;
    senCone = angleInDegrees * Math.PI / 180;
    cosCone = angleInDegrees * Math.PI / 180;
    senCube = angleInDegrees * Math.PI / 180;
    cosCube = angleInDegrees * Math.PI / 180;
  
    sphereTranslation[0] = Math.sin(senS);
    sphereTranslation[1] = Math.cos(cosS);
  
    coneTranslation[1] = Math.sin(senCone);
    coneTranslation[3] = Math.cos(cosCone);
  
    cubeTranslation[2] = Math.sin(senCube);
    cubeTranslation[5] = Math.cos(cosCube);
    drawScene();
  }

  // Draw the scene.
  function drawScene(time) {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    time = time *0.005;

    twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    var cameraPosition = [0, 0, 100];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    var sphereXRotation =  senS;
    var sphereYRotation =  cosS;
    var cubeXRotation   = -senCube;
    var cubeYRotation   =  cosCube;
    var coneXRotation   =  senCone;
    var coneYRotation   = -cosCone;

    // Compute the matrices for each object.
    sphereUniforms.u_matrix = computeMatrix(
        viewProjectionMatrix,
        sphereTranslation,
        sphereXRotation,
        sphereYRotation);

    cubeUniforms.u_matrix = computeMatrix(
        viewProjectionMatrix,
        cubeTranslation,
        cubeXRotation,
        cubeYRotation);

    coneUniforms.u_matrix = computeMatrix(
        viewProjectionMatrix,
        coneTranslation,
        coneXRotation,
        coneYRotation);

    // ------ Draw the objects --------

    objectsToDraw.forEach(function(object) {
      var programInfo = object.programInfo;

      gl.useProgram(programInfo.program);

      // Setup all the needed attributes.
      gl.bindVertexArray(object.vertexArray);

      // Set the uniforms we just computed
      twgl.setUniforms(programInfo, object.uniforms);

      twgl.drawBufferInfo(gl, object.bufferInfo);
    });

    requestAnimationFrame(drawScene);
  }
}

main();
