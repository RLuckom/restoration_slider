function slider(div_id) {
    var div = document.getElementById(div_id);
    var imgs = get_imgs(div);
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
    var canvas = document.createElement('canvas');
    var width = imgs[0].width;
    var height = imgs[0].height;
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    var context = canvas.getContext("2d");
    document.body.appendChild(canvas);
    var horiz_middle = width / 2;
    var vert_middle = height / 2;
    var slider_width = 15;
    var slider_height = 40;
    var slider_left = horiz_middle - (slider_width / 2);
    var slider_top = vert_middle - (slider_height / 2);

    var recenter = function(x) {
        horiz_middle = x;
        slider_left = horiz_middle - (slider_width / 2);
        slider_top = vert_middle - (slider_height / 2);
        context.drawImage(imgs[0], 0, 0, horiz_middle, height,
                          0, 0, horiz_middle, height);
        right_width = width - horiz_middle;
        context.fillStyle = "#000000";
        context.drawImage(imgs[1], horiz_middle, 0, right_width, height,
                          horiz_middle, 0, right_width, height);
        context.fillRect(horiz_middle - 2 , 0, 4, height);
        context.fillStyle = "#CCCCCC";
        slider_left = horiz_middle - (slider_width / 2);
        context.fillRect(slider_left, slider_top,
                         slider_width, slider_height);
    };

    recenter(horiz_middle);

    var dragging = false;
    var inside_slider = function(point) {
        var within_x = slider_left <= point.x <= slider_left + slider_width;
        var within_y = slider_top <= point.y <= slider_top + slider_height;
        return within_x && within_y;
    };
    var get_x_y = function(evt) {
        var rect = canvas.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top;
        return {x: x, y: y};
    };
    var onMouseDown = function(evt) {
        console.log("down");
        var point = get_x_y(evt);
        if (inside_slider(point)) {
            dragging = true;
        }
    };

    var onMouseMove = function(evt) {
        console.log("move");
        var point = get_x_y(evt);
        if (dragging) {
            recenter(point.x);
        }
    };
    var onMouseUp = function (evt) {
        console.log("up");
        dragging = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseout", onMouseUp);
    console.log("added handlers");
}



function get_imgs(div) {
    var l = [];
    var n = 0;
    for (n = 0; n < div.childNodes.length; n++) {
        if (div.childNodes[n].tagName == "IMG" || div.childNodes[n].tagName == "img") {
            l.push(div.childNodes[n]);
        }
    }
    return l;
}
