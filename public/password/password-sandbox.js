var instructions = "Play around with shifting some text based on a password!\
                    When you are done, feel free to exit this tab, or click\
                    the 'Back to Exercise' button to shift back to the\
                    password shift exercise";

var opening_text = instructions;

function check_is_win(plaintext, password, ciphertext){
  var cipherset = new Set(ciphertext);
  return ((cipherset.size === ciphertext.length)
          && (plaintext.size >= 5)
          && (password.size >= 5)
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

function shift_letter(password, password_index, a_value){
  return password[password_index].charCodeAt(0) - a_value;
}

// Run the password encrypt algorithm unit tests
jQuery.get('password-encrypt.py', function(data) {
  var python_function = convert_to_HTML(data);
  encryption_code.innerHTML = python_function;
  instruction_text.innerHTML = instructions;
  opening_modal_text.innerHTML = opening_text;
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  $("#spinDown").addClass('disabled');
});