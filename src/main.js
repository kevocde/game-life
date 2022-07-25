/**
 * Life Game script
 * Created by: Kevin Guzmán (kevocde@gmail.com)
 */
require('./assets/main.css')

const _ = require('lodash')

const CELL_SIZE = 10
const ANIMATION_TIME = 1000/70
const BOARD_ID = 'main-board'
const TOGGLE_BTN_ID = 'toggle-btn'
const RESET_BTN_ID = 'reset-btn'

class Game {
  constructor() {
    /** Elements and Events */
    this.toggleBtn = document.getElementById(TOGGLE_BTN_ID)
    this.resetBtn = document.getElementById(RESET_BTN_ID)
    this.htmlElement = document.getElementById(BOARD_ID)
    this.context = this.htmlElement.getContext('2d')

    this.addEvents()
    this.defineStateProperties()
  }

  addEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', this.toggleAnimation.bind(this))
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', this.resetAnimation.bind(this))
    }
  }

  defineStateProperties() {
    this.requestAnimationId = null
    this.running = false
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
    this.world = this.generateAleatory(0, 1)
    this.buffer = this.generateAleatory()
  }

  toggleAnimation() {
    this.running = ! this.running

    if (this.running) {
      this.start()
      this.toggleBtn.innerText = 'Detener'
    } else {
      this.toggleBtn.innerText = 'Continuar'
    }
  }

  resetAnimation() {
    window.cancelAnimationFrame(this.requestAnimationId)

    this.world = this.generateAleatory(0, 1)
    this.buffer = this.generateAleatory()
    this.running = false
    this.toggleBtn.innerText = 'Iniciar'

    this.clean()
  }

  generateAleatory(min=0, max=0) {
    let matrix = []

    for (let i = 0; i < this.cell.xCount; i ++) {
      matrix.push([])
      for (let j = 0; j < this.cell.yCount; j ++) {
        matrix[i][j] = _.random(min, max)
      }
    }

    return matrix
  }

  countNeighbors(x, y) {
    let neighbors = 0

    for (let i = x-1; i <= x+1; i ++) {
      for (let j = y-1; j <= y+1; j ++) {
        const ireal = (i < 0) ? this.cell.xCount + (i % this.cell.xCount) : (i % this.cell.xCount)
        const jreal = (j < 0) ? this.cell.yCount + (j % this.cell.yCount) : (j % this.cell.yCount)

        if (this.world[ireal][jreal]) neighbors ++
      }
    }

    return this.world[x][y] ? neighbors - 1 : neighbors
  }

  clean() {
    this.context.clearRect(0, 0, this.dimentions.width, this.dimentions.height)
  }

  draw() {
    for (let i = 0; i < this.cell.xCount; i ++) {
      for (let j = 0; j < this.cell.yCount; j ++) {
        if (this.world[i][j]) {
          this.context.fillRect(
            this.cell.width * i, 
            this.cell.height * j, 
            this.cell.width - 1, 
            this.cell.height - 1
          )
        }
      }
    }
  }

  update() {
    this.buffer = JSON.parse(JSON.stringify(this.world))
    
    for (let i = 0; i < this.cell.xCount; i ++) {
      for (let j = 0; j < this.cell.yCount; j ++) {
        this.buffer[i][j] = this.countNeighbors(i, j)
      }
    }

    for (let i = 0; i < this.cell.xCount; i ++) {
      for (let j = 0; j < this.cell.yCount; j ++) {
        if ((this.world[i][j] && this.buffer[i][j] >= 2 && this.buffer[i][j] <= 3) || (! this.world[i][j] && this.buffer[i][j] === 3)) {
          this.buffer[i][j] = 1
        } else {
          this.buffer[i][j] = 0
        }
      }
    }

    this.world = JSON.parse(JSON.stringify(this.buffer))
  }

  start() {
    this.clean()
    this.draw()
    this.update()

    if (this.running) {
      this.requestAnimationId = window.requestAnimationFrame(() => {
        setTimeout(this.start.bind(this), ANIMATION_TIME)
      })
    }
  }
}

new Game()