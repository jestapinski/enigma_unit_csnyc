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
var spin_up = document.getElementById('spinUp');
var spin_down = document.getElementById('spinDown');
var clipboard = document.getElementById('clipboard');
var current_word_index = 0;
var given_word = '';
var box_height = 50;
var box_height_offset = 100;
var text_height_offset = box_height * (3.0/5);
var margin = 10;
var time_duration = 7;
var instruction_speed = 500;
var a_value = 'a'.charCodeAt(0);
var hidden_text = false;
var instructions = "Write your own <strong>plaintext message of at least 5 \
                  letters</strong> and <strong>password of at least 5 letters\
                  </strong> such that the encrypted text is composed of all \
                  <strong>unique letters</strong> (i.e. no letter is in the \
                  encrypted text twice)!";
var pi = Math.PI;
var cx = 100;
var cy = 100;
var radius = 95;
var cos = Math.cos;
var sin = Math.sin;
function to_radians (angle) {
  return angle * (pi / 180);
}
var theta_right = to_radians(-60);
var theta_left = to_radians(-120);
var given_password = password_value.value;
var rotation_angle = 0;
var angle_offset = 20;
var max_step = 50;

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
  ctx.font = '20px Arial';
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
                                                            box_height_offset);
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
  ctx.font = "20px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";
  if (!(plaintext[word_index].toLowerCase().match(/[a-z]/i))){
    shift_text = 'Not changing \''.concat(plaintext[word_index], 
                                              '\' because it is not a letter');
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
    ctx.font = '20px Arial';
    ctx.fillText(plaintext[i], box_horizontal + (box_width/2), 
                                                            text_height_offset);
    ctx.beginPath();
    ctx.moveTo(box_horizontal, 0);
    ctx.lineTo(box_horizontal, box_height);
    ctx.stroke();
  }  
}

function check_is_win(plaintext, password, ciphertext){
  return ((Set(ciphertext).size == ciphertext.length)
          && (plaintext.size >= 5)
          && (password.size >= 5)
    );
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
  var password_shift = password[password_index].charCodeAt(0) - a_value;
  var text_start_x, text_height;
  if (step >= max_step){
    //Move on to next letter
    if (word_index === (ciphertext.length - 1)){
      //End of the word, stop here
      draw_plaintext(plaintext, ctx);
      draw_word_position(-1);
      $("#encrypt").removeClass('disabled');
      $("#spinUp").removeClass('disabled');
      if (current_word_index != 0){
        $("#spinDown").removeClass('disabled');
      }
      if (check_is_win){
        console.log("win!");
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

  //Set the timeout to continue the animation
  setTimeout(animate_ciphertext, time_duration, word_index, step + 1, 
                               ciphertext, ctx, box_width, plaintext, password);
}

/*
  password_encrypt

  plaintext: The plaintext value we want to encrypt
  password: The encryption password we will use to generate substitution shifts
  word_index: The index of the password we want to start on

  returns the encrypted plaintext using the provided password and the current
  word index.
*/
function password_encrypt(plaintext, password, word_index){
	var final_word = '';
  var a_value = 'a'.charCodeAt(0);
  var shift_value, total_index, encryption_letter;
	for (letter_index in plaintext){
		total_index = word_index + parseInt(letter_index);
		encryption_letter = password[total_index % password.length];
		shift_value = encryption_letter.toLowerCase().charCodeAt(0) - a_value;
		final_word += caesar_encrypt_one_letter(plaintext[letter_index], 
													shift_value=shift_value);
	}
  return final_word;
}


/*
  test_password_encrypt

  No inputs
  No return value

  Tests the password_encrypt function using test inputs and expected outputs
  found in password-encrypt-tests.txt, raising an assertion failure if a test
  fails, or outputting a success message to the console otherwise.
*/
function test_password_encrypt(){
  var tests, test_case_num, test_case, input_str, input_shift, output_str;
  jQuery.get('password-encrypt-tests.txt', function(data) {
    tests = data.split("\n");
    for (test_case_num = 0; test_case_num < tests.length; test_case_num++){
      test_case = tests[test_case_num].split(",");
      input_str = test_case[0];
      password = test_case[1];
      input_shift = parseInt(test_case[2]);
      output_str = test_case[3];
      assert(password_encrypt(input_str, password, input_shift) === output_str);
    }
    console.log("Javascript password encryption passed");
  });
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
	run_encryption

  No inputs
  No return value

  Runs the encryption process, including encrypting the current plaintext value,
  showing the necessary animations, and updating UI elements.
*/
function run_encryption(){
	var final_word, password, plaintext;
  var parent_node = document.getElementById("black-box-parent");
  var black_box_text = document.getElementById('black_box_text');
  var box_width, ctx;
	$('#word_shift_text').removeAttr('hidden');
  $("#spinUp").addClass('disabled');
  $("#spinDown").addClass('disabled');
	password = password_value.value;
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
  console.log(step);
  if (step == max_step){
    current_word_index += -pass;
    $("#spinUp").removeClass('disabled');
    if (current_word_index != 0){
      $("#spinDown").removeClass('disabled');
    }
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
	No return value

	Draws the current word index value, along with its letter, on the wheel
*/
function draw_current_index_value(ctx, angle, pass){
  console.log(angle);
	if (!angle){
		angle = 0;
	}
  if (!pass){
    pass = 0;
  }
  ctx.translate(cx, cy);
  ctx.rotate(to_radians(pass * angle));
  var x, y;
  var text_height = 60;
  // x = cx;
  y = - text_height + 10;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.font = '30px Arial';
  ctx.fillText(current_word_index.toString(), 0, y);
  ctx.font = '20px Arial';
  ctx.fillText(given_password[current_word_index % given_password.length], 0, -30);
  ctx.rotate(to_radians(pass * -50));
  ctx.font = '30px Arial';
  ctx.fillText((current_word_index - pass).toString(), 0, y);
  ctx.font = '20px Arial';
  ctx.fillText(given_password[(current_word_index - pass) % given_password.length], 0, -30);
	return;
}

function input_change(){
  given_password = password_value.value;
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
  var word = password_value.value;
  var canvas_width = word_shift_canvas.clientWidth;
  var box_width = canvas_width / (word.length);
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
    ctx.font = "30px Arial";    
    ctx.textAlign = "center";
    ctx.fillText(word[i], box_width * (i + 1.0/2), text_height_offset);
    ctx.font = "20px Arial";    
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
  var word = password_value.value;
  var canvas_width = word_shift_canvas.clientWidth;
  var box_width = canvas_width / (word.length);
  var box_horizontal;
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
  ctx.font = "30px Arial";    
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

// Run the password encrypt algorithm unit tests
jQuery.get('password-encrypt.py', function(data) {
  var python_function = convert_to_HTML(data);
  encryption_code.innerHTML = python_function;
  instruction_text.innerHTML = instructions;
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  $("#spinDown").addClass('disabled');
});

test_password_encrypt()
draw_index_wheel();
encrypt.addEventListener('click', run_encryption);
spin_up.addEventListener('click', increase_index);
spin_down.addEventListener('click', decrease_index);
clipboard.addEventListener('click', copy_to_clipboard);
setTimeout(run_start_modal, 600);