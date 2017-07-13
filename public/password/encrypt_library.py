def shift_by_value_in_alphabet(starting_letter, shift_value):
	return chr(ord(starting_letter) + shift_value)

def is_above_z(letter):
	return ord(letter) > ord('z')

def is_below_a(letter):
	return ord(letter) < ord('a')

def wrap_around_a(letter):
	return chr(ord('a') + (ord(letter) - ord('z')) - 1)

def wrap_around_z(letter):
	return chr(ord('z') - (ord('a') - ord(letter)) + 1)