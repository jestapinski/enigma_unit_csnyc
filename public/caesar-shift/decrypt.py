"""
Jordan Stapinski
decrypt.py - Python code for Caesar Shift Decryption
Enigma CSNYC module - MongoDB
"""
import string
from encrypt_library import *
from encrypt import caesar_shift

#START#
def caesar_shift_decrypt(ciphertext, shift_value=5):
  """
  caesar_shift_decrypt

  ciphertext - encrypted message to encrypt
  shift_value - the Caesar Shift we are guessing the ciphertext was shifted by

  returns the ciphertext decrypted by trying the shift_value thought to be used to
  encrypt the plaintext.
  """
  # we can flip the shift value we think the encryptor used to decrypt the message!
  # <a href="#" class="clickable" onclick="if(enable_tooltips){$('#modalDecryptEncrypt').modal('open')}">return caesar_shift(ciphertext, shift_value)</a>
  return caesar_shift(ciphertext, -shift_value)
#END#
