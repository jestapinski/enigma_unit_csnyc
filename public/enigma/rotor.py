"""
Jordan Stapinski
rotor.py
Python process logic for Enigma Machine Rotors
"""

class Rotor(object):
  def __init__(this_rotor, position, next_rotor):
    this_rotor.position = position
    this_rotor.inner_array = []
    this_rotor.outer_array = []
    this_rotor.next_rotor = next_rotor

  def initialize_arrays(this_rotor):
    return

  def initialize_alphabet_array(this_rotor):
    return

  def process_letter(this_rotor):
    return

  def inverse_process_letter(this_rotor):
    return

  def rotate(this_rotor):
    return

#END#

def test_rotor():
  return

if __name__ == '__main__':
  test_rotor()