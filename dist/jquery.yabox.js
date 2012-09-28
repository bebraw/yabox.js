/*! yabox.js - v0.4.5 - 2012-09-28
* http://bebraw.github.com/yabox.js/
* Copyright (c) 2012 Juho Vepsalainen; Licensed MIT */

(function ($) {
    // http://stackoverflow.com/a/210733/228885
    jQuery.fn.center = function ($parent) {
        $parent = $parent || $(window);

        var $e = this;


        this.css("position","absolute");
        this.css("top", Math.max(0, (($parent.height() - this.outerHeight()) / 2) +
            $(window).scrollTop()) + "px");
        this.css("left", Math.max(0, (($parent.width() - this.outerWidth()) / 2) +
            $(window).scrollLeft()) + "px");

        if(!$e.data('centered')) {
            $(window).on('resize', center).on('scroll', center);
        }

        function center() {
            $e.center($parent);
            $e.data('centered', true);
        }

        return this;
    };
})(jQuery);

(function ($) {
    function yabox($elem, opts) {
        var $overlay = $(opts.overlayId).length? $(opts.overlayId): overlay();
        var $full = full();
        $overlay.bind('click', hide($('.' + opts.fullClass)));

        if(opts.$content) opts.$content.hide();

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

        $elem.bind('click', show);
        function show(e) {
            e.preventDefault();

            opts.cbs.beforeShow($full, $overlay);

            var $content;
            if(opts.$content) {
                opts.$content.show();
                $content = opts.$content;
            }
            else $content = $elem.clone();

            $content.removeClass();

            $full.html($content);

            $full.center();
            opts.cbs.show($full, $overlay);
        }

        function hide($f) {
            return function() {
                if(opts.$content) opts.$content.hide();

                opts.cbs.hide($f, $overlay);
            };
        }
    }

    $.fn.yabox = function(options) {
        return this.each(function () {
            var $elem = $(this);
            var opts = $.extend(true, {
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
            }, options);

            opts.overlayId = '#' + opts.overlayId;
            yabox($elem, opts);
        });
    };

    $.fn.yabox.hide = function() {
        $('#overlay').trigger('click');
    };
})(jQuery);
