require('hammerjs');

var touchY = 0,
  dir = '',
  isSwipe = false;

$(document).on('touchstart', '.swipe-bar', (e) => { 
  e.preventDefault();
  touchY = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageY : e.pageY;
  isSwipe = true;
  $("body").addClass("is-swipe");
  $('.swipe-panel').removeClass('transition in out').css({
    transform: 'translateY(' + ((touchY -70) / $(window).height()) * 100 + '%)'
  });
});

$('.swipe-bar').on('touchmove', (e) => { 
  e.preventDefault();
  if( !isSwipe ) return;
  
  const pageY = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageY : e.pageY;

  dir = (pageY<touchY) ? 'up' : 'down';

  $('.swipe-panel').css({
    transform: 'translateY(' + ((pageY -70) / $(window).height())*100 + '%)'
  });
});

$('.swipe-bar').on('touchend', (e) => { 
  e.preventDefault();
  if( !isSwipe ) return;
  
  $('.swipe-panel').addClass('transition');

  if(dir=='up')
    $('.swipe-panel').addClass('in')
  else
    $('.swipe-panel').addClass('out')

  $("body").removeClass("is-swipe");
  isSwipe = false;
});