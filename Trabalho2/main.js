"use strict"

var tempo;
var corDisparo = "orange";
var AumentaVelocidadeJogo = 0.25;
var velocidadeJogo = 1.0;
var nivel = 0; 
var vida = 3;
var Ship;
var invaders;
var tempoFase = 0;
var level = 1;
var duracaoShake = 120;
var tempoInicialShake = 0;
var controlaPontuacao = new controlaPontuacao();
var vidaManager = new vidaManager();
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;


function inicializar() {
    menuInicial(); 
    invaders = new controlaInvaders();
    Ship = setNave();
    invaders.setInvaders();
    Ship.disparos = [];
}

inicializar();

function menuInicial() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font="bold 48px serif";
    ctx.fillStyle = 'white';
    ctx.textBaseline="center"; 
    ctx.textAlign="center"; 
    ctx.fillText("Space Invaders", canvas.width / 2, canvas.height/2 - 80); 
    ctx.font="bold 24px Arial";
    ctx.fillStyle="blue";

	ctx.fillText("Pressione S para iniciar", canvas.width / 2, canvas.height/2 - 30); 
}


function loop() {
	if(nivel==1){
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
    		
    controlaPontuacao.desenhaPontuacao();

    vidaManager.desenhaVidas();
		atualizaNave(); //movimenta nave
    invaders.atualizaInvaders();
    preShake(); 
    desenhaNave();
    verificaColisoes();
    invaders.desenhaInvaders();
    postShake();
        
    //verifica se todos os Invaders morreram
    if (invadersDead >= invaders.rowInvaders*invaders.colInvaders) {
      nivel = 4;
      invadersDead = 0;
    }
	}else if (nivel == 3) { //GAME OVER
    vida--;
    ctx.font="bold 64px Arial";
    ctx.fillStyle = "blue";
    ctx.textAlign="center"; 
    ctx.font="bold 44px Arial";
    ctx.fillText("GAME 0VER", canvas.width/2, canvas.height/2- 120);
  
  } else if (nivel == 4) { //NEXT LEVEL
    if (tempoFase == 0) {
      level++;
      velocidadeJogo += AumentaVelocidadeJogo;
      tempoFase = new Date().getTime();
    }

    if (new Date().getTime() > tempoFase + 2000) {
      nivel = 1;
      inicializar();
      tempoFase = 0;
    } else {
      ctx.strokeStyle = "white";
      ctx.font="bold 64px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign="center"; 
      ctx.fillStyle = "white";
      ctx.font="bold 44px Arial";
      ctx.fillText("FASE C0MPLETA", canvas.width/2, canvas.height/2-120);
    }
  }
}

function imprimirPausa() {
    ctx.font="bold 64px Arial";
    ctx.fillStyle = '#0000ff';
    ctx.textBaseline="center"; 
    ctx.textAlign="center"; 
    ctx.fillText("Pausado", canvas.width / 2, canvas.height/2 - 120); 
    ctx.font="bold 24px Arial";

}

function verificaColisoes(){
    for(var i in Ship.disparos){
        var disparo = Ship.disparos[i];
        var colisao = invaders.verificaColisoes(disparo.x, disparo.y, disparo.width, disparo.length);
        if(colisao == true){ //verifica se ocorreu alguma colisão
 		    // 	delete Ship.disparos[i];  
			    Ship.disparos.splice(i, 1); //remove disparo i da lista
        }
    }
}

//Balanca a tela quando o disparo é efetuado no invader
//https://stackoverflow.com/questions/28023696/html-canvas-animation-which-incorporates-a-shaking-effect
function preShake() {
  if (tempoInicialShake == 0) 
    return;
  var deltaTime = Date.now()-tempoInicialShake;
  if (deltaTime > duracaoShake) {
      tempoInicialShake = 0; 
      return;
  }
  ctx.save();  
  var dx = Math.random()*10;
  var dy = Math.random()*10;
  ctx.translate(dx, dy);  
}

function postShake() {
  if (tempoInicialShake ==0) 
    return;
  ctx.restore();
}

function startShake() {
   tempoInicialShake=Date.now();
}

