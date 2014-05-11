/* Given the ID of a div with two img tags, where the images referenced in
 * the tags are exactly the same size, replaces the images with a canvas
 * element the size of one of the images. This canvas initially displays
 * half of each image, and by moving a slider, a user can transition the
 * image shown from one to the other of the original imnages.
 *
 * If the images are not the same size, or there are not two of them, this
 * logs an error message and returns.
 *
 * @param div_id (string)
 */
function restoration_slider(div_id) {

    /*Gets all img nodes within a parent node
     *
     * @param div (DOMNode)
     * @return (array) : array of Images
     */
    var get_imgs = function (div) {
        var l = [];
        var n = 0;
        for (n = 0; n < div.childNodes.length; n++) {
            var img_node = (div.childNodes[n].tagName == "IMG"
                            || div.childNodes[n].tagName == "img");
            if (img_node) {
                img = div.childNodes[n];
                l.push(img);
            }
        }
        return l;
    };

    var div = document.getElementById(div_id);
    var imgs = get_imgs(div);

    /* Check that there are two equal-sized images */
    if (imgs.length != 2) {
        console.log("Expected 2 imgs, got " + imgs.length + ".");
        return;
    }
    var matched_heights = imgs[0].height == imgs[1].height;
    var matched_widths = imgs[0].width == imgs[1].width;
    if (! (matched_heights && matched_widths)) {
        var s = ("widths: " + imgs[0].width + ", " + imgs[1].width
                 + " heights: " + imgs[0].height + ", " + imgs[1].height);
        console.log(s);
        return;
    }

    /* Maintainer beware: these variables are shared within the callbacks */
    var canvas = document.createElement('canvas');
    var width = imgs[0].width;
    var height = imgs[0].height;
    var test_img = new Image();
    test_img.src = imgs[0].getAttribute("src");
    var full_height = test_img.height;
    full_width = test_img.width;
    var context = canvas.getContext("2d");
    var middle_in_orig = 0;
    var orig_right_width = 0;
    var horiz_middle = width / 2;
    var vert_middle = height / 2;
    var slider_width = 15;
    var slider_height = 40;
    var slider_left = horiz_middle - (slider_width / 2);
    var slider_top = vert_middle - (slider_height / 2);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    canvas.className = imgs[0].className;
    div.parentNode.replaceChild(canvas, div);
    var rect = canvas.getBoundingClientRect();

    /* Given a position x, this lines up the divider between the left and
     * right images at x along the x-axis, and resizes the images accordingly.
     *
     * @param x (int) : x-coordinate of new "center"
     */
    var recenter = function(x) {
        horiz_middle = x;
        middle_in_orig = full_width * (horiz_middle / width); 
        slider_left = horiz_middle - (slider_width / 2);
        slider_top = vert_middle - (slider_height / 2);
        context.drawImage(imgs[0], 0, 0, middle_in_orig, full_height,
                          0, 0, horiz_middle, height);
        orig_right_width = full_width - middle_in_orig;
        right_width = width - horiz_middle;
        context.fillStyle = "#000000";
        context.drawImage(imgs[1], middle_in_orig, 0, orig_right_width, full_height,
                          horiz_middle, 0, right_width, height);
        context.fillRect(horiz_middle - 2 , 0, 4, height);
        context.fillStyle = "#CCCCCC";
        slider_left = horiz_middle - (slider_width / 2);
        context.fillRect(slider_left, slider_top,
                         slider_width, slider_height);
    };

    /* Start out withe the images half-and-half */
    recenter(horiz_middle);

    /* This boolean controls whether the center should follow the mouse. */
    var dragging = false;

    /*
     * @param point (object) : {x: number, y: number}
     * @return (bool) : is point within the slider 'handle?'
     */
    var inside_slider = function(point) {
        var within_x = ((slider_left <= point.x)
                        && (point.x <= (slider_left + slider_width)));
        var within_y = ((slider_top <= point.y)
                        && (point.y <= (slider_top + slider_height)));
        return within_x && within_y;
    };

    /* Convenience method for getting the canvas-frame coords of the mouse.
     * Note that y = 0 at the top of the canvas, and y = height at the bottom.
     *
     * @param evt (Event)
     * @return (object) : {x: number, y: number}
     */
    var get_mouse_x_y = function(evt) {
        rect = canvas.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top;
        return {x: x, y: y};
    };

    /* Convenience method for getting the canvas-frame coords of a touch.
     * Note that y = 0 at the top of the canvas, and y = height at the bottom.
     *
     * @param evt (Event)
     * @return (object) : {x: number, y: number}
     */
    var get_touch_x_y = function(evt) {
        rect = canvas.getBoundingClientRect();
        return {x: evt.targetTouches[0].clientX - rect.left,
                y: evt.targetTouches[0].clientY - rect.top};
    };

    /* Callback to set dragging to true if mouse position is within handle. */
    var onMouseDown = function(evt) {
        var point = get_mouse_x_y(evt);
        if (inside_slider(point)) {
            dragging = true;
        }
    };

    /* Callback to recenter on the mouse position if dragging is true */
    var onMouseMove = function(evt) {
        var point = get_mouse_x_y(evt);
        if (dragging) {
            recenter(point.x);
        } else {
            return true;
        }
    };

    /* Callback to set dragging to false */
    var onMouseUp = function (evt) {
        dragging = false;
    };

    /* Callback to set dragging to true if touch position is within handle. */
    var onTouchStart = function(evt) {

        /* Don't interfere with 'pinch to zoom' */
        if (evt.targetTouches.length != 1) {
            dragging = false;
            return true;
        }
        var point = get_touch_x_y(evt);
        if (inside_slider(point)) {
            dragging = true;
            evt.preventDefault();
        }
    };

    /* Callback to recenter on the touch position if dragging is true */
    var onTouchMove = function(evt) {
        var point = get_touch_x_y(evt);
        if (dragging) {
            evt.preventDefault();
            recenter(point.x);
        } else {
            return true;
        }
    };

    /* Register the callbacks. */
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseout", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart);
    canvas.addEventListener("touchend", onMouseUp);
    canvas.addEventListener("touchmove", onTouchMove);
}
