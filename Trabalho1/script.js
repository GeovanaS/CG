// WebGL2 - Scene Graph - Solar System
// from https://webgl2fundamentals.org/webgl/webgl-scene-graph-solar-system-adjusted.html

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
uniform vec4 u_colorOffset;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult + u_colorOffset;
}
`;

var Node = function(nome,cor,diametro,periodo,orbita) {
  this.children = [];
  this.localMatrix = m4.identity();
  this.worldMatrix = m4.identity();
};

Node.prototype.setParent = function(parent) {
  // remove us from our parent
  if (this.parent) {
    var ndx = this.parent.children.indexOf(this);
    if (ndx >= 0) {
      this.parent.children.splice(ndx, 1);
    }
  }

  // Add us to our new parent
  if (parent) {
    parent.children.push(this);
  }
  this.parent = parent;
};

Node.prototype.updateWorldMatrix = function(matrix) {
  if (matrix) {
    // a matrix was passed in so do the math
    m4.multiply(matrix, this.localMatrix, this.worldMatrix);
  } else {
    // no matrix was passed in so just copy.
    m4.copy(this.localMatrix, this.worldMatrix);
  }

  // now process all the children
  var worldMatrix = this.worldMatrix;
  this.children.forEach(function(child) {
    child.updateWorldMatrix(worldMatrix);
  });
};


var cameraPosition = [10,0,-60];
var target = [0,0,0];
var up = [0,1,0];



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

  var sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(gl, 8, 12, 6);
  //https://twgljs.org/docs/module-twgl_primitives.html#.createTorusBufferInfo
  var orbitaBufferInfo = flattenedPrimitives.createTorusBufferInfo(gl, 20,8,50,70);
  var orbita = flattenedPrimitives.createTorusBufferInfo(gl, 40,0.30,50,10,20);
  
  // setup GLSL program
  var programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  var sphereVAO = twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);
  var orbitaVAO = twgl.createVAOFromBufferInfo(gl, programInfo, orbitaBufferInfo);
  var torusVAO = twgl.createVAOFromBufferInfo(gl, programInfo, orbita);
  
  //Create textures
  /* const textures = twgl.createTextures(gl, {
    sun: {src:"https://www.solarsystemscope.com/textures/download/2k_sun.jpg"},
    earth: {src:"https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg"},
    mercury: {src:"https://www.solarsystemscope.com/textures/download/2k_mercury.jpg"},
    venus:{src:"https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg"},
    mars:{src:"https://www.solarsystemscope.com/textures/download/2k_mars.jpg"},
    moon:{src:"https://www.solarsystemscope.com/textures/download/2k_moon.jpg"},
    jupiter:{src:"https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg"}
    saturn:{src:"https://www.solarsystemscope.com/textures/download/2k_saturn.jpg"},
    nepture:{src:"https://www.solarsystemscope.com/textures/download/2k_neptune.jpg"},
    uranus:{src:"https://www.solarsystemscope.com/textures/download/2k_uranus.jpg"},
    pluto:{src:"https://vignette.wikia.nocookie.net/planet-texture-maps/images/6/64/Pluto_Made.png/revision/latest?cb=20190331055010"}
  });
  */

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(60);

  var objectsToDraw = [];
  var objects = [];

  // Let's make all the nodes
  var solarSystemNode = new Node();
  var earthOrbitNode = new Node();
  // earth orbit 100 units from the sun
  earthOrbitNode.localMatrix = m4.translation(100, 0, 0);

  var moonOrbitNode = new Node();
  // moon 20 units from the earth
  moonOrbitNode.localMatrix = m4.translation(20,0, 0);
  
   //Mercúrio
  var mercuryOrbitNode = new Node();
  mercuryOrbitNode.localMatrix = m4.translation(40,0,0);
  
  //Vênus
  var venusOrbitNode = new Node();
  venusOrbitNode.localMatrix = m4.translation(60,0,0);
  
  //Marte
  var marsOrbitNode = new Node();
  marsOrbitNode.localMatrix = m4.translation(140,0,0);
  
  //Jupiter
  var jupiterOrbitNode = new Node();
  jupiterOrbitNode.localMatrix = m4.translation(180,0,0);
  
  //Saturno
  var saturnOrbitNode = new Node();
  saturnOrbitNode.localMatrix = m4.translation(220,0,0);
  var saturnLineOrbitNode = new Node();
   saturnLineOrbitNode.localMatrix = m4.translation(0,0,0);
  
  //Anel do Saturno
  var saturnRingOrbitNode = new Node();
  saturnRingOrbitNode.localMatrix = m4.translation(220,0,0);

  //Urano
  var uranusOrbitNode = new Node();
  uranusOrbitNode.localMatrix = m4.translation(260,0,0);
  
  //Neturno
  var neptureOrbitNode = new Node();
  neptureOrbitNode.localMatrix = m4.translation(300,0,0);
  
  //Plutão
  var plutoOrbitNode = new Node();
  plutoOrbitNode.localMatrix = m4.translation(340,0,0);

  //Lua Io 
  var ioMoonOrbitNode = new Node();
  ioMoonOrbitNode.localMatrix = m4.translation(56,0,0);
  //Lua Europa
  var europaMoonOrbitNode = new Node();
  europaMoonOrbitNode.localMatrix = m4.translation(56,0,25);
  
  //Lua Mimas 
  var mimasMoonOrbitNode = new Node();
  mimasMoonOrbitNode.localMatrix = m4.translation(68,0,0);

  //Cometa Halley
  var halleyOrbitNode = new Node();
  halleyOrbitNode.localMatrix = m4.translation(85,0,0);
  var halleyLineOrbitNode = new Node();
  halleyLineOrbitNode.localMatrix = m4.translation(0,0,0);

  var sunNode = new Node();
  sunNode.localMatrix = m4.scaling(4, 4, 4);  // sun a the center
  sunNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.6, 0.6, 0, 1], // yellow
      u_colorMult:   [0.4, 0.4, 0, 1],
     // u_texture: textures.sun,
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
    vertexArray: sphereVAO,
  };

  var earthNode = new Node();
  // make the earth twice as large
  earthNode.localMatrix = m4.scaling(1, 1, 1);   // make the earth twice as large
  earthNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.2, 0.5, 0.8, 1],  // blue-green
      u_colorMult:   [0.8, 0.5, 0.2, 1],
     // u_texture: textures.earth,
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
    vertexArray: sphereVAO,
  };

  var moonNode = new Node();
  moonNode.localMatrix = m4.scaling(0.7, 0.7, 0.7);
  moonNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.6, 0.6, 0.6, 1],  // gray
      u_colorMult:   [0.1, 0.1, 0.1, 1],
     //u_texture:textures.moon,
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
    vertexArray: sphereVAO,
  };
  
  var mercuryNode = new Node();
  mercuryNode.localMatrix = m4.scaling(0.5,0.5,0.5);
  mercuryNode.drawInfo = {
    uniforms: {
      u_colorOffset:[0.2, 0.5, 0.5, 1], //black-blue
      u_colorMult:  [0.6, 0.1, 0.1, 1],
    //u_texture:textures.mercury,
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  }; 
  
  var venusNode = new Node();
  venusNode.localMatrix = m4.scaling(0.7,0.7,0.7);
  venusNode.drawInfo = {
    uniforms: {
      u_colorOffset: [255, 165, 0.0, 255], //orange
      u_colorMult:  [0.7, 0.7, 0.7, 7],
    // u_texture:textures.venus,
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  };

  var marsNode = new Node();
  marsNode.localMatrix = m4.scaling(0.9,0.9,0.9);
  marsNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.3,-0.3,-3,0.3], //red
      u_colorMult:  [0.6, 0.1, 0.1, 1],
     // u_textures:textures.mars,
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  };

  var jupiterNode = new Node();
  jupiterNode.localMatrix = m4.scaling(0.7,0.7,0.7);
  jupiterNode.drawInfo = {
    uniforms: {
      u_colorOffset:  [0.2, 0.5, 0.8, 1], //blue-green
      u_colorMult:  [0.6, 0.4, 0.2, 1],
    //  u_texture:textures.jupiter,
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  };
 
  
  var saturnNode = new Node();
  saturnNode.localMatrix = m4.scaling(1.4,1.4,1.4);
  saturnNode.drawInfo = {
    uniforms: {
      u_colorOffset: [1, 0.8,0.2, 1], //yellow
      u_colorMult:  [0.4, 0.4, 0.4, 1],
    //  u_texture:textures.saturn,
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  };
  
  var saturnRingNode = new Node();
  saturnRingNode.localMatrix = m4.scaling(0.6, 0.5, 1.5);
  saturnRingNode.drawInfo = {
    uniforms: {
      u_colorOffset:  [2, 1, 0.5, 1],
      u_colorMult:  [0.2, 0.4, 0.4, 1],
    },
      programInfo: programInfo,
      bufferInfo: orbitaBufferInfo,
      vertexArray: orbitaVAO,
  };

  var uranusNode = new Node();
  uranusNode.localMatrix = m4.scaling(0.7,0.7,0.7);
  uranusNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.2, 0.5, 0.9, 1], //blue-green
      u_colorMult:  [0.6, 0.1, 0.1, 1],
     // u_texture:textures.uranus,
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  };
  
  var neptureNode = new Node();
  neptureNode.localMatrix = m4.scaling(0.7,0.7,0.7);
  neptureNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.5, 0.5, 0.9, 1], //blue
      u_colorMult:  [0.6, 0.1, 0.1, 1],
    //  u_texture:textures.nepture,
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  };
  
  var plutoNode = new Node();
  plutoNode.localMatrix = m4.scaling(0.7,0.7,0.7);
  plutoNode.drawInfo = {
    uniforms: {
      u_colorOffset: [-0.2,0.5,0.9,1],  //blue
      u_colorMult:  [0.6, 0.1, 0.1, 1],
     // u_texture:textures.pluto,
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  };

  var ioMoonNode = new Node();
  ioMoonNode.localMatrix = m4.scaling(0.7,0.7,0.7);
  ioMoonNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.8, 0.3, 0.1, 1],  //orange
      u_colorMult:  [0.6, 0.1, 0.1, 1],
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  };

  var europaMoonNode = new Node();
  europaMoonNode.localMatrix = m4.scaling(0.7,0.7,0.7);
  europaMoonNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.6, 0.6, 0.6, 1],
      u_colorMult:  [0.6, 0.1, 0.1, 1],
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  };

  var mimasMoonNode = new Node();
  mimasMoonNode.localMatrix = m4.scaling(0.7,0.7,0.7);
  mimasMoonNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.6, 0.6,0.6, 1],  //gray
      u_colorMult:  [0.2, 0.1, 0.1, 1],
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  };

  var halleyNode = new Node();
  halleyNode.localMatrix = m4.scaling(0.7,0.7,0.7);
  halleyNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.3, 0.2, 0.6, 1], //pink
      u_colorMult:   [0.9, 0.2, 0.9, 1],
    },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
  };
  
  var halleyLineNode = new Node();
  halleyLineNode.localMatrix = m4.scaling(4.53, 0.83, 0.83);   
  halleyLineNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0, 0, 0, 0], 
      u_colorMult:   [0, 0, 0, 0],
    },
    programInfo: programInfo,
    bufferInfo: orbita,
    vertexArray: torusVAO,
  };

  var mercuryOrbit = new Node();
    mercuryOrbit.localMatrix = m4.scaling(0.55, 0.55, 0.55);   
    mercuryOrbit.drawInfo = {
      uniforms: {
        u_colorOffset: [0, 0, 0, 0],  
        u_colorMult:   [0, 0, 0, 0],
      },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  }; 

  var venusOrbit = new Node();
    venusOrbit.localMatrix = m4.scaling(1.55, 1.55, 1.55);   
    venusOrbit.drawInfo = {
      uniforms: {
        u_colorOffset: [0, 0, 0, 0], 
        u_colorMult:   [0, 0, 0, 0],
      },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };

   var earthOrbit = new Node();
    earthOrbit.localMatrix = m4.scaling(2.55, 2.55, 2.55);   
    earthOrbit.drawInfo = {
      uniforms: {
        u_colorOffset: [0, 0, 0, 0],  
        u_colorMult:   [0, 0, 0, 0],
      },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };

  var marsOrbit = new Node();
    marsOrbit.localMatrix = m4.scaling(3.55, 3.55, 3.55);   
    marsOrbit.drawInfo = {
      uniforms: {
        u_colorOffset: [0, 0, 0, 0],  
        u_colorMult:   [0, 0, 0, 0],
      },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };

  var jupiterOrbit = new Node();
    jupiterOrbit.localMatrix = m4.scaling(4.55, 4.55, 4.55);  
    jupiterOrbit.drawInfo = {
      uniforms: {
        u_colorOffset: [0, 0, 0, 0], 
        u_colorMult:   [0, 0, 0, 0],
      },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };

  var saturnOrbit = new Node();
    saturnOrbit.localMatrix = m4.scaling(5.55, 5.55, 5.55);   
    saturnOrbit.drawInfo = {
      uniforms: {
        u_colorOffset: [0, 0, 0, 0],  
        u_colorMult:   [0, 0, 0, 0],
      },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };
  
   var uranusOrbit = new Node();
    uranusOrbit.localMatrix = m4.scaling(6.55, 6.55, 6.55);  
    uranusOrbit.drawInfo = {
      uniforms: {
        u_colorOffset: [0, 0, 0, 0],  
        u_colorMult:   [0, 0, 0, 0],
      },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };
  

  var neptuneOrbit = new Node();
    neptuneOrbit.localMatrix = m4.scaling(7.55, 7.55, 7.55);  
    neptuneOrbit.drawInfo = {
      uniforms: {
        u_colorOffset: [0, 0, 0, 0], 
        u_colorMult:   [0, 0, 0, 0],
      },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };


  var plutoOrbit = new Node();
    plutoOrbit.localMatrix = m4.scaling(8.55, 8.55, 8.55);   
    plutoOrbit.drawInfo = {
      uniforms: {
        u_colorOffset: [0, 0, 0, 0],  
        u_colorMult:   [0, 0, 0, 0],
      },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };
  
  
  var ioMoonOrbit = new Node();
  ioMoonOrbit.localMatrix = m4.scaling(1.5, 1.5, 1.5);
  ioMoonOrbit.drawInfo = {
    uniforms: {
      u_colorOffset: [0,0,0,0], 
      u_colorMult:  [0, 0, 0, 0],
    },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };

  var europaMoonOrbit = new Node();
  europaMoonOrbit.localMatrix = m4.scaling(1.5, 1.5, 1.5);
  europaMoonOrbit.drawInfo = {
    uniforms: {
      u_colorOffset: [0,0,0,0], 
      u_colorMult:  [0, 0, 0, 0],
    },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };

  var mimasMoonOrbit = new Node();
  mimasMoonOrbit.localMatrix = m4.scaling(1.7, 1.7, 1.7);
  mimasMoonOrbit.drawInfo = {
    uniforms: {
      u_colorOffset: [0, 0, 0, 0], 
      u_colorMult:  [0, 0, 0, 0],
    },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };

  var halleyOrbit = new Node();
  halleyOrbit.localMatrix = m4.scaling(4.53, 0.83, 0.83);
  halleyOrbit.drawInfo = {
    uniforms: {
      u_colorOffset: [0, 0, 0, 0],  
      u_colorMult:  [0, 0, 0, 0],
    },
      programInfo: programInfo,
      bufferInfo: orbita,
      vertexArray: torusVAO,
  };

  // connect the celetial objects
  sunNode.setParent(solarSystemNode);
  
  earthOrbitNode.setParent(solarSystemNode);
  earthNode.setParent(earthOrbitNode);
  earthOrbit.setParent(solarSystemNode);
  
  moonOrbitNode.setParent(earthOrbitNode);
  moonNode.setParent(moonOrbitNode);
  
  mercuryOrbitNode.setParent(solarSystemNode);
  mercuryNode.setParent(mercuryOrbitNode);
  mercuryOrbit.setParent(solarSystemNode);
  
  venusOrbitNode.setParent(solarSystemNode);
  venusOrbit.setParent(solarSystemNode);
  venusNode.setParent(venusOrbitNode);
  
  marsOrbitNode.setParent(solarSystemNode);
  marsOrbit.setParent(solarSystemNode);
  marsNode.setParent(marsOrbitNode);
  
  jupiterOrbitNode.setParent(solarSystemNode);
  jupiterOrbit.setParent(solarSystemNode);
  jupiterNode.setParent(jupiterOrbitNode);
  
  saturnOrbitNode.setParent(solarSystemNode);
  saturnNode.setParent(saturnOrbitNode);
  saturnLineOrbitNode.setParent(solarSystemNode);
  saturnOrbit.setParent(saturnLineOrbitNode);
  
  saturnRingOrbitNode.setParent(solarSystemNode);
  saturnRingNode.setParent(saturnRingOrbitNode);

  uranusOrbitNode.setParent(solarSystemNode);
  uranusOrbit.setParent(solarSystemNode);
  uranusNode.setParent(uranusOrbitNode);
  
  neptureOrbitNode.setParent(solarSystemNode);
  neptuneOrbit.setParent(solarSystemNode);
  neptureNode.setParent(neptureOrbitNode);
  
  plutoOrbitNode.setParent(solarSystemNode);
  plutoOrbit.setParent(solarSystemNode);
  plutoNode.setParent(plutoOrbitNode);
  
  ioMoonOrbitNode.setParent(jupiterOrbitNode);
  ioMoonNode.setParent(ioMoonOrbitNode);
  ioMoonOrbit.setParent(jupiterOrbitNode);
  
  europaMoonOrbitNode.setParent(jupiterOrbitNode);
  europaMoonNode.setParent(europaMoonOrbitNode);
  europaMoonOrbit.setParent(jupiterOrbitNode);
  
  mimasMoonOrbit.setParent(saturnOrbitNode);
  mimasMoonNode.setParent(mimasMoonOrbitNode);
  mimasMoonOrbitNode.setParent(saturnOrbitNode);
  
  halleyOrbitNode.setParent(solarSystemNode);
  halleyNode.setParent(halleyOrbitNode);
  halleyLineOrbitNode.setParent(solarSystemNode);
  halleyLineNode.setParent(halleyLineOrbitNode);
  
  
  var objects = [
    sunNode,
    earthNode,
    earthOrbit,
    moonNode,
    marsNode,
    marsOrbit,
    jupiterNode,
    jupiterOrbit,
    mercuryNode,
    mercuryOrbit,
    venusNode,
    venusOrbit,
    saturnNode,
    saturnOrbit,
    saturnRingNode,
    uranusNode,
    uranusOrbit,
    neptureNode,
    neptuneOrbit,
    plutoNode,
    plutoOrbit,
    ioMoonNode,
    ioMoonOrbit,
    europaMoonNode,
    europaMoonOrbit,
    mimasMoonNode,
    mimasMoonOrbit,
    halleyNode,
    halleyLineNode,
   ];

  var objectsToDraw = [
    sunNode.drawInfo,
    earthNode.drawInfo,
    earthOrbit.drawInfo,
    moonNode.drawInfo,
    marsOrbit.drawInfo,
    marsNode.drawInfo,
    jupiterNode.drawInfo,
    jupiterOrbit.drawInfo,
    mercuryNode.drawInfo,
    mercuryOrbit.drawInfo,
    venusNode.drawInfo,
    venusOrbit.drawInfo,
    saturnNode.drawInfo,
    saturnOrbit.drawInfo,
    saturnRingNode.drawInfo,
    uranusNode.drawInfo,
    uranusOrbit.drawInfo,
    neptureNode.drawInfo,
    neptuneOrbit.drawInfo,
    plutoNode.drawInfo,
    plutoOrbit.drawInfo,
    ioMoonNode.drawInfo,
    ioMoonOrbit.drawInfo,
    europaMoonNode.drawInfo,
    europaMoonOrbit.drawInfo,
    mimasMoonNode.drawInfo,
    mimasMoonOrbit.drawInfo,
    halleyNode.drawInfo,
    halleyLineNode.drawInfo,
  ];


  requestAnimationFrame(drawScene);
  // Planets Translation Speed in Km/s ^-4 
  //Source: by Wikipedia
  var tMercurio = 0.0047, tVenus = 0.0035, tTerra = 0.0029, tMarte = 0.0024, tJupiter = 0.0013, tSaturno =  0.0009, tUrano = 0.0006, tNetuno = 0.0005, tPlutao = 0.0004;


  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

   // First let's make some variables
  // to hold the translation,
  var fieldOfViewRadians = degToRad(60);
  var cameraAngleRadians = degToRad(0);
  var velocidadeInicial = [0,0,0];
  var cameraPosition = [100, 400, 0];
  var target = [0, 0, 0];
  var up = [0, 0, 1];

//  drawScene();
  requestAnimationFrame(drawScene);

  // Setup a ui.
  webglLessonsUI.setupSlider("#CameraX", {slide: alteraCameraX(0), min: -1000, max: 1000});
  webglLessonsUI.setupSlider("#CameraY", {slide: alteraCameraY(1), min: -1000, max: 1200});
  webglLessonsUI.setupSlider("#CameraZ", {slide: alteraCameraZ(2), min: -1000, max: 1000}); 
  webglLessonsUI.setupSlider("#Tempo_Mercurio", {slide: updateTempoMercurio(tMercurio), min:-0.00001, max: 100.00, step:0.001});
  webglLessonsUI.setupSlider("#Tempo_Venus", {slide: updateTempoVenus(tVenus), min:-0.00001, max: 100.00, step:0.001});
  webglLessonsUI.setupSlider("#Tempo_Terra", {slide: updateTempoTerra(tTerra), min:-0.00001, max: 10.000, step:0.001});
  webglLessonsUI.setupSlider("#Tempo_Marte", {slide: updateTempoMarte(tMarte), min:-0.00001, max: 10.000, step:0.001});
  webglLessonsUI.setupSlider("#Tempo_Jupiter", {slide: updateTempoJupiter(tJupiter), min:-0.00001, max: 100.00, step:0.001});
  webglLessonsUI.setupSlider("#Tempo_Saturno", {slide: updateTempoSaturno(tSaturno), min:-0.00001, max: 10.000, step:0.001});
  webglLessonsUI.setupSlider("#Tempo_Urano", {slide: updateTempoUrano(tUrano), min:-0.00001, max: 10.000, step:0.001});
  webglLessonsUI.setupSlider("#Tempo_Netuno", {slide: updateTempoNetuno(tNetuno), min:0.00001, max: 10.000, step:0.001});
  webglLessonsUI.setupSlider("#Tempo_Plutao", {slide: updateTempoPlutao(tPlutao), min:-0.00001, max: 10.000, step:0.001});
  
  function updateTempoMercurio(event,ui) {
      return function(event, ui) {
         tMercurio = 0.0047 * ui.value;
      }
    }

  function updateTempoVenus(event,ui) {
      return function(event, ui) {
         tVenus = 0.0035 * ui.value;
      }
    }

  function updateTempoTerra(event,ui) {
      return function(event, ui) {
         tTerra = 0.0029 * ui.value;
      }
    }

  function updateTempoMarte(event,ui) {
      return function(event, ui) {
         tMarte = 0.0024 *ui.value;
      }
    }

   function updateTempoJupiter(event,ui) {
      return function(event, ui) {
         tJupiter =  0.0013 * ui.value;
      }
    }

    function updateTempoSaturno(event,ui) {
      return function(event, ui) {
         tSaturno = 0.0009 * ui.value;
      }
    }

    function updateTempoUrano(event,ui) {
      return function(event, ui) {
         tUrano = 0.0006 * ui.value;
      }
    }

    function updateTempoNetuno(event,ui) {
      return function(event, ui) {
         tNetuno = 0.0005 * ui.value;
      }
    }

    function updateTempoPlutao(event,ui) {
      return function(event, ui) {
         tPlutao = 0.0004 * ui.value;
      }
    }

    function alteraCameraX(index){
      return function(event,ui){
        cameraPosition[index] = ui.value;
        target[index] = ui.value;
      }
    }
 
    function alteraCameraY(index){
      return function(event,ui){
        cameraPosition[index] = ui.value;
      }
     }

    function alteraCameraZ(index){
      return function(event,ui){
        cameraPosition[index] = ui.value;
      }
    }

  var then = 0;

  // Draw the scene.
  function drawScene(time) {
    time *= 0.001;

    //var deltaTime = now - then;
    //then = time;
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas AND the depth buffer.
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
   // var cameraPosition = [0, -200, 0];
    //var target = [0, 0, 0];
    //var up = [0, 0, 1];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // update the local matrices for each object.
    m4.multiply(m4.yRotation(tTerra),earthOrbitNode.localMatrix, earthOrbitNode.localMatrix);
    m4.multiply(m4.yRotation(0.001),moonOrbitNode.localMatrix, moonOrbitNode.localMatrix);
    m4.multiply(m4.yRotation(tMercurio),mercuryOrbitNode.localMatrix,mercuryOrbitNode.localMatrix);           
    m4.multiply(m4.yRotation(tVenus),venusOrbitNode.localMatrix,venusOrbitNode.localMatrix); 
    m4.multiply(m4.yRotation(tMarte),marsOrbitNode.localMatrix,marsOrbitNode.localMatrix);   
    m4.multiply(m4.yRotation(tJupiter),jupiterOrbitNode.localMatrix,jupiterOrbitNode.localMatrix);                           
    m4.multiply(m4.yRotation(tSaturno),saturnOrbitNode.localMatrix,saturnOrbitNode.localMatrix);
   m4.multiply(m4.yRotation(tSaturno),saturnRingOrbitNode.localMatrix,saturnRingOrbitNode.localMatrix);
    m4.multiply(m4.yRotation(tUrano),uranusOrbitNode.localMatrix,uranusOrbitNode.localMatrix);               
    m4.multiply(m4.yRotation(tNetuno),neptureOrbitNode.localMatrix,neptureOrbitNode.localMatrix);
    m4.multiply(m4.yRotation(tPlutao),plutoOrbitNode.localMatrix,plutoOrbitNode.localMatrix);
    m4.multiply(m4.yRotation(tJupiter),ioMoonOrbitNode.localMatrix,ioMoonOrbitNode.localMatrix);
    m4.multiply(m4.yRotation(tJupiter),europaMoonOrbitNode.localMatrix,europaMoonOrbitNode.localMatrix);
    m4.multiply(m4.yRotation(tSaturno),mimasMoonOrbitNode.localMatrix,mimasMoonOrbitNode.localMatrix);
    m4.multiply(m4.yRotation(0.005),halleyOrbitNode.localMatrix,halleyOrbitNode.localMatrix);

    // spin the sun
    m4.multiply(m4.yRotation(0.005), sunNode.localMatrix, sunNode.localMatrix);
    // spin the earth
    m4.multiply(m4.yRotation(0.005), earthNode.localMatrix, earthNode.localMatrix);
    // spin the moon
    m4.multiply(m4.yRotation(-0.001), moonNode.localMatrix, moonNode.localMatrix);
    //spin the mars planet
    m4.multiply(m4.yRotation(-0.002),marsNode.localMatrix,marsNode.localMatrix); 
    //spin the jupiter planet
    m4.multiply(m4.yRotation(-0.005),jupiterNode.localMatrix,jupiterNode.localMatrix);
    //spin the mercury planet
     m4.multiply(m4.yRotation(-0.002),mercuryNode.localMatrix,mercuryNode.localMatrix);
    //spin the venus planet
     m4.multiply(m4.yRotation(-0.002),venusNode.localMatrix,venusNode.localMatrix);
    //spin the saturn planet
     m4.multiply(m4.yRotation(-0.002),saturnNode.localMatrix,saturnNode.localMatrix);
 m4.multiply(m4.yRotation(-0.002),saturnRingNode.localMatrix,saturnRingNode.localMatrix);
    
    //spin the uranus planet    
    m4.multiply(m4.yRotation(-0.014),uranusNode.localMatrix,uranusNode.localMatrix);
    //spin the nepture planet
     m4.multiply(m4.yRotation(-0.012),neptureNode.localMatrix,neptureNode.localMatrix);
    //spin the pluto planet
     m4.multiply(m4.yRotation(-0.002),plutoNode.localMatrix,plutoNode.localMatrix);
    //spin the moon io
     m4.multiply(m4.yRotation(-0.002),ioMoonNode.localMatrix,ioMoonNode.localMatrix);
    //spin the moon europa
     m4.multiply(m4.yRotation(-0.002),europaMoonNode.localMatrix,europaMoonNode.localMatrix);
    //spin the moon mimas
     m4.multiply(m4.yRotation(-0.002),mimasMoonNode.localMatrix,mimasMoonNode.localMatrix);
    //spin the comet halley
     m4.multiply(m4.yRotation(-0.002),halleyNode.localMatrix,halleyNode.localMatrix);

    // Update all world matrices in the scene graph
    solarSystemNode.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(function(object) {
        object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
    });

    // ------ Draw the objects --------

    twgl.drawObjectList(gl, objectsToDraw);

    requestAnimationFrame(drawScene);
  }
}

main();
