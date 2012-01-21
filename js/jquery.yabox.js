/* MIT (c) Juho Vepsalainen */
(function ($) {
    function yabox($elem, opts) {
        var $overlay = $(opts.overlayId).length? $(opts.overlayId): overlay();
        var $full = full();

        // TODO: figure out centering logic

        function overlay() {
            return $('<div>').attr('id', 'overlay').appendTo($('body')).hide().bind('click', function() {
                $('.' + opts.fullClass).hide();
                $overlay.hide(); 
            });
        }

        function full() {
            var $e = $elem.clone().hide().css({
                    'z-index': $overlay.css('z-index') + 1
                }).removeClass().addClass(opts.fullClass).
                appendTo($('body')).bind('click', function() {
                    $full.hide();
                    $overlay.hide();
                });

            return $e;
        }

        $elem.bind('click', show);

        function show() {
            console.log('show');
            $full.show();
            $overlay.show();

            $full.css({
                'margin-left': -$full.outerWidth(true) / 2 + 'px',
                'margin-top': -$full.outerHeight(true) / 2 + 'px'
            });
        }
    }

    $.fn.yabox = function (options) {
        return this.each(function () {
            var $elem = $(this);
            var opts = $.extend({
                overlayId: 'overlay',
                fullClass: 'full'
            }, options);

            opts.overlayId = '#' + opts.overlayId;
            yabox($elem, opts);
        });
    };
})(jQuery);
