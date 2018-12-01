window.createjs = this.createjs = require('createjs-module');
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
    this.canvas.height = this.outer_h;
    this.xmasPlanet;
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
    this.soundMute = true;
    this.rocket;
    this.firework;
    // this.score = new createjs.Text(this.distance + " light year", "bold 2em Oswald", "#FFFFFF");
    this.scoreGift = new createjs.Text("YOU HAVE " + this.gotGift + "GIFTS", "bold 2em", "#FFFFFF");
    this.stage = new createjs.Stage(this.id);

    this.manifest = [{
      src: "../img/santa-claus.png",
      id: "santaClaus"
    }, {
      src: "../img/santa-claus-broke.png",
      id: "santaClausBroke"
    }, {
      src: "../img/Got_it.png",
      id: "firework"
    }, {
      id: "planet-1",
      src: "../img/planet-1.png"
    }, {
      id: "planet-2",
      src: "../img/planet-2.png"
    }, {
      id: "planet-3",
      src: "../img/planet-3.png"
    }, {
      id: "planet-4",
      src: "../img/planet-4.png"
    }, {
      id: "planet-5",
      src: "../img/planet-5.png"
    }, {
      id: "planet-6",
      src: "../img/planet-6.png"
    }, {
      id: "gift-1",
      src: "../img/gift-1.png"
    }, {
      id: "gift-2",
      src: "../img/gift-2.png"
    }, {
      id: "gift-3",
      src: "../img/gift-3.png"
    }, {
      id: "gift-4",
      src: "../img/gift-4.png"
    }, {
      id: "gift-5",
      src: "../img/gift-5.png"
    }, {
      id: "gift-6",
      src: "../img/gift-6.png"
    }, {
      id: "snowflake-1",
      src: "../img/snowflake-1.png"
    }, {
      id: "snowflake-2",
      src: "../img/snowflake-2.png"
    }, {
      id: "snowflake-3",
      src: "../img/snowflake-3.png"
    }, {
      id: "snowflake-4",
      src: "../img/snowflake-4.png"
    }, {
      id: "snowflake-5",
      src: "../img/snowflake-5.png"
    }, {
      id: "snowflake-6",
      src: "../img/snowflake-6.png"
    }, {
      src: "../img/start-btn.png",
      id: "start-btn"
    },{
      src: "../sounds/boom.mp3",
      id: "bell"
    },{
      src: "../sounds/gift.mp3",
      id: "bell"
    },{
      src: "../sounds/jingle-bells-country.mp3",
      id: "jingle-bell"
    }];

    this.queue = new createjs.LoadQueue();
    this.queue.installPlugin(createjs.Sound);
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
    createjs.Sound.alternateExtensions = ["mp3"];

    this.mc.add(new Hammer.Pan());
    this.stage.enableMouseOver(10);
    createjs.Touch.enable(this.stage);

    document.addEventListener('keydown', e => this.handleKeyDown(e));
    document.addEventListener('keyup', e => this.handleKeyUp(e));
    window.addEventListener('resize', e => this.resizeCanvas(e));
    document.querySelector('#start').addEventListener('click', (e) => this.startGame(e));
    document.querySelector('#restart').addEventListener('click', (e) => this.startGame(e));
    document.querySelector('#sound').addEventListener('click', (e) => this.toggleSound(e));

    this.queue.loadManifest(this.manifest);

    this.queue.on("complete", e => {
      $("#loading").remove();
      var sounds = [{
        src:"../sounds/boom.mp3",
        id: 'boom'
      }, {
        src:"../sounds/gift.mp3",
        id: 'gift'
      },{
        src: "../sounds/jingle-bells-country.mp3",
        id: "jingle-bell"
      }];
      createjs.Sound.alternateExtensions = ["mp3"];
      createjs.Sound.registerSounds(sounds);
      createjs.Sound.muted = this.soundMute;
      createjs.Sound.play("jingle-bell", 
        new createjs.PlayPropsConfig().set({
          loop: -1,
          volume: 0.5
        })
      );

      this.rocket = new createjs.Bitmap(this.queue.getResult("santaClaus"));
      this.firework = new createjs.Bitmap(this.queue.getResult("firework"));
      this.init();
    });

    this.mc.on('panmove panend', e => this.mcSwipe(e));

    createjs.Ticker.addEventListener("tick", (e) => this.tick());
  }
  
  toggleSound(e) {
    this.soundMute = !this.soundMute;
    createjs.Sound.muted = this.soundMute;

    if( this.soundMute ) {
      document.querySelector('#sound').className = '';
      document.querySelector('#sound').querySelector('span').innerText = "Off";
    } else {
      document.querySelector('#sound').className = 'on';
      document.querySelector('#sound').querySelector('span').innerText = "On";
    }
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
    this.stage.removeAllChildren();

    var img = this.rocket.image;
    // default 定位, 中心點
    this.rocket.regX = img.naturalWidth / 2;
    this.rocket.regY = img.naturalWidth / 3;
    this.rocket.width = img.naturalWidth;
    this.rocket.height = img.naturalHeight;

    var fire = this.firework.image;
    this.firework.regX = fire.naturalWidth / 2;
    this.firework.regY = fire.naturalWidth / 2;
    this.firework.width = fire.naturalWidth / 2;
    this.firework.height = fire.naturalHeight / 2;
    this.firework.alpha = 0;
    this.firework.scale = 0.1;

    if (this.outer_w < 768) {
      this.rocket.scaleX = 0.5;
      this.rocket.scaleY = 0.5;
      this.firework.scaleX = 0.5;
      this.firework.scaleY = 0.5;
    }

    this.rocket.x = this.outer_w / 2;
    this.rocket.y = this.outer_h / 2;

    this.stage.addChild(this.rocket);
    this.stage.addChild(this.firework);
    this.stage.update();

    if (!this.gameFisnish) {
      document.querySelector('#start-layer').className = 'layer';
    }
  }

  gameFinish() {

    document.querySelector('#finish-layer').className = 'layer';
    document.querySelector('#final-scoreGift').innerHTML = (3 - this.gotGift.toFixed(0));
    
    this.gameStart = false;
    this.stars = [];
    this.giftID = 0;
    this.gotGiftID = [];
    this.gifts = [];
    this.lfHeld = false;
    this.rtHeld = false;
    this.fwdHeld = false;
    this.fsdHeld = false;
    this.gameFisnish = true;

    // this.init();
  }


  gameFinishSuccess() {
    $('.card-content').removeClass('hidden');

    this.stage.removeAllChildren();

    this.gameStart = false;
    this.TURN_FACTOR = 5; //how far the ship turns per frame
    this.SPEED = 18; //how far the ship turns per frame
    this.SPEED_RATE = 0.1;
    this.stars = [];
    this.rocks = [];
    this.giftID = 0;
    this.gotGiftID = [];
    this.gifts = [];
    this.lfHeld = false;
    this.rtHeld = false;
    this.fwdHeld = false;
    this.fsdHeld = false;
    this.gameFisnish = true;

  }

  startGame(e) {
    this.rocks = [];
    this.init();

    this.renderStar();
    this.renderGift();
    this.renderSnowflake(0);

    this.gameFisnish = false;
    this.gotGift = 0;

    this.rocket.image = this.queue.getResult('santaClaus');
    document.querySelector('#finish-layer').className = 'layer hidden';
    document.querySelector('#start-layer').className = 'layer hidden';

    this.gameStart = true;

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

    let image = this.queue.getResult("planet-" + rockType);

    this.rocks[i] = new createjs.Shape();
    this.rocks[i].graphics.clear().beginBitmapFill(image).drawRect(0, 0, image.naturalWidth, image.naturalHeight).command;
    this.rocks[i].radius = image.naturalHeight;
    this.rocks[i].regX = image.naturalWidth / 2;
    this.rocks[i].regY = 0;
    if (this.outer_w < 768) {
      this.rocks[i].scaleX = 0.5;
      this.rocks[i].scaleY = 0.5;
    }

    this.rocks[i].width = image.naturalWidth;
    this.rocks[i].height = image.naturalHeight;
    this.rocks[i].x = Math.random() * this.outer_w;
    this.rocks[i].y = -image.naturalHeight;
    this.stage.addChild(this.rocks[i]);
    this.stage.update();

    this.flyItem(this.rocks[i], 'rock', i);

    if (i < this.rockNumber) {
      setTimeout(() => {
        this.renderRock(i + 1);
      }, Math.ceil(Math.random() * 8000))
    }
  }

  renderSnowflake(i) {
    var snowflakeType = Math.floor(Math.random() * 6) + 1;
    var image = this.queue.getResult("snowflake-" + snowflakeType);

    this.snowflake[i] = new createjs.Bitmap(image);
    var img = this.snowflake[i].image;
    this.snowflake[i].regX = img.naturalWidth;
    this.snowflake[i].regY = img.naturalHeight;

    if (this.outer_w < 768) {
      this.snowflake[i].scaleX = 0.5;
      this.snowflake[i].scaleY = 0.5;
    }

    this.snowflake[i].width = img.naturalWidth;
    this.snowflake[i].height = img.naturalWidth;
    this.snowflake[i].x = Math.random() * this.outer_w;
    this.snowflake[i].y = -img.naturalHeight;
    this.stage.addChild(this.snowflake[i]);
    this.stage.update();

    this.flyItem(this.snowflake[i], 'snowflake', i);

    if (i < this.snowflakeNumber) {
      setTimeout(() => {
        this.renderSnowflake(i + 1);
      }, Math.ceil(Math.random() * 15000))
    }

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
    this.giftID++;

    let image = this.queue.getResult("gift-" + this.giftID);
    this.gifts[i] = new createjs.Bitmap(image);
    var img = this.gifts[i].image;
    this.gifts[i].id = 'gift-' + this.giftID;
    this.gifts[i].regX = img.naturalWidth / 2;
    this.gifts[i].regY = img.naturalHeight / 2;

    if (this.outer_w < 768) {
      this.gifts[i].scaleX = 0.5;
      this.gifts[i].scaleY = 0.5;
    }

    this.gifts[i].width = img.naturalWidth;
    this.gifts[i].height = img.naturalWidth;
    this.gifts[i].x = Math.random() * this.outer_w;
    this.gifts[i].y = -img.naturalHeight;
    this.stage.addChild(this.gifts[i]);
    this.stage.update();


    this.flyItem(this.gifts[i], 'gift', i);

    if (i < this.giftNumber) {
      setTimeout(() => {
        this.renderGift(i + 1);
      }, Math.ceil(Math.random() * 10000))
      }

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

  }

  flyItem(item, type, idx) {
    var angle = this.rocket.rotation % 360 * (this.rocket.rotation % 360 < 0 ? -1 : 1);
    var img_h = item.height;
    var img_w = item.width;

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

    if (this.gameStart) {

      if (this.lfHeld) {
        this.rocket.rotation -= this.TURN_FACTOR;
      } else if (this.rtHeld) {
        this.rocket.rotation += this.TURN_FACTOR;
      }

      for (let r in this.rocks) {
        var rock = this.rocks[r];

        if (this.detectHit(rock)) {
          createjs.Sound.play("boom", 3);
          this.rocket.image = this.queue.getResult('santaClausBroke');
          this.gameStart = false;
          this.gameFisnish = false;
          this.gameFinish();
        }
      }

      for (let k in this.gifts) {
        var gift = this.gifts[k];

        if (this.detectHit(gift) && gift.visible) {

          this.firework.x = gift.x;
          this.firework.y = gift.y;

          createjs.Tween.get(this.firework).to({alpha:1, scaleX: 0.5, scaleY: 0.5 }, 50).call(()=>{
            createjs.Tween.get(this.firework).wait(300).to({alpha:0, scale: 0}, 100);
          });

          gift.visible = false;
          
          if ( this.gotGiftID.indexOf(gift.id) == -1 ) {
            createjs.Sound.play("gift", 3);
            this.gotGiftID.push(gift.id);
            this.gotGift++;
            if (this.gotGift.toFixed(0) == 3) {
              setTimeout(() => {
                this.gameFinishSuccess();
              }, 1000);
            }
          }

        } else {
          var index =  this.gotGiftID.indexOf(gift.id);
          if( index != -1 && gift.visible == true ) {
            this.gotGiftID.splice(index, 1);
          }
        }
      }

      this.scoreGift.text = "YOU HAVE " + this.gotGift.toFixed(0) + " GIFTS";
    }
    this.stage.update();
  }

  degToRad(deg) {
    return deg * Math.PI / 180;
  }

  detectHit(item) {
    var cx, cy;
    if( !item ) return;

    var position = item.localToLocal(80, 0, this.rocket);
    return this.rocket.hitTest(position.x, position.y);
  }

  countDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }


  handleKeyDown(e) {
    if (!e)
      var e = window.event;

    switch (e.keyCode) {
      case KEYCODE_A:
      case KEYCODE_LEFT:
        this.lfHeld = true;
        return false;

      case KEYCODE_D:
      case KEYCODE_RIGHT:
        this.rtHeld = true;
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
    }
  }

}


function renderCanvas() {
  new rocket('rocket');
}

window.onload = renderCanvas();


