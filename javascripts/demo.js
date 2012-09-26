$(function() {
    $('.polaroid').yabox({
        fullClass: 'fullPolaroid',
        // these callbacks are optional
        // as you can see they allow you to
        // animate show/hide as you wish
        showCb: function($full, $overlay) {
            $full.center();
            $overlay.show().css('opacity', 0.3);
            $full.fadeIn(300);
        },
        hideCb: function($full, $overlay) {
            $full.fadeOut(300, function() {
                $overlay.fadeOut(300);
            });
        }
    });

    $('#custom').yabox({
        hideOnClick: false,
        $content: $('#customContent')
    });

    $('#customContent .close').bind('click', $('#custom').yabox.hide);
});
