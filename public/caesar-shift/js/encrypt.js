// Jordan Stapinski
// Enigma Unit Encryption Accompanying JS file

// Gathering document elements
var spinUp = document.getElementById('spinUp');
var spinDown = document.getElementById('spinDown');
var show_code = document.getElementById('show_code');
var encrypt = document.getElementById('encrypt');
var plaintext_value = document.getElementById('plaintext_value');
var black_box_text = document.getElementById('black_box_text');
var output_text = document.getElementById('output_text');
var square_box = document.getElementById('square-box');
var canvas = document.getElementById("canvas");

// Initializing Shift array constants
var numbers = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
var start_index = 3;
var num_sections = 5;

// Timer delay speed for the scroller and instructions
var encryption_scrolling_speed = 15;
var instruction_speed = 500;

// Initializing UI customization options
var hidden_text = true;
var enable_tooltips = true;

// Wheel display colors
var colors = ["#F5E5C0", "#F5E5C0", "#FFFFFF", "#F5E5C0", "#F5E5C0"]

// Default box sizes
var boxWidth = 50;
var boxHeight = 50;
var box_center = boxWidth / 2;
var text_height_offset = 30;
var max_number_of_steps = 50;

/*
  draw_wheel

  No inputs
  No return value

  Draws the scrolling wheel on the canvas used for collecting shift value input.
  The scrolling wheel has five sections and ranges from numbers[start_index - 2] to
  numbers[start_index + 2] inclusive, with numbers[start_index] being the default value.

  ASSUMES a box size of 50x50 for the wheel
*/
function draw_wheel(){
  var number_index, text_height, i;
  if (canvas.getContext){
    ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < num_sections; i++) {
      ctx = canvas.getContext("2d");
      ctx.fillStyle = colors[i];
      ctx.fillRect(0, i * boxHeight, boxWidth, boxHeight);

      establish_context_settings(ctx);

      number_index = (start_index + i) % numbers.length;
      text_height = text_height_offset + i * boxHeight;
      ctx.fillText(numbers[number_index].toString(), box_center, text_height);

      draw_horizontal_box_lines(ctx, i, boxHeight, boxWidth);
    }
  }
}


function redraw(step, direction, ctx){
  var number_index, text_height, i;
  if (step >= boxHeight){
    return;
  }
  for (i = 0; i < num_sections + 1; i++) {
    if (i < colors.length){
      ctx.fillStyle = colors[i];
      ctx.fillRect(0, i * boxHeight, boxWidth, boxHeight);
    }
    establish_context_settings(ctx);
    number_index = (start_index + i - 1) % numbers.length;
    text_height = text_height_offset + i * boxHeight - step;
    if (direction === "up"){
      if (number_index < 0){
        number_index += numbers.length;
      }
      ctx.fillText(numbers[number_index].toString(), box_center, text_height);
    } else {
      number_index = (start_index + i) % numbers.length;
      text_height = text_height_offset - boxHeight + i * boxHeight + step;
      ctx.fillText(numbers[number_index].toString(), box_center, text_height);
    }
    draw_horizontal_box_lines(ctx, i, boxHeight, boxWidth);
  }
  setTimeout(redraw, encryption_scrolling_speed, step + 1, direction, ctx);
}

/*
  draw_horizontal_box_lines

  ctx: The canvas 2D drawing context
  box_number: The number of the box we are drawing
  box_height: The height of the box we are drawing
  box_width: The width of the box we are drawing
  No return value

  Draws horizontal box lines as shown on the scrolling wheel in between
  number regions.

  ASSUMES: The lines drawn are horizontal and are box_height apart
*/
function draw_horizontal_box_lines(ctx, box_number, box_height, box_width){
  ctx.beginPath();
  ctx.moveTo(0, box_number * box_height);
  ctx.lineTo(box_width, box_number * box_height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, (box_number + 1) * box_height);
  ctx.lineTo(box_width, (box_number + 1) * box_height);
  ctx.stroke();  
}

/*
  establish_context_settings

  ctx: The canvas 2D drawing context
  No return value

  Sets up values for the context to draw text, including font, color,
  and alignment
*/
function establish_context_settings(ctx){
  ctx.fillStyle = "#000000";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
}

function caesar_encrypt_one_letter(initial_char, shift_value){
  var letter_ascii = initial_char.toLowerCase().charCodeAt(0);
  if (!(initial_char.toLowerCase().match(/[a-z]/i))){
    return initial_char;
  }
  var new_letter_ascii = letter_ascii + shift_value;
  var z_value = 'z'.charCodeAt(0);
  var a_value = 'a'.charCodeAt(0);
  var letter_difference = 0;

  if (new_letter_ascii > z_value){
    letter_difference = new_letter_ascii - z_value;
    new_letter_ascii = a_value + letter_difference - 1;
  } else if (new_letter_ascii < a_value){
    letter_difference = a_value - new_letter_ascii;
    new_letter_ascii = z_value - (letter_difference - 1);
  }
  return String.fromCharCode(new_letter_ascii);
}

/*
  spin_wheel_up

  No inputs
  No return value

  Animates the scrolling wheel upwards and increases the value
  by 1, overflowing if needed.
*/
function spin_wheel_up(){
  if (canvas.getContext){
    ctx = canvas.getContext("2d");
    setTimeout(redraw, encryption_scrolling_speed, 0, "up", ctx);
    start_index++;
    start_index %= numbers.length;
  }
}

/*
  spin_wheel_down

  No inputs
  No return value

  Animates the scrolling wheel downwards and decreases the value
  by 1, overflowing if needed.
*/
function spin_wheel_down(){
  if (canvas.getContext){
    ctx = canvas.getContext("2d");
    setTimeout(redraw, encryption_scrolling_speed, 0, "down", ctx);
    start_index--;
    if (start_index == -1){
      start_index = numbers.length - 1;
    }
  }
}

/*
  plaintext_not_valid

  text: The given plaintext value

  Checks whether or not the plaintext is empty.
*/
function plaintext_not_valid(text){
  return (text == "");
}

function enough_shifts_exhausted(shift_offset, current_shift_value, shifting_value){
  return ((shift_offset === -1) && (current_shift_value > shifting_value + 1)) ||
          ((shift_offset === 1) && (current_shift_value < shifting_value - 1));
}

function encryptionRedraw(i, passed_text_value, current_shift_value, shifting_value, step, ctx){
  var canvas_width = square_box.clientWidth;
  var canvas_height = 200;
  var boxWidth = canvas_width / passed_text_value.length;
  var max_box_height = 50;
  var heightOffset = 100;
  var shift_offset = 1;
  var next_letter, text_start;
  boxWidth = Math.min(boxWidth, max_box_height);
  ctx.clearRect(0, boxHeight, canvas_width, boxHeight);

  // Negative shift for moving in the negative direction
  if (shifting_value < 0){
    shift_offset = -1;
  }
  if (step === max_number_of_steps){
    if (enough_shifts_exhausted(shift_offset, current_shift_value, shifting_value)){
      setTimeout(encryptionRedraw, encryption_scrolling_speed, i, passed_text_value, 
                              current_shift_value + shift_offset, shifting_value, 0, ctx);
      return;      
    }
    if (i == (passed_text_value.length - 1)){
      $("#encrypt").removeClass('disabled');
      ctx.clearRect(0, boxHeight, canvas_width, boxHeight);
      return;       
    } else {
      setTimeout(encryptionRedraw, encryption_scrolling_speed, i + 1, passed_text_value, 0, shifting_value, 0, ctx);
      return;      
    }
  }

  ctx.clearRect(i * boxWidth, boxHeight, canvas_width, canvas_height);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(i * boxWidth, heightOffset, boxWidth, boxHeight);
  establish_context_settings(ctx);

  next_shift_value = current_shift_value + shift_offset;
  text_start = i * boxWidth + (boxWidth / 2);
  ctx.fillText(caesar_encrypt_one_letter(passed_text_value[i], current_shift_value), text_start, heightOffset + 30 - step)
  ctx.fillText(caesar_encrypt_one_letter(passed_text_value[i], next_shift_value), text_start, heightOffset + 80 - step);        

  draw_vertical_box_lines(ctx, i, boxHeight, boxWidth, heightOffset);

  setTimeout(encryptionRedraw, encryption_scrolling_speed, i, passed_text_value, current_shift_value, shifting_value, step + 1, ctx);
}

function runEncryption(){
  remove_tooltip();
  var passed_text_value = plaintext_value.value;
  if (plaintext_not_valid(passed_text_value)){
    alert("Plaintext should not be blank!");
    return;
  }
  // TODO rewrite below more cleanly
  var selected_value = (start_index + 2) % numbers.length;
  var shifting_value = numbers[selected_value];
  //Get space locations

  var parentNode = document.getElementById("black-box-parent");
  var button_parent_node = document.getElementById('button-container');
  if (document.getElementById("black_box_canvas")){
    document.getElementById("black_box_canvas").remove();
  }
  var canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 200;
  canvas.id = "black_box_canvas";

  parentNode.appendChild(canvas);
  if (black_box_text.parentNode){
    black_box_text.parentNode.removeChild(black_box_text);
  }
  $("#encrypt").addClass('disabled');

  if (canvas.getContext){
    var canvas_size = square_box.clientWidth;
    var boxHeight = 50
    var boxWidth = canvas_size / passed_text_value.length;
    if (boxWidth > 50){
      boxWidth = 50;
    }
    var num_sections = 4
    ctx = canvas.getContext("2d")
    var height_offset = 0;

    ctx.clearRect(0, 0, canvas_size, 200)

    for (var i = 0; i < passed_text_value.length; i++) {
      ctx = canvas.getContext("2d")
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(i * boxWidth, height_offset, boxWidth, boxHeight);
      establish_context_settings(ctx);
      ctx.fillText(passed_text_value[i], i * boxWidth + (boxWidth / 2), 30);

      draw_vertical_box_lines(ctx, i, boxHeight, boxWidth, height_offset);
    }
    setTimeout(encryptionRedraw, 20, 0, passed_text_value, 0, shifting_value, 0, ctx, shifting_value);
  }
  //Fix to place at end of animation
  var stringArray = passed_text_value.split("");
  var mappedArray = stringArray.map(function(c){
    return caesar_encrypt_one_letter(c, shifting_value);
  })
  var newText = mappedArray.join("");
  output_text.value = newText;    
}

function draw_vertical_box_lines(ctx, box_number, box_height, box_width, height_offset){
  ctx.beginPath();
  ctx.moveTo(box_number * box_width, height_offset);
  ctx.lineTo(box_number * box_width, height_offset + box_height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo((box_number + 1) * box_width, height_offset);
  ctx.lineTo((box_number + 1) * box_width, height_offset + box_height);
  ctx.stroke();  
}

function modify_instructions(){
  if (hidden_text){
    $('#instruction_set').show(instruction_speed);
    document.getElementById('instruction_button').text = 'Hide Instructions';
    hidden_text = false;
  } else {
    $('#instruction_set').hide(instruction_speed);
    document.getElementById('instruction_button').text = 'Show Instructions';
    hidden_text = true;
  }
}

draw_wheel()

spinUp.addEventListener("click", spin_wheel_up)
spinDown.addEventListener("click", spin_wheel_down)
encrypt.addEventListener("click", runEncryption)