window.createjs = this.createjs = require('createjs-module')
require('createjs-easeljs')
require('hammerjs')

;(function() {

  "use strict";
  
  class Ball extends Lamp {
    constructor(x, y, velX, velY, color, size)
    {
      this.x = x
      this.y = y
      this.velX = velX
      this.velY = velY
      this.color = color
      this.size = size
    }
   
    draw () {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }

    update () {
      if ((this.x + this.size) >= this.outer_w) {
          this.velX = -this.velX;
      }
      if ((this.x - this.size) <= 0) {
          this.velX = -this.velX;
      }
  
      if ((this.y + this.size) >= this.outer_h) {
          this.velY = -this.velY;
      }
      if ((this.y - this.size) <= 0) {
          this.velY = -this.velY;
      }
  
      this.x += this.velX;
      this.y += this.velY;
    }
  }

  class Lamp {
    constructor(id, options)
    {
      this.options = Object.assign({
        speedMin: -7,
        speedMax: 7,
        ballMin: 10,
        ballMax: 20,
        ballCount: 30
      }, options)
      
      this.id = id
      this.canvas = document.querySelector("#" + id)
      this.mc = new Hammer.Manager(this.canvas)
      this.outer_w = window.innerWidth
      this.outer_h = window.innerHeight

      this.canvas.width = this.outer_w
      this.canvas.height = this.outer_h
      this.stage = new createjs.Stage(this.id)
      this.queue = new createjs.LoadQueue()
      this.balls = []

      this.init()
    }

    init()
    {
      
    }

    /**
     * function to generate random number
     *
     * @param max
     * @param min
     * @returns {*}
    */
    random (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }

  const lamp = new Lamp('ball', {
    ballMax: 30,
    ballCount: 30
  })

})();
