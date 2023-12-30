// the script for a pixel canvas for fun
// created 12/28/2023 by Honkyrot

// size of the canvas variables, default is 64x36 or 16:9
let default_size_x = 64;
let default_size_y = 36;

// configurable size variables
let size_x = 64;
let size_y = 36;

// ids
let pixel_canvas = document.getElementById("pixel_canvas");

// active variables
let active_color = "hsl(0, 0%, 0%)"
let last_mouse_pos = null;
let assigned_pixel = null;
let currently_dragging = false;
let color_snap = false;

// configure the size ratio of size_x and size_y
function configure_size_ratio(x, y) {
    size_x = x || default_size_x;
    size_y = y || default_size_y;
}

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
    color_wheel.src = "media/color_wheel_hsl2.png";
    color_wheel.setAttribute("id", "color_wheel");
    color_wheel.setAttribute("class", "color_wheel");
    color_wheel.setAttribute("draggable", "false");
    color_wheel.classList.add("color_wheel");

    var mouse_position_array = last_mouse_pos.split(", ");

    color_wheel.style.top = mouse_position_array[1] + "px";
    color_wheel.style.left = mouse_position_array[0] + "px";
    color_wheel.style.transform = "translate(-50%, -50%)";

    // set default size
    color_wheel.style.width = "100px";
    color_wheel.style.height = "100px";

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
function update_color_wheel(event) {
    var color_wheel = document.getElementById("color_wheel");
    var last_mouse_pos_array = last_mouse_pos.split(", ");

    var mouse_position_array = (event.clientX + ", " + event.clientY).split(", ");

    var distance = Math.sqrt(Math.pow(mouse_position_array[0] - last_mouse_pos_array[0], 2) + Math.pow(mouse_position_array[1] - last_mouse_pos_array[1], 2));

    var size = Math.min(Math.max(distance * 2, 100), 1000);  // clamp between 100px and 1000px

    color_wheel.style.width = size + "px";
    color_wheel.style.height = size + "px";

    // switch color wheel to show if you're snapping to 15 degree increments
    if (color_snap) {
        color_wheel.src = "media/color_wheel_hsl2.png";
    } else {
        color_wheel.src = "media/color_wheel_hsl.png";
    }

    //console.log(distance);
}

// mouse events for dragging color
// on mouse down, assign pixel to variable assigned_pixel
document.addEventListener("mousedown", function(event) {
    assigned_pixel = event.target;
    //console.log("mouse down");
    last_mouse_pos = event.clientX + ", " + event.clientY;

    if (currently_dragging == false) {
        currently_dragging = true;
        create_color_wheel();
    }
});

// mouse events
document.addEventListener("mousemove", function(event) {
    if (currently_dragging == true) {
        change_color_mouse(event);
        update_color_wheel(event);

    }
});

// mouse up event
document.addEventListener("mouseup", function(event) {
    currently_dragging = false;
    destroy_color_wheel();
    change_color_mouse(event);
    //console.log("mouse up");
});

// on mouse wheel, change how dark the pixel is, up is lighter, down is darker
document.addEventListener('wheel', function(event) {
    assigned_pixel = event.target;
    var hsl_color = assigned_pixel.getAttribute("hsl_color");
    var hsl_color_array = hsl_color.split(", ");
    var lightness = hsl_color_array[2].replace("%)", "");
    lightness = parseInt(lightness);

    if (color_snap == true) {
        lightness += event.deltaY
    } else {
        lightness += event.deltaY / 10;
    }
    
    lightness = Math.min(Math.max(lightness, 0), 100);  // clamp between 0 and 100

    hsl_color_array[2] = lightness + "%)";
    assigned_pixel.style.backgroundColor = hsl_color_array.join(", ");
    assigned_pixel.setAttribute("hsl_color", hsl_color_array.join(", "));
});

document.addEventListener("touchstart", function(event) {
    assigned_pixel = event.target;
    //console.log("mouse down");
    last_mouse_pos = event.clientX + ", " + event.clientY;

    if (currently_dragging == false) {
        currently_dragging = true;
        create_color_wheel();
    }
});

// if user press left shift, snap to color wheel
window.addEventListener("keydown", function(event) {
    if (event.key === "Shift") {
        color_snap = true;
    }
});

window.addEventListener("keyup", function(event) {
    if (event.key === "Shift") {
        color_snap = false;
    }
});

function change_color_mouse(event) {
    var mouse_position = event.clientX + ", " + event.clientY;
    var mouse_position_array = mouse_position.split(", ");
    var last_mouse_pos_array = last_mouse_pos.split(", ");

    // calculates based on the angle of the mouse
    var rad = Math.atan2(mouse_position_array[1] - last_mouse_pos_array[1], mouse_position_array[0] - last_mouse_pos_array[0]);
    var deg = rad * (180 / Math.PI);

    // if snapping is true, snap to 15 degree increments
    if (color_snap == true) {
        deg = Math.round(deg / 15) * 15;
    }

    active_color = "hsl(" + deg + ", 100%, 50%)";

    assigned_pixel.style.backgroundColor = active_color;
    assigned_pixel.setAttribute("hsl_color", active_color);
}
// start
configure_size_ratio();
populate_canvas();

// mobile check, tell user to use desktop if on mobile, thank you stack overflow
window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    if (check == true) {
        alert("This site is not compatible with touch screens. Please use a desktop computer or plug in a mouse to use this site.");
    }
};

window.mobileCheck();