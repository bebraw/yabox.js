/* MIT (c) Juho Vepsalainen */
(function ($) {
    function yabox($elem, opts) {
        
    }

    $.fn.yabox = function (options) {
        return this.each(function () {
            var $elem = $(this);
            var opts = $.extend({
            
            }, options);

            yabox($elem, opts);
        });
    };
})(jQuery);
