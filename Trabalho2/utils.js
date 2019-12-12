document.addEventListener("keydown", controlaNave, false);
document.addEventListener("keyup", controlaTeclas, false);

var teclado = {
	dir: false,
	esq: false,
	space: false
};

function controlaNave(e) {
	switch(e.keyCode){
		case 39: //RIGHT ARROW
		     teclado.dir = true;
		     break;
		case 37: //LEFT ARROW
		     teclado.esq = true;
		     break;
		case 32: //SPACE
		     teclado.space = true;     
		     break;
	}
}

function controlaTeclas(e) {
	switch(e.keyCode){
		case 39: //RIGHT ARROW
		   teclado.dir = false; //key 39 release
		   break;
		case 37:  //LEFT ARROW
		   teclado.esq = false;  
		   break;
		case 32: //SPACE
		    teclado.space = false;     
		    break; 
		case 83: //TECLA S
            if(nivel == 0){ //verifica se jogo não foi iniciado ainda
			   tempo = setInterval(loop, 2000/60); //determina o tempo que os inimigos demoram para atravessar
			   nivel = 1; //jogo iniciado
		    }else if(nivel==2) { //verifica se o jogo foi pausado
		       nivel = 1;
		    } else if (nivel == 3) { //verifica se o jogo foi reiniciado
			   clearInterval(tempo);
			   velocidadeJogo = 2.0;
			   nivel = 0;
			   inicializar();
		    }
		   break;
		case 80: //TECLA P
           if(nivel == 1){ //verifica se o jogo foi iniciado
			  nivel = 2; //jogo pausado pelo usuário
			  imprimirPausa();
		   } 
		break;
	}
	
}                                           

function musica(src) {
    this.musica = document.createElement("audio");
    this.musica.src = src;
    this.musica.setAttribute("preload", "auto");
    this.musica.setAttribute("controls", "none");
    this.musica.style.display = "none";
    this.musica.volume=.3;
    document.body.appendChild(this.musica);
    this.play = function(){
        this.musica.play();
    }
    this.stop = function(){
        this.musica.pause();
    }
} 

function disparo(x, y) {
	this.x = x + 20; //posicionamento x do disparo
	this.y = y + 5; //posicionamento y do disparo
	this.width = 8;
	this.length= 9;

	this.cor = corDisparo; 
	this.velocidade = 5;
	this.som = new musica("shoot.wav");

	this.atualizaDisparo = function() { 
		this.y -= this.velocidade*velocidadeJogo; //atualiza posicao do tiro
	};

	this.desenhaDisparo = function() {
		ctx.fillStyle = this.cor;
		ctx.fillRect(this.x, this.y, this.width, this.length);
	};
};

function controlaPontuacao() {
	this.pontuacao = 0;
	
	this.adicionaPontos = function(pontos) {
		this.pontuacao += pontos;
	};

	this.desenhaPontuacao = function() {
		ctx.fillStyle = "white";
		ctx.font="bold 24px Arial";
		ctx.fillText("Pontuação: " + this.pontuacao, 100, canvas.height - 100);
	};
}; 

function vidaManager() {
	this.vida = 3;
	
	this.diminueVida= function(num) {
		if(this.vida > 0){
		   this.vida -= num;
	    }else{
	    	this.vida = 3;
	    }
	};

	this.desenhaVidas = function() {
		ctx.fillStyle = "white";
		ctx.font="bold 24px Arial";
		ctx.fillText("Vidas: " + this.vida, 90, canvas.height - 60);
	};
};    

