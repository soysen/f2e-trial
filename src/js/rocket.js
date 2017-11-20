window.createjs = this.createjs = require('createjs-module');
require('createjs-easeljs');
require('hammerjs');


var KEYCODE_UP = 38; //useful keycode
var KEYCODE_LEFT = 37; //useful keycode
var KEYCODE_RIGHT = 39; //useful keycode
var KEYCODE_DOWN = 40; //useful keycode
var KEYCODE_W = 87; //useful keycode
var KEYCODE_S = 83; //useful keycode
var KEYCODE_A = 65; //useful keycode
var KEYCODE_D = 68; //useful keycode


class rocket {
  constructor(id) {
    this.id = id;
    this.canvas = document.querySelector("#" + id);
    this.mc = new Hammer.Manager(this.canvas);
    this.outer_w = window.innerWidth;
    this.outer_h = window.innerHeight;
    this.canvas.width = this.outer_w;
    this.canvas.height = this.outer_h - document.querySelector('header').clientHeight;
    this.startBtn;
    this.restartBtn;
    this.gameStart = false;
    this.gameFisnish = false;
    this.distance = 0;
    this.TURN_FACTOR = 5; //how far the ship turns per frame
    this.SPEED = 8; //how far the ship turns per frame
    this.SPEED_RATE = 0.1;
    this.stars = [];
    this.rocks = [];
    this.rockNumber = 5;
    this.starNumber = 20;
    this.lfHeld = false;
    this.rtHeld = false;
    this.fwdHeld = false;
    this.fsdHeld = false;
    this.rocket;
    this.score = new createjs.Text(this.distance + " light year", "bold 2em Oswald", "#FFFFFF");
    this.stage = new createjs.Stage(this.id);
    this.queue = new createjs.LoadQueue();
    this.btnQue = new createjs.LoadQueue();

    this.bgAudio = document.querySelector('#bg-sound');
    this.startAudio = document.querySelector('#start-sound');
    this.finishAudio = document.querySelector('#finish-sound');

    this.mc.add(new Hammer.Pan());

    this.queue.loadFile({
      src: "../img/rocket.png",
      id: "image"
    });

    this.stage.enableMouseOver(10);
    createjs.Touch.enable(this.stage);

    document.addEventListener('keydown', e => this.handleKeyDown(e));
    document.addEventListener('keyup', e => this.handleKeyUp(e));
    window.addEventListener('resize', e => this.resizeCanvas(e));
    document.querySelector('#start').addEventListener('click', (e) => this.startGame(e));
    document.querySelector('#restart').addEventListener('click', (e) => this.startGame(e));

    // Load image
    this.queue.on("complete", e => {
      var image = this.queue.getResult("image");
      this.rocket = new createjs.Bitmap(image);

      this.btnQue.loadFile({
        src: "../img/start-btn.png",
        id: "start-btn"
      });

      this.btnQue.on("fileload", e => {
        this.startBtn = new createjs.Bitmap(e.result);
        this.init();
      });

    });

    this.mc.on('panend panleft panright panup pandown', e => this.mcSwipe(e));

    createjs.Ticker.addEventListener("tick", (e) => this.tick());
  }

  mcSwipe(e) {
    if (!this.gameStart) return;

    switch (e.type) {
      case 'panleft':
        this.lfHeld = true;
        break;
      case 'panright':
        this.rtHeld = true;
        break;
      case 'panup':
        this.fwdHeld = true;
        break;
      case 'pandown':
        this.fsdHeld = true;
        break;
      case 'panend':
        this.lfHeld = false;
        this.rtHeld = false;
        this.fwdHeld = false;
        this.fsdHeld = false;
        break;
    }

    setTimeout(() => {}, 50);
  }

  init() {
    this.renderStar();

    var img = this.rocket.image;
    this.rocket.regX = img.naturalWidth / 2;
    this.rocket.regY = img.naturalHeight / 2;
    this.rocket.width = img.naturalWidth;
    this.rocket.height = img.naturalHeight;
    this.rocket.x = this.outer_w / 2;
    this.rocket.y = this.outer_h / 2;

    this.stage.addChild(this.rocket);
    this.stage.update();

    this.stage.update();

    if (this.gameFisnish) {
      document.querySelector('#finish-layer').className = 'layer';
      document.querySelector('#final-score').innerHTML = this.distance.toFixed(1);
    } else {
      document.querySelector('#start-layer').className = 'layer';
    }
  }

  gameFinish() {
    this.bgAudio.pause();
    this.finishAudio.volumn = 100;
    this.finishAudio.play();

    this.stage.removeAllChildren();

    this.startBtn;
    this.restartBtn;
    this.gameStart = false;
    this.TURN_FACTOR = 5; //how far the ship turns per frame
    this.SPEED = 8; //how far the ship turns per frame
    this.SPEED_RATE = 0.1;
    this.stars = [];
    this.rocks = [];
    this.rockNumber = 5;
    this.starNumber = 20;
    this.lfHeld = false;
    this.rtHeld = false;
    this.fwdHeld = false;
    this.fsdHeld = false;
    this.gameFisnish = true;

    this.init();
  }

  startGame(e) {
    this.gameFisnish = false;
    this.distance = 0;

    this.finishAudio.currentTime = 0;
    this.finishAudio.pause();
    this.startAudio = document.querySelector('#start-sound');
    this.startAudio.play();

    var bgaudio = document.querySelector('#bg-sound');
    bgaudio.currentTime = 0;
    bgaudio.play();
    document.querySelector('#finish-layer').className = 'layer hidden';
    document.querySelector('#start-layer').className = 'layer hidden';

    this.gameStart = true;
    this.stage.removeChild(this.startBtn, this.title);

    this.score.textAlign = 'left';
    this.score.x = 20;
    this.score.y = 20;
    this.stage.addChild(this.score);

    this.stage.update();

    this.renderRock(0);
    this.starPass();
  }

  resizeCanvas() {
    var img = this.rocket.image;
    this.rocket.regX = img.naturalWidth / 2;
    this.rocket.regY = img.naturalHeight / 2;
    this.rocket.x = this.outer_w / 2;
    this.rocket.y = this.outer_h / 2;
    this.outer_w = window.innerWidth;
    this.outer_h = window.innerHeight;
    this.canvas.width = this.outer_w;
    this.canvas.height = this.outer_h - document.querySelector('header').clientHeight;
    this.stage.update();
  }

  renderRock(i) {
    var rockType = Math.floor(Math.random() * 8) + 1;
    var que = new createjs.LoadQueue();

    que.loadFile({
      id: "rock-" + i,
      src: "../img/rock-" + rockType + ".png"
    });

    que.on("fileload", e => {
      let image = e.result;
      this.rocks[i] = new createjs.Bitmap(image);
      var img = this.rocks[i].image;
      this.rocks[i].regX = img.naturalWidth / 2;
      this.rocks[i].regY = img.naturalHeight / 2;
      this.rocks[i].scaleX = 0.3;
      this.rocks[i].scaleY = 0.3;
      this.rocks[i].width = img.naturalWidth * 0.3;
      this.rocks[i].height = img.naturalWidth * 0.3;
      this.rocks[i].x = Math.random() * this.outer_w;
      this.rocks[i].y = -img.naturalHeight;
      this.stage.addChild(this.rocks[i]);
      this.stage.update();

      this.flyRock(this.rocks[i]);
    }, this);

    que.on("complete", e => {
      if (i < this.rockNumber) {
        setTimeout(() => {
          this.renderRock(i + 1);
        }, Math.ceil(Math.random() * 5000))
      }
    }, this);
  }

  renderStar() {
    for (var i = 0; i < this.starNumber; i++) {
      let star = new createjs.Shape();
      let opt = Math.random() * 1;
      star.graphics.beginFill("rgba(255,255,255," + opt + ")").drawCircle(0, 0, Math.random() * 10);
      star.x = Math.random() * this.outer_w;
      star.y = Math.random() * this.outer_h;
      star.opacity = opt;
      this.stage.addChild(star);

      this.stars.push(star);
    }
    this.stage.update();
  }

  starPass() {
    var angle = this.rocket.rotation % 360 * (this.rocket.rotation % 360 < 0 ? -1 : 1);

    this.stars.forEach((item, index) => {
      if (item.y > this.outer_h + 10 || item.y < -10 || item.x > this.outer_w + 10 || item.x < -10) {
        if (angle > 45 && angle < 135) {
          item.x = this.outer_w + 10;
        } else if (angle > 225 && angle < 315) {
          item.x = -10;
        } else {
          item.x = Math.random() * this.outer_w;
        }

        if (angle > 315 && angle <= 360 || angle >= 0 && angle <= 45) {
          item.y = -10;
        } else if (angle > 45 && angle < 135 || angle > 225 && angle < 315) {
          item.y = Math.random() * this.outer_h;
        } else if (angle > 135 && angle < 225) {
          item.y = this.outer_h + 10;
        } else {
          item.y = Math.random() * this.outer_h;
        }

      } else {
        item.x += Math.sin(this.rocket.rotation * (Math.PI / -180)) * this.SPEED * item.opacity;
        item.y += Math.cos(this.rocket.rotation * (Math.PI / -180)) * this.SPEED * item.opacity;
      }
    });

    this.stage.update();
    if (this.gameStart) {
      setTimeout(() => {
        this.starPass();
      }, 50);
    }
    // this.starPass();
  }

  flyRock(rock) {
    var angle = this.rocket.rotation % 360 * (this.rocket.rotation % 360 < 0 ? -1 : 1);
    var img_h = rock.height * 2
    var img_w = rock.width * 2
    if (rock.y > this.outer_h + img_h || rock.y < -img_h || rock.x > this.outer_w + img_w || rock.x < -img_w) {
      if (angle > 45 && angle < 135) {
        rock.x = this.outer_w + img_w / 2;
      } else if (angle > 225 && angle < 315) {
        rock.x = -img_w / 2;
      } else {
        rock.x = Math.random() * this.outer_w;
      }

      if (angle > 315 && angle <= 360 || angle >= 0 && angle <= 45) {
        rock.y = -img_h / 2;
      } else if (angle > 45 && angle < 135 || angle > 225 && angle < 315) {
        rock.y = Math.random() * this.outer_h;
      } else if (angle > 135 && angle < 225) {
        rock.y = this.outer_h + img_h / 2;
      } else {
        rock.y = Math.random() * this.outer_h;
      }

    } else {
      rock.x += Math.sin(this.rocket.rotation * (Math.PI / -180)) * this.SPEED * (img_h / 300);
      rock.y += Math.cos(this.rocket.rotation * (Math.PI / -180)) * this.SPEED * (img_h / 300);
    }


    this.stage.update();

    if (this.gameStart) {
      setTimeout(() => {
        this.flyRock(rock);
      }, 60);
    }
  }

  tick() {
    //handle turning
    if (this.gameStart) {
      if (this.fwdHeld) {
        this.SPEED_RATE += 0.1;
        this.SPEED += this.SPEED_RATE;
      } else if (this.fsdHeld && this.SPEED_RATE > 0.1) {
        this.SPEED_RATE -= 0.1;
        this.SPEED -= this.SPEED < 1 ? 0 : this.SPEED_RATE;
      }

      if (this.lfHeld) {
        this.rocket.rotation -= this.TURN_FACTOR;
      } else if (this.rtHeld) {
        this.rocket.rotation += this.TURN_FACTOR;
      }
      for (let r in this.rocks) {
        var rock = this.rocks[r];
        if (this.detectHit(rock)) {
          this.gameStart = false;
          this.gameFisnish = false;
          this.gameFinish();
        }
      }

      this.distance += (this.SPEED / 50);
      this.score.text = this.distance.toFixed(1) + " light year";
    }
    this.stage.update();
  }

  degToRad(deg) {
    return deg * Math.PI / 180;
  }

  detectHit(rock) {
    if (!rock) return;
    var cx, cy;
    var angleOfRad = this.degToRad(-this.rocket.rotation);

    var rectCenterX = this.rocket.x + this.rocket.image.naturalWidth / 2
    var rectCenterY = this.rocket.y + this.rocket.image.naturalHeight / 2
    var rotateCircleX = Math.cos(angleOfRad) * (rock.x - rectCenterX) - Math.sin(angleOfRad) * (rock.y - rectCenterY) + rectCenterX
    var rotateCircleY = Math.sin(angleOfRad) * (rock.x - rectCenterX) + Math.cos(angleOfRad) * (rock.y - rectCenterY) + rectCenterY

    if (rotateCircleX < this.rocket.x)
      cx = this.rocket.x
    else if (rotateCircleX > this.rocket.x + this.rocket.image.naturalWidth)
      cx = this.rocket.x + this.rocket.image.naturalWidth
    else
      cx = rotateCircleX

    if (rotateCircleY < this.rocket.y)
      cy = this.rocket.y
    else if (rotateCircleY > this.rocket.y + this.rocket.image.naturalHeight)
      cy = this.rocket.y + this.rocket.image.naturalHeight
    else
      cy = rotateCircleY

    // console.log('rotateCircleX', rotateCircleX)
    // console.log('rotateCircleY', rotateCircleY)
    // console.log('cx', cx)
    // console.log('cy', cy)
    // console.log(this.countDistance(rotateCircleX, rotateCircleY, cx, cy));
    let cound = this.countDistance(rotateCircleX, rotateCircleY, cx, cy);
    // console.log(cound, (rock.height * 0.3) / 2, (rock.width * 0.3) / 2)
    if (cound < (rock.height * 0.3) / 2 && cound < (rock.width * 0.3) / 2) {
      return true
    }

    return false
  }

  countDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }


  handleKeyDown(e) {
    if (!e) {
      var e = window.event;
    }
    switch (e.keyCode) {
      case KEYCODE_A:
      case KEYCODE_LEFT:
        this.lfHeld = true;
        return false;
      case KEYCODE_D:
      case KEYCODE_RIGHT:
        this.rtHeld = true;
        return false;
      case KEYCODE_W:
      case KEYCODE_UP:
        this.fwdHeld = true;
        return false;
      case KEYCODE_S:
      case KEYCODE_DOWN:
        this.fsdHeld = true;
        return false;
    }

    setTimeout(() => {
      this.lfHeld = false;
      this.rtHeld = false;
      this.fwdHeld = false;
      this.fsdHeld = false;
    }, 50);
  }

  handleKeyUp(e) {
    if (!e) {
      var e = window.event;
    }
    switch (e.keyCode) {
      case KEYCODE_A:
      case KEYCODE_LEFT:
        this.lfHeld = false;
        break;
      case KEYCODE_D:
      case KEYCODE_RIGHT:
        this.rtHeld = false;
        break;
      case KEYCODE_W:
      case KEYCODE_UP:
        this.fwdHeld = false;
        break;
      case KEYCODE_S:
      case KEYCODE_DOWN:
        this.fsdHeld = false;
        break;
    }
  }

}


function renderCanvas() {
  new rocket('rocket');
}

window.onload = renderCanvas()