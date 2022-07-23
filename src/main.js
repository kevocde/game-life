/**
 * Life Game script
 * Created by: Kevin Guzmán (kevocde@gmail.com)
 */
var _ = require('lodash')


const BOARD_ID = 'tablero'
const TOGGLE_BTN_ID = 'btn-toggle'
const CELL_SIZE = 10
const ANIMATION_TIME = 1000/10

class Juego {
  constructor() {
    /** Control properties */
    this.toggleBtn = document.getElementById(TOGGLE_BTN_ID)
    this.htmlElement = document.getElementById(BOARD_ID)
    this.context = this.htmlElement.getContext('2d')

    /** Main properties */
    this.dimentions = {
      width: this.htmlElement.width, 
      height: this.htmlElement.height
    }
    this.cell = {
      width: CELL_SIZE, 
      height: CELL_SIZE,
      xCount: (this.dimentions.width / CELL_SIZE),
      yCount: (this.dimentions.height / CELL_SIZE),
    }

    /** World properties */
    this.world = []
    this.buffer = []
    this.timer = 0
  }

  initMatrix() {
    
  }


  init() {
    this.initMatrix()
    this.start()
  }
}