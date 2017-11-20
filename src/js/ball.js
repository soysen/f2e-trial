window.createjs = this.createjs = require('createjs-module');
require('createjs-easeljs');

function ball(id) {

  // set size
  var canvas = document.querySelector("#" + id);
  var outer_w = canvas.parentNode.clientWidth;
  var outer_h = canvas.parentNode.clientHeight;
  var ball_size = 12;
  var speed = 0;
  var drop = null;
  canvas.width = outer_w;
  canvas.height = outer_h;
  // init
  var stage = new createjs.Stage(id);
  var ball = new createjs.Shape();
  ball.graphics.beginFill('red').drawCircle(0, 0, ball_size);
  ball.x = (outer_w / 2 - ball_size);
  ball.y = (outer_h / 2 - ball_size);
  ball.cursor = 'pointer';
  stage.addChild(ball);
  stage.update();

  var is_hold = false,
    vy = 0, //初始速度
    gravity = 0.24, //定义重力加速度
    bounce = -0.85; //定义反弹系数


  ball.addEventListener('pressmove', function (e) {
    is_hold = true;
    ball.x = stage.mouseX;
    ball.y = stage.mouseY;
    stage.update();
    vy = 0;
  });

  //碰撞检测
  function checkGround(ball) {
    if (ball.y + ball_size > outer_h) {
      ball.y = canvas.height - ball_size;
      vy *= bounce; //速度反向并且减小
    }
  }

  (function drawFramw() {
    window.requestAnimationFrame(drawFramw, canvas);
    // context.clearRect(0, 0, canvas.width, canvas.height);

    vy += gravity;
    ball.y += vy;

    //碰撞检测
    checkGround(ball);
    stage.update();
  }());
}

function renderCanvas() {
  ball('ball');
}

window.onload = renderCanvas()