/*
  Jordan Stapinski
  Enigma Unit - Enigma Machine module
  enigma.js - Accompanying Javascript to base_enigma_exercise.html/enigma.css
*/

var hidden_text = false;
var instruction_speed = 500;
var instruction_button = document.getElementById('instruction_button');
var rotor_canvas = document.getElementById('rotor_canvas');
/*
  modify_instructions

  No inputs
  No return value

  Flips the instructions text from hidden to shown, and vise versa
*/
function modify_instructions(){
  if (hidden_text){
    $('#instruction_set').show(instruction_speed);
    instruction_button.text = 'Hide Instructions';
    hidden_text = false;
  } else {
    $('#instruction_set').hide(instruction_speed);
    instruction_button.text = 'Show Instructions';
    hidden_text = true;
  }
}

function convert_to_letter(letter, shift){
  return String.fromCharCode(letter.charCodeAt(0) + shift);
}

/*
  assert

  condition: The condition we want to check true or false ASSUMES a boolean
  No return value

  assert simply continues if the passed condition is true, and throws an 
  exception otherwise
*/
function assert(condition, message) {
  if (!condition) {
    throw message;
  }
}

// Borrowed from 
// https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
function array_equal(a, b){
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;  
}

//Sets up two Rotor objects on ONE HTML canvas
function initialize_rotors(){

}

$.getScript('rotor.js', function(){
  Rotor.test_rotor();
  initialize_rotors();  
});