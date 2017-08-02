// Jordan Stapinski
// Enigma Password Encryption JS file

var word_index_wheel_canvas = document.getElementById('word_index_wheel');
var word_shift_canvas = document.getElementById('word_shift_canvas');
var password_value = document.getElementById('password_value');
var plaintext_value = document.getElementById('plaintext_value');
var output_text = document.getElementById('output_text');
var square_box = document.getElementById('square-box');
var encrypt = document.getElementById('encrypt');
var instruction_text = document.getElementById('instructions_text');
var opening_modal_text = document.getElementById('opening_modal_text');
var spin_up = document.getElementById('spinUp');
var spin_down = document.getElementById('spinDown');
var clipboard = document.getElementById('clipboard');
var index_input = document.getElementById('index_input');
var success_modal_text = document.getElementById('success_modal_text');
var retry_modal_text = document.getElementById('retry_modal_text');
var encrypt_code = document.getElementById('encrypt_code');
var current_word_index = 0;
var given_word = '';
var validate = true;
const enable_tooltips = true;
const box_height = 50;
const box_height_offset = 100;
const text_height_offset = box_height * (3.0/5);
const margin = 10;
const time_duration = 5;
const instruction_speed = 500;
const a_value = 'a'.charCodeAt(0);
const wheel_rotation_offset = -50;
var hidden_text = false;
const pi = Math.PI;
const cx = 100;
const cy = 100;
var radius = 95;
var cos = Math.cos;
var sin = Math.sin;
function to_radians (angle) {
  return angle * (pi / 180);
}
var theta_right = to_radians(-60);
var theta_left = to_radians(-120);
var given_password = password_value.value.toLowerCase();
var rotation_angle = 0;
var angle_offset = 20;
var max_step = 50;
var decrypt = false;
var shift_switch;

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
  draw_highlighted_letter

  ctx: The 2d drawing context for the blue box canvas
  word_index: The current index of the plaintext/ciphertext we are animating
  plaintext: The original message we are encrypting
  text_start_x: The horizontal point for our text
  box_width: The width of the box for each letter of text

  No return value

  Draws a highlighted version of the specified plaintext letter in the blue box 
  animation canvas. This allows for the user to clearly see the plaintext value
  being modified. Draws a yellow-ish background with a black text value.

  Helper function to animate_ciphertext
*/
function draw_highlighted_letter(ctx, word_index, plaintext, text_start_x,
                                                                    box_width){
  ctx.fillStyle = "#F8CA4D";
  ctx.textAlign = "center";
  ctx.font = '1.30rem PT Mono';
  ctx.fillRect(margin + word_index * box_width, 0, box_width, box_height);
  ctx.fillStyle = "#000000";
  ctx.fillText(plaintext[word_index], text_start_x, text_height_offset);
  ctx.fillStyle = "#FFFFFF";
}

/*
  animate_text_draw_lines

  ctx: The 2d drawing context for the blue box canvas
  ciphertext: The encrypted plaintext
  plaintext: The original message we are encrypting
  word_index: The current index of the plaintext/ciphertext we are animating
  text_start_x: The horizontal point for our text
  box_width: The width of the box for each letter of text
  text_height: The height of the text in the lower, animating, region of the box

  No return value

  Draws the 'scrolling' text by shifting y-coordinates according to the current
  step in the animation (calculation figured out in animate_ciphertext). Also
  draws the divider lines to separate letters in the animated text.

  Helper function to animate_ciphertext
*/
function animate_text_draw_lines(ctx, ciphertext, plaintext, word_index, 
                                        text_start_x, box_width, text_height){
  var selected_box_width = word_index * box_width;
  ctx.fillStyle = "#000000";
  ctx.fillText(ciphertext[word_index], text_start_x, text_height + box_height);
  ctx.fillText(plaintext[word_index], text_start_x, text_height);
  ctx.beginPath();
  ctx.moveTo(margin + selected_box_width, box_height + box_height_offset);
  ctx.lineTo(margin + selected_box_width, 2 * box_height + box_height_offset);
  ctx.stroke();
}

/*
  clear_text_overflow

  ctx: The 2d drawing context for the blue box canvas
  canvas_width: The width of the blue box canvas

  No return value

  Clears the areas above and below the lower, animating section in the blue
  box canvas to hide text re-drawing effects.

  Helper function to animate_ciphertext
*/
function clear_text_overflow(ctx, canvas_width){
  ctx.fillStyle = "#3F5666";
  ctx.fillRect(0, box_height, canvas_width, box_height_offset);
  ctx.fillRect(0, 2 * box_height + box_height_offset, canvas_width, 
                                                            box_height_offset / 2);
}

/*
  draw_process_text

  ctx: The 2d drawing context for the blue box canvas
  plaintext: The original message we are encrypting
  password_shift: The value we are shifting the word_index place in the 
    plaintext by to encrypt it
  word_index: The current index of the plaintext/ciphertext we are animating
  ciphertext: The encrypted plaintext

  No return value

  Draws process text showing the user, clearly, our plaintext letter, our
  ciphertext letter, and the shift we are using to go from plaintext to
  ciphertext. If the given point in the plaintext is not a letter, then we
  report that this is not a letter and it is not shifted.

  Helper function to animate_ciphertext
*/
function draw_process_text(ctx, plaintext, password_shift, word_index, 
                                                                  ciphertext){
  var shift_text = 'Shifting ';
  ctx.font = "1.30rem PT Mono";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";
  if (!(plaintext[word_index].toLowerCase().match(/[a-z]/i))){
    shift_text = "'".concat(plaintext[word_index], '\' is not a letter');
  } else {
    shift_text = shift_text.concat(plaintext[word_index], ' by ', 
                           password_shift, ' to get ', ciphertext[word_index]);    
  }
  ctx.fillText(shift_text, margin, box_height_offset);
}

/*
  draw_plaintext

  plaintext: The original message we are encrypting
  ctx: The 2d drawing context for the blue box canvas

  No return value

  Draws the upper 'static' plaintext section within the blue box, containing
  text and dividing lines between text boxes.

  Helper function for animate_ciphertext
*/
function draw_plaintext(plaintext, ctx){
  var canvas = document.getElementById('black_box_canvas');
  var box_width = (square_box.clientWidth - 2 * margin) / plaintext.length;
  var box_height = 50;
  var box_horizontal;
  // draw plaintext
  ctx.clearRect(0, 0, canvas.clientWidth, box_height);
  for (var i = 0; i < plaintext.length; i++){
    box_horizontal = margin + (i * box_width)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(box_horizontal, 0, box_width, box_height);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = '1.30rem PT Mono';
    ctx.fillText(plaintext[i], box_horizontal + (box_width/2), 
                                                            text_height_offset);
    ctx.beginPath();
    ctx.moveTo(box_horizontal, 0);
    ctx.lineTo(box_horizontal, box_height);
    ctx.stroke();
  }  
}

/*
  animate_ciphertext

  word_index: The current index of the plaintext/ciphertext we are animating
  step: The point in the animation we are at (0 <= step <= 50) 
  ciphertext: The encrypted plaintext
  ctx: The 2d drawing context for the blue box canvas
  box_width: The width of the box for each letter of text
  plaintext: The original message we are encrypting
  password: The password we are using to encrypt the plaintext

  No return value

  Runs the animations for the password encryption process, including:
    - Animating the plaintext --> ciphertext process in the blue box
    - Showing moving through the password with values in the word shift canvas
    - Highlighting the current point of the plaintext and password in the 
      algorithm

  Continuously sets timers for continued calls and a smooth animation
*/
function animate_ciphertext(word_index, step, ciphertext, ctx, box_width, 
                                                        plaintext, password){
  var canvas_width = 500;
  var password_index = (word_index + current_word_index) % password.length;
  var password_shift = shift_letter(password, password_index, a_value);
  var text_start_x, text_height;
  if (step >= max_step){
    //Move on to next letter
    if (word_index === (ciphertext.length - 1)){
      //End of the word, stop here
      draw_plaintext(plaintext, ctx);
      draw_word_position(0);
      $("#encrypt").removeClass('disabled');
      $("#spinUp").removeClass('disabled');
      if (!decrypt){
        $("#plaintext_value").attr('disabled', false);
      }
      $("#password_value").attr('disabled', false);
      $("#index_input").attr('disabled', false);
      if (current_word_index != 0){
        $("#spinDown").removeClass('disabled');
      }
      if (shift_switch){
        $('#shift_switch').removeAttr('disabled');
      }
      if (validate){
        if (check_is_win(plaintext, password, ciphertext)){
          $('#modalSuccess').modal('open');
          console.log("win!");
        } else {
          $('#modalRetry').modal('open');
        }
      }
      return;
    }
    setTimeout(animate_ciphertext, time_duration, word_index + 1, 0, ciphertext,
                                           ctx, box_width, plaintext, password);
    return;
  }
  text_start_x = margin + word_index * box_width + box_width / 2;
  draw_plaintext(plaintext, ctx);
  draw_word_position(word_index);
  draw_highlighted_letter(ctx, word_index, plaintext, text_start_x, box_width);

  //Draw the rectangle backing the letter here
  ctx.clearRect(margin + word_index * box_width, box_height + box_height_offset,
                                                         box_width, box_height);
  ctx.fillRect(margin + word_index * box_width, box_height + box_height_offset,
                                                         box_width, box_height);

  text_height = box_height + box_height_offset + text_height_offset - step;
  animate_text_draw_lines(ctx, ciphertext, plaintext, word_index, text_start_x,
                                                        box_width, text_height);
  clear_text_overflow(ctx, canvas_width);
  draw_process_text(ctx, plaintext, password_shift, word_index, ciphertext);

  if ((step >= max_step - 1) && (word_index === ciphertext.length - 1) && validate){
    setTimeout(animate_ciphertext, 100*time_duration, word_index, step + 1, ciphertext,
                                         ctx, box_width, plaintext, password);
    return
  }

  //Set the timeout to continue the animation
  setTimeout(animate_ciphertext, time_duration, word_index, step + 1, 
                               ciphertext, ctx, box_width, plaintext, password);
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

function has_special_characters(password){
  return (/[^a-zA-Z]+/.test(password));
}

function multiple_words(password){
  return (password.split(" ").length > 1);
}

function validate_password(password){
  if (password === ""){
    return "Password should not be blank";
  }
  if (multiple_words(password)){
    return "Password must only be one word";
  }
  if (has_special_characters(password)){
    return "Password must only contain letters a-z";
  }
  return '';
}

/*
	run_encryption

  No inputs
  No return value

  Runs the encryption process, including encrypting the current plaintext value,
  showing the necessary animations, and updating UI elements.
*/
function run_encryption(){
	var final_word, password, plaintext, password_errors, box_width, ctx;
  var parent_node = document.getElementById("black-box-parent");
  var black_box_text = document.getElementById('black_box_text');
  // Validate the password
  password = password_value.value.toLowerCase();
  password_errors = validate_password(password)
  if (password_errors){
    alert(password_errors);
    return;
  }
	$('#word_shift_text').removeAttr('hidden');
  $("#spinUp").addClass('disabled');
  $("#spinDown").addClass('disabled');
  $("#plaintext_value").attr('disabled', true);
  $("#password_value").attr('disabled', true);
  $("#index_input").attr('disabled', true);
  if (shift_switch){
    $('#shift_switch').attr('disabled', 'true');
  }
	plaintext = plaintext_value.value;
	final_word = password_encrypt(plaintext, password, current_word_index);
  if (document.getElementById("black_box_canvas")){
    document.getElementById("black_box_canvas").remove();
  }
  //Create a new canvas and place it in the encryption box
  canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 300;
  canvas.id = "black_box_canvas";

  parent_node.appendChild(canvas);
  ctx = canvas.getContext('2d');
  if (black_box_text){
    if (black_box_text.parent_node){
      black_box_text.parent_node.removeChild(black_box_text);
    }
    black_box_text.remove();    
  }

  //Disable the ability to encrypt for now
  $("#encrypt").addClass('disabled');
  output_text.value = final_word;
  box_width = (square_box.clientWidth - 2 * margin) / plaintext.length;
  animate_ciphertext(0, 0, final_word, ctx, box_width, plaintext, password);
}

function increase_index(){
  $("#spinUp").addClass('disabled');
  $("#spinDown").addClass('disabled');
  index_wheel_timer(0, -1);
}

function decrease_index(){
  if (current_word_index == 0){
    return;
  }
  $("#spinUp").addClass('disabled');
  $("#spinDown").addClass('disabled');
  index_wheel_timer(0, 1);
}

function index_wheel_timer(step, pass){
  if (step == max_step){
    current_word_index += -pass;
    $("#spinUp").removeClass('disabled');
    if (current_word_index != 0){
      $("#spinDown").removeClass('disabled');
    }
    index_input.value = current_word_index;
    draw_word_position(0);
    return;
  } else {
    draw_index_wheel(step, pass);
    setTimeout(index_wheel_timer, time_duration, step + 1, pass);
  }
}

/*
	run_start_modal

	No input values
	No return value

	Opens the starting modal (wrapped in a function for cleanliness)
*/
function run_start_modal(){
	$('#modal_encrypt').modal('open');
}

/*
	draw_outer_wheel

	ctx: The drawing context for the word_index_wheel_canvas
	No return value

	Draws the outer, dark wheel for the word index wheel
*/
function draw_outer_wheel(ctx){
  ctx.restore();
  ctx.save();
  ctx.clearRect(0, 0, 200, 250);
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * pi);
  ctx.lineWidth = 0;
  ctx.strokeStyle = '';
  console.log(cx);
  console.log(cy);
  console.log(radius);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.stroke();
	return;
}

/*
	draw_inner_triangle

	ctx: The drawing context for the word_index_wheel_canvas
	No return value

	Draws the inner, light section for the selected word index	
*/
function draw_inner_triangle(ctx){
  var x, y, x1, y1;
  x = cx + radius * cos(theta_right);
  y = cy + radius * sin(theta_right) + 2;
  console.log(x);
  console.log(y);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, y);
  x1 = cx + radius * cos(theta_left);
  y1 = cy + radius * sin(theta_left) + 2;
  ctx.lineTo(x1, y1);
  ctx.closePath();
  ctx.fillStyle = "#FFFFFF";
  ctx.lineWidth = 5;
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.stroke();
  console.log((y + y1) / 2);

  ctx.beginPath();
  //TODO fix
  ctx.ellipse((x + x1) / 2, (y + y1) / 2, (x - x1) / 2, 13.5, 0, -pi, 0);
  ctx.fill();
  ctx.stroke();
	return;
}

/*
	draw_current_index_value

	ctx: The drawing context for the word_index_wheel_canvas
	angle: The angle at which we want to draw (spinning around the wheel)
  direction
	No return value

	Draws the current word index value, along with its letter, on the wheel
*/
function draw_current_index_value(ctx, angle, direction){
  var next_letter;
  const text_height = 60;
  const y = - text_height + 10;
  let this_letter = given_password[current_word_index % given_password.length];
  let upcoming_letter = given_password[(next_letter) % given_password.length];
	if (!angle){
		angle = 0;
	}
  if (!direction){
    direction = 0;
  }
  if (this_letter === undefined){
    this_letter = '';
  }
  if (upcoming_letter === undefined){
    upcoming_letter = '';
  }
  ctx.translate(cx, cy);
  ctx.rotate(to_radians(direction * angle));

  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.font = '1.40rem PT Mono';
  ctx.fillText(current_word_index.toString(), 0, y);
  ctx.font = '1.30rem PT Mono';
  // Check undefined here!
  ctx.fillText(this_letter, 0, -text_height_offset);
  ctx.rotate(to_radians(direction * wheel_rotation_offset));
  ctx.font = '1.40rem PT Mono';
  ctx.fillText((current_word_index - direction).toString(), 0, y);
  ctx.font = '1.30rem PT Mono';
  next_letter = current_word_index - direction;
  ctx.fillText(upcoming_letter, 0, -text_height_offset);
	return;
}

function validate_index(index){
  if (index < 0){
    return 'Please enter a non-negative index!';
  }
  return;
}

function input_change(){
  var password_error, index_error;
  given_password = password_value.value.toLowerCase();
  password_error = validate_password(given_password);
  if (password_error){
    alert(password_error);
    return;
  }
  current_word_index = parseInt(index_input.value);
  index_error = validate_index(current_word_index);
  if (index_error){
    current_word_index = 0;
    alert(index_error);
    index_input.value = 0;
    draw_word_position(0);
    draw_index_wheel();
    return;
  }
  draw_word_position(0);
  draw_index_wheel();
}

/*
  draw_index_wheel

  No inputs
  No return value

  Draws the word index selection wheel on the word index selection canvas which
  is used to select the starting index in the password
*/
function draw_index_wheel(angle, pass){
	var ctx;
  console.log("drawing");
	if (word_index_wheel_canvas.getContext){
		ctx = word_index_wheel_canvas.getContext('2d');
		draw_outer_wheel(ctx);
		draw_inner_triangle(ctx);
    console.log(pass);
		draw_current_index_value(ctx, angle, pass);
	}
}

/*
  draw_password

  ctx: The 2d drawing context for the word shift canvas

  No return value

  Draws the password text within the word shift canvas
*/
function draw_password(ctx){
  var word = password_value.value.toLowerCase();
  var canvas_width = word_shift_canvas.clientWidth;
  var box_width = canvas_width / (word.length);
  if (validate_password(word)){
    return;
  }
  for (var i = 0; i < word.length; i++){
    var alphabet_position = word[i].charCodeAt(0) - a_value;
    //Background box
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(i * box_width, 0, box_width, box_height);
    //Dividers
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(i * box_width, 0);
    ctx.lineTo(i * box_width, box_height);
    ctx.stroke();
    //Letters
    ctx.font = "1.90rem PT Mono";    
    ctx.textAlign = "center";
    ctx.fillText(word[i], box_width * (i + 1.0/2), text_height_offset);
    ctx.font = "1.40rem PT Mono";    
    ctx.fillText(alphabet_position, box_width * (i + 1/2), 
                                              text_height_offset + box_height);
  }
  return;
}

/*
  highlight_password_position

  ctx: The 2d drawing context for the word shift canvas
  word_index: The point in the plaintext/ciphertext we are animating in

  No return value

  Draws a highlight over the current password position the animation is in

  Helper function for draw_word_position
*/
function highlight_password_position(ctx, word_index){
  var word = password_value.value.toLowerCase();
  var canvas_width = word_shift_canvas.clientWidth;
  var box_width = canvas_width / (word.length);
  var box_horizontal;
  if (validate_password(word)){
    return;
  }
  word_index = word_index % word.length;
  box_horizontal = word_index * box_width;
  // Draw yellow box the box_width and height as needed
  ctx.fillStyle = "#F8CA4D";
  ctx.fillRect(box_horizontal, 0, box_width, box_height);
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(box_horizontal, 0);
  ctx.lineTo(box_horizontal, box_height);
  ctx.stroke();
  ctx.font = "1.90rem PT Mono";    
  ctx.textAlign = "center";
  ctx.fillText(word[word_index], box_horizontal + (box_width/2), 
                                                            text_height_offset);
  return;
}

/*
  draw_word_position

  word_index: The point in the plaintext/ciphertext we are animating in

  No return value

  Draws the password and a highlighting effect at the word index (unless the 
  given word index is -1) on the word shift canvas 
*/
function draw_word_position(word_index){
  var ctx;
  if (word_shift_canvas.getContext){
    ctx = word_shift_canvas.getContext('2d');
    //Might want to clear canvas here
    var canvas_width = word_shift_canvas.clientWidth;
    var canvas_height = word_shift_canvas.clientHeight;
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    draw_password(ctx);
    if (word_index !== -1){
      highlight_password_position(ctx, word_index + current_word_index);      
    }
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
  var start_flag = false;
  for (i = 0; i < python_lines.length; i++){
    python_line = python_lines[i];
    if (python_line == "#START#"){
      start_flag = true;
      continue;
    }
    if (!start_flag){
      continue;
    }
    if (skip_flag){
      skip_flag = false;
      continue;
    }
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

// Allowing for modularity in different versions of the password exercise

if (document.title.includes('Encryption')){
  $.getScript('password-encrypt.js', function(){
    console.log('Loaded Encrypt');
    test_password_encrypt();
  });  
}

if (document.title.includes('Sandbox')){
  //Turn off validations while in the Sandbox
  validate = false;
  $.getScript('password-sandbox.js', function(){
    console.log('Loaded Sandbox');
    test_password_encrypt();
    test_password_decrypt();
  });    
}

if (document.title.includes('Decryption')){
  $.getScript('password-decrypt.js', function(){
    console.log('Loaded Decryption');
    test_password_decrypt();
    decrypt = true;
  });  
}

jQuery.get('encrypt.py', function(data) {
  var python_function = convert_to_HTML(data);
  encrypt_code.innerHTML = python_function;
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});

draw_index_wheel();
draw_word_position(0);
encrypt.addEventListener('click', run_encryption);
spin_up.addEventListener('click', increase_index);
spin_down.addEventListener('click', decrease_index);
clipboard.addEventListener('click', copy_to_clipboard);
setTimeout(run_start_modal, 600);
$(document).keypress(function(e){
  console.log(e.charCode);
    if (e.charCode == 13){
        encrypt.click();
    }
});