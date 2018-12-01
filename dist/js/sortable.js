(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Sortable {
  constructor (el) {
    this.el = $(el);
    this.isTouched;
    this.isMoved;
    this.touchStartY;
    this.touchesDiff;
    this.$sortingEl;
    this.$sortingItems;
    this.$container = $('.swipe-panel > .panel-body');
    this.$sortableContainer;
    this.sortingElHeight;
    this.minTop;
    this.maxTop;
    this.$insertAfterEl;
    this.$insertBeforeEl;
    this.indexFrom;
    this.$pageEl;
    this.$pageContentEl;
    this.pageHeight;
    this.pageOffset;
    this.sortingElOffsetLocal;
    this.sortingElOffsetTop;
    this.initialScrollTop;

    $(document).on('touchstart', '.list.sortable .sortable-handler', (e) => { this.handleTouchStart(e) });
    this.el.on('touchmove', (e) => { this.handleTouchMove(e) });
    this.el.on('touchend', (e) => { this.handleTouchEnd(e) });
  }

  handleTouchStart(e) {
    console.log('handleTouchStart', this.el)
    this.isMoved = false;
    this.isTouched = true;
    this.touchStartY = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageY : e.pageY;
    this.$sortingEl = $(e.target).parents('li');
    this.indexFrom = this.el.find('li').index(this.$sortingEl);
    this.$sortableContainer = this.$sortingEl.parents('.sortable');
    const $listGroup = this.$sortingEl.parents('.list-group');
    if ($listGroup.length && $listGroup.parents(this.$sortableContainer).length) {
      this.$sortableContainer = $listGroup;
    }

    this.$sortingItems = this.$sortableContainer.children('ul').children('li');
  }

  handleTouchMove(e) {
    console.log('handleTouchMove', e, this.isTouched, this.isMoved)
    if (!this.isTouched || !this.$sortingEl) return;
    const pageY = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageY : e.pageY;
    const paddingTop = 0;
    const paddingBottom = 0;
    if (!this.isMoved) {
      this.$pageEl = this.$sortingEl.parents('body');
      this.$pageContentEl = this.$container;
      this.initialScrollTop = this.$container[0].scrollTop;
      this.pageOffset = this.$pageEl.offset().top + paddingTop;
      this.pageHeight = this.$pageEl.height() - paddingTop - paddingBottom;
      this.$sortingEl.addClass('sorting');
      this.$sortableContainer.addClass('sortable-sorting');
      this.sortingElOffsetLocal = this.$sortingEl[0].offsetTop;
      this.minTop = this.$sortingEl[0].offsetTop;
      this.maxTop = this.$sortingEl.parent().height() - this.sortingElOffsetLocal - this.$sortingEl.height();
      this.sortingElHeight = this.$sortingEl[0].offsetHeight;
      this.sortingElOffsetTop = this.$sortingEl.offset().top;
    }
    this.isMoved = true;

    e.preventDefault();

    this.touchesDiff = pageY - this.touchStartY;

    const translateScrollOffset = this.$pageContentEl[0].scrollTop - this.initialScrollTop;
    const translate = Math.min(Math.max(this.touchesDiff + translateScrollOffset, -this.minTop), this.maxTop);

    this.$sortingEl.css('transform',`translate3d(0,${translate}px,0)`);

    const scrollAddition = 44;
    let allowScroll = true;
    if ((this.touchesDiff + this.translateScrollOffset) + this.scrollAddition < -this.minTop) {
      this.allowScroll = false;
    }
    if ((this.touchesDiff + this.translateScrollOffset) - this.scrollAddition > this.maxTop) {
      this.allowScroll = false;
    }

    this.$insertBeforeEl = undefined;
    this.$insertAfterEl = undefined;

    let scrollDiff;
    if (allowScroll) {
      if (this.sortingElOffsetTop + this.touchesDiff + this.sortingElHeight + this.scrollAddition > this.pageOffset + this.pageHeight) {
        // To Bottom
        scrollDiff = (this.sortingElOffsetTop + this.touchesDiff + this.sortingElHeight + this.scrollAddition) - (this.pageOffset + this.pageHeight);
      }
      if (this.sortingElOffsetTop + this.touchesDiff < this.pageOffset + scrollAddition) {
        // To Top
        scrollDiff = (this.sortingElOffsetTop + this.touchesDiff) - this.pageOffset - this.scrollAddition;
      }
      if (scrollDiff) {
        this.$pageContentEl[0].scrollTop += scrollDiff;
      }
    }

    this.$sortingItems.each((index, el) => {
      const $currentEl = $(el);

      if ($currentEl[0] === this.$sortingEl[0]) return;
      const currentElOffset = $currentEl[0].offsetTop;
      const currentElHeight = $currentEl.height();
      const sortingElOffset = this.sortingElOffsetLocal + translate;
      let currentIdx = this.$sortingItems.index(el)
      let sortingElIdx = this.$sortingItems.index(this.$sortingEll)
      
      if ((sortingElOffset >= currentElOffset - (currentElHeight / 2)) && this.indexFrom < currentIdx) {
        $currentEl.css('transition',`transform .2s`);
        $currentEl.css('transform',`translate3d(0, ${-this.sortingElHeight}px,0)`);
        this.$insertAfterEl = $currentEl;
        this.$insertBeforeEl = undefined;
      } else if ((sortingElOffset <= currentElOffset + (currentElHeight / 2)) && this.indexFrom > currentIdx) {
        $currentEl.css('transition',`transform .2s`);
        $currentEl.css('transform',`translate3d(0, ${this.sortingElHeight}px,0)`);
        this.$insertAfterEl = undefined;
        if (!this.$insertBeforeEl) this.$insertBeforeEl = $currentEl;
      } else {
        $currentEl.css('transform','translate3d(0, 0%,0)');
      }
    });
  }
  handleTouchEnd () {
    if (!this.isTouched || !this.isMoved) {
      this.isTouched = false;
      this.isMoved = false;
      return;
    }
    
    this.$sortingItems.css('transition',``);
    this.$sortingItems.css('transform', '');
    this.$sortingEl.removeClass('sorting');
    this.$sortableContainer.removeClass('sortable-sorting');

    let virtualList;
    let oldIndex;
    let newIndex;
    
    if (this.$insertAfterEl) {
      this.$sortingEl.insertAfter(this.$insertAfterEl);
    }
    if (this.$insertBeforeEl) {
      this.$sortingEl.insertBefore(this.$insertBeforeEl);
    }
  
    if ((this.$insertAfterEl || this.$insertBeforeEl)
       && this.$sortableContainer.hasClass('virtual-list')
    ) {
      virtualList = this.$sortableContainer[0].f7VirtualList;
      oldIndex = this.$sortingEl[0].f7VirtualListIndex;
      newIndex = this.$insertBeforeEl ? this.$insertBeforeEl[0].f7VirtualListIndex : this.$insertAfterEl[0].f7VirtualListIndex;
      if (virtualList) virtualList.moveItem(oldIndex, newIndex);
    }

    // this.$sortingEl.trigger('sortable:sort', { from: indexFrom, to: $sortingEl.index() });
    // app.emit('sortableSort', $sortingEl[0], { from: indexFrom, to: $sortingEl.index() });

    this.$insertBeforeEl = undefined;
    this.$insertAfterEl = undefined;
    this.isTouched = false;
    this.isMoved = false;
  }
  enable() {
    if (this.el.length === 0) return;
    this.el.addClass('sortable-enabled');
    this.el.trigger('sortable:enable');
  }
  disable() {
    if (this.el.length === 0) return;
    this.el.removeClass('sortable-enabled');
    this.el.trigger('sortable:disable');
  }
  toggle() {
    if (this.el.length === 0) return;
    if (this.el.hasClass('sortable-enabled')) {
      this.disable();
    } else {
      this.enable();
    }
  }
}

(function() {
  const sorting = new Sortable('.list.sortable');
  sorting.enable();
})();
},{}]},{},[1])
//# sourceMappingURL=sortable.js.map
