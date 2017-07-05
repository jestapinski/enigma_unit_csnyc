import string
from encrypt_library import *
#START#
def caesar_shift(plaintext, shift_value=5):
  ciphertext = ""
  #<a href="#" class="clickable" class="clickable" onclick="if(enable_tooltips){$('#modalForLoop').modal('open')}">for eachletter in plaintext:</a> 
  for eachletter in plaintext.lower():
    #if our letter is not a letter, keep it and move on!
    if eachletter not in string.ascii_letters:
      ciphertext = ciphertext + eachletter
      continue

    #if adding shift constant puts out of alphabet (> ord(z)) then sub ord(a)
    #<a href="#" class="clickable" onclick="if(enable_tooltips){$('#modalShiftVal').modal('open')}">encoded_letter = shift_by_value_in_alphabet(eachletter, shift_value)</a>
    encoded_letter = shift_by_value_in_alphabet(eachletter, shift_value)

    #if our shift would go beyond the letter z then we wrap around to the start
    if is_above_z(encoded_letter):
      #<a href="#" class="clickable" onclick="if(enable_tooltips){$('#modalWrapA').modal('open')}">encoded_letter = wrap_around_a(encoded_letter)</a>
      encoded_letter = wrap_around_a(encoded_letter)

    #if our shift would go before the letter a then we wrap around to the end
    if is_below_a(encoded_letter):
      #<a href="#" class="clickable" onclick="if(enable_tooltips){$('#modalWrapZ').modal('open')}">encoded_letter = wrap_around_z(encoded_letter)</a>
      encoded_letter = wrap_around_z(encoded_letter)
    
    #put our new letter on the end of our ciphertext
    #<a href="#" class="clickable" onclick="if(enable_tooltips){$('#modalStrConcat').modal('open')}">ciphertext = ciphertext + encoded_letter</a>
    ciphertext = ciphertext + encoded_letter
  return ciphertext
#END#

def test_encryption():
  with open("encryption_tests.txt") as f:
    test_cases = f.read().splitlines()
    for test_case in test_cases:
      parsed_case = test_case.split(",")
      input_string = parsed_case[0]
      shift_value = int(parsed_case[1])
      output_string = parsed_case[2]
      assert(caesar_shift(input_string, shift_value=shift_value) == output_string)
    f.close()
  print("Python Encryption Passed")

def make_tests():
  input_strings = ["hello world", "Hello World", "mongodb", "r a i N b 0 w", "i have a dream", "i came/ I saw/ I conquered"]
  shift_values = range(-10, 10)
  for input_value in input_strings:
    for shift_value in shift_values:
      print("%s,%d,%s" % (input_value, shift_value, caesar_shift(input_value, shift_value=shift_value)))

if __name__ == "__main__":
  test_encryption()