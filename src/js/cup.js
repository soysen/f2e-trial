window.$ = window.jQuery = require('jquery');

class FindRabbit {
  constructor() {
    this.container = $("#cup-container");
    this.hats = [$("#hat-1"), $("#hat-2"), $("#hat-3")];
    this.rabbitIdx = Math.ceil(Math.random() * 3) - 1;
    this.startLayer = $('#game-start');
    this.startBtn = $("#start");
    this.shuffleSpeed = 500;
    this.nuberOfShuffels = 10;
    this.currentShuffleTime = 0;
    this.gameFinish = false;
    this.z = 0;

    this.init();

    this.startBtn.on('click', e => {
      this.gameStart()
    });

    $(this.container).find('.hat-container').click(e => {
      if (!this.gameFinish) return;
      e.preventDefault();
      this.showResult(e);
    });
  }

  init() {
    this.hats[this.rabbitIdx].addClass('with-rabbit').prepend(
      $("<div/>", {
        class: "rabbit bounceInUp animated"
      })
    );
  }

  shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  gameStart() {
    this.gameFinish = false;
    this.currentShuffleTime = 0;
    this.startLayer.addClass("hidden");
    this.container.find('.rabbit').removeClass("bounceInUp").addClass('bounceOutDown');

    var hat1_left = this.hats[0].position().left,
      hat2_left = this.hats[1].position().left,
      hat3_left = this.hats[2].position().left,
      hat_top = this.hats[2].position().top;

    this.hats[0].css({
      position: "absolute",
      top: hat_top + "px",
      left: hat1_left + "px"
    });

    this.hats[1].css({
      position: "absolute",
      top: hat_top + "px",
      left: hat2_left + "px"
    });

    this.hats[2].css({
      position: "absolute",
      top: hat_top + "px",
      left: hat3_left + "px"
    });

    this.shuffleHat();
  }

  showResult(e) {
    $(".rabbit").removeClass("bounceOutDown").addClass('bounceInUp');

    setTimeout(() => {
      if ($(e.target).find(".rabbit").length || $(e.target).siblings('.rabbit').length)
        alert('Bingo!');
      else
        alert('Loooooser!');
    }, this.shuffleSpeed);

    this.startLayer.removeClass('hidden');
  }

  shuffleHat() {
    var interval = setInterval(() => {
      // Stop Shuffle
      if (this.currentShuffleTime >= this.nuberOfShuffels) {
        clearInterval(interval);
        this.gameFinish = true;
      }

      // Shuffle
      var array = this.shuffle([1, 2, 3]);
      var time = this.shuffleSpeed;

      var h_1_left = $("#hat-" + array[1]).position().left;
      var h_0_left = $("#hat-" + array[0]).position().left;
      $("#hat-" + array[0]).animate({
        left: h_1_left + "px",
        zIndex: 0
      }, time);

      $("#hat-" + array[1]).animate({
        left: h_0_left + "px",
        zIndex: 1
      }, time);

      this.currentShuffleTime++;

    }, this.shuffleSpeed * 1.5);
  }
}


window.onload = function () {
  window.rabbitGame = new FindRabbit();
}