(function ($) {
    var overlayClass = 'yabox_overlay';

    function yabox($elem, opts) {
        var $overlay = getOrCreate('.' + overlayClass, overlay);
        var $full = full();

        if(opts.$content) opts.$content.hide();

        if(!$elem) return {
            show: show,
            hide: forceHide($full)
        };

        function getOrCreate(selector, creator) {
            var elem = $(selector + ':first');
            return elem.length? elem: creator();
        }

        function overlay() {
            return $('<div/>')
                .appendTo($('body'))
                .addClass(overlayClass)
                .hide();
        }

        function full() {
            var $e = $('<div/>').hide()
                .css({
                    'z-index': $overlay.css('z-index') + 1
                })
                .addClass(opts.fullClass)
                .appendTo($('body'));

            $e.bind('click', hide($e));

            return $e;
        }

        if($elem) $elem.bind('click', function(e) {
            e.preventDefault();

            show();
        });

        function show() {
            var $content;
            if(opts.$content) {
                opts.$content.show();
                $content = opts.$content;
            }
            else if($elem) $content = $elem.clone();

            $content.removeClass();

            $full.html($content);

            $full.center();
            opts.cbs.show($overlay, $full, $elem);

            $overlay.unbind('click');
            $overlay.bind('click', hide($('.' + opts.fullClass)));
            $overlay.unbind('hide');
            $overlay.bind('hide', forceHide($full));
        }

        function hide($f) {
            return function() {
                if(!opts.hideOnClick) return;
                forceHide($f)();
            };
        }

        function forceHide($f) {
            return function() {
                if(opts.$content) opts.$content.hide();
                opts.cbs.hide($overlay, $f, $elem);
            };
        }
    }

    $.fn.yabox = function(options) {
        if(!this.length) {
            return yabox(undefined, opts(options));
        }

        return this.each(function() {
            var $elem = $(this);
            yabox($elem, opts(options));
        });

        function opts(o) {
            return $.extend(true, {
                fullClass: 'full',
                hideOnClick: true,
                $content: null,
                cbs: {
                    show: function($overlay, $full) {
                        $overlay.show();
                        $full.show();
                    },
                    hide: function($overlay, $full) {
                        if($full) $full.hide();
                        $overlay.hide();
                    }
                }
            }, o);
        }
    };

    $.fn.yabox.animated = {
        show: function(length, opacity) {
            length = length || 300;
            opacity = opacity || 0.3;

            return function($overlay, $full) {
                $overlay.show().css('opacity', opacity);
                $full.fadeIn(length);
            };
        },
        hide: function(fullLength, overlayLength) {
            fullLength = fullLength || 300;
            overlayLength = overlayLength || 300;

            return function($overlay, $full) {
                $full.fadeOut(fullLength, function() {
                    $overlay.fadeOut(overlayLength);
                });
            };
        }
    };

    $.fn.yabox.hide = function() {
        $('.' + overlayClass).trigger('hide');
    };
})(jQuery);
