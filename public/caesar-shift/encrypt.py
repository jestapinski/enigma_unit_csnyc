"""def caesar_shift(plaintext, shift_value=5):
  ciphertext = ""
  <a onmouseover="if(enable_tooltips){$('#modalForLoop').modal('open')}">for eachletter in plaintext:</a> 

    #if adding shift constant puts out of alphabet (> ord(z)) then sub ord(a)
    <a onmouseover="if(enable_tooltips){$('#modalOrdChr').modal('open')}">encoded_letter = ord(c) + shift_value</a>

    #if our shift would go beyond the letter z then we wrap around to the start
    if encoded_letter > ord('z'):
      encoded_letter = ord('a') + (encoded_letter - ord('z')) - 1

    #if our shift would go before the letter a then we wrap around to the end
    if encoded_letter < ord('a'):
      encoded_letter = ord('z') - (ord('a') - encoded_letter) + 1
    
    #put our new letter on the end of our ciphertext
    <a onmouseover="if(enable_tooltips){$('#modalOrdChr').modal('open')}">ciphertext = ciphertext + (chr(encoded_letter))</a>
  return ciphertext"""

def foo(x):
  #1
  return x
import inspect
y = inspect.getsource(foo).replace("#1\n", "<a>")
print(y)