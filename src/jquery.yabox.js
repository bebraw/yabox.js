(function ($) {
    function yabox($elem, opts) {
        var $overlay = $(opts.overlayId).length? $(opts.overlayId): overlay();
        var $full = full();
        $overlay.bind('click', hide($('.' + opts.fullClass)));

        if(opts.$content) opts.$content.hide();

        if(!$elem) return {
            show: show,
            hide: hide($full)
        };

        function overlay() {
            return $('<div/>')
                .addClass('overlay')
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

            if(opts.hideOnClick) $e.bind('click', hide($e));

            return $e;
        }

        if($elem) $elem.bind('click', function(e) {
            e.preventDefault();

            show();
        });

        function show() {
            opts.cbs.beforeShow($full, $overlay, $elem);

            var $content;
            if(opts.$content) {
                opts.$content.show();
                $content = opts.$content;
            }
            else if($elem) $content = $elem.clone();

            $content.removeClass();

            $full.html($content);

            $full.center();
            opts.cbs.show($full, $overlay, $elem);
        }

        function hide($f) {
            return function() {
                if(opts.$content) opts.$content.hide();

                opts.cbs.hide($f, $overlay, $elem);
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
                    beforeShow: function($full, $overlay) {},
                    show: function($full, $overlay) {
                        $overlay.show();
                        $full.show();
                    },
                    hide: function($full, $overlay) {
                        $full.hide();
                        $overlay.hide();
                    }
                }
            }, o);

            ret.overlayId = '#' + ret.overlayId;

            return ret;
        }
    };

    $.fn.yabox.hide = function() {
        $('#overlay').trigger('click');
    };
})(jQuery);
