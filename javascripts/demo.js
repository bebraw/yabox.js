$(function() {
    // this is an "anonymous" yabox we can show/hide procedurally
    // handy for certain kind of popovers (think progress bars and such)
    var y = $().yabox({
        hideOnClick: false,
        $content: $('#customContent')
    });

    $('.polaroid').yabox({
        fullClass: 'fullPolaroid',
        // these callbacks are optional
        // as you can see they allow you to
        // animate show/hide as you wish
        cbs: {
            show: function($overlay, $full) {
                $overlay.show().css('opacity', 0.3);
                $full.fadeIn(300);
            },
            hide: function($overlay, $full) {
                $full.fadeOut(300, function() {
                    $overlay.fadeOut(300);
                });
            }
        }
    });

    $('#custom').yabox({
        hideOnClick: false,
        $content: $('#customContent')
    });

    $('#customContent .close').live('click', $().yabox.hide);

    $('#empty').on('click', function(e) {
        e.preventDefault();

        y.show();
    });
});
