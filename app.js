/* Autor: Kevin Daniel Guzman Delgadillo
 * Fecha: 2017-12-19
 * Descripcion: Script juego de la vida
**/
var ANCHOCELULA = 10;
var ALTOCELULA = 10;
var ELEMENTOCANVAS = 'tablero';
var TIEMPOANIMACION = 1000 / 2;
var Juego = /** @class */ (function () {
    function Juego() {
        var _this = this;
        this.dimensiones = { ancho: 0, alto: 0 };
        this.celula = { ancho: 0, alto: 0, cantidadX: 0, cantidadY: 0 };
        this.iniciarMotor = function () {
            _this.limpiar();
            _this.dibujar();
            _this.actualizar();
            setTimeout(_this.iniciarMotor, TIEMPOANIMACION);
        };
        this.elementoHTML = document.getElementById(ELEMENTOCANVAS);
        this.contexto = this.elementoHTML.getContext('2d');
        this.dimensiones = { ancho: this.elementoHTML.width, alto: this.elementoHTML.height };
        this.celula = { ancho: ANCHOCELULA, alto: ALTOCELULA, cantidadX: (this.dimensiones.ancho / ANCHOCELULA), cantidadY: (this.dimensiones.alto / ALTOCELULA) };
        // Inicalizacion de matrices
        this.mundo = [];
        this.buffer = [];
    }
    Juego.prototype.iniciar = function () {
        console.log('Iniciando juego...');
        this.iniciarMatrices();
        this.iniciarMotor();
    };
    Juego.prototype.dibujar = function () {
        for (var i = 0; i < this.celula.cantidadX; i++) {
            for (var j = 0; j < this.celula.cantidadY; j++) {
                if (this.mundo[i][j] === 1) {
                    this.contexto.fillRect(this.celula.ancho * i, this.celula.alto * j, this.celula.ancho - 1, this.celula.alto - 1);
                }
            }
        }
    };
    Juego.prototype.actualizar = function () {
        this.copiarEnBuffer();
        this.obtenerVecinos();
        this.evaluarMatrizMundo();
        this.cargarBuffer();
    };
    Juego.prototype.cargarBuffer = function () {
        for (var i = 0; i < this.celula.cantidadX; i++) {
            for (var j = 0; j < this.celula.cantidadY; j++) {
                this.mundo[i][j] = this.buffer[i][j];
            }
        }
    };
    Juego.prototype.evaluarMatrizMundo = function () {
        for (var i = 0; i < this.celula.cantidadX; i++) {
            for (var j = 0; j < this.celula.cantidadY; j++) {
                this.buffer[i][j] = this.aplicarReglas(this.buffer[i][j], this.mundo[i][j]);
            }
        }
    };
    Juego.prototype.aplicarReglas = function (cantidadVecinos, estado) {
        if (estado === 1 && cantidadVecinos >= 2 && cantidadVecinos <= 3) {
            return 1;
        }
        else {
            if (estado === 0 && cantidadVecinos === 3) {
                return 1;
            }
        }
        return 0;
    };
    Juego.prototype.copiarEnBuffer = function () {
        for (var i = 0; i < this.celula.cantidadX; i++) {
            for (var j = 0; j < this.celula.cantidadY; j++) {
                this.buffer[i][j] = this.mundo[i][j];
            }
        }
    };
    Juego.prototype.obtenerVecinos = function () {
        for (var i = 0; i < this.celula.cantidadX; i++) {
            for (var j = 0; j < this.celula.cantidadY; j++) {
                this.buffer[i][j] = this.contarVecinos(i, j);
            }
        }
    };
    Juego.prototype.contarVecinos = function (posX, posY) {
        var cantidadVecinos = 0;
        for (var i = (posX - 1); i <= (posX + 1); i++) {
            for (var j = (posY - 1); j <= (posY + 1); j++) {
                if ((i !== posX || j !== posY) && this.mundo[this.evaluarLimites(this.celula.cantidadX, 0, i)][this.evaluarLimites(this.celula.cantidadY, 0, j)] === 1) {
                    cantidadVecinos++;
                }
            }
        }
        return cantidadVecinos;
    };
    Juego.prototype.evaluarLimites = function (max, min, valor) {
        if (valor > max - 1) {
            return min;
        }
        if (valor < min) {
            return max - 1;
        }
        return valor;
    };
    Juego.prototype.iniciarMatrices = function () {
        for (var i = 0; i < this.celula.cantidadX; i++) {
            this.mundo.push([]);
            this.buffer.push([]);
            for (var j = 0; j < this.celula.cantidadY; j++) {
                this.mundo[i][j] = this.generarAleatorio(0, 1);
                this.buffer[i][j] = 0;
            }
        }
    };
    Juego.prototype.limpiar = function () {
        this.contexto.clearRect(0, 0, this.dimensiones.ancho, this.dimensiones.alto);
    };
    Juego.prototype.generarAleatorio = function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    };
    return Juego;
}());
var juego = new Juego();
juego.iniciar();
