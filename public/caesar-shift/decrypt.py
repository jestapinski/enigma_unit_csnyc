import string
from encrypt_library import *
from encrypt import caesar_shift
#START#
def caesar_shift_decrypt(ciphertext, shift_value=5):
  #we can flip the shift value we think the encryptor used to decrypt the message!
  shift_value = -shift_value
    #<a href="#" class="clickable" onclick="if(enable_tooltips){$('#modalOrdChr').modal('open')}">return caesar_shift(ciphertext, shift_value)</a>
  return caesar_shift(ciphertext, shift_value)
#END#

def test_decryption():
  with open("decryption-tests.txt") as f:
    test_cases = f.read().splitlines()
    for test_case in test_cases:
      parsed_case = test_case.split(",")
      input_string = parsed_case[0]
      shift_value = int(parsed_case[1])
      output_string = parsed_case[2]
      assert(caesar_shift_decrypt(input_string, shift_value=shift_value) == output_string)
    f.close()
  print("Python Decryption Passed")

def make_tests():
  input_strings = ["hello world", "Hello World", "mongodb", "r a i N b 0 w", "i have a dream", "i came/ I saw/ I conquered"]
  shift_values = range(-10, 10)
  for input_value in input_strings:
    for shift_value in shift_values:
      print("%s,%d,%s" % (input_value, shift_value, caesar_shift_decrypt(input_value, shift_value=shift_value)))

if __name__ == "__main__":
  test_decryption()