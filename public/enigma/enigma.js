/*
  Jordan Stapinski
  Enigma Unit - Enigma Machine module
  enigma.js - Accompanying Javascript to base_enigma_exercise.html/enigma.css
*/

var hidden_text = false;
var instruction_speed = 500;
var instruction_button = document.getElementById('instruction_button');
var rotor_canvas = document.getElementById('rotor_canvas');
var encrypt = document.getElementById('encrypt');
var plaintext_value = document.getElementById('plaintext_value');
var ciphertext_value = document.getElementById('ciphertext_value');
var canvas_width, canvas_height;
var left_rotor, right_rotor, first_point, p2, pt, ct, new_i;
var ctx = rotor_canvas.getContext('2d');
var step_delay = 500;
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

function reflector_process_letter(letter){
  //TODO add mapping for reflector
  return 'b';
  return letter;
}

function has_special_characters(plaintext){
  return !(/[a-z]/.test(plaintext));
}

function multiple_words(plaintext){
  return (plaintext.split(" ").length > 1);
}

function validate_plaintext(plaintext){
  if (plaintext === ""){
    return "Plaintext should not be blank";
  }
  if (multiple_words(plaintext)){
    return "Plaintext must only be one word";
  }
  if (has_special_characters(plaintext)){
    return "Plaintext must only contain letters a-z";
  }
  return '';
}

function run_encryption(){
  const plaintext = plaintext_value.value.toLowerCase();
  const validation_errors = validate_plaintext(plaintext);
  var ciphertext;
  if (validation_errors){
    alert(validation_errors);
    return;
  }
  plaintext_value.value = plaintext;
  ciphertext = enigma_machine_encryption(plaintext);
  // return ciphertext;
}

function draw_plaintext(letter=0){
  var word = pt;
  console.log(word);
  var box_width = rotor_canvas.width / (3 * word.length), box_height = 40, text_height_offset = 35;
  var box_height_offset = 10;
  ctx.clearRect(0, 0, rotor_canvas.width, 60);
  ctx.translate(300, 0);
  ctx.strokeStyle = '#000000';
  for (var i = 0; i < word.length; i++){
    // var alphabet_position = word[i].charCodeAt(0) - a_value;
    //Background box
    console.log(i * box_width);
    if (i == letter){
      ctx.fillStyle = 'yellow';
    } else {
      ctx.fillStyle = "#FFFFFF";      
    }
    ctx.fillRect(i * box_width, box_height_offset, box_width, box_height);
    //Dividers
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(i * box_width, box_height_offset);
    ctx.lineTo(i * box_width, box_height_offset + box_height);
    ctx.stroke();
    //Letters
    ctx.font = "1.90rem PT Mono";    
    ctx.textAlign = "center";
    ctx.fillText(word[i], box_width * (i + 1.0/2), text_height_offset);
    ctx.font = "1.40rem PT Mono";    
  }
  ctx.translate(-300, 0);
}

function enigma_machine_encryption(plaintext, ciphertext='', i=0){
  if (i == plaintext.length){
    console.log(ciphertext);
    ciphertext_value.value = ciphertext;
    draw_plaintext(plaintext.length - 1);
    return;
  }
  ciphertext_value.value = ciphertext;
  var intermediate_letter, timer_delay = 500;
  left_rotor.current_letter = plaintext[i];
  ctx.clearRect(14 * rotor_canvas.width / 16, 0, 2*rotor_canvas.width / 16, rotor_canvas.height);
  initialize_reflector();
  pt = plaintext;
  draw_plaintext(i);  
  left_rotor.rotate(false);
  pt = plaintext;
  draw_plaintext(i);
  if (left_rotor.num_rotations == 0){
    timer_delay = 1000;
  }
  setTimeout(encryption_process, timer_delay, plaintext, ciphertext, i);
}

function reflector_hit(letter){
  //Clear and draw
  var x = 31 * rotor_canvas.width / 32;
  var y = rotor_canvas.height / 3;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000000';
  ctx.font = '1.30rem PT Mono';
  ctx.fillText(right_rotor.inner_array[right_rotor.outer_array.indexOf(letter)], x, y);
  arrow(ctx, {x: right_rotor.begin_x + 20, y: right_rotor.begin_y}, {x: x - 5, y: y}, 5);
  setTimeout(reflector_down, step_delay, letter, x, y);
}

function reflector_down(letter, x1, y1){
  var encrypted_letter = right_rotor.process_letter(letter);
  var x2 = x1;
  var y2 = y1 + 200;
  arrow(ctx, {x: x1, y: y1 + 10}, {x: x2, y: y2 - 20}, 5);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000000';
  ctx.font = '1.30rem PT Mono';
  ctx.fillText(reflector_process_letter(encrypted_letter), x2, y2);
  setTimeout(reflector_out, step_delay, reflector_process_letter(encrypted_letter), x2, y2);
}

function reflector_out(letter, x1, y1){
  var angle_difference = (2 * Math.PI) / right_rotor.num_notches;
  var theta = right_rotor.inner_array.indexOf(letter) * angle_difference;
  var cx = right_rotor.offset + 3 * (right_rotor.canvas_width / 16);
  var cy = right_rotor.canvas_height / 2;
  var ovr_radius = cy - inner_radius_offset;
  var out_radius = cy - middle_radius_offset;
  var x2 = cx + (ovr_radius + 15) * (Math.cos(theta));
  var y2 = cy + (ovr_radius + 15) * (Math.sin(theta)) + 5;
  ctx.strokeStyle = '#00ff00';
  arrow(ctx, {x: x1 - 10, y: y1}, {x: x2 + 60, y: y2 - 10}, 5);
  var x = cx + (out_radius + 15) * (Math.cos(theta)) + 40;
  var y = cy + (out_radius + 15) * (Math.sin(theta)) - 5;
  ctx.strokeRect(x, y - 5, 20, 20);
  setTimeout(inverse_r2_r1, step_delay, right_rotor.inverse_process_letter(letter), x, y);
}

function inverse_r2_r1(letter, x1, y1){
  var angle_difference = (2 * Math.PI) / right_rotor.num_notches;
  var theta = left_rotor.inner_array.indexOf(letter) * angle_difference;
  var cx = left_rotor.offset + 3 * (right_rotor.canvas_width / 16);
  var cy = left_rotor.canvas_height / 2;
  var ovr_radius = cy - inner_radius_offset;
  var out_radius = cy - middle_radius_offset;
  var x2 = cx + (ovr_radius + 15) * (Math.cos(theta));
  var y2 = cy + (ovr_radius + 15) * (Math.sin(theta)) + 5;
  arrow(ctx, {x: x1, y: y1}, {x: x2 + 60, y: y2 - 10}, 5);
  var x = cx + (out_radius + 15) * (Math.cos(theta)) + 40;
  var y = cy + (out_radius + 15) * (Math.sin(theta)) - 5;
  ctx.strokeRect(x, y - 5, 20, 20);
  arrow(ctx, {x: x, y: y}, {x: 0, y: 380}, 5);
  setTimeout(enigma_machine_encryption, 500, pt, ct, new_i);  
}

function encryption_process(plaintext, ciphertext, i){
  var letter = plaintext[i];
  console.log(letter);
  var angle_difference = (2 * Math.PI) / left_rotor.num_notches;
  var theta = (left_rotor.outer_array.indexOf(letter)) * angle_difference;
  var cx = left_rotor.offset + 3 * (left_rotor.canvas_width / 16);
  var cy = left_rotor.canvas_height / 2;
  var ovr_radius = cy - middle_radius_offset;
  var out_radius = cy - middle_radius_offset;
  var x2 = cx + (ovr_radius + 15) * (Math.cos(theta)) + 40;
  var y2 = cy + (ovr_radius + 15) * (Math.sin(theta)) - 10;
  arrow(ctx, {x: 0, y: 50}, {x: x2, y: y2}, 5);
  intermediate_letter = left_rotor.process_letter(plaintext[i]);
  console.log(intermediate_letter);
  //rotor right
  intermediate_letter = right_rotor.process_letter(intermediate_letter);
  console.log(intermediate_letter);
  //reflector
  intermediate_letter = reflector_process_letter(intermediate_letter);
  console.log(intermediate_letter);
  //inverse rotor right
  intermediate_letter = right_rotor.inverse_process_letter(intermediate_letter);
  console.log(intermediate_letter);
  //inverse rotor left
  intermediate_letter = left_rotor.inverse_process_letter(intermediate_letter);
  console.log(intermediate_letter);
  right_rotor.draw_rotor(true);
  var rotor = right_rotor;
  var letter = right_rotor.current_letter;
  var letter_index;
  var outer = true;
  if (outer){
    letter_index = rotor.outer_array.indexOf(letter);
  } else {
    letter_index = rotor.inner_array.indexOf(letter);
  }
  var theta = letter_index * (2 * Math.PI) / (rotor.num_notches);
  var cx = rotor.offset + 3 * (rotor.canvas_width / 16);
  var cy = rotor.canvas_height / 2;
  var ovr_radius = cy - middle_radius_offset;
  var x = cx + (ovr_radius + 15) * (Math.cos(theta)) + 40;
  var y = cy + (ovr_radius + 15) * (Math.sin(theta)) - 5;
  right_rotor.begin_x = x;
  right_rotor.begin_y = y;
  // get first point
  first_point = {x: left_rotor.begin_x + 20, y: left_rotor.begin_y};
  // find second to map to
  // Draw arrow
  p2 = {x: right_rotor.begin_x, y: right_rotor.begin_y};
  rotor.draw_rotor(true, 0, false);
  arrow(left_rotor.ctx, first_point, p2, 5);
  reflector_hit(letter);

  pt = plaintext;
  ct = ciphertext + intermediate_letter;
  new_i = i + 1;
  
  // enigma_machine_encryption(plaintext, ciphertext + intermediate_letter, i + 1);
  // setTimeout(enigma_machine_encryption, 1000, plaintext, ciphertext + intermediate_letter, i + 1);  
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
  canvas_width = rotor_canvas.width;
  canvas_height = rotor_canvas.height;
  // ctx.translate(50, 0);
  right_rotor = new Rotor('Right', 0, ctx);
  left_rotor = new Rotor('Left', 0, ctx, right_rotor);
  right_rotor.draw_rotor();
  left_rotor.draw_rotor();
  right_rotor.previous_rotor = left_rotor;
}

function initialize_reflector(){
  ctx.fillStyle = '#888888';
  ctx.strokeStyle='#000000';
  ctx.lineWidth = 1;
  ctx.fillRect(15 * rotor_canvas.width / 16, 0, rotor_canvas.width / 16, rotor_canvas.height);
  ctx.strokeRect(15 * rotor_canvas.width / 16, 0, rotor_canvas.width / 16, rotor_canvas.height);
  ctx.lineWidth = 2;
}

$.getScript('rotor.js', function(){
  Rotor.test_rotor();
  initialize_rotors();
  initialize_reflector();
});

encrypt.addEventListener("click", run_encryption);