// the script for a pixel canvas for fun
// created 12/28/2023 by Honkyrot

// size of the canvas variables
let size_x = 32;
let size_y = 18;

// ids
let pixel_canvas = document.getElementById("pixel_canvas");

// active variables
let active_color = "hsl(0, 0%, 0%)"
let last_mouse_pos = null;
let assigned_pixel = null;
let currently_dragging = false;

// populate the canvas with the correct number of pixels
function populate_canvas() {
    // calculate size porportions of the screen
    var size_x_calc = document.body.clientWidth / size_x;
    var size_y_calc = document.body.clientHeight / size_y;

    var total_pixels = size_x * size_y;

    // create the pixels
    for (var i = 0; i < total_pixels; i++) {
        var top_pos = Math.floor(i / size_x);
        var left_pos = i % size_x;

        // create a row
        var pixel = document.createElement("td");
        var new_id = i;
        pixel.setAttribute("id", "pixel" + new_id);
        pixel.setAttribute("class", "pixel");
        pixel.setAttribute("dragable", "true");
        pixel.classList.add("pixel");

        pixel.addEventListener("scroll", test());

        pixel.style.width = size_x_calc + "px";
        pixel.style.height = size_y_calc + "px";

        pixel.style.left = left_pos * size_x_calc + "px";
        pixel.style.top = top_pos * size_y_calc + "px";

        // rgb test color
        //pixel.style.backgroundColor = "rgb(" + i * 10 + ", " + ii * 10 + ", " + i * ii + ")";
        pixel.style.backgroundColor = active_color;
        assigned_pixel = pixel;
        pixel_canvas.appendChild(pixel);
    }
}

// mouse events for dragging color
// on mouse down, assign pixel to variable assigned_pixel
document.addEventListener("mousedown", function(e) {
    assigned_pixel = e.target;
    //console.log("mouse down");
    last_mouse_pos = e.clientX + ", " + e.clientY;

    if (currently_dragging == false) {
        currently_dragging = true;
    }
});

// mouse events
document.addEventListener("mousemove", function(e) {
    if (currently_dragging == true) {
        change_color_mouse(e);
    }
});

// mouse up event
document.addEventListener("mouseup", function(e) {
    currently_dragging = false;
    change_color_mouse(e);
    //console.log("mouse up");
});

// on mouse wheel, change how dark the pixel is, up is lighter, down is darker
document.addEventListener('wheel', function(e) {
    assigned_pixel = e.target;
    var hsl_color = assigned_pixel.getAttribute("hsl_color");
    var hsl_color_array = hsl_color.split(", ");
    var lightness = hsl_color_array[2].replace("%)", "");
    lightness = parseInt(lightness);
    lightness += e.deltaY / 10;
    
    lightness = Math.min(Math.max(lightness, 0), 100);  // clamp between 0 and 100

    hsl_color_array[2] = lightness + "%)";
    assigned_pixel.style.backgroundColor = hsl_color_array.join(", ");
    assigned_pixel.setAttribute("hsl_color", hsl_color_array.join(", "));
});

function test() {
    console.log("test");
}

function change_color_mouse(e) {
    var mouse_position = e.clientX + ", " + e.clientY;
    var mouse_position_array = mouse_position.split(", ");
    var last_mouse_pos_array = last_mouse_pos.split(", ");

    // calculates based on the angle of the mouse
    var rad = Math.atan2(mouse_position_array[1] - last_mouse_pos_array[1], mouse_position_array[0] - last_mouse_pos_array[0]);
    var deg = rad * (180 / Math.PI);

    active_color = "hsl(" + deg + ", 100%, 50%)";

    assigned_pixel.style.backgroundColor = active_color;
    assigned_pixel.setAttribute("hsl_color", active_color);
}
// start
populate_canvas();