// the script for a pixel canvas for fun
// created 12/28/2023 by Honkyrot

// size of the canvas variables
let size_x = 64;
let size_y = 36;

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
        pixel.setAttribute("dragable", "false");
        pixel.classList.add("pixel");

        pixel.style.width = size_x_calc + "px";
        pixel.style.height = size_y_calc + "px";

        pixel.style.left = left_pos * size_x_calc + "px";
        pixel.style.top = top_pos * size_y_calc + "px";

        // rgb test color
        //pixel.style.backgroundColor = "rgb(" + i * 10 + ", " + ii * 10 + ", " + i * ii + ")";
        pixel.style.backgroundColor = active_color;
        pixel.setAttribute("hsl_color", active_color);
        assigned_pixel = pixel;
        pixel_canvas.appendChild(pixel);
    }
}

// create the color wheel for dragging
function create_color_wheel() {
    var color_wheel = document.createElement("img");
    color_wheel.src = "media/color_wheel_hsl.png";
    color_wheel.setAttribute("id", "color_wheel");
    color_wheel.setAttribute("class", "color_wheel");
    color_wheel.setAttribute("draggable", "false");
    color_wheel.classList.add("color_wheel");

    var mouse_position_array = last_mouse_pos.split(", ");

    color_wheel.style.top = mouse_position_array[1] + "px";
    color_wheel.style.left = mouse_position_array[0] + "px";
    color_wheel.style.transform = "translate(-50%, -50%)";

    document.body.appendChild(color_wheel);

    setTimeout(() => {
        color_wheel.style.opacity = "1";
    }, 100);
}

// destroy the color wheel once finished dragging
function destroy_color_wheel() {
    var color_wheel = document.getElementById("color_wheel");
    color_wheel.parentNode.removeChild(color_wheel);
}

// update color wheel based on mouse distance from center
function update_color_wheel_size(e) {
    var color_wheel = document.getElementById("color_wheel");
    var last_mouse_pos_array = last_mouse_pos.split(", ");

    var mouse_position_array = (e.clientX + ", " + e.clientY).split(", ");

    var distance = Math.sqrt(Math.pow(mouse_position_array[0] - last_mouse_pos_array[0], 2) + Math.pow(mouse_position_array[1] - last_mouse_pos_array[1], 2));

    var size = Math.min(Math.max(distance * 2, 100), 500);  // clamp between 100px and 500px

    color_wheel.style.width = size + "px";
    color_wheel.style.height = size + "px";

    //console.log(distance);
}

// mouse events for dragging color
// on mouse down, assign pixel to variable assigned_pixel
document.addEventListener("mousedown", function(e) {
    assigned_pixel = e.target;
    //console.log("mouse down");
    last_mouse_pos = e.clientX + ", " + e.clientY;

    if (currently_dragging == false) {
        currently_dragging = true;
        create_color_wheel();
    }
});

// mouse events
document.addEventListener("mousemove", function(e) {
    if (currently_dragging == true) {
        change_color_mouse(e);
        update_color_wheel_size(e);

    }
});

// mouse up event
document.addEventListener("mouseup", function(e) {
    currently_dragging = false;
    destroy_color_wheel();
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