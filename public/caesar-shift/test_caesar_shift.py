"""
Jordan Stapinski
test_caesar_shift.py - Python code for Caesar Shift Algorithm testing
Enigma CSNYC module - MongoDB
"""
from encrypt import caesar_shift
from decrypt import caesar_shift_decrypt

def test_encryption():
  """
  test_encryption

  No input value
  No return value

  Tests the Caesar Shift algorithm against test cases defined in 
  encryption_tests.txt
  """
  with open("encryption_tests.txt") as f:
    test_cases = f.read().splitlines()
    for test_case in test_cases:
      parsed_case = test_case.split(",")
      input_string = parsed_case[0]
      shift_value = int(parsed_case[1])
      output_string = parsed_case[2]
      print(caesar_shift(input_string, shift_value=shift_value))
      assert(caesar_shift(input_string, shift_value=shift_value) == output_string)
    f.close()
  print("Python Encryption Passed")

def test_decryption():
  """
  test_decryption

  No input value
  No return value

  Tests the Caesar Shift Decryption algorithm against test cases defined in 
  decryption_tests.txt
  """
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
  """
  make_tests

  No input value
  No return value

  Creates the series of test cases for the Caesar Shift algorithm as console
  output for encryption and decryption
  """
  input_strings = ["hello world", "Hello World", "mongodb", "r a i N b 0 w", "i have a dream", "i came/ I saw/ I conquered"]
  shift_values = range(-10, 10)
  for input_value in input_strings:
    for shift_value in shift_values:
      print("%s,%d,%s" % (input_value, shift_value, caesar_shift(input_value, shift_value=shift_value)))
  print('Decrypt Tests')
  for input_value in input_strings:
    for shift_value in shift_values:
      print("%s,%d,%s" % (input_value, shift_value, caesar_shift_decrypt(input_value, shift_value=shift_value)))

if __name__ == "__main__":
  import os
  test_encryption()
  test_decryption()
  os._exit(0)