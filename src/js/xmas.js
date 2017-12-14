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
    this.xmasPlanet;
    this.startBtn;
    this.restartBtn;
    this.gameStart = false;
    this.gameFisnish = false;
    // this.distance = 0;
    this.gotGift = 0;
    this.TURN_FACTOR = 5; //how far the ship turns per frame
    this.SPEED = 8; //how far the ship turns per frame
    this.SPEED_RATE = 0.1;
    this.stars = [];
    this.rocks = [];
    this.gifts = [];
    this.snowflake = [];
    this.rockNumber = 5;
    this.starNumber = 20;
    this.giftNumber = 6;
    this.snowflakeNumber = 6;
    this.lfHeld = false;
    this.rtHeld = false;
    this.fwdHeld = false;
    this.fsdHeld = false;
    this.rocket;
    // this.score = new createjs.Text(this.distance + " light year", "bold 2em Oswald", "#FFFFFF");
    this.scoreGift = new createjs.Text("YOU HAVE " + this.gotGift + "GIFTS", "bold 2em Oswald", "#FFFFFF");
    this.stage = new createjs.Stage(this.id);
    this.queue = new createjs.LoadQueue();
    this.xmasPlanetQue = new createjs.LoadQueue();
    this.btnQue = new createjs.LoadQueue();

    // this.bgAudio = document.querySelector('#bg-sound');
    // this.startAudio = document.querySelector('#start-sound');
    // this.finishAudio = document.querySelector('#finish-sound');

    this.mc.add(new Hammer.Pan());

    this.queue.loadFile({
      src: "../img/santa-claus.png",
      id: "santaClaus"
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
      var image = this.queue.getResult("santaClaus");
      this.rocket = new createjs.Bitmap(image);

      // this.xmasPlanetQue.loadFile({
      //   src: "../img/xmas-planet.png",
      //   id: "xmasPlanet"
      // });

      // this.xmasPlanetQue.on("fileload", e => {
      //   this.xmasPlanet = new createjs.Bitmap(e.result);
      //   this.init();
      //   console.log('load');
      // });

      this.btnQue.loadFile({
        src: "../img/start-btn.png",
        id: "start-btn"
      });

      this.btnQue.on("fileload", e => {
        this.startBtn = new createjs.Bitmap(e.result);
        this.init();
        // console.log('btn');
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
    this.renderGift();
    this.renderSnowflake(0);

    var img = this.rocket.image;
    // default 定位, 中心點
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
      // document.querySelector('#final-score').innerHTML = this.distance.toFixed(1);
      document.querySelector('#final-scoreGift').innerHTML = this.gotGift.toFixed(1);
    } else {
      document.querySelector('#start-layer').className = 'layer';
    }
  }

  gameFinish() {
    // this.bgAudio.pause();
    // this.finishAudio.volumn = 100;
    // this.finishAudio.play();

    this.stage.removeAllChildren();

    this.startBtn;
    this.restartBtn;
    this.gameStart = false;
    this.TURN_FACTOR = 5; //how far the ship turns per frame
    this.SPEED = 8; //how far the ship turns per frame
    this.SPEED_RATE = 0.1;
    this.stars = [];
    this.rocks = [];
    this.gifts = [];
    this.rockNumber = 5;
    this.snowflakeNumber = 6;
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
    // this.distance = 0;
    this.gotGift = 0;

    // this.finishAudio.currentTime = 0;
    // this.finishAudio.pause();
    // this.startAudio = document.querySelector('#start-sound');
    // this.startAudio.play();

    // var bgaudio = document.querySelector('#bg-sound');
    // bgaudio.currentTime = 0;
    // bgaudio.play();
    document.querySelector('#finish-layer').className = 'layer hidden';
    document.querySelector('#start-layer').className = 'layer hidden';

    this.gameStart = true;
    this.stage.removeChild(this.startBtn, this.title);

    // this.score.textAlign = 'left';
    // this.score.x = 20;
    // this.score.y = 20;
    // this.stage.addChild(this.score);

    this.scoreGift.textAlign = 'left';
    this.scoreGift.x = 20;
    this.scoreGift.y = 60;
    this.stage.addChild(this.scoreGift);

    this.stage.update();

    this.renderRock(0);
    this.renderGift(0);
    this.renderSnowflake(0);
    this.starPass();
  }

  reStartGame() {

  }

  resizeCanvas() {
    var img = this.rocket.image;
    this.rocket.regX = img.naturalWidth;
    this.rocket.regY = img.naturalHeight;
    this.rocket.x = this.outer_w;
    this.rocket.y = this.outer_h;
    this.outer_w = window.innerWidth;
    this.outer_h = window.innerHeight;
    this.canvas.width = this.outer_w;
    this.canvas.height = this.outer_h - document.querySelector('header').clientHeight;
    this.stage.update();
  }

  renderRock(i) {
    var rockType = Math.floor(Math.random() * 6) + 1;
    var que = new createjs.LoadQueue();

    que.loadFile({
      id: "planet-" + i,
      src: "../img/planet-" + rockType + ".png"
    });

    que.on("fileload", e => {
      let image = e.result;
      this.rocks[i] = new createjs.Bitmap(image);
      var img = this.rocks[i].image;
      this.rocks[i].regX = img.naturalWidth;
      this.rocks[i].regY = img.naturalHeight;
      this.rocks[i].scaleX = 1;
      this.rocks[i].scaleY = 1;
      this.rocks[i].width = img.naturalWidth;
      this.rocks[i].height = img.naturalWidth;
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

  renderSnowflake(i) {
    var snowflakeType = Math.floor(Math.random() * 6) + 1;
    var que = new createjs.LoadQueue();

    que.loadFile({
      id: "snowflake-" + i,
      src: "../img/snowflake-" + snowflakeType + ".png"
    });

    que.on("fileload", e => {
      let image = e.result;
      this.snowflake[i] = new createjs.Bitmap(image);
      var img = this.snowflake[i].image;
      this.snowflake[i].regX = img.naturalWidth;
      this.snowflake[i].regY = img.naturalHeight;
      this.snowflake[i].scaleX = 1;
      this.snowflake[i].scaleY = 1;
      this.snowflake[i].width = img.naturalWidth;
      this.snowflake[i].height = img.naturalWidth;
      this.snowflake[i].x = Math.random() * this.outer_w;
      this.snowflake[i].y = -img.naturalHeight;
      this.stage.addChild(this.snowflake[i]);
      this.stage.update();

      this.flySnowflake(this.snowflake[i]);
    }, this);

    que.on("complete", e => {
      if (i < this.snowflakeNumber) {
        setTimeout(() => {
          this.renderSnowflake(i + 1);
        }, Math.ceil(Math.random() * 5000))
      }
      // console.log('snowflake' + i);
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

  renderGift(i) {
    var giftType = Math.floor(Math.random() * 6) + 1;
    var que = new createjs.LoadQueue();

    que.loadFile({
      id: "gift-" + i,
      src: "../img/gift-" + giftType + ".png"
    });

    que.on("fileload", e => {
      let image = e.result;
      this.gifts[i] = new createjs.Bitmap(image);
      var img = this.gifts[i].image;
      this.gifts[i].regX = img.naturalWidth;
      this.gifts[i].regY = img.naturalHeight;
      this.gifts[i].scaleX = 1;
      this.gifts[i].scaleY = 1;
      this.gifts[i].width = img.naturalWidth;
      this.gifts[i].height = img.naturalWidth;
      this.gifts[i].x = Math.random() * this.outer_w;
      this.gifts[i].y = -img.naturalHeight;
      this.stage.addChild(this.gifts[i]);
      this.stage.update();

      this.flyGift(this.gifts[i]);
    }, this);

    que.on("complete", e => {
      if (i < this.giftNumber) {
        setTimeout(() => {
          this.renderGift(i + 1);
        }, Math.ceil(Math.random() * 5000))
      }
      // console.log('gift' + i);
    }, this);
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
    var img_h = rock.height
    var img_w = rock.width
    if (rock.y > this.outer_h + img_h || rock.y < -img_h || rock.x > this.outer_w + img_w || rock.x < -img_w) {
      if (angle > 45 && angle < 135) {
        rock.x = this.outer_w + img_w;
      } else if (angle > 225 && angle < 315) {
        rock.x = -img_w;
      } else {
        rock.x = Math.random() * this.outer_w;
      }

      if (angle > 315 && angle <= 360 || angle >= 0 && angle <= 45) {
        rock.y = -img_h;
      } else if (angle > 45 && angle < 135 || angle > 225 && angle < 315) {
        rock.y = Math.random() * this.outer_h;
      } else if (angle > 135 && angle < 225) {
        rock.y = this.outer_h + img_h;
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


  flyGift(gift) {
    var angle = this.rocket.rotation % 360 * (this.rocket.rotation % 360 < 0 ? -1 : 1);
    var img_h = gift.height
    var img_w = gift.width
    if (gift.y > this.outer_h + img_h || gift.y < -img_h || gift.x > this.outer_w + img_w || gift.x < -img_w) {
      if (angle > 45 && angle < 135) {
        gift.x = this.outer_w + img_w;
      } else if (angle > 225 && angle < 315) {
        gift.x = -img_w;
      } else {
        gift.x = Math.random() * this.outer_w;
      }

      if (angle > 315 && angle <= 360 || angle >= 0 && angle <= 45) {
        gift.y = -img_h;
      } else if (angle > 45 && angle < 135 || angle > 225 && angle < 315) {
        gift.y = Math.random() * this.outer_h;
      } else if (angle > 135 && angle < 225) {
        gift.y = this.outer_h + img_h;
      } else {
        gift.y = Math.random() * this.outer_h;
      }

    } else {
      gift.x += Math.sin(this.rocket.rotation * (Math.PI / -180)) * this.SPEED * (img_h / 300);
      gift.y += Math.cos(this.rocket.rotation * (Math.PI / -180)) * this.SPEED * (img_h / 300);
    }


    this.stage.update();

    if (this.gameStart) {
      setTimeout(() => {
        // this.flyGift(gift);
        this.flyGift(gift);
      }, 60);
    }
  }


  flySnowflake(snowflake) {
    var angle = this.rocket.rotation % 360 * (this.rocket.rotation % 360 < 0 ? -1 : 1);
    var img_h = snowflake.height
    var img_w = snowflake.width
    if (snowflake.y > this.outer_h + img_h || snowflake.y < -img_h || snowflake.x > this.outer_w + img_w || snowflake.x < -img_w) {
      if (angle > 45 && angle < 135) {
        snowflake.x = this.outer_w + img_w;
      } else if (angle > 225 && angle < 315) {
        snowflake.x = -img_w;
      } else {
        snowflake.x = Math.random() * this.outer_w;
      }

      if (angle > 315 && angle <= 360 || angle >= 0 && angle <= 45) {
        snowflake.y = -img_h;
      } else if (angle > 45 && angle < 135 || angle > 225 && angle < 315) {
        snowflake.y = Math.random() * this.outer_h;
      } else if (angle > 135 && angle < 225) {
        snowflake.y = this.outer_h + img_h;
      } else {
        snowflake.y = Math.random() * this.outer_h;
      }

    } else {
      snowflake.x += Math.sin(this.rocket.rotation * (Math.PI / -180)) * this.SPEED * (img_h / 300);
      snowflake.y += Math.cos(this.rocket.rotation * (Math.PI / -180)) * this.SPEED * (img_h / 300);
    }


    this.stage.update();

    if (this.gameStart) {
      setTimeout(() => {
        this.flySnowflake(snowflake);
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
      for (let k in this.gifts) {
        var gift = this.gifts[k];
        if (this.detectGift(gift)) {
          // this.gameStart = false;
          // this.gameFisnish = false;
          // this.gameFinish();
          console.log('got gift')
        }
      }

      // this.distance += (this.SPEED / 50);
      // this.score.text = this.distance.toFixed(1) + " light year";
      this.scoreGift.text = "YOU HAVE " + this.gotGift.toFixed(1) + " GIFTS";
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

    var rectCenterX = this.rocket.x + this.rocket.image.naturalWidth;
    var rectCenterY = this.rocket.y + this.rocket.image.naturalHeight;
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
    if (cound < rock.height && cound < rock.width ) {
      return true
    }

    return false
  }

  detectGift(gift) {
    if (!gift) return;
    var cx, cy;
    var angleOfRad = this.degToRad(-this.rocket.rotation);

    var rectCenterX = this.rocket.x + this.rocket.image.naturalWidth;
    var rectCenterY = this.rocket.y + this.rocket.image.naturalHeight;
    var rotateCircleX = Math.cos(angleOfRad) * (gift.x - rectCenterX) - Math.sin(angleOfRad) * (gift.y - rectCenterY) + rectCenterX
    var rotateCircleY = Math.sin(angleOfRad) * (gift.x - rectCenterX) + Math.cos(angleOfRad) * (gift.y - rectCenterY) + rectCenterY

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
    if (cound < gift.height && cound < gift.width ) {
      console.log('got gift');
      // return true;
    }

    // return false

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

window.onload = renderCanvas();


