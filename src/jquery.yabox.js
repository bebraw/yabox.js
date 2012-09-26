/* MIT (c) Juho Vepsalainen */
(function ($) {
    function yabox($elem, opts) {
        var $overlay = $(opts.overlayId).length? $(opts.overlayId): overlay();
        var $full = full();
        $overlay.bind('click', hide($('.' + opts.fullClass)))

        function overlay() {
            return $('<div>')
                .attr('id', 'overlay')
                .appendTo($('body'))
                .hide();
        }

        function full() {
            var $e = opts.$content? opts.$content: $elem.clone();

            $e = $e.hide()
                .css({
                    'z-index': $overlay.css('z-index') + 1
                })
                .removeClass()
                .addClass(opts.fullClass)
                .appendTo($('body'));

            if(opts.hideOnClick) {
                $e.bind('click', hide($e));
            }

            return $e;
        }

        $elem.bind('click', show);
        function show(e) {
            e.preventDefault();
            $full.center();
            opts.showCb($full, $overlay);
        }

        function hide($f) {
            return function() {
                opts.hideCb($f, $overlay);
            }
        }
    }

    $.fn.center = function() {
        this.css({
            'position': 'fixed',
            'left': '50%',
            'top': '50%',
        });
        this.css({
            'margin-left': -this.width() / 2 + 'px',
            'margin-top': -this.height() / 2 + 'px'
        });

        return this;
    }

    $.fn.yabox = function(options) {
        return this.each(function () {
            var $elem = $(this);
            var opts = $.extend({
                overlayId: 'overlay',
                fullClass: 'full',
                hideOnClick: true,
                $content: null,
                showCb: function($full, $overlay) {
                    $overlay.show();
                    $full.show();
                },
                hideCb: function($full, $overlay) {
                    $full.hide();
                    $overlay.hide();
                }
            }, options);

            opts.overlayId = '#' + opts.overlayId;
            yabox($elem, opts);
        });
    };

    $.fn.yabox.hide = function() {
        $('#overlay').trigger('click');
    };
})(jQuery);
