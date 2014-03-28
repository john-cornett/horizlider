/*
 * ! jquery.horizlider.js 1.0.0 - Allows horizontal slides of content that display and go right and left. 
 * @author John Cornett - Copyright (c) 2013 - Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
(function($) {

	// Private variables

	var _options = {};
	var _container = {};
	var _canvas = {};
	var _selector = '';
	var _slides = {};
	var _hiders = {};
	var _active = {};
	var _pos = 0;
	var _width = 0;
	var _top_sections = {};
	var _middle_sections = {};
	var _bottom_sections = {};

	// Public functions

	jQuery.fn.horizlider = function(options) {
		_options = $.extend({}, $.fn.horizlider.defaults, options);
		return this.each(function() {
			_container = $(this);
			init();
		});
	};

	// Private functions

	function init() {
		_canvas = $(_container).find('.expander');
		_selector = '.' + _canvas[0].className.replace(/ /g, '.') + ' ';
		_slides = $(_canvas).find('.slide');
		_hiders = $(_container).find('.middle-section, .bottom-section, .mobile-section');
		_mobile_sections = $(_container).find('.mobile-section');
		_top_sections = $(_container).find('.top-section');
		_middle_sections = $(_container).find('.middle-section');
		_bottom_sections = $(_container).find('.bottom-section');
		_next_arrow = $(_canvas).find('.nav-arrow-next');
		_prev_arrow = $(_canvas).find('.nav-arrow-prev');
		_active = $(_canvas).find('.active');

		// If the breadcrumb contains nothing, don't do anything
		if (_slides.length > 0) {
			$(_slides[0]).addClass('first');
			if (_slides.length > 1) {
				$(_slides.last()).addClass('last');
			}
			set_tick_position();
			setup_clicks();
			check_buttons();

			window.onresize = function(event) {
				calibrate_slides(_pos - 1);
			}
		}
	}

	function set_slider_width() {
		_width = $(window).width();
	}

	function calibrate_slides(pos) {
		set_slider_width();
		$(_slides).each(function(i) {
			$(this).width(_width);
			if (pos >= i) {
				$(this).css("margin-left", (pos - i) * -_width);
			} else {
				$(this).css("margin-left","");				
			}
		});

	}

	function get_tick_position() {
		var sec_width = 100 / $(_slides).length;
		var offset = (sec_width * _pos) - (sec_width / 2);
		if (_pos <= ($(_slides).length / 2)) {
			offset = offset - (sec_width * 0.05);
		}
		return offset;
	}

	function set_tick_position() {
		var left_offset = get_tick_position() + "%";
		$(_selector + '.expander-inner:before').addRule({
			left : left_offset
		});
	}

	function show_canvas() {
		$(_hiders).fadeOut(400, 'swing', function() {
			$(_canvas).slideDown();
		});
	}

	function hide_canvas() {
		$(_canvas).slideUp(400, function() {
			$(_hiders).fadeIn();
		});
	}

	function setup_click_custom(arr) {
		$(arr).each(function(i) {
			$(this).click(function(e) {
				if (goto_slide(i)) {
					show_canvas();
				}
			});
		});
	}
	
	function setup_clicks() {
		$(_selector + '.expander-close').click(function(e) {
			hide_canvas();
		});

		setup_click_custom(_mobile_sections);
		setup_click_custom(_top_sections);
		setup_click_custom(_middle_sections);
		setup_click_custom(_bottom_sections);

		$(_next_arrow).click(function() {
			next_slide("right");
		});
		$(_prev_arrow).click(function() {
			next_slide("left");
		});
	}

	function check_buttons() {
		if ($('.slide.last.active').length) {
			$('.nav-arrow-next').hide();
		} else {
			$('.nav-arrow-next').show();
		}
		if ($('.slide.first.active').length) {
			$('.nav-arrow-prev').hide();
		} else {
			$('.nav-arrow-prev').show();
		}
	}

	function next_slide(direction) {
		if (direction == 'right') {
			$(_active).next().addClass('active');
			$(_active).animate({
				marginLeft : -$(_active).outerWidth()
			});
			$(_active).removeClass('active');
			_pos++;
		} else if (direction == 'left') {
			$(_active).prev().addClass('active');
			$(_active).prev().animate({
				marginLeft : 0
			});
			$(_active).removeClass('active');
			_pos--;
		}
		_active = $(_canvas).find('.active');
		check_buttons();
		set_tick_position();
	}

	function goto_slide(pos) {
		if (_pos == pos + 1) {
			hide_canvas();
			_pos = 0;
			return false;
		} else {
			$('.slide').removeClass('active');
			$(_slides[pos]).addClass('active');
			calibrate_slides(pos);
			_pos = pos + 1;
			_active = $(_canvas).find('.active');
			check_buttons();
			set_tick_position();
			return true;
		}
	}

	// Public global variables
	$.fn.horizlider.defaults = {};

})(jQuery);

/*
 * ! jquery.addrule.js 0.0.1 - https://gist.github.com/yckart/5563717/ Add css-rules to an existing stylesheet.
 * @see http://stackoverflow.com/a/16507264/1250044
 * Copyright (c) 2013 Yannick Albert (http://yckart.com) Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php). 2013/05/12
 */
(function($) {
	window.addRule = function(selector, styles, sheet) {
		styles = (function(styles) {
			if (typeof styles === "string")
				return styles;
			var clone = "";
			for ( var p in styles) {
				if (styles.hasOwnProperty(p)) {
					var val = styles[p];
					p = p.replace(/([A-Z])/g, "-$1").toLowerCase(); 
					clone += p + ":" + (p === "content" ? '"' + val + '"' : val) + "; ";
				}
			}
			return clone;
		}(styles));
		sheet = sheet || document.styleSheets[document.styleSheets.length - 1];
		if (sheet.insertRule)
			sheet.insertRule(selector + " {" + styles + "}", sheet.cssRules.length);
		else if (sheet.addRule)
			sheet.addRule(selector, styles);
		return this;
	};
	if ($)
		$.fn.addRule = function(styles, sheet) {
			addRule(this.selector, styles, sheet);
			return this;
		};
}(window.jQuery));
