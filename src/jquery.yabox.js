(function ($) {
    function yabox($elem, opts) {
        var $overlay;
        var overlayExists = $('.yabox_overlay').length > 0;

        if(overlayExists) {
            $overlay = $('.yabox_overlay:first');
        }
        else {
            $overlay = $(opts.overlayId).length? $(opts.overlayId): overlay();
            $overlay.addClass('yabox_overlay');
       }

        var $full = full();

        if(opts.$content) opts.$content.hide();

        if(!$elem) return {
            show: show,
            hide: forceHide($full)
        };

        function overlay() {
            return $('<div/>')
                .appendTo($('body'))
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
            var ret = $.extend(true, {
                overlayId: 'overlay',
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

            ret.overlayId = '#' + ret.overlayId;

            return ret;
        }
    };

    $.fn.yabox.hide = function() {
        $('.yabox_overlay').trigger('hide');
    };
})(jQuery);
