# yabox.js - Yet another lightbox clone for jQuery

yabox.js makes it easy to create one of those infamous popovers. It sticks to the view center (fixed there). It is light and somewhat extensible by design.

## Installation

Add prepackaged `dist/jquery.yabox.js` to your page.

## Usage

JavaScript:

```js
$(function() {
    $('.polaroid').yabox({
        fullClass: 'fullPolaroid', // used for popover
        // optional callbacks for animating
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
        hideOnClick: false, // sticky popover...
        $content: $('#customContent') // loads content elsewhere
    });

    // custom handlers
    $('#customContent .close').bind('click', $('#custom').yabox.hide);
});
```

## License

yabox.js is available under MIT. See LICENSE for more details.
