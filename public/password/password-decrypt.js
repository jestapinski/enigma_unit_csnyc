/*
  Jordan Stapinski
  password-decrypt.js
  Instructions and logic specific to the Vigenere#Decrypt exercise

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

const help_url = "Hint: <u>\
                  <a href='https://en.wikipedia.org/wiki/Normandy_landings'\
                    style='color:blue' target=_blank> The Battle of Normandy\
                  </a>\
                </u>";
const instructions = "We have a ciphertext of <strong>ulsu hzekvto</strong>\
                    that we need to crack. We have a clue that <strong>the\
                    password is the country which hosts the city of Paris\
                    </strong> and the <strong>index input is the day of the\
                    month the Allies invaded Normandy Beach\
                    </strong>. " + (help_url);

const opening_text = instructions;
const success_text = "Great work, moving on";
const failure_text = "Not quite, make sure you are following the instructions";
const alphabet_size = 26;
const answer = 'push dunkirk'

function check_is_win(plaintext, password, ciphertext){
  return ciphertext === answer;
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
    encryption_letter = password[total_index % password.length].toLowerCase();
    shift_value = alphabet_size - (encryption_letter.charCodeAt(0) - a_value);
    if (shift_value === 26){
      shift_value = 0;
    }
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
function test_password_decrypt(){
  var tests, test_case_num, test_case, input_str, input_shift, output_str;
  jQuery.get('password-decrypt-tests.txt', function(data) {
    tests = data.split("\n");
    for (test_case_num = 0; test_case_num < tests.length; test_case_num++){
      test_case = tests[test_case_num].split(",");
      input_str = test_case[0];
      password = test_case[1];
      input_shift = parseInt(test_case[2]);
      output_str = test_case[3];
      assert(password_encrypt(input_str, password, input_shift) === output_str);
    }
    console.log("Javascript password decryption passed");
  });
}

/*
  shift_letter

  password: The password from the user
  password_index: The index of the letter in the password we wish to obtain
  a_value: The ASCII value of 'a'

  returns the size of the alphabet minus the position of the letter defined
  by password[password_index] in the alphabet (this is because decryption runs
  in the opposite means as encryption).
*/
function shift_letter(password, password_index, a_value){
  const password_letter = password[password_index].toLowerCase();
  return alphabet_size - (password_letter.charCodeAt(0) - a_value);
}

// Run the password encrypt algorithm unit tests
jQuery.get('password-decrypt.py', function(data) {
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