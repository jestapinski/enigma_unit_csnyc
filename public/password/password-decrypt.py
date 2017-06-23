import string
def caesar_shift_one_letter(letter, shift_value):
  if letter not in string.ascii_letters:
    return letter

  #if adding shift constant puts out of alphabet (> ord(z)) then sub ord(a)
  #<a onmouseover="if(enable_tooltips){$('#modalOrdChr').modal('open')}">encoded_letter = ord(eachletter) + shift_value</a>
  encoded_letter = ord(letter) + shift_value

  #if our shift would go beyond the letter z then we wrap around to the start
  if encoded_letter > ord('z'):
    encoded_letter = ord('a') + (encoded_letter - ord('z')) - 1

  #if our shift would go before the letter a then we wrap around to the end
  if encoded_letter < ord('a'):
    encoded_letter = ord('z') - (ord('a') - encoded_letter) + 1

  return chr(encoded_letter)

def password_shift_decryption(plaintext, password, password_starting_index):
  final_word = ''
  alphabet_offset = ord('a')
  for letter_index in range(len(plaintext)):
    password_current_index = password_starting_index + letter_index
    encryption_letter = password[password_current_index % len(password)]
    shift_value = 26 - (ord(encryption_letter.lower()) - alphabet_offset)
    plaintext_letter = plaintext[letter_index].lower()
    final_word = final_word + caesar_shift_one_letter(plaintext_letter, shift_value)
  return final_word
#END#
def make_tests():
  input_strings = ["hello world", "Hello World", "mongodb", "r a i N b 0 w", "i have a dream", "i came/ I saw/ I conquered"]
  passwords = ["password", "helloworld", "mongodbuniversity", "enigmaunit", "alanturing", "turingmachine"]
  start_shift_values = range(0, 8)
  with open("password-decrypt-tests.txt", "w") as f:
    for input_value in input_strings:
      for password in passwords:
        for shift_value in start_shift_values:
          f.write("%s,%s,%d,%s\n" % (input_value, password, shift_value, password_shift_decryption(input_value, password, shift_value)))


def run_tests():
  with open("password-decrypt-tests.txt") as f:
    test_cases = f.read().splitlines()
    for test_case in test_cases:
      parsed_case = test_case.split(",")
      input_string = parsed_case[0]
      password = parsed_case[1]
      shift_value = int(parsed_case[2])
      output_string = parsed_case[3]
      assert(password_shift_decryption(input_string, password, shift_value) == output_string)
    f.close()
  print("Python Password Decryption Passed")

if __name__ == '__main__':
  run_tests()