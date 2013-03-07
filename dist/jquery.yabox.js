/*! yabox - v0.5.8 - Juho Vepsalainen - MIT
https://github.com/bebraw/yabox.js - 2013-03-07 */
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

        if(!this.data('centered')) {
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
    var fullClass = 'yabox_full';
    var overlayClass = 'yabox_overlay';

    function yabox($elem, opts) {
        var $overlay = overlay(opts, hide(true), function() {
            $('.' + fullClass + ':visible:first').trigger('click');
        });
        var $full = full(opts, hide(opts.hideOnClick), $overlay);
        var $content = content($elem, opts.$content);

        if($elem) {
            $elem.bind('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                show();

                return false;
            });
        }
        else {
            return {
                show: show,
                hide: hide(true)
            };
        }

        function hide(hideOnClick) {
            return function() {
                if(!hideOnClick) return;
                forceHide($('.' + fullClass + ':visible:last'))();
            };
        }

        function show() {
            $full.html($content);
            $content.show();
            $full.center();
            opts.cbs.show($overlay, $full, $elem);
        }

        function forceHide($f) {
            return function() {
                var anotherFullExists = $('.' + fullClass + ':visible').length > 1;

                opts.cbs.hide(anotherFullExists? $(): $overlay, $f);
            };
        }
    }

    function content($elem, $content) {
        if($content) {
            $ret = $content;
            $content.hide();
        }
        else if($elem) {
            $ret = $elem.clone().removeClass();
        }
        else {
            console.warn('No content given to yabox!');
            return $();
        }

        return $ret;
    }

    function overlay(opts, apiHide, clickHide) {
        var $elem = $('.' + overlayClass + ':first');

        if($elem.length) return $elem;

        return $('<div/>').
            appendTo($('body')).
            addClass(overlayClass).
            bind('click', clickHide).
            bind('hide', apiHide).
            hide();
    }

    function full(opts, hide, $overlay) {
        return $('<div/>').hide().
            css({
                'z-index': parseInt($overlay.css('z-index'), 10) + 1
            }).
            addClass(fullClass).
            addClass(opts.fullClass).
            bind('click', hide).
            appendTo($('body'));
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
        show: function(length) {
            length = length || 300;

            return function($overlay, $full) {
                $overlay.show();
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
