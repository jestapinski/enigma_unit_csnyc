from encrypt import *

#START#
def password_shift_encryption(plaintext, password, password_starting_index):
  final_word = ''
  #<a href="#" class="clickable" onclick="$('#modalOrd').modal('open')">alphabet_offset = ord('a')</a>
  alphabet_offset = ord('a')
  #<a href="#" class="clickable" onclick="$('#modalForLoop1').modal('open')">for letter_index in range(len(plaintext)):</a>
  for letter_index in range(len(plaintext)):
    # Find where in the password we are to encrypt off of
    password_current_index = password_starting_index + letter_index
    # Find the letter in the password we wish to use for our encryption
    encryption_letter = password[password_current_index % len(password)].lower()
    #<a href="#" class="clickable" onclick="$('#modalOffset').modal('open')">shift_value = ord(encryption_letter) - alphabet_offset</a>
    shift_value = ord(encryption_letter) - alphabet_offset
    plaintext_letter = plaintext[letter_index].lower()
    #<a href="#" class="clickable" onclick="$('#modalStrConcat1').modal('open')">final_word = final_word + caesar_shift(plaintext_letter, shift_value)</a>
    final_word = final_word + caesar_shift(plaintext_letter, shift_value)
  return final_word
#END#
def make_tests():
  input_strings = ["hello world", "Hello World", "mongodb", "r a i N b 0 w", "i have a dream", "i came/ I saw/ I conquered"]
  passwords = ["password", "helloworld", "mongodbuniversity", "enigmaunit", "alanturing", "turingmachine"]
  start_shift_values = range(0, 8)
  for input_value in input_strings:
    for password in passwords:
      for shift_value in start_shift_values:
        print("%s,%s,%d,%s" % (input_value, password, shift_value, password_shift_encryption(input_value, password, shift_value)))


def run_tests():
  with open("password-encrypt-tests.txt") as f:
    test_cases = f.read().splitlines()
    for test_case in test_cases:
      parsed_case = test_case.split(",")
      input_string = parsed_case[0]
      password = parsed_case[1]
      shift_value = int(parsed_case[2])
      output_string = parsed_case[3]
      assert(password_shift_encryption(input_string, password, shift_value) == output_string)
    f.close()
  print("Python Password Encryption Passed")

if __name__ == '__main__':
  run_tests()