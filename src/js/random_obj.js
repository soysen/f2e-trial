window.createjs = this.createjs = require('createjs-module');
require('createjs-easeljs');
require('hammerjs');
// RotationPlugin.install(props);

class RandomObj {
  constructor(id) {
    this.id = id
    this.canvas = document.querySelector("#" + id)
    this.mc = new Hammer.Manager(this.canvas)
    this.outer_w = window.innerWidth
    this.outer_h = window.innerHeight
    this.canvas.width = this.outer_w
    this.canvas.height = this.outer_h
    this.stage = new createjs.Stage(this.id)
    this.queue = new createjs.LoadQueue()
    this.lastMousePos = { x: 0, y: 0 }
    this.objects = []
    this.tweens = []
    this.maxNumber = 100

    createjs.Touch.enable(this.stage);
    this.stage.enableMouseOver(10);
    this.stage.mouseMoveOutside = true
    this.stage.on("stagemousemove", e => this._tick(e));
    this.mc.on('panmove', e => this._tick(e));

    this._init()

    createjs.Ticker.addEventListener("tick", (e) => this._tick())
  }

  _init() {
    this._renderObj()
    this.stage.update()
  }

  _tick() {
    this.objects.forEach(obj => {
      var pt = obj.globalToLocal(this.stage.mouseX, this.stage.mouseY)
      if( obj.hitTest(pt.x, pt.y) ) {
        this.objMove(obj, { x: this.stage.mouseX, y: this.stage.mouseY }, this.lastMousePos)
        obj.hitPos = null
      } 
    })

    this.lastMousePos = {
      x: this.stage.mouseX,
      y: this.stage.mouseY
    }

    this.stage.update()
  }

  objMove(obj, crtPos, lasPos) {
    if( obj.isMove ) return

    var ang = this.angle(lasPos.x, lasPos.y, crtPos.x, crtPos.y)
    // console.log(crtPos, lasPos, )
    var dest = {
      x: Math.sin(ang * (Math.PI / 180)) * 70, 
      y: Math.cos(ang * (Math.PI / 180)) * 70
    }

    obj.isMove = true
    // if( !this.tweens[obj.index]==false ) createjs.Tween.
    this.tweens[obj.index] = createjs.Tween.get(obj).to({ 
      x: obj.x + dest.x, 
      y: obj.y + dest.y 
    }, 350, createjs.Ease.getPowOut(4)).call(() => {
      obj.isMove = false
      this.detectPositoin(obj, (obj.x + dest.x), (obj.y + dest.y))
    })
  }

  detectPositoin(obj, x, y) {
    if( x-20 < 0 || y-20 < 0 || x+20 > this.outer_w || y+20 > this.outer_h) {
      var newX = (x - 20 < 0) ? 200 : (x + 20 > this.outer_w ? this.outer_w - 200 : x)
      var newY = (y - 20 < 0) ? 200 : (y + 20 > this.outer_h ? this.outer_h - 200 : y)
      
      obj.isMove = true
      this.tweens[obj.index] = createjs.Tween.get(obj).to({ 
        x: newX, 
        y: newY
      }, 350, createjs.Ease.getPowOut(4)).call(() => {
        obj.isMove = false
        this.detectPositoin(newX, newY)
      })
    }
  }
  
  angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }

  _renderObj() {
    for(var i=0; i<this.maxNumber; i++) {
      let shape = new createjs.Shape()
      shape.graphics.beginStroke("#000000").setStrokeStyle(2).moveTo(20,0).lineTo(40, 40).lineTo(0, 40).lineTo(20,0).closePath()
      
      shape.regX = 20
      shape.regY = 20
      
      let rangeX = this.outer_w / 150
      let rangeY = this.outer_h / 150
      shape.x = this._getRandomInt(rangeX, this.outer_w - rangeX)
      shape.y = this._getRandomInt(rangeY, this.outer_h - rangeY)

      shape.hitPos = null
      shape.isMove = false
      shape.rotation = Math.random(10) * 1000
      shape.hitArea = shape
      shape.index = this.objects.length
      
      this.stage.addChild(shape) 
      this._doRotate(shape, 5000, Math.floor(Math.random() * 10) % 2)
      this.objects.push(shape)
    }
  }
  
  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  _doRotate(shape, sec, dir) {
    shape.rotation = 0
    
    createjs.Tween.get(shape).to({ rotation: dir > 0 ? 360 : -360 }, sec).call(() => {
      this._doRotate(shape, sec, dir)
    })
  }
}


const randObj = new RandomObj("random_obj")