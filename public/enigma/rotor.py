"""
Jordan Stapinski
rotor.py
Python process logic for Enigma Machine Rotors
"""

def rotate_last_element_to_front(l):
  last_element_list = [l[-1]]
  # Add the last element to the front of the original array
  original_list_with_last_in_front = last_element_list + l
  # Keep every element except the last, which is a duplicate
  trim_duplicate_last_element = original_list_with_last_in_front[0:-1]
  return trim_duplicate_last_element

def rotate_first_element_to_last(l):
  first_element_list = [l[0]]
  # Add the first element to the end of the original array
  original_list_with_first_in_back = l + first_element_list
  # Keep every element except the first, which is a duplicate
  trim_duplicate_front_element = original_list_with_first_in_back[1:]
  return trim_duplicate_front_element

#START#
class Rotor(object):
  # Initialize all of the properties of a Rotor
  def __init__(this_rotor, next_rotor):
    # We will use lists to represent the inner and outer rings of the rotor
    this_rotor.initialize_arrays()
    # We will keep track of the next rotor for rotations
    this_rotor.next_rotor = next_rotor

    this_rotor.number_of_notches = 26
    this_rotor.number_of_rotations = 0

  def initialize_arrays(this_rotor):
    # Set up the outer array to be a list of the letters a-z
    this_rotor.outer_array = this_rotor.initialize_alphabet_array()

    # For the inner array, we will have it go from b-z and add 'a' on the end
    inner_array = this_rotor.initialize_alphabet_array()
    inner_array = rotate_first_element_to_last(inner_array)
    this_rotor.inner_array = inner_array

  def initialize_alphabet_array(this_rotor):
    import string
    # string.ascii_lowercase returns a word containing the letters from a-z
    lowercase_letters = string.ascii_lowercase
    # We convert this word to a list
    return list(lowercase_letters)

  def process_letter(this_rotor, letter):
    # We find where in the outer array the letter is, then find the letter
    # at that position in the inner array
    place_in_outer_array = this_rotor.outer_array.index(letter)
    return this_rotor.inner_array[place_in_outer_array]

  def inverse_process_letter(this_rotor, letter):
    # We find where in the inner array the letter is, then find the letter
    # at that position in the outer array
    place_in_inner_array = this_rotor.inner_array.index(letter)
    return this_rotor.outer_array[place_in_inner_array]

  def rotate(this_rotor, clockwise):
    if (clockwise):
      # Rotate the outer array to wrap the last element to the front
      this_rotor.outer_array = rotate_last_element_to_front(this_rotor.outer_array)
      this_rotor.number_of_rotations = this_rotor.number_of_rotations + 1
    else:
      # Rotate the outer array to wrap the front element to the back
      this_rotor.outer_array = rotate_first_element_to_last(this_rotor.outer_array)
      this_rotor.number_of_rotations = this_rotor.number_of_rotations - 1
    if (this_rotor.number_of_rotations == this_rotor.number_of_notches):
      if (this_rotor.next_rotor != None):
        this_rotor.next_rotor.rotate(not clockwise)
    return

#END#

def test_rotor():
  new_rotor = Rotor(None)
  assert(new_rotor.inner_array != [])
  assert(new_rotor.outer_array != [])
  assert(new_rotor.number_of_notches == 26)
  assert(new_rotor.number_of_rotations == 0)

  # Check Shift by 1 invariant
  assert(new_rotor.inner_array[0] == new_rotor.outer_array[1])
  assert(len(new_rotor.inner_array) == len(new_rotor.outer_array) == 26)

  # Check correct mapping
  assert(new_rotor.process_letter('a') == 'b')
  assert(new_rotor.process_letter('z') == 'a')

  # Check inverse mapping
  assert(new_rotor.inverse_process_letter('a') == 'z')
  assert(new_rotor.inverse_process_letter('b') == 'a')

  # Double check inverse invariant
  assert(new_rotor.inverse_process_letter(new_rotor.process_letter('a')) == 'a')

  # Set up rotor chaining
  right_rotor = Rotor(None)
  new_rotor.next_rotor = right_rotor
  assert(new_rotor.next_rotor != None)
  assert(right_rotor.process_letter('a') == 'b')

  # Check clockwise and counterclockwise rotations
  new_rotor.rotate(True)
  assert(new_rotor.process_letter('a') == 'c')
  assert(new_rotor.inverse_process_letter('b') == 'z')
  assert(new_rotor.number_of_rotations == 1)

  new_rotor.rotate(False)
  # Check counterclockwise rotation resets rotor
  assert(new_rotor.process_letter('a') == 'b')
  assert(new_rotor.process_letter('z') == 'a')
  assert(new_rotor.inverse_process_letter('a') == 'z')
  assert(new_rotor.inverse_process_letter('b') == 'a')

  #Check chaining
  for i in range(26):
    new_rotor.rotate(True)

  assert(new_rotor.process_letter('a') == 'b')
  assert(right_rotor.process_letter('a') == 'a')
  return

if __name__ == '__main__':
  import os
  test_rotor()
  print("Rotor Tests Passed")
  os._exit(1)