var Ship = {
	x: 0,
	y: canvas.height,
	width: 40,
	length: 40,
	velocidade: 10,
	lateral: 20,
	lim_esq: 20,
	lim_dir: 0,
    img: document.getElementById("nave"),
	ultimoDisparo: 0,
	freqDisparo: 200,
	disparos: []
};

function setNave(){
	Ship.x = (canvas.width - 50)/2;
	Ship.y = canvas.height - Ship.length - Ship.lateral;
	Ship.lim_esq = Ship.lateral;
	Ship.lim_dir = canvas.width - Ship.width - Ship.lateral;
    return Ship;
}

function atualizaNave(){
	if (teclado.dir) {
		Ship.x += Ship.velocidade;
	}
	if (teclado.esq) {
		Ship.x -= Ship.velocidade;
	} 
	if(teclado.space) {
		disparar();
	}
	var lim_esq = Ship.lateral; //limite de tela pelo lado esquerdo

	if (Ship.x < Ship.lim_esq){
		Ship.x = Ship.lim_esq;
	}else if (Ship.x > Ship.lim_dir){
		Ship.x = Ship.lim_dir;
	}
}
function desenhaNave(){
    ctx.drawImage(Ship.img, Ship.x, Ship.y, Ship.width, Ship.length);

	//atualiza quantidade de disparos
	for(var j=0; j<Ship.disparos.length; j++){
		var disparo = Ship.disparos[j];
		disparo.atualizaDisparo();
		disparo.desenhaDisparo();
	}
}

function disparar(){
	//https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime
	var now = new Date().getTime();  // retorna o valor numérico correspondente ao horário da data especificada  
	if(Ship.ultimoDisparo === 0 || (now - Ship.ultimoDisparo) > (Ship.freqDisparo)){
		var novoDisparo = new disparo(Ship.x, Ship.y);
		novoDisparo.som.play(); // executa musica ao disparar tiro
		Ship.disparos.push(novoDisparo); //adiciona novo disparo ao array
		teclado.space = false;
		Ship.ultimoDisparo = now; //atualiza tempo do ultimo disparo
	}
}
