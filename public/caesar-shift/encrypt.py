"""
Jordan Stapinski
encrypt.py - Python code for Caesar Shift Encryption
Enigma CSNYC module - MongoDB
"""
import string
# encrypt_library is a library of Caesar Shift helper functions defined in 
# encrypt_library.py
from encrypt_library import *

#START#
def caesar_shift(plaintext, shift_value=5):
  """
  caesar_shift

  plaintext - original message to encrypt
  shift_value - the Caesar Shift value to shift each letter by

  returns the plaintext with each letter encrypted by moving shift_value places
  in the alphabet.
  """
  ciphertext = ""
  # <a href="#" class="clickable" class="clickable" onclick="if(enable_tooltips){$('#modalForLoop').modal('open')}">for each_letter in plaintext:</a> 
  for each_letter in plaintext.lower():
    # if our letter is indeed a letter from a-z, encrypt it!
    if each_letter in string.ascii_letters:

      # <a href="#" class="clickable" onclick="if(enable_tooltips){$('#modalShiftVal').modal('open')}">encoded_letter = shift_by_value_in_alphabet(each_letter, shift_value)</a>
      encoded_letter = shift_by_value_in_alphabet(each_letter, shift_value)

      # if our shift would go beyond the letter 'z' then we wrap around to the start
      if is_above_z(encoded_letter):
        # <a href="#" class="clickable" onclick="if(enable_tooltips){$('#modalWrapA').modal('open')}">encoded_letter = wrap_around_a(encoded_letter)</a>
        encoded_letter = wrap_around_a(encoded_letter)

      # if our shift would go before the letter 'a' then we wrap around to the end
      if is_below_a(encoded_letter):
        # <a href="#" class="clickable" onclick="if(enable_tooltips){$('#modalWrapZ').modal('open')}">encoded_letter = wrap_around_z(encoded_letter)</a>
        encoded_letter = wrap_around_z(encoded_letter)
      
      # put our new letter on the end of our ciphertext
      # <a href="#" class="clickable" onclick="if(enable_tooltips){$('#modalStrConcat').modal('open')}">ciphertext = ciphertext + encoded_letter</a>
      ciphertext = ciphertext + encoded_letter

    # if our letter is not a letter (perhaps a space or number), just keep it
    else:
      ciphertext = ciphertext + each_letter
  return ciphertext
#END#
