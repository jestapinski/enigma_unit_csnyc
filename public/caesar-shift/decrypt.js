/*
  Jordan Stapinski
  decrypt.js: Enigma Unit Caesar Shift Decryption Accompanying JS file
  Enigma CSNYC module - MongoDB
*/

const plaintext_solution = 'take paris';
const instructions = 'We have a ciphertext of: <strong>ryic nypgq</strong>, but we do not know what shift values were used to encode this. Try different shift values and press "Decrypt" to see if we can reverse the encryption to something legible!';
const modal_text = 'Now that we have seen how to encrypt some text using a Caesar Shift, we have a new task. We have intercepted some Ciphertext <strong>ryic nypgq</strong>. We know it was encrypted with a Caesar Shift, but we do not know what it means. Can you try different Encryption Shift possibilities to see if we can decode the message?';
const success_text = 'You found it! This is how cryptographers (people who make and break encryption algorithms) were able to defeat the Caesar Shift: by trying a bunch of different Encryption Shift values (often called a <strong>brute force attack</strong>) until something made sense.<br/><br/> Now for a new type of encryption strategy!';

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
function caesar_encrypt_one_letter(initial_char, shift_value) {
  const letter_ascii = initial_char.toLowerCase().charCodeAt(0);
  const z_value = 'z'.charCodeAt(0);
  const a_value = 'a'.charCodeAt(0);
  const wrap_offset = -1;
  let letter_difference = 0;
  let new_letter_ascii;
  // If this is not a letter, just pass it along.
  if (!(initial_char.toLowerCase().match(/[a-z]/i))) {
    return initial_char;
  }
  new_letter_ascii = letter_ascii + shift_value;
  // Wrap-around if too high or low
  if (new_letter_ascii > z_value) {
    letter_difference = new_letter_ascii - z_value;
    new_letter_ascii = a_value + letter_difference + wrap_offset;
  } else if (new_letter_ascii < a_value) {
    letter_difference = a_value - new_letter_ascii;
    new_letter_ascii = z_value - letter_difference - wrap_offset;
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
function overall_encryption(str, shift_value) {
  const final_string = [];
  for (let i = 0; i < str.length; i += 1) {
    final_string.push(caesar_encrypt_one_letter(str[i], shift_value));
  }
  return final_string.join('');
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
    throw Error('Decryption Test failed');
  }
}

/*
  check_for_win

  plaintext: The plaintext decrypted using the user's ciphertext and shift inputs
  No return value

  Checks the ciphertext generated by the user against the answer to generate whether
  or not the user has successfully encrypted the ciphertext. Provides feedback accordingly
*/
function check_for_win(plaintext) {
  if (plaintext_solution === plaintext) {
    $('#modalSuccess').modal('open');
  } else {
    $('#modalRetry').modal('open');
    shown_retry_msg = true;
  }
}

/*
  test_decryption

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
function test_decryption() {
  let tests;
  let test_case_num;
  let test_case;
  let input_str;
  let input_shift;
  let output_str;
  jQuery.get('decryption-tests.txt', (data) => {
    tests = data.split('\n');
    for (test_case_num = 0; test_case_num < tests.length; test_case_num += 1) {
      test_case = tests[test_case_num].split(',');
      input_str = test_case[0];
      input_shift = -parseInt(test_case[1], 10);
      output_str = test_case[2];
      assert(overall_encryption(input_str, input_shift) === output_str);
    }
    console.log('Javascript decryption passed');
  });
}
