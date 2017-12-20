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
    this.giftID = 0;
    this.gameStart = false;
    this.gameFisnish = false;
    // this.distance = 0;
    this.gotGiftID = [];
    this.gotGift = 0;
    this.TURN_FACTOR = window.innerWidth > 768 ? 5 : 4; //how far the ship turns per frame
    this.SPEED = 18; //how far the ship turns per frame
    this.SPEED_RATE = 0.1;
    this.stars = [];
    this.rocks = [];
    this.gifts = [];
    this.snowflake = [];
    this.rockNumber = 2;
    this.starNumber = 20;
    this.giftNumber = 3;
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

    this.mc.on('panmove panend', e => this.mcSwipe(e));

    createjs.Ticker.addEventListener("tick", (e) => this.tick());
  }

  mcSwipe(e) {
    if (!this.gameStart) return;
    
    switch (e.type) {
      case 'panmove':
        if( e.overallVelocityX > 0) {
          this.rtHeld = true;
          this.lfHeld = false;
        } else {
          this.rtHeld = false;
          this.lfHeld = true;
        }
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
    this.rocket.regY = img.naturalWidth / 3;
    this.rocket.width = img.naturalWidth;
    this.rocket.height = img.naturalHeight;
    if (this.outer_w < 768) {
      this.rocket.scaleX = 0.5;
      this.rocket.scaleY = 0.5;
    }
    this.rocket.x = this.outer_w / 2;
    this.rocket.y = this.outer_h / 2;

    this.stage.addChild(this.rocket);
    this.stage.update();

    this.stage.update();

    if (this.gameFisnish) {
      document.querySelector('#finish-layer').className = 'layer';
      // document.querySelector('#final-score').innerHTML = this.distance.toFixed(1);
      document.querySelector('#final-scoreGift').innerHTML = this.gotGift.toFixed(0);
    } else {
      document.querySelector('#start-layer').className = 'layer';
    }
  }

  gameFinish() {
    // this.bgAudio.pause();
    // this.finishAudio.volumn = 100;
    // this.finishAudio.play();

    // $('.card-content').removeClass('hidden');

    this.stage.removeAllChildren();

    this.startBtn;
    this.restartBtn;
    this.gameStart = false;
    this.TURN_FACTOR = 5; //how far the ship turns per frame
    this.SPEED = 18; //how far the ship turns per frame
    this.SPEED_RATE = 0.1;
    this.stars = [];
    this.rocks = [];
    this.giftID = 0;
    this.gotGiftID = [];
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


  gameFinishSuccess() {
    // this.bgAudio.pause();
    // this.finishAudio.volumn = 100;
    // this.finishAudio.play();

    $('.card-content').removeClass('hidden');

    this.stage.removeAllChildren();

    this.startBtn;
    this.restartBtn;
    this.gameStart = false;
    this.TURN_FACTOR = 5; //how far the ship turns per frame
    this.SPEED = 18; //how far the ship turns per frame
    this.SPEED_RATE = 0.1;
    this.stars = [];
    this.rocks = [];
    this.giftID = 0;
    this.gotGiftID = [];
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
    this.scoreGift.y = 20;
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
    this.rocket.regX = img.naturalWidth / 2;
    this.rocket.regY = img.naturalWidth / 3;
    this.rocket.x = this.outer_w / 2;
    this.rocket.y = this.outer_h / 2;
    if (this.outer_w < 768) {
      this.rocket.scaleX = 0.5;
      this.rocket.scaleY = 0.5;
    }
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
      this.rocks[i] = new createjs.Shape();
      this.rocks[i].graphics.clear().beginBitmapFill(image).drawRect(0, 0, image.naturalWidth, image.naturalHeight).command;
      this.rocks[i].radius = image.naturalHeight;
      this.rocks[i].regX = image.naturalWidth / 2;
      this.rocks[i].regY = 0;
      if (this.outer_w < 768) {
        this.rocks[i].scaleX = 0.5;
        this.rocks[i].scaleY = 0.5;
      }
      // this.rocks[i].scaleX = 1;
      // this.rocks[i].scaleY = 1;
      this.rocks[i].width = image.naturalWidth;
      this.rocks[i].height = image.naturalHeight;
      this.rocks[i].x = Math.random() * this.outer_w;
      this.rocks[i].y = -image.naturalHeight;
      this.stage.addChild(this.rocks[i]);
      this.stage.update();

      this.flyItem(this.rocks[i], 'rock', i);
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
      if (this.outer_w < 768) {
        this.snowflake[i].scaleX = 0.5;
        this.snowflake[i].scaleY = 0.5;
      }
      // this.snowflake[i].scaleX = 1;
      // this.snowflake[i].scaleY = 1;
      this.snowflake[i].width = img.naturalWidth;
      this.snowflake[i].height = img.naturalWidth;
      this.snowflake[i].x = Math.random() * this.outer_w;
      this.snowflake[i].y = -img.naturalHeight;
      this.stage.addChild(this.snowflake[i]);
      this.stage.update();

      this.flyItem(this.snowflake[i], 'snowflake', i);
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
    console.log('renderGift');
    var giftType = Math.floor(Math.random() * 6) + 1;
    var que = new createjs.LoadQueue();

    que.loadFile({
      id: "gift-" + i,
      src: "../img/gift-" + giftType + ".png"
    });

    que.on("fileload", e => {
      this.giftID++;
      let image = e.result;
      this.gifts[i] = new createjs.Bitmap(image);
      var img = this.gifts[i].image;
      this.gifts[i].id = 'gift-' + this.giftID;
      console.log(this.giftID);
      this.gifts[i].regX = img.naturalWidth / 2;
      this.gifts[i].regY = img.naturalHeight / 2;
      if (this.outer_w < 768) {
        this.gifts[i].scaleX = 0.5;
        this.gifts[i].scaleY = 0.5;
      }
      // this.gifts[i].scaleX = 1;
      // this.gifts[i].scaleY = 1;
      this.gifts[i].width = img.naturalWidth;
      this.gifts[i].height = img.naturalWidth;
      this.gifts[i].x = Math.random() * this.outer_w;
      this.gifts[i].y = -img.naturalHeight;
      this.stage.addChild(this.gifts[i]);
      this.stage.update();


      this.flyItem(this.gifts[i], 'gift', i);

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

  flyItem(item, type, idx) {
    var angle = this.rocket.rotation % 360 * (this.rocket.rotation % 360 < 0 ? -1 : 1);
    var img_h = item.height;
    var img_w = item.width;
    // debugger;
    if (item.y > this.outer_h + img_h || item.y < -img_h || item.x > this.outer_w + img_w || item.x < -img_w) {

      if (angle > 45 && angle < 135) {
        item.x = this.outer_w + img_w;
      } else if (angle > 225 && angle < 315) {
        item.x = -img_w;
      } else {
        item.x = Math.random() * this.outer_w;
      }

      if (angle > 315 && angle <= 360 || angle >= 0 && angle <= 45) {
        item.y = -img_h;
      } else if (angle > 45 && angle < 135 || angle > 225 && angle < 315) {
        item.y = Math.random() * this.outer_h;
      } else if (angle > 135 && angle < 225) {
        item.y = this.outer_h + img_h;
      } else {
        item.y = Math.random() * this.outer_h;
      }

      item.visible = true;

      if ( type == 'gift' ) {
        this.gotGiftID = [];
      }

    } else {
      item.x += Math.sin(this.rocket.rotation * (Math.PI / -180)) * this.SPEED * (img_h / 300);
      item.y += Math.cos(this.rocket.rotation * (Math.PI / -180)) * this.SPEED * (img_h / 300);
    }


    this.stage.update();

    if (this.gameStart) {
      setTimeout(() => {
        this.flyItem(item);
      }, 60);
    }
  }

  tick(event) {
    //handle turning
    if (this.gameStart) {
      // if (this.fwdHeld) {
      //   this.SPEED_RATE += 0.1;
      //   this.SPEED += this.SPEED_RATE;
      // } else if (this.fsdHeld && this.SPEED_RATE > 0.1) {
      //   this.SPEED_RATE -= 0.1;
      //   this.SPEED -= this.SPEED < 1 ? 0 : this.SPEED_RATE;
      // }

      if (this.lfHeld) {
        this.rocket.rotation -= this.TURN_FACTOR;
      } else if (this.rtHeld) {
        this.rocket.rotation += this.TURN_FACTOR;
      }

      for (let r in this.rocks) {
        var rock = this.rocks[r];
        // debugger;
        if (this.detectHit(rock)) {
          this.gameStart = false;
          this.gameFisnish = false;
          this.gameFinish();
        }
      }

      for (let k in this.gifts) {
        var gift = this.gifts[k];
        if (this.detectHit(gift)) {
          gift.visible = false;
          if ( this.gotGiftID.indexOf(gift.id) == -1 ) {
            console.log('detect ' + gift.id);
            this.gotGiftID.push(gift.id);
            this.gotGift++;
            console.log('gotGift' + this.gotGift);
            if (this.gotGift.toFixed(0) == 4) {
              this.gameFinishSuccess();
            }
          }
          // gift.id = 0;
        }
      }

      // this.gotGiftID = [];

      // this.distance += (this.SPEED / 50);
      // this.score.text = this.distance.toFixed(1) + " light year";
      this.scoreGift.text = "YOU HAVE " + this.gotGift.toFixed(0) + " GIFTS";
    }
    this.stage.update();
  }

  degToRad(deg) {
    return deg * Math.PI / 180;
  }

  detectHit(item) {
    var cx, cy;
    var position = item.localToLocal(100, 0, this.rocket);
    return this.rocket.hitTest(position.x, position.y);
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
      // case KEYCODE_W:
      // case KEYCODE_UP:
      //   this.fwdHeld = true;
      //   return false;
      // case KEYCODE_S:
      // case KEYCODE_DOWN:
      //   this.fsdHeld = true;
      //   return false;
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
      // case KEYCODE_W:
      // case KEYCODE_UP:
      //   this.fwdHeld = false;
      //   break;
      // case KEYCODE_S:
      // case KEYCODE_DOWN:
      //   this.fsdHeld = false;
      //   break;
    }
  }

}


function renderCanvas() {
  new rocket('rocket');
}

window.onload = renderCanvas();


