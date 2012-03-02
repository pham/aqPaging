(function($) {
$.fn.aqPaging = function($options) {
	var _o = $.extend({
		border: '#eeeeee',
		fg: '#444444',
		bg: '#eeeeee',
		padding: '2px 5px',
		margin: '0 2px',
		pages: 0,
		max: 10,
		current: 1,
		urlHash: false
	},$options);

	var _draw = function($ob) {
		$ob.empty();

		var _s = 1,
			_e = _o.pages,
			_p,
			_offset = (_o.current > _o.max) ? 1 : 0;

		if (_o.pages > _o.max) {
			if (_o.current > _o.max) {
				_s = _o.max *
					parseInt((_o.current - _offset) / _o.max, 10);
			}

			if (_o.current - _offset + _o.max < _o.pages) {
				_e = _s + _o.max + _offset;
			}
		}

		for (_p = _s; _p <= _e; _p++) {
			$('<a\/>')
				.attr('href', '#' + _p)
				.text(_p)
				.appendTo($ob);
		}

		if (_o.current >= _s && _o.current - _o.max > 0) {
			$ob.prepend('<a href="#1">1<\/a><i>&hellip;<\/i>');
		}

		if ((_o.current - _offset + _o.max) <= _o.pages &&
			_e !== _o.pages) {
			$ob.append('<i>&hellip;<\/i>' +
				'<a href="#' + _o.pages + '">' + _o.pages + '<\/a>');
		}

		$('<br\/>')
			.css({ float: 'none', clear: 'both' })
			.appendTo($ob);

		$('A, I', $ob)
		.css({
			display: 'block',
			float: 'left',
			padding: _o.padding,
			margin: _o.margin
		})
		.filter('A')
		.css({
			border: '1px solid ' + _o.border,
			textDecoration: 'none',
			color: _o.fg,
			backgroundColor: _o.bg
		})
		.hover(
			function() {
				$(this).css({backgroundColor: _o.fg, color: _o.bg});
			},
			function() {
				if ($(this).attr('href') !== '#' + _o.current) {
					$(this).css({backgroundColor: _o.bg, color: _o.fg});
				}
			}
		);
	};

	return this.each(function() {
		if (_o.pages <= 1) {
			return false;
		}

		var _ob = $('.aqPaging', this);

		if (!_ob.length) {
			_ob = $('<div\/>')
				.addClass('aqPaging')
				.appendTo(this);
		}

		_ob.bind('highlight', function() {
			_draw(_ob);
			$('A', _ob)
				.css({ backgroundColor: _o.bg, color: _o.fg})
				.filter('A[href="#' + _o.current + '"]')
				.css({ backgroundColor: _o.fg, color: _o.bg});
		})
		.trigger('highlight');

		_ob.on('click', 'A', function($e, $p) {
			_o.current = parseInt($p || $(this).text(), 10);

			_ob.trigger('highlight');

			if ($.isFunction(_o.cb)) {
				_o.cb(_o.current);
			}

			if (_o.urlHash) {
				location.hash = _o.current;
			}
			return false;
		});

        if (_o.urlHash) {
            $(window).unbind('hashchange')
			.bind('hashchange', function($e) {
                var _page = location.hash.substring(1);
                if (_o.current !== _page) {
                    _ob.find('A:first').trigger('click', [_page]);
                }
            });

            var _p = parseInt(location.hash.replace(/[^0-9]/g, ''), 10);
            if (_p && _o.current !== _p) {
				_ob.find('A:first').trigger('click', [_p]);
            }
        }
	});
};

})(jQuery);
