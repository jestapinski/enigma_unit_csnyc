/*
  Jordan Stapinski
  password-encrypt.js
  Instructions and logic specific to the Vigenere#Encrypt exercise

  Javascript file which accompanies password.js. Required interface includes:
    Variables
      - instructions
      - opening_text
      - success_text
      - failure_text
    Functions
      - check_is_win
      - password_encrypt
      - shift_letter
  to operate in conjunction with the main password.js file.

  ASSUMES: 'a' is position 0 in the alphabet.
*/

const instructions = "Write your own <strong>plaintext message of at least 5 \
                    letters</strong> and <strong>password of at least 5 letters\
                    </strong> such that the encrypted text is composed of all \
                    <strong>unique letters</strong> (i.e. no letter is in the \
                    encrypted text twice)! <br/> Think about how the password\
                    works with the original text to create the new, encrypted text.\
                    <br/><br/>Feel free to click 'About Vigenere Cipher' to see an \
                    example! Fill in some plaintext and a password and click the \
                    'Encrypt' button!";

const opening_text = "We have been playing with encryption and decryption of\
                    text with a fixed shifting value for each letter. What if\
                    we made the encryption technique more complicated?\
                    Consider using a word to define our shift values. We can\
                    think of each letter as having a number according to its\
                    position in the alphabet (a is 0, b is 1, c is 2, and so\
                    on). Thus we can shift by amounts that vary based on a given\
                    password as we step through the password as we walk\
                    through encrypting our starting message. <br/><br />\
                    We can also vary the starting position in the password when\
                    we walk through as we encrypt: This position is known as\
                    the <strong>Start Index</strong> of the password.<br/><br/>\
                    For example, if we have <strong>abc</strong> and a password\
                    of <strong>bcd</strong>, we would shift 'a' by 1, 'b' by 2,\
                    and 'c' by 3 to get an ending text of <strong>'bdf'</strong>.";

const success_text = "Great work, moving on";

const failure_text = "Not quite, make sure you are following the instructions";

/*
  check_is_win

  plaintext: The original message we are encrypting/decrypting with the password
  password: The word we are using to apply a shift on the plaintext to encrypt
    or decrypt
  ciphertext: The result of applying a password shift on the plaintext with the
  given password

  Validates the user's inputs versus the provided rule condition
*/
function check_is_win(plaintext, password, ciphertext){
  var cipherset = new Set(ciphertext);
  return ((cipherset.size === ciphertext.length)
          && (plaintext.length >= 5)
          && (password.length >= 5)
    );
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
  shift_letter

  password: The password from the user
  password_index: The index of the letter in the password we wish to obtain
  a_value: The ASCII value of 'a'

  returns the position of the letter defined by password[password_index] in the
  alphabet.
*/
function shift_letter(password, password_index, a_value){
  return password[password_index].charCodeAt(0) - a_value;
}

// Run the password encrypt algorithm unit tests
jQuery.get('password-encrypt.py', function(data) {
  var python_function = convert_to_HTML(data);
  encryption_code.innerHTML = python_function;
  instruction_text.innerHTML = instructions;
  opening_modal_text.innerHTML = opening_text;
  success_modal_text.innerHTML = success_text;
  retry_modal_text.innerHTML = failure_text;
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  $("#spinDown").addClass('disabled');
});