// Jordan Stapinski
// Enigma Password Encryption JS file

var word_index_wheel_canvas = document.getElementById('word_index_wheel');
var word_shift_canvas = document.getElementById('word_shift_canvas');
var password_value = document.getElementById('password_value');
var plaintext_value = document.getElementById('plaintext_value');
var output_text = document.getElementById('output_text');
var current_word_index = 0;
var given_word = '';

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

function animate_ciphertext(ciphertext){
	return;
}

/*
  password_encrypt

  plaintext: The plaintext value we want to encrypt
  password: The encryption password we will use to generate substitution shifts

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

test_password_encrypt()

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
	$('#word_shift_text').removeAttr('hidden');
	password = password_value.value;
	plaintext = plaintext_value.value;
	final_word = password_encrypt(plaintext, password, current_word_index);
	output_text.value = final_word;
	animate_ciphertext(final_word);
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

encrypt.addEventListener('click', run_encryption);
setTimeout(run_start_modal, 600);