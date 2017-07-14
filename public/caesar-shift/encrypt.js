// Jordan Stapinski
// Enigma Unit Caesar Shift Encryption Accompanying JS file

var plaintext_solution = "move north";
var shift_solution = 3;

const instructions = "Using a plaintext of: <strong>move north</strong>, perform a Caesar\
                    Shift of <strong>up 3</strong> using the computational model (input\
                    the needed inputs on the left, and press 'Encrypt' to run the\
                    encryption and see the ciphertext as the output!).";

const modal_text = "One method of encrypting a message is through a <strong>Caesar\
 Shift</strong>, in which we specify a number and direction which we move in the\
 alphabet for each letter in our original text to get our encrypted text. Try the\
 encryption example here, and feel free to click on the 'Play with Caesar Shift'\
 button to insert your own text and shift values to see the Caesar Shift in action!";

const retry_text = "It seems like something was encrypted, but not exactly the \
message and shift amount we were going for. Are you sure your plaintext value \
is <strong>move north</strong> and your encryption shift is <strong>up (positive) \
3</strong>?";

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
    console.log("Javascript encryption passed");
  });
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