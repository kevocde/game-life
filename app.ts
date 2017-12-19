/* Autor: Kevin Daniel Guzman Delgadillo
 * Fecha: 2017-12-19
 * Descripcion: Script juego de la vida
**/

const ANCHOCELULA     = 10;
const ALTOCELULA      = 10;
const ELEMENTOCANVAS  = 'tablero';
const TIEMPOANIMACION = 1000/2;         

class Juego {
	private elementoHTML;
	private contexto;
	private dimensiones = { ancho: 0, alto: 0 };
	private celula       = { ancho: 0, alto: 0, cantidadX: 0, cantidadY: 0 };
	private mundo;
	private buffer;

	constructor() {
		this.elementoHTML = document.getElementById(ELEMENTOCANVAS);
		this.contexto     = this.elementoHTML.getContext('2d');
		this.dimensiones  = { ancho: this.elementoHTML.width, alto: this.elementoHTML.height };
		this.celula        = { ancho: ANCHOCELULA, alto: ALTOCELULA, cantidadX: (this.dimensiones.ancho / ANCHOCELULA), cantidadY: (this.dimensiones.alto / ALTOCELULA) };
		// Inicalizacion de matrices
		this.mundo        = [];
		this.buffer       = [];
	}

	public iniciar() {
		console.log('Iniciando juego...');
		this.iniciarMatrices();
		this.iniciarMotor();
	}

	public iniciarMotor = () => {
		this.limpiar();
		this.dibujar();
		this.actualizar();
		setTimeout(this.iniciarMotor, TIEMPOANIMACION);
	}

	public dibujar() {
		for(let i=0; i<this.celula.cantidadX; i++) {
			for(let j=0; j<this.celula.cantidadY; j++) {
				if(this.mundo[i][j] === 1) {
					this.contexto.fillRect(this.celula.ancho*i, this.celula.alto*j, this.celula.ancho-1, this.celula.alto-1);
				}
			}
		}
	}

	public actualizar() {
		this.copiarEnBuffer();
		this.obtenerVecinos();
		this.evaluarMatrizMundo();
		this.cargarBuffer();
	}

	public cargarBuffer() {
		for(let i=0; i<this.celula.cantidadX; i++) {
			for(let j=0; j<this.celula.cantidadY; j++) {
				this.mundo[i][j] = this.buffer[i][j];
			}
		}
	}

	public evaluarMatrizMundo() {
		for(let i=0; i<this.celula.cantidadX; i++) {
			for(let j=0; j<this.celula.cantidadY; j++) {
				this.buffer[i][j] = this.aplicarReglas(this.buffer[i][j], this.mundo[i][j]);
			}
		}
	}

	public aplicarReglas(cantidadVecinos, estado) {
		if(estado === 1 && cantidadVecinos >= 2 && cantidadVecinos <= 3) {
			return 1;
		}else {
			if(estado === 0 && cantidadVecinos === 3) {
				return 1;
			}
		}
		return 0;
	}

	public copiarEnBuffer() {
		for(let i=0; i<this.celula.cantidadX; i++) {
			for(let j=0; j<this.celula.cantidadY; j++) {
				this.buffer[i][j] = this.mundo[i][j];
			}
		}
	}

	public obtenerVecinos() {
		for(let i=0; i<this.celula.cantidadX; i++) {
			for(let j=0; j<this.celula.cantidadY; j++) {
				this.buffer[i][j] = this.contarVecinos(i, j);
			}
		}
	}

	public contarVecinos(posX, posY) {
		let cantidadVecinos = 0;
		for(let i=(posX-1); i<=(posX+1); i++) {
			for(let j=(posY-1); j<=(posY+1); j++) {
				if((i !== posX || j !== posY) && this.mundo[this.evaluarLimites(this.celula.cantidadX, 0, i)][this.evaluarLimites(this.celula.cantidadY, 0, j)] === 1) {
					cantidadVecinos ++;
				}
			}
		}
		return cantidadVecinos;
	}

	public evaluarLimites(max, min, valor) {
		if(valor > max-1) {
			return min;
		}
		if(valor < min) {
			return max-1;
		}
		return valor;
	}

	public iniciarMatrices() {
		for(let i=0; i<this.celula.cantidadX; i++) {
			this.mundo.push([]);
			this.buffer.push([]);
			for(let j=0; j<this.celula.cantidadY; j++) {
				this.mundo[i][j]  = this.generarAleatorio(0, 1);
				this.buffer[i][j] = 0;
			}
		}
	}

	public limpiar() {
		this.contexto.clearRect(0, 0, this.dimensiones.ancho, this.dimensiones.alto);
	}

	public generarAleatorio(min: number, max: number) {
		return Math.round(Math.random()*(max-min)+min);
	}
}

let juego = new Juego();
juego.iniciar();