// WebGL2 - Multiple Objects - Manual
// from https://webgl2fundamentals.org/webgl/webgl-multiple-objects-manual.html


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
  // setup GLSL program
  var programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  var shereVAO   = twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);
  
  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(60);

  // Uniforms for each object.
  var sphereUniforms = {
    u_colorMult: [0.5, 1, 0.5, 1],
    u_matrix: m4.identity(),
  };
  
  var rotationInRadiansSphere= 0;
  var scale = [1,1];
  var clicked = 0;
  var arrayX = [];
  var arrayY = [];
  var arrayZ = [];
  var arrayAngle = [];
  window.primeiraPosicaoX = 0;
  window.ultimaPosicaoX = 0;
  window.posicaoAtualX = 0;
  window.primeiraPosicaoY = 0;
  window.ultimaPosicaoY = 0;
  window.posicaoAtualY = 0;
  window.primeiraPosicaoZ = 0;
  window.ultimaPosicaoZ = 0;
  window.posicaoAtualZ = 0;
  window.primeiraPosicaoAngle = 0;
  window.ultimaPosicaoAngle = 0;
  window.posicaoAtualAngle = 0;
  
  var sphereTranslation = [  -40, 0, 0];
  //var coneTranslation   = [ 40, 0, 0];
  //var rotation = [degToRad(190), degToRad(40), degToRad(320)]; // talvez
  var fieldOfViewRadians = degToRad(60);
  var rotationSpeed = 1.2;
  var then = 0;

  function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
    var matrix = m4.translate(viewProjectionMatrix,
        translation[0],
        translation[1],
        translation[2]);
    matrix = m4.xRotate(matrix, xRotation);
    return m4.yRotate(matrix, yRotation);
  }
   requestAnimationFrame(drawScene); 
   function slidersAparece (){
        webglLessonsUI.setupSlider("#Sphere_X",      {slide: updatePositionSphere(0), min: 0, max: gl.canvas.width });
        webglLessonsUI.setupSlider("#Sphere_Y",      {slide: updatePositionSphere(1), min: 0, max: gl.canvas.height});
        webglLessonsUI.setupSlider("#Sphere_Z",      {slide: updatePositionSphere(2), max: gl.canvas.height});
        webglLessonsUI.setupSlider("#Angle",  {/*value: rotationInRadians * 180 / Math.PI | 0, */slide: updateAngleCubo, max: 360});
   }
   function updatePositionSphere(index) {
        return function(event, ui) {
              sphereTranslation[index] = ui.value;
              //console.log(cubeTranslation);
              if(index==0){
                    arrayX.push(sphereTranslation[index]);
              }else if(index==1){
                    arrayY.push(sphereTranslation[index]);
              }else{
                     arrayZ.push(sphereTranslation[index]);
              }
        };
    }
    function updateAngleCubo(event, ui) {
          //var angleInDegrees = 360 - ui.value;
          //rotationInRadiansCubo = angleInDegrees * Math.PI / 180;
          arrayAngle.push(ui.value);
          //drawScene();
    }  
  slidersAparece();
  document.getElementById('buttonA').onclick = function() {
    if(arrayAngle.lenght > 1){
             primeiraPosicaoAngle = arrayAngle[arrayAngle.lenght-1];
             arrayAngle = [];
    }else if(arrayAngle.lenght){
            primeiraPosicaoAngle = 0
    }
    else if(arrayZ.lenght > 1){
              primeiraPosicaoZ = arrayZ[arrayZ.length-1];
              arrayZ = []; 
      }else if(arrayZ.lenght<=1){
             primeiraPosicaoZ=0;
      }else if(arrayY.lenght > 1){
              primeiraPosicaoY = arrayY[arrayY.length-1];
              //console.log(primeiraPosicaoY);
              arrayY = []; 
      }
      else if(arrayY.lenght<=1){
              primeiraPosicaoY=0;
      }
       else if(arrayX.lenght > 1){
             primeiraPosicaoX = arrayX[arrayX.length-1];
             arrayX = []; 
       }
      else{
            primeiraPosicaoX = 0;
      }
  };
  document.getElementById('buttonAnimation').onclick = function() {
        if(arrayZ.length !=0){
              ultimaPosicaoZ = arrayZ[arrayZ.length-1];
              posicaoAtualZ = primeiraPosicaoZ;
        }
        if(arrayY.length !=0){
              ultimaPosicaoY = arrayY[arrayY.length-1];
              posicaoAtualY = primeiraPosicaoY;
        }
        if(arrayX.length !=0){
              ultimaPosicaoX = arrayX[arrayX.length-1];
              posicaoAtualX = primeiraPosicaoX;
        }
        if(arrayAngle.lenght !=0){
           ultimaPosicaoAngle = arrayAnle[arrayAngle.length-1];
           posicaoAtualAngle = primeiraPosicaoAngle;
          
          //var angleInDegrees = 360 - ui.value;
          //rotationInRadiansCubo = angleInDegrees * Math.PI / 180;
        }
  };
  
  // Draw the scene.
  function drawScene(now) {
    //time = time * 0.0000;
    
        now *= 0.001;
    // Subtract the previous time from the current time
        var deltaTime = now - then;
        // Remember the current time for the next frame.
        then = now;
        twgl.resizeCanvasToDisplaySize(gl.canvas);
       if(posicaoAtualZ!=ultimaPosicaoZ+1){
            sphereTranslation[2] = posicaoAtualZ;
            posicaoAtualZ++;
       }
       if(posicaoAtualY!=ultimaPosicaoY+1){
            sphereTranslation[1] = posicaoAtualY;
            posicaoAtualY++;
       }
       if(posicaoAtualX!=ultimaPosicaoX+1){
            sphereTranslation[0] = posicaoAtualX;
            posicaoAtualX++;
       }

    //rotation[1] += rotationSpeed * deltaTime;
    
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
    
    
    var sphereXRotation   = -rotationInRadiansSphere;
    var sphereYRotation   =  rotationInRadiansSphere;

    
    gl.useProgram(programInfo.program);
 
    // ------ Draw the cube --------

    // Setup all the needed attributes.
    gl.bindVertexArray(shereVAO);

    sphereUniforms.u_matrix = computeMatrix(
        viewProjectionMatrix,
        sphereTranslation,
        sphereXRotation,
        sphereYRotation);

    // Set the uniforms we just computed
    twgl.setUniforms(programInfo, sphereUniforms);

    twgl.drawBufferInfo(gl, sphereBufferInfo);

    requestAnimationFrame(drawScene);
  }
}

main();
