// Jordan Stapinski
// Enigma Password Encryption JS file

var word_index_wheel_canvas = document.getElementById('word_index_wheel');
var word_shift_canvas = document.getElementById('word_shift_canvas');
var password_value = document.getElementById('password_value');
var plaintext_value = document.getElementById('plaintext_value');
var output_text = document.getElementById('output_text');
var square_box = document.getElementById('square-box');
var current_word_index = 0;
var given_word = '';
var box_height = 50;
var box_height_offset = 100;
var text_height_offset = box_height * (3.0/5);
var margin = 5;
var time_duration = 10;

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

function animate_ciphertext(word_index, step, ciphertext, ctx, box_width){
  var max_step = 50;
  var canvas_width = 500;
  //Move on to next letter
  if (step >= max_step){
    if (word_index === (ciphertext.length - 1)){
      return;
    }
    setTimeout(animate_ciphertext, time_duration, word_index + 1, 0, ciphertext, ctx, box_width);
    return;
  }
  // Draw this one a touch higher
  ctx.clearRect(margin + word_index * box_width, box_height + box_height_offset, box_width, box_height);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(margin + word_index * box_width, box_height + box_height_offset, box_width, box_height);
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.font = '20px Arial';
  ctx.fillText(ciphertext[word_index], margin + word_index * box_width + box_width / 2, box_height + box_height_offset + text_height_offset + 50 - step);
  ctx.fillText(ciphertext[word_index], margin + word_index * box_width + box_width / 2, box_height + box_height_offset + text_height_offset - step);
  ctx.fillStyle = "#3F5666";
  ctx.fillRect(0, box_height, canvas_width, box_height_offset);
  setTimeout(animate_ciphertext, time_duration, word_index, step + 1, ciphertext, ctx, box_width);
}

function draw_text_animations(plaintext, ciphertext, ctx){
  var canvas = document.getElementById('black_box_canvas');
  var box_width = (square_box.clientWidth - 2 * margin) / plaintext.length;
  var box_height = 50;
  // draw plaintext
  for (var i = 0; i < plaintext.length; i++){
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(margin + (i * box_width), 0, box_width, box_height);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = '20px Arial';
    ctx.fillText(plaintext[i], margin + box_width * (i + (1.0 / 2)), text_height_offset);
    ctx.beginPath();
    ctx.moveTo(margin + (i * box_width), 0);
    ctx.lineTo(margin + (i * box_width), box_height);
    ctx.stroke();
  }
  animate_ciphertext(0, 0, ciphertext, ctx, box_width);
  // loop through ciphertext and draw
  // for (i = 0; i < ciphertext.length; i++){
  //   ctx.fillStyle = "#FFFFFF";
  //   ctx.fillRect(margin + (i * box_width), box_height_offset, box_width, box_height);
  //   ctx.fillStyle = "#000000";
  //   ctx.textAlign = "center";
  //   ctx.font = '20px Arial';
  //   ctx.fillText(ciphertext[i], margin + box_width * (i + (1.0 / 2)), text_height_offset + box_height_offset);
  //   ctx.beginPath();
  //   ctx.moveTo(margin + (i * box_width), box_height_offset);
  //   ctx.lineTo(margin + (i * box_width), box_height + box_height_offset);
  //   ctx.stroke();    
  // }
	return;
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
  var ctx;
	$('#word_shift_text').removeAttr('hidden');
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
  black_box_text.remove();
  if (black_box_text.parent_node){
    black_box_text.parent_node.removeChild(black_box_text);
  }

  //Disable the ability to encrypt for now
  $("#encrypt").addClass('disabled');
  output_text.value = final_word;
	draw_text_animations(plaintext, final_word, ctx);
  draw_word_position(0);
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
	return;
}

/*
	draw_inner_triangle

	ctx: The drawing context for the word_index_wheel_canvas
	No return value

	Draws the inner, light section for the selected word index	
*/
function draw_inner_triangle(ctx){
	return;
}

/*
	draw_current_index_value

	ctx: The drawing context for the word_index_wheel_canvas
	angle: The angle at which we want to draw the value (spinning around the wheel)
	No return value

	Draws the current word index value, along with its letter, on the wheel
*/
function draw_current_index_value(ctx, angle){
	if (!angle){
		angle = 0;
	}
	return;
}

function draw_index_wheel(){
	var ctx;
	if (word_index_wheel_canvas.getContext){
		ctx = word_index_wheel_canvas.getContext('2d');
		draw_outer_wheel(ctx);
		draw_inner_triangle(ctx);
		draw_current_index_value(ctx);
	}
}

function draw_word(ctx){
  var word = password_value.value;
  var canvas_width = word_shift_canvas.clientWidth;
  var box_width = canvas_width / (word.length);
  for (var i = 0; i < word.length; i++){
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
  }
  return;
}

function highlight_word_position(ctx, word_index){
  var word = password_value.value;
  var canvas_width = word_shift_canvas.clientWidth;
  var box_width = canvas_width / (word.length);
  // Draw yellow box the box_width and height as needed
  ctx.fillStyle = "#F8CA4D";
  ctx.fillRect(word_index * box_width, 0, box_width, box_height);
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(word_index * box_width, 0);
  ctx.lineTo(word_index * box_width, box_height);
  ctx.stroke();
  ctx.font = "30px Arial";    
  ctx.textAlign = "center";
  ctx.fillText(word[word_index], box_width * (word_index + 1.0/2), text_height_offset);
  return;
}

/*

*/
function draw_word_position(word_index){
  var ctx;
  if (word_shift_canvas.getContext){
    ctx = word_shift_canvas.getContext('2d');
    //Might want to clear canvas here
    var canvas_width = word_shift_canvas.clientWidth;
    var canvas_height = word_shift_canvas.clientHeight;
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    draw_word(ctx);
    highlight_word_position(ctx, word_index);
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
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});

test_password_encrypt()
encrypt.addEventListener('click', run_encryption);
setTimeout(run_start_modal, 600);