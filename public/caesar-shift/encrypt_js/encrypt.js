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
var encryption_code = document.getElementById('encryption_code');
var clipboard = document.getElementById('clipboard');
var plaintext_solution = "move north";
var shift_solution = 3;

// Initializing Shift array constants
var numbers = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
var start_index = 3;
var num_sections = 5;

// Timer delay speed for the scroller and instructions
var encryption_scrolling_speed = 5;
var wheel_scrolling_speed = 5;
var instruction_speed = 500;

// Initializing UI customization options
var hidden_text = false;
var enable_tooltips = true;

// Wheel display colors
var colors = ["#F5E5C0", "#F5E5C0", "#FFFFFF", "#F5E5C0", "#F5E5C0"]

// Default box sizes
var box_width = 50;
var box_height = 50;
var box_center = box_width / 2;
var text_height_offset = 30;
var max_number_of_steps = 50;
var canvas_margin = 10;

/*
  draw_wheel

  No inputs
  No return value

  Draws the scrolling wheel on the canvas used for collecting shift value input.
  The scrolling wheel has five sections and ranges from numbers[start_index - 2]
  to numbers[start_index + 2] inclusive, with numbers[start_index] being the 
  default value.

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
      ctx.fillRect(0, i * box_height, box_width, box_height);

      establish_context_settings(ctx);

      number_index = (start_index + i) % numbers.length;
      text_height = text_height_offset + i * box_height;
      ctx.fillText(numbers[number_index].toString(), box_center, text_height);

      draw_horizontal_box_lines(ctx, i, box_height, box_width);
    }
  }
}

/*
  redraw

  step: The step of the animation we are on (ASSUMES 0 <= step <= 50)
  direction: The direction of the wheel scroll (ASSUMES either "up" or "down")
  ctx: The canvas 2D drawing context

  No return value

  Redraws the scrolling wheel according to the step of the animation and the
  direction of the animation.

  ASSUMES a box size of 50x50 for the wheel
*/
function redraw(step, direction, ctx){
  var number_index, text_height, i;
  if (step >= box_height){
    return;
  }
  for (i = 0; i < num_sections + 1; i++) {
    if (i < colors.length){
      ctx.fillStyle = colors[i];
      ctx.fillRect(0, i * box_height, box_width, box_height);
    }
    establish_context_settings(ctx);
    // Find the index of the number in the number array and its height
    number_index = (start_index + i - 1) % numbers.length;
    text_height = text_height_offset + i * box_height - step;
    if (direction === "up"){
      //Move everything up in the vertical direction
      if (number_index < 0){
        number_index += numbers.length;
      }
      ctx.fillText(numbers[number_index].toString(), box_center, text_height);
    } else {
      //Move everything down in the vertical direction
      number_index = (start_index + i) % numbers.length;
      text_height = text_height_offset - box_height + i * box_height + step;
      ctx.fillText(numbers[number_index].toString(), box_center, text_height);
    }
    draw_horizontal_box_lines(ctx, i, box_height, box_width);
  }
  //Set a timeout to loop at a consistant time, essentially recursively
  setTimeout(redraw, wheel_scrolling_speed, step + 1, direction, ctx);
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
function establish_context_settings(ctx, plaintext_length){
  ctx.fillStyle = "#000000";
  if (plaintext_length > 20){
    ctx.font = "1.20rem PT Mono";
  } else {
    ctx.font = "1.20rem PT Mono";    
  }
  ctx.textAlign = "center";
}

/*
  caesar_encrypt_one_letter

  initial char: The single character to encrypt (ASSUMES this is one character)
  shift_value: The amount to shift by (positive means increasing in the 
  alphabet, negative is decreasing)

  returns a single character encoded using the caesar shift method shifted by 
  shift_value letters

  caesar_encrypt_one_letter takes in an initial character and a shift_value and 
  performs a caesar substitution on the initial character by the passed 
  shift_value, returning the encoded result. If the passed character is not a 
  letter, it is simply returned.
*/
function caesar_encrypt_one_letter(initial_char, shift_value){
  var letter_ascii = initial_char.toLowerCase().charCodeAt(0);
  var z_value = 'z'.charCodeAt(0);
  var a_value = 'a'.charCodeAt(0);
  var letter_difference = 0;
  var new_letter_ascii;
  //If this is not a letter, just pass it along.
  if (!(initial_char.toLowerCase().match(/[a-z]/i))){
    return initial_char;
  }
  new_letter_ascii = letter_ascii + shift_value;
  //Wrap-around if too high or low
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
  overall_encryption

  str: The input string to encrypt
  shift_value: The amount to shift by (positive means increasing in the 
  alphabet, negative is decreasing)

  TESTED: test_encryption
*/
function overall_encryption(str, shift_value){
  var final_string = [];
  for (var i = 0; i < str.length; i++) {
    final_string.push(caesar_encrypt_one_letter(str[i], shift_value));
  }
  return final_string.join("");
}

/*
  assert

  condition: The condition we want to check true or false ASSUMES a boolean
  No return value

  assert simply continues if the passed condition is true, and throws an 
  exception otherwise
*/
function assert(condition) {
  if (!condition) {
    throw "Encryption Test failed";
  }
}

/*
  test_encryption
  
  No input value
  No return value but outputs pass or error to the console

  test_encryption runs the testing data defined in encryption_tests.txt, parsing
  according to the folowing logic for the tests:

  ##Sample Test Data Format##
  input_text,shift_value,expected_output

  These values are separated by a comma, and no commas are expected in the input
  or output strings. This format is used for the test data to cross-use with
  the equivalent Python function.
*/
function test_encryption(){
  var tests, test_case_num, test_case, input_str, input_shift, output_str;
  jQuery.get('encryption_tests.txt', function(data) {
    tests = data.split("\n");
    for (test_case_num = 0; test_case_num < tests.length; test_case_num++){
      test_case = tests[test_case_num].split(",");
      input_str = test_case[0];
      input_shift = parseInt(test_case[1]);
      output_str = test_case[2];
      assert(overall_encryption(input_str, input_shift) === output_str);
    }
    encryption_code.value = data;
    console.log("Javascript encryption passed");
  });
}

/*
  convert_to_HTML

  data: The raw test from the Python file we want to parse
  returns an HTML-formatted piece of Python code

  convert_to_HTML takes in raw python text which follows the following
  conventions and converts it to formatted HTML:
    - for each line that is formatted, a commented line should be above with
      the exact HTML we wish to use in the application
    - the formats begin with a <a tag directly after the comment (i.e. #<a)
    - the code portion we wish to use ends with a #END# line
    - see encrypt.py for an example
*/
function convert_to_HTML(data){
  var python_lines = data.split("\n");
  var python_line, i;
  var final_python_code = [];
  var skip_flag = false;
  for (i = 0; i < python_lines.length; i++){
    if (skip_flag){
      skip_flag = false;
      continue;
    }
    python_line = python_lines[i];
    if (python_line == "#END#"){
      break;
    }
    if (python_line.trim().substring(0, 3) == "#<a"){
      final_python_code.push(python_line.replace("#", ""));
      skip_flag = true;
    } else {
      final_python_code.push(python_line);
    }
  }
  return final_python_code.join("\n");
}

/*
  spin_wheel_up

  No inputs
  No return value

  Animates the scrolling wheel upwards and increases the value
  by 1, overflowing if needed.
*/
function spin_wheel_up(){
  var ctx;
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
  var ctx;
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

/*
  enough_shifts_exhausted

  shift_offset: The direction we are shifting (ASSUMES -1 is downward, 1 is up)
  current_shift_val: The current number of letters we have shifted
  shifting_val: The total number of shifts we will be performing

  returns true if enough shifts have passed by to indicate the animation should
  stop, and false otherwise.
*/
function not_enough_shifts_exhausted(shift_offset, current_shift_val, shifting_val){
  return ((shift_offset === -1) && (current_shift_val > shifting_val + 1)) ||
          ((shift_offset === 1) && (current_shift_val < shifting_val - 1));
}

/*
  check_for_win

  guess_string: The ciphertext assembled by the user's plaintext and shift inputs
  No return value

  Checks the ciphertext generated by the user against the answer to generate whether
  or not the user has successfully encrypted the ciphertext. Provides feedback accordingly
*/
function check_for_win(guess_string){
  if (overall_encryption(plaintext_solution, shift_solution) === guess_string){
    $('#modalSuccess').modal('open');
  } else {
    $('#modalRetry').modal('open');
  }
}

/*
  encryption_redraw

  i: The index of the passed_text_value we are at
  passed_text_value: The plaintext value passed in by the user
  current_shift_value: The current number of shifts we have performed
  shifting_value: The total number of shifts to perform
  step: The animation step we are on (ASSUMES 50 steps per animation)
  ctx: The 2d drawing context from the canvas

  No return value

  encryption_redraw animates and redraws the encryption process text by
  redrawing the encryption process animated text. The function sets timers
  recursively to ensure a smooth and consistent animation effect.
*/
function encryption_redraw(i, passed_text_value, current_shift_value, 
                                                    shifting_value, step, ctx){
  var canvas_width = square_box.clientWidth - 2 * canvas_margin;
  var canvas_height = 200;
  var box_width = canvas_width / passed_text_value.length;
  var max_box_width = 50;
  var height_offset = 100;
  var line_draw_height = height_offset + max_box_width - 2;
  var shift_offset = 1;
  var next_letter, text_start, previous_letter, next_letter, text_letter;
  var line_offset;
  var abs_shift = Math.abs(shifting_value);
  encryption_scrolling_speed = 100 / (passed_text_value.length * abs_shift);
  //So as to not be too slow
  encryption_scrolling_speed = Math.min(15, encryption_scrolling_speed);
  box_width = Math.min(box_width, max_box_width);
  ctx.clearRect(0, box_height, canvas_width, box_height);

  // Negative shift for moving in the negative direction
  if (shifting_value < 0){
    shift_offset = -1;
  }
  if (step === max_number_of_steps){
    //Check if we have shifted enough, if so move onto the next letter
    if (not_enough_shifts_exhausted(shift_offset, current_shift_value, shifting_value)){
      setTimeout(encryption_redraw, encryption_scrolling_speed, i, 
                          passed_text_value, current_shift_value + shift_offset,
                          shifting_value, 0, ctx);
      return;      
    }
    //Enough shifts have passed, so either move on to the next letter or let
    //another encryption start
    if (i == (passed_text_value.length - 1)){
      $("#encrypt").removeClass('disabled');
      ctx.clearRect(0, box_height, canvas_width, box_height);
      check_for_win(overall_encryption(passed_text_value, shifting_value));
      return;       
    } else {
      setTimeout(encryption_redraw, encryption_scrolling_speed, i + 1, 
                                  passed_text_value, 0, shifting_value, 0, ctx);
      return;      
    }
  }

  //Fill in the rectangle for this letter
  ctx.clearRect(canvas_margin + i * box_width, box_height, canvas_width, canvas_height);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(canvas_margin + i * box_width, height_offset, box_width, box_height);
  establish_context_settings(ctx, passed_text_value.length);

  //Draw text according to the current and next shift values
  next_shift_value = current_shift_value + shift_offset;
  text_start = i * box_width + (box_width / 2);
  text_letter = passed_text_value[i];
  previous_letter = caesar_encrypt_one_letter(text_letter, current_shift_value);
  next_letter = caesar_encrypt_one_letter(text_letter, next_shift_value);
  if (shift_offset === -1){
    ctx.fillText(previous_letter, canvas_margin + text_start, height_offset + 30 + step);
  } else {
    ctx.fillText(previous_letter, canvas_margin + text_start, height_offset + 30 - step);
  }
  //Clear above the letters

  if (shift_offset === -1){
    ctx.fillText(next_letter, canvas_margin + text_start, height_offset - 20 + step); 
    ctx.beginPath();
    line_offset = height_offset + 2;
    ctx.moveTo(canvas_margin + i * box_width, line_offset + step);
    ctx.lineTo(canvas_margin + (i + 1) * box_width, line_offset + step);
    ctx.stroke();   
  } else {
    ctx.fillText(next_letter, canvas_margin + text_start, height_offset + 80 - step);
    ctx.beginPath();
    line_offset = line_draw_height - step;
    ctx.moveTo(canvas_margin + i * box_width, line_offset);
    ctx.lineTo(canvas_margin + (i + 1) * box_width, line_offset);
    ctx.stroke();
  }

  //Clear above the letters
  ctx.fillStyle = "#3F5666";
  ctx.fillRect(0, box_height, canvas_width + 2 * canvas_margin, box_height);

  //Clear below the letters
  ctx.fillStyle = "#3F5666";
  ctx.fillRect(0, box_height + height_offset, canvas_width + 2 * canvas_margin, 
                                                                    box_height);         

  draw_vertical_box_lines(ctx, i, box_height, box_width, height_offset);

  setTimeout(encryption_redraw, encryption_scrolling_speed, i,passed_text_value, 
                            current_shift_value, shifting_value, step + 1, ctx);
}


/*
  run_encryption

  No inputs
  No return value

  Runs the encryption process, which encompasses the shifting animation
*/
function run_encryption(){
  var passed_text_value = plaintext_value.value;
  var selected_value = (start_index + 2) % numbers.length;
  var shifting_value = numbers[selected_value];
  var parent_node = document.getElementById("black-box-parent");
  var height_offset = 0;
  var max_box_height = 50;
  var canvas, this_letter, button_parent_node, canvas_size, box_width, i;
  var string_array, mapped_array, new_text;
  remove_tooltip();
  if (plaintext_not_valid(passed_text_value)){
    alert("Plaintext should not be blank!");
    return;
  }

  if (passed_text_value.length > 30){
    alert("This plaintext is too long!");
    return;
  }

  button_parent_node = document.getElementById('button-container');
  //Remove the encryption animation if it exists already
  if (document.getElementById("black_box_canvas")){
    document.getElementById("black_box_canvas").remove();
  }
  //Create a new canvas and place it in the encryption box
  canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 200;
  canvas.id = "black_box_canvas";

  parent_node.appendChild(canvas);
  black_box_text.remove();
  if (black_box_text.parent_node){
    black_box_text.parent_node.removeChild(black_box_text);
  }

  //Disable the ability to encrypt for now
  $("#encrypt").addClass('disabled');

  if (canvas.getContext){
    canvas_size = square_box.clientWidth - 2 * canvas_margin;
    box_width = canvas_size / passed_text_value.length;
    box_width = Math.min(box_width, max_box_height);
    ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas_size, canvas.height);

    //Draw static top boxes
    for (i = 0; i < passed_text_value.length; i++) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(canvas_margin + i * box_width, height_offset, box_width, box_height);
      establish_context_settings(ctx, passed_text_value.length);
      this_letter = passed_text_value[i];
      ctx.fillText(this_letter, canvas_margin + box_width * (i + 1.0/2), text_height_offset);

      draw_vertical_box_lines(ctx, i, box_height, box_width, height_offset);
    }
    setTimeout(encryption_redraw, encryption_scrolling_speed, 0, 
                  passed_text_value, 0, shifting_value, 0, ctx, shifting_value);
  }
  //Fix to place at end of animation
  string_array = passed_text_value.split("");
  mapped_array = string_array.map(function(c){
    return caesar_encrypt_one_letter(c, shifting_value);
  })
  new_text = mapped_array.join("");
  output_text.value = new_text;    
}
/*
  draw_vertical_box_lines

  ctx: The canvas 2D drawing context
  box_number: The number of the box we are drawing
  box_height: The height of the box we are drawing
  box_width: The width of the box we are drawing
  height_offset: The vertical offset for the box we wish to draw borders around
  No return value

  Draws the border lines for boxes with the border lines being vertical (for
  the encryption action) 
*/
function draw_vertical_box_lines(ctx, box_number, box_height, box_width, 
                                                                height_offset){
  ctx.beginPath();
  ctx.moveTo(canvas_margin + box_number * box_width, height_offset);
  ctx.lineTo(canvas_margin + box_number * box_width, height_offset + box_height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvas_margin + (box_number + 1) * box_width, height_offset);
  ctx.lineTo(canvas_margin + (box_number + 1) * box_width, height_offset + box_height);
  ctx.stroke();  
}

/*
  modify_instructions

  No inputs
  No return value

  Flips the instructions text from hidden to shown, and vise versa
*/
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

/*
  copy_to_clipboard

  No inputs
  No return value

  Copies the text in the ciphertext area to the clipboard
*/
function copy_to_clipboard(){
  var copy_text_area, copied;
  var toast_display_time = 4000
  $('#output_text').removeAttr('disabled');
  copy_text_area = document.querySelector('#output_text');
  copy_text_area.select();
  copied = document.execCommand('copy');
  $('#output_text').attr('disabled', 'true');
  if (copied){
    Materialize.toast('Copied to Clipboard!', toast_display_time);    
  } else {
    Materialize.toast('Copy Failed, try manual copying', toast_display_time);
  }
}

//Run the following when instantiating the web page
test_encryption();
draw_wheel()
//Convert the Python code to HTML and highlight
jQuery.get('encrypt.py', function(data) {
  var python_function = convert_to_HTML(data);
  encryption_code.innerHTML = python_function;
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  $('#modal_encrypt').modal('open');
});

//Bind buttons to events
spinUp.addEventListener("click", spin_wheel_up);
spinDown.addEventListener("click", spin_wheel_down);
encrypt.addEventListener("click", run_encryption);
clipboard.addEventListener("click", copy_to_clipboard);

