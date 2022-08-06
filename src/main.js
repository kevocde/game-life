/**
 * Life Game script
 * Created by: Kevin Guzmán (kevocde@gmail.com)
 */
require('./assets/main.css')

const _ = require('lodash')

const CELL_SIZE = 15
const ANIMATION_TIME = 1000/20
const PERCENTAGE_POPULATION = 0.8
const BOARD_ID = 'main-board'
const TOGGLE_BTN_ID = 'toggle-btn'
const RESET_BTN_ID = 'reset-btn'
const CLEAN_BTN_ID = 'clean-btn'
const ALIVE_TXT_ID = 'txt-alive'
const CYCLE_TXT_ID = 'txt-cycle'

class Game {
  constructor() {
    /** Elements and Events */
    this.toggleBtn = document.getElementById(TOGGLE_BTN_ID)
    this.resetBtn = document.getElementById(RESET_BTN_ID)
    this.cleanBtn = document.getElementById(CLEAN_BTN_ID)
    this.aliveTxt = document.getElementById(ALIVE_TXT_ID)
    this.cycleTxt = document.getElementById(CYCLE_TXT_ID)
    this.loadBoardProps()

    this.defineStateProperties()
    this.addEvents()
  }

  loadBoardProps() {
    let original = document.getElementById(BOARD_ID)
    const canvas = document.createElement('canvas')
    const props = {
      'class': original.classList,
      'id': original.id,
      'width': Math.floor(original.clientWidth),
      'height': Math.floor(original.clientWidth * 0.7),
    }
    canvas.setAttribute('id', props.id + '-canvas')
    canvas.setAttribute('class', props.class.toString())
    canvas.setAttribute('width', props.width)
    canvas.setAttribute('height', props.height)

    original.classList.add('hidden')
    original.parentElement.prepend(canvas)

    this.htmlElement = document.getElementById(BOARD_ID + '-canvas')
    this.context = this.htmlElement.getContext('2d')
  }

  addEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', this.toggleAnimation.bind(this))
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', this.resetAnimation.bind(this))
    }

    if (this.resetBtn) {
      this.cleanBtn.addEventListener('click', this.cleanAnimation.bind(this))
    }

    if (this.htmlElement) {
      this.htmlElement.addEventListener('mousedown', (event) => { this.toggleCell(event) })
    }
  }

  cleanAnimation() {
    if (this.running) this.toggleAnimation()
    this.world = this.generateAleatory()
    this.alive = 0
    this.cycle = 0
  }

  toggleCell(event) {
    const rect = this.htmlElement.getBoundingClientRect()
    const coordinates = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }

    coordinates.xCell = Math.floor(coordinates.x / this.cell.width)
    coordinates.yCell = Math.floor(coordinates.y / this.cell.height)

    this.world[coordinates.xCell][coordinates.yCell] = !(!!this.world[coordinates.xCell][coordinates.yCell]);
    this.alive += this.world[coordinates.xCell][coordinates.yCell] ? 1 : -1
  }

  defineStateProperties() {
    this.requestAnimation = null
    this.running = false
    this.dimentions = {
      width: this.htmlElement.width,
      height: this.htmlElement.height
    }
    this.cell = {
      width: CELL_SIZE,
      height: CELL_SIZE,
      xCount: Math.floor(this.dimentions.width / CELL_SIZE),
      yCount: Math.floor(this.dimentions.height / CELL_SIZE),
    }
    this.world = this.generateAleatory(PERCENTAGE_POPULATION)
    this.buffer = this.generateAleatory()
    this.alive = Math.floor(this.cell.xCount * PERCENTAGE_POPULATION)
    this.cycle = 0
  }

  toggleAnimation() {
    this.running = ! this.running
    this.toggleBtn.innerText = this.running ? 'Stop' : 'Resume'

    if (this.running && this.requestAnimation === null) this.start()
  }

  resetAnimation() {
    this.running = false
    this.toggleBtn.innerText = 'Start'
    this.world = this.generateAleatory(PERCENTAGE_POPULATION)
    this.buffer = this.generateAleatory()
    this.alive = Math.floor((this.cell.xCount * this.cell.yCount) * PERCENTAGE_POPULATION)
    this.cycle = 0
  }

  generateAleatory(percentage = 0) {
    let all_fields = _.fill(Array(this.cell.xCount * this.cell.yCount), 0)
    let cells = Math.floor(all_fields.length * percentage)
    let counter = 0

    while (cells > 0) {
      if (counter > all_fields.length - 1) counter = 0

      all_fields[counter] = Math.random() >= 0.5

      if (all_fields[counter]) cells --

      counter ++
    }

    return JSON.parse(JSON.stringify(_.chunk(all_fields, this.cell.yCount)))
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
    this.alive = 0
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
          this.alive ++
        } else {
          this.buffer[i][j] = 0
        }
      }
    }

    this.world = JSON.parse(JSON.stringify(this.buffer))
    this.cycle ++
  }

  updateCounters() {
    this.aliveTxt.innerText = `${this.alive} of ${this.cell.xCount * this.cell.yCount}`
    this.cycleTxt.innerText = this.cycle
  }

  start() {
    this.clean()
    this.draw()

    if (this.running) this.update()

    this.updateCounters()

    this.requestAnimation = window.requestAnimationFrame(() => {
      setTimeout(this.start.bind(this), ANIMATION_TIME)
    })
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {new Game()}, 1000)
})