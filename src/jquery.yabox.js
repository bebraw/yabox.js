(function ($) {
    var fullClass = 'yabox_full';
    var overlayClass = 'yabox_overlay';

    function yabox($elem, opts) {
        var $overlay = overlay(opts, hide(true), function() {
            $('.' + fullClass + ':visible').first().trigger('click');
        });
        var $full = full(opts, hide(opts.hideOnClick), $overlay);
        var $content = content($elem, opts.$content);

        if($elem) {
            $elem.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                show();

                return false;
            });
        }
        else {
            return {
                show: show,
                hide: hide(true),
                $full: $full,
                $content: $content,
                $overlay: $overlay
            };
        }

        function hide(hideOnClick) {
            return function() {
                if(!hideOnClick) return;
                forceHide($('.' + fullClass + ':visible').last())();
            };
        }

        function show() {
            $full.html($content);
            $content.show();
            opts.cbs.show($overlay, $full, $elem);
            $full.center();
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
        var $elem = $('.' + overlayClass).first();

        if($elem.length) return $elem;

        return $('<div/>').
            appendTo($('body')).
            addClass(overlayClass).
            on('click', clickHide).
            on('hide', apiHide).
            hide();
    }

    function full(opts, hide, $overlay) {
        return $('<div/>').hide().
            css({
            'z-index': parseInt($overlay.css('z-index'), 10) + 1
        }).
            addClass(fullClass).
            addClass(opts.fullClass).
            on('click', hide).
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

    if(window.Zepto) {
        // TODO: move to a separate package
        // https://github.com/madrobby/zepto/blob/master/src/selector.js
        ;(function($){
            var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches;

            function visible(elem){
                elem = $(elem);
                return !!(elem.width() || elem.height()) && elem.css("display") !== "none";
            }

            var filters = $.expr[':'] = {
                visible:  function(){ if (visible(this)) return this; }
            };

            var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
                childRe  = /^\s*>/,
                classTag = 'Zepto' + (+new Date());

            function process(sel, fn) {
                // quote the hash in `a[href^=#]` expression
                sel = sel.replace(/=#\]/g, '="#"]');
                var filter, arg, match = filterRe.exec(sel);

                if (match && match[2] in filters) {
                    filter = filters[match[2]], arg = match[3];
                    sel = match[1];

                    if (arg) {
                        var num = Number(arg);
                        if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '');
                            else arg = num;
                    }
                }
                return fn(sel, filter, arg);
            }

            zepto.qsa = function(node, selector) {
                var nodes;
                return process(selector, function(sel, filter, arg){
                    var taggedParent;
                    try {
                        if (!sel && filter) sel = '*';
                            else if (childRe.test(sel))
                                // support "> *" child queries by tagging the parent node with a
                                // unique class and prepending that classname onto the selector
                                taggedParent = $(node).addClass(classTag), sel = '.'+classTag+' '+sel;

                                nodes = oldQsa(node, sel);
                    } catch(e) {
                        console.error('error performing selector: %o', selector);
                        throw e;
                } finally {
                    if (taggedParent) taggedParent.removeClass(classTag);
                }
                return !filter ? nodes :
                    zepto.uniq($.map(nodes, function(n, i){ return filter.call(n, i, nodes, arg);}));
                });
        };

        zepto.matches = function(node, selector) {
            return process(selector, function(sel, filter, arg){
                return (!sel || oldMatches(node, sel)) &&
                    (!filter || filter.call(node, null, arg) === node);
            });
        };
        })(Zepto);

        if(!$.fn.fadeIn) {
            $.fn.fadeIn = function(speed, callback) {
                callback = callback || function() {};

                $(this).show();
                callback();
            };
        }

        if(!$.fn.fadeOut) {
            $.fn.fadeOut = function(speed, callback) {
                callback = callback || function() {};

                $(this).hide();
                callback();
            };
        }
    }
})(window.jQuery || window.Zepto);
