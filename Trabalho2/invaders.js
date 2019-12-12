var img = document.getElementById("invader");
var pontos = 10; 
var widthInvader = 50;
var lengthInvader = 50;
var invadersDead = 0;

function invader(x, y) {
	this.x = x;
	this.y = y;
	this.width = widthInvader;
	this.length = lengthInvader;
	this.alive = true;
	this.cor = "red";
	this.velocidade = 3;
	this.disparo = new disparoInvader();  
	this.tempoDisparo = -10;

	//Função que movimenta os Invaders
	this.atualizaInvader = function(moveDir, vertical) {
		this.disparo.atualizaDisparo();
		this.verificaColisao();
		if (!this.alive) return;
		if(vertical)
			this.y += (this.velocidade-1.5)*velocidadeJogo;
		else
			if(moveDir)
				this.x += this.velocidade*velocidadeJogo;
			else
				this.x -= this.velocidade*velocidadeJogo;
	};

	//desenha o Invader e o disparo
	this.desenhaInvader = function() {
		if (this.alive) {
			ctx.drawImage(img, this.x, this.y, 50, 50);
		}
		this.disparo.desenhaDisparo();
	};

	this.atualizaDisparo = function() {
		if (this.tempoDisparo <= 0) {
			this.recarregarDisparo();
		}
		if (this.disparo.alive) 
		    return; //Only one shot alive
		if (this.tempoDisparo < new Date().getTime()) {
			this.disparo.disparar(this.x, this.y);
			this.recarregarDisparo();
		}
	};
    
    //determina quantidade de disparos dados pelos Invaderde uma unica vez
	this.recarregarDisparo = function() {
		this.tempoDisparo = new Date().getTime() + (Math.floor(Math.random() * 6)*2000 + 900)/velocidadeJogo;
	};

	this.verificaColisao = function() {
		if (Ship.x < this.x + this.width && Ship.x + Ship.width > this.x && Ship.y < this.y + this.length && Ship.y + Ship.length > this.y) {
		    //vidaManager =  diminueVida(1);
			nivel = 3;
		}
	}
}

function disparoInvader() {
	this.x = 0 + widthInvader/2;
	this.y = 0 + lengthInvader + 2;

	this.width= 10;
	this.length= 10;

	this.alive = false;
	this.velocidade = 5;

	this.disparar = function(x, y) {
		this.alive = true;
		this.x = x + widthInvader/2;
		this.y = y + lengthInvader;
	};

	this.atualizaDisparo = function() {
		if (!this.alive) 
			return;
		this.y += this.velocidade*velocidadeJogo; 
		if (this.y > canvas.width) {
			this.alive = false;
		}
		this.verificaColisao();
	};

	this.desenhaDisparo = function() {
		if (this.alive) {
			ctx.fillStyle = "red";
			ctx.fillRect(this.x, this.y, this.width, this.length)
		}
	};

	this.verificaColisao = function() {
		//verifica se nave foi atingida por um disparo
		if (Ship.x < this.x + this.width && Ship.x + Ship.width > this.x && Ship.y < this.y + this.length && Ship.y + Ship.length > this.y) {
		    vidaManager.diminueVida(1);
			nivel = 3;
		}
	};
}

function controlaInvaders(){
	var invaders = [];
	var moveDir = true; 
	var mudaDirecao = false;
	var tempoVertical = 200; 
	var then = 0;

	this.rowInvaders = 8; //qtd de Invaders por linhas 
	this.colInvaders = 4; //qtd de Invaders por colunas 

    //define posicionamento dos Invaders 
	this.setInvaders = function() {
		var posX = 30; 
		var posY = 20;
		for(var j = 0; j < this.colInvaders; ++j){ 
			invaders[j]= [];
			for(var i = 0; i < this.rowInvaders; ++i){
				invaders[j][i] = new invader(posX, posY);
				posX += invaders[j][i].width+50;
			}
			posY+=70;
			posX = 30;
		}
	}
	//atualiza posição dos invaders
	this.atualizaInvaders = function(){
		var now = new Date().getTime();
		const deltaTime = now - then;
		if(deltaTime < tempoVertical)
			this.moveVertical();
		else
			this.moveLados(); 

		if(mudaDirecao == true){
			moveDir = !moveDir;
			mudaDirecao = false;
			then = new Date().getTime();
		}

		for (var i = 0; i < this.rowInvaders; i++) {
			var j = invaders.length - 1;
			while (!invaders[j][i].alive && j > 0) {
				j--; //diminui qtd de invaders ao ser atingido por um disparo
			}
			if (!invaders[j][i].alive){
				continue;
			}
			invaders[j][i].atualizaDisparo();
			
		}
	}

	//move Invaders para as laterais da tela
	this.moveLados = function() {
		for(var j = 0; j < invaders.length; ++j){
			for(var i = 0; i < invaders[j].length; ++i){
				invaders[j][i].atualizaInvader(moveDir, false);
				//se a posição do invader for maior do que o tamanho das laterais da tela, muda de direção
				if(invaders[j][i].x >= canvas.width - 60){ 
					mudaDirecao = true;
				}else if(invaders[j][i].x <= 10){
					mudaDirecao = true;
				}
			}
		}
	}

	//move verticalmente os Invaders 
	this.moveVertical = function (){
		for(var j = 0; j < invaders.length; ++j){
			for(var i = 0; i < invaders[j].length; ++i){
				invaders[j][i].atualizaInvader(moveDir, true);
			}
		}
	}

	//desenha invaders
	this.desenhaInvaders = function(){
		for(var j=0; j<invaders.length; ++j){
			for(var i=0; i<invaders[j].length; ++i){
				invaders[j][i].desenhaInvader();
			}
		}
	}

    this.verificaColisoes = function(x, y, width, length) {
        for(var j = 0; j < invaders.length; j++)
			for(var i = 0; i < invaders[j].length; i++){
				if (!invaders[j][i].alive) //verifica se invader já não esta morto
					continue;
				//verifica se invaders foi atingido por algum disparo
                if(invaders[j][i].x < x + width && invaders[j][i].x + invaders[j][i].width > x && invaders[j][i].y < y + length && invaders[j][i].y + invaders[j][i].length > y){
                    invaders[j][i].alive = false; //muda status para morto, caso tenha sido atingido 
                    startShake();
                    controlaPontuacao.adicionaPontos(pontos);
                    invadersDead++; 
                    return true;
                }
            }
        return false; //não foi atingido 
    }
}
