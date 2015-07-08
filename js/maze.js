/* =========================================================
 * updownleftright => created by kevin hu
 * ========================================================= */

;(function(factory){

  if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
      module.exports = factory(require('jquery'));
  } else {
      factory(jQuery);
  }

})(function($){

	var maze = (function(element, settings){

    /*
     *  constructor function for maze
     */

    function settingDefault(element, settings){
      // create a new property to hold default settings and merge
      this.settings = $.extend({}, this, this.defaults, settings);

	    // default variables operates
      this.initials = {
      	width: 4,
      	height: 4,
      	mode: 'easy'
        // arrowUp: '.arrow-up',
        // arrowDown: '.arrow-down',
        // arrowRight: '.arrow-right',
        // arrowLeft: '.arrow-left'
      };

	    // extend this.initials args properties
      $.extend(this,this.initials);

      // operation on this.$el
      this.$el = $(element);

	    // ensure that the value of 'this' always references this element
      this.handleDirection = $.proxy(this.handleDirection,this);

      this.init();

		 	// provides each carousel with a unique ID
      // this.instanceUid = instanceUid++;
    }

    return settingDefault;

  })();

  maze.prototype.init = function(){
    // test unit
    // this.test();

	  // create item
    this.itemBuild();
    // create wall
    this.wallBuild();
	  // Start the maze
    this.mazeStart();
    // bind events like click next/prev arrows and indicator dots
    this.eventsBind();
  };

	/**
	 *  bulid items and settings maze height and width
	 */

	maze.prototype.itemBuild = function(){
		// setting maze height and width
		this.$el.css({width: this.settings.width * 100 + 'px', height: this.settings.height * 100 + 'px'});

		for(var k = 0, l = this.settings.height; k < l; k += 1){
			for(var i = 0, j = this.settings.width; i < j; i += 1){
				var item = '<div class="item" data-coorx="' + i + '" data-coory="' + k +'"></div>';
				this.$el.append(item);
			}
		}
		// console.log(this.$el.children().last().data('coordinates'));
	};

	/**
	 *  bulid items and settings maze height and width
	 */

	maze.prototype.mazeStart = function(){
		var startOK,
				endOK,
				startInit = {},
				endInit = {};

		// generate
		if(!startOK)
			genCoordinate(startInit, this.settings.width, this.settings.height);
		if(!endOK)
			genCoordinate(endInit, this.settings.width, this.settings.height);

		// check wall
		if(checkWall(this.$el.find('.item'), startInit.x, startInit.y)){
			this.mazeStart();
    	return;
  	}else
  		startOK = true;
		if(checkWall(this.$el.find('.item'), endInit.x, endInit.y)){
			this.mazeStart();
    	return;
  	}else
  		endOK = true;

		// check start end
		if(startInit.x === endInit.x && startInit.y === endInit.y){
    	endOK = false;
    	// regenerate end coordinate
    	this.mazeStart();
    	return;
    }

		this.$el.find('.item').each(function(index, element){
			var $this = $(element),
					findStart,
					findEnd;
			if(!findStart && startInit.x === $this.data('coorx') && startInit.y === $this.data('coory')){
				$this.addClass('current');
				findStart = true;
			}
			if(!findEnd && endInit.x === $this.data('coorx') && endInit.y === $this.data('coory')){
				$this.addClass('end');
				findEnd = true;
			}
			// if start and end setting completed
			if(findStart && findEnd)
				return false;
		});
	};

	/**
	 *  bulid random wall
	 */

	maze.prototype.wallBuild = function(){
		switch(this.settings.mode) {
	    case 'easy':
	    	genWall(this.$el.find('.item'), 0, 2);
	    	genWall(this.$el.find('.item'), 0, 3);
	    	genWall(this.$el.find('.item'), 1, 0);
	    	genWall(this.$el.find('.item'), 2, 0);
	    	genWall(this.$el.find('.item'), 3, 0);
	    	genWall(this.$el.find('.item'), 3, 2);
	    	genWall(this.$el.find('.item'), 3, 3);
				break;
	    case 'normal':
	    	// if(newY === 0)
					// return;
				// newY -= 1;
				break;
	    case 'hard':
	    	// if(newX === this.settings.width - 1)
	    		// return;
				// newX += 1;
				break;
			default:
				return;
		}
	};

	/**
	 *  bulid items and settings maze height and width
	 */

	maze.prototype.eventsBind = function(){
		$(document).keydown(throttle(this.handleDirection, 50));
	};

	/**
	 *  bulid items and settings maze height and width
	 */

	maze.prototype.handleDirection = function(e){
		var $current = this.$el.find('.current'),
				$newCurrent;

		var newX = $current.data('coorx'),
		 		newY = $current.data('coory');

		// left = 37, up = 38, right = 39, down = 40
		if(e.keyCode < 37 || e.keyCode > 40)
			return;

		switch(e.keyCode) {
	    case 37:
	    	if(newX === 0)
	    		return;
				newX -= 1;
				break;
	    case 38:
	    	if(newY === 0)
					return;
				newY -= 1;
				break;
	    case 39:
	    	if(newX === this.settings.width - 1)
	    		return;
				newX += 1;
				break;
	    case 40:
	    	if(newY === this.settings.height - 1)
	    		return;
				newY += 1;
				break;
			default:
				return;
		}

		// check wall
		if(checkWall(this.$el.find('.item'), newX, newY))
			return;

		$current.removeClass('current');
		this.$el.find('.item').each(function(index, element){

			var $this = $(element);
			if(newX === this.$el.find('.end').data('coorx') && newY === this.$el.find('.end').data('coory')){
				alert('over');
				return false;
			}
			if(newX === $this.data('coorx') && newY === $this.data('coory')){
				$this.addClass('current');
				return false;
			}
		}.bind(this));
	};

	/**
	 *  init once for each dom object passed to jquery
	 */

	$.fn.maze = function(options){
    return this.each(function(index,el){
      el.maze = new maze(el,options);
    });
  };

  // generate maze wall
  function genWall(objs, x, y) {
  	objs.filter('[data-coorx="' + x + '"]').filter('[data-coory="' + y + '"]').addClass('wall');
  };

  // generate integer between maze size
  function genCoordinate(obj, width, height) {
  	obj.x = Math.floor(Math.random() * width);
  	obj.y = Math.floor(Math.random() * height);
  	return obj;
  };

  // check is wall or not
  function checkWall(objs, x, y) {
  	return objs.filter('[data-coorx="' + x + '"]').filter('[data-coory="' + y + '"]').hasClass('wall') ? true : false;
  };

  // add extra function throttle for event function
  function throttle(fn, threshhold, scope) {
    // default 250 ms if not setting
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date,
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

});