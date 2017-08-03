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
var encrypt_code = document.getElementById('encrypt_code');
var delay_text = document.getElementById('delay_text');
var comment_text = document.getElementById('comment_text');
var final_correct = document.getElementById('final_correct');
var step_button = document.getElementById('show_code2');
var canvas_width, canvas_height;
var left_rotor, right_rotor, first_point, p2, pt, ct, new_i;
var ctx = rotor_canvas.getContext('2d');
var step_delay = 500;
var validate = true;
var hello_count = 0;
var solution_word = 'hello';
var is_animating = false;
var step_mode = false;
var enter_char = 13;
var no_bind = true;
var first_encryption = '', second_encryption = '', at_r2_letter;
var next_step_function = function(){run_encryption();};

var step_1 = 'The first rotor spins, creating a new mapping of letters.';
var step_2 = ' is sent to rotor 1 and is encrypted using the mapping on rotor 1 to get ';
var step_3 = ' is sent to rotor 2 where it is mapped outside in to get ';
var step_3_5 = ' is sent to the reflector.'
var step_4 = ' is sent to the reflector, where it is encrypted with a Caesar Shift 1 to get ';
var step_5 = ' is sent back to rotor 2 where it is encrypted inversely (inside to outside) to get ';
var step_6 = ' is then sent back through rotor 1 inversely (inside to outside) to get ';
var step_7 = ' is added to our ending text.'
var final_msg = 'Great job encrypting hello again! Note that you got ';
var final_msg_2 = ' so can you imagine how hard it must have been to crack this?';
var final_msg_3 = ' fortunately for you, we will not be covering that. Onward to the end!';

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
  if (letter === 'z'){
    return 'a'
  }
  return String.fromCharCode(letter.charCodeAt(0) + 1);
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
  if (is_animating){
    return;
  }
  if (!hidden_text){
    $('#instruction_set').hide(instruction_speed);
    instruction_button.text = 'Show Instructions';
    hidden_text = true;    
  }
  is_animating = true;
  if (validation_errors){
    alert(validation_errors);
    return;
  }
  plaintext_value.value = plaintext;
  $('#plaintext_value').attr('disabled', true);
  // $('#encrypt').addClass('disabled');
  ciphertext = enigma_machine_encryption(plaintext);
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
    // draw_plaintext(plaintext.length - 1);
    if (plaintext == solution_word && validate){
      console.log(hello_count);
      if (!hello_count){
        first_encryption = ciphertext;
        $('#modal_hello_1').modal('open');
      } else {
        second_encryption = ciphertext;
        final_correct.innerHTML = final_msg.concat(first_encryption, ' and ', 
                                  second_encryption, final_msg_2, final_msg_3);
        $('#modal_hello_2').modal('open');
      }
      hello_count++;
    }
    if (plaintext != solution_word && validate){
      $('#modal_failure').modal('open');
    }
    $('#plaintext_value').attr('disabled', false);
    is_animating = false;
    next_step_function = function(){
      run_encryption();
    }
    comment_text.innerHTML = 'Our text is encrypted!';
    return;
  }
  ciphertext_value.value = ciphertext;
  var intermediate_letter, timer_delay = 500;
  left_rotor.current_letter = plaintext[i];
  ctx.clearRect(14 * rotor_canvas.width / 16, 0, rotor_canvas.width / 8, rotor_canvas.height);
  initialize_reflector();
  pt = plaintext;
  draw_plaintext(i);
  comment_text.innerHTML = step_1;  
  left_rotor.rotate(false);
  pt = plaintext;
  draw_plaintext(i);
  if (left_rotor.num_rotations == 0){
    timer_delay = 1000;
  }
  next_step_function = function(){
    encryption_process(plaintext, ciphertext, i);
  };
  if (!step_mode){
    setTimeout(encryption_process, timer_delay, plaintext, ciphertext, i);    
  }
}

function reflector_hit(letter){
  //Clear and draw
  var x = 31 * rotor_canvas.width / 32;
  var y = rotor_canvas.height / 3;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000000';
  ctx.font = '1.30rem PT Mono';
  ctx.fillText(right_rotor.process_letter(letter), x, y);
  comment_text.innerHTML = '"'.concat(right_rotor.process_letter(letter), '"', step_3_5);
  arrow(ctx, {x: right_rotor.begin_x + 20, y: right_rotor.begin_y}, {x: x - 5, y: y}, 5);
  next_step_function = function(){
    reflector_down(letter, x, y);
  }
  if (!step_mode){
    setTimeout(reflector_down, step_delay, letter, x, y);    
  }
}

function reflector_down(letter, x1, y1){
  var encrypted_letter = right_rotor.process_letter(letter);
  var x2 = x1;
  var y2 = y1 + 200;
  var reflect_letter = reflector_process_letter(encrypted_letter);
  comment_text.innerHTML = '"'.concat(encrypted_letter, '"', step_4, '"', reflect_letter, '"');
  arrow(ctx, {x: x1, y: y1 + 10}, {x: x2, y: y2 - 20}, 5);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000000';
  ctx.font = '1.30rem PT Mono';
  ctx.fillText(reflect_letter, x2, y2);
  if (!step_mode){
    setTimeout(reflector_out, step_delay, reflect_letter, x2, y2);
  }
  next_step_function = function(){
    reflector_out(reflect_letter, x2, y2);
  }
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
  var inv_letter = right_rotor.inverse_process_letter(letter);
  ctx.strokeStyle = '#00ff00';
  arrow(ctx, {x: x1 - 10, y: y1}, {x: x2 + 60, y: y2 - 10}, 5);
  var x = cx + (out_radius + 15) * (Math.cos(theta)) + 40;
  var y = cy + (out_radius + 15) * (Math.sin(theta)) - 5;
  ctx.strokeRect(x, y - 5, 20, 20);
  comment_text.innerHTML = '"'.concat(letter, '"', step_5, '"', inv_letter, '"');
  if (!step_mode){
    setTimeout(inverse_r1, step_delay, inv_letter, x, y);
  }
  next_step_function = function() {
    inverse_r1(inv_letter, x, y);
  }
}

function inverse_r1(letter, x1, y1){
  var angle_difference = (2 * Math.PI) / right_rotor.num_notches;
  var theta = left_rotor.inner_array.indexOf(letter) * angle_difference;
  var cx = left_rotor.offset + 3 * (right_rotor.canvas_width / 16);
  var cy = left_rotor.canvas_height / 2;
  var ovr_radius = cy - inner_radius_offset;
  var out_radius = cy - middle_radius_offset;
  var x2 = cx + (ovr_radius + 15) * (Math.cos(theta));
  var y2 = cy + (ovr_radius + 15) * (Math.sin(theta)) + 5;
  var inv_letter = left_rotor.inverse_process_letter(letter);
  arrow(ctx, {x: x1, y: y1}, {x: x2 + 60, y: y2 - 10}, 5);
  var x = cx + (out_radius + 15) * (Math.cos(theta)) + 40;
  var y = cy + (out_radius + 15) * (Math.sin(theta)) - 5;
  ctx.strokeRect(x, y - 5, 20, 20);
  comment_text.innerHTML = '"'.concat(letter, '"', step_6, '"', inv_letter, '"');
  if (!step_mode){
    setTimeout(to_end, step_delay, theta, out_radius, cx, cy, inv_letter);  
  }
  next_step_function = function(){
    to_end(theta, out_radius, cx, cy, inv_letter);
  }
}

function to_end(theta, out_radius, cx, cy, letter){
  var x = cx + (out_radius + 15) * (Math.cos(theta)) + 40;
  var y = cy + (out_radius + 15) * (Math.sin(theta)) - 5;
  // ctx.strokeRect(x, y - 5, 20, 20);
  arrow(ctx, {x: x, y: y}, {x: 0, y: 430}, 5);
  comment_text.innerHTML = '"'.concat(letter, '"', step_7);
  ciphertext_value.value = ct;
  if (new_i == pt.length){
    $('#plaintext_value').attr('disabled', false);
  }
  setTimeout(enigma_machine_encryption, step_delay, pt, ct, new_i); 
}

function encryption_process(plaintext, ciphertext, i, redraw=true){
  if (redraw){
    setTimeout(encryption_process, 400, plaintext, ciphertext, i, false)
    return
  }
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
  comment_text.innerHTML = '"'.concat(plaintext[i], '"', step_2, '"', intermediate_letter, '"');
  at_r2_letter = intermediate_letter;
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
  var rotor = right_rotor;
  var letter = right_rotor.current_letter;
  var letter_index;
  var outer = true;
  letter_index = rotor.outer_array.indexOf(letter);
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
  pt = plaintext;
  ct = ciphertext + intermediate_letter;
  new_i = i + 1;

  next_step_function = function(){
    to_r2(first_point, p2, letter);
  }
  if (!step_mode){
    setTimeout(to_r2, step_delay, first_point, p2, letter);
  }
   
}

function to_r2(first_point, p2, letter){
  var rotor = right_rotor;

  // rotor.draw_rotor(true, 0, false);
  arrow(left_rotor.ctx, first_point, p2, 5);
  comment_text.innerHTML = '"'.concat(at_r2_letter, '"', step_3, '"', right_rotor.process_letter(letter), '"');
  ctx.clearRect(14 * (rotor.canvas_width / 16) + 20, rotor.canvas_height - 40, 14 * (rotor.canvas_width / 16) + 50, this.canvas_height);
  ctx.fillText("Reflector", 15 * rotor_canvas.width / 16, rotor_canvas.height - 20);
  ctx.fillText("(Caesar Shift 1)", 29 * rotor_canvas.width / 32, rotor_canvas.height);
  next_step_function = function(){
    reflector_hit(letter);
  }
  if (!step_mode){
    setTimeout(reflector_hit, step_delay, letter);    
  }
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
  ctx.fillRect(15 * rotor_canvas.width / 16, 50, rotor_canvas.width / 16, rotor_canvas.height - 100);
  ctx.strokeRect(15 * rotor_canvas.width / 16, 50, rotor_canvas.width / 16, rotor_canvas.height - 100);
  ctx.lineWidth = 2;
  ctx.fillStyle = '#000000';
  ctx.fillText("Reflector", 15 * rotor_canvas.width / 16, rotor_canvas.height - 20);
  ctx.fillText("(Caesar Shift 1)", 29 * rotor_canvas.width / 32, rotor_canvas.height);
}

/*
  convert_to_HTML

  data: The raw test from the Python file we want to parse
  returns an HTML-formatted piece of Python code

  convert_to_HTML takes in raw python text which follows the following
  conventions and converts it to formatted HTML:
    - for each line that is formatted, a commented line should be above with
      the exact HTML we wish to use in the application
    - the formats begin with a <a tag directly after the comment (i.e. #<a)
    - the code portion we wish to use ends with a #END# line
    - see encrypt.py for an example
*/
function convert_to_HTML(data){
  var python_lines = data.split("\n");
  var python_line, i;
  var final_python_code = [];
  var skip_flag = false;
  var start_flag = false;
  for (i = 0; i < python_lines.length; i++){
    python_line = python_lines[i];
    if (python_line == "#START#"){
      start_flag = true;
      continue;
    }
    if (!start_flag){
      continue;
    }
    if (skip_flag){
      skip_flag = false;
      continue;
    }
    if (python_line == "#END#"){
      break;
    }
    if (python_line.trim().substring(0, 3) == "def"){
      final_python_code.push(python_lines[i - 2]);
      final_python_code.push(python_lines[i - 1].replace("#", ""));
      final_python_code.push(" ");
    }
    if (python_line.trim().substring(0, 3) == "cla"){
      final_python_code.push(python_lines[i - 1].replace("#", ""));
    }
  }
  return final_python_code.join("\n");
}

/*
  run_start_modal

  No input values
  No return value

  Opens the starting modal (wrapped in a function for cleanliness)
*/
function run_start_modal(){
  $('#modal_enigma').modal({
    ready: function(modal, trigger){
      $(document).keypress((e) => {
        if (e.charCode == enter_char){
          $('#modal_enigma').modal('close');
        }
      });
    },
    complete: function(){
      if (no_bind){
        console.log('BINDING')
        no_bind = false;
        $(document).keypress((e) => {
          if (e.charCode == enter_char){
            console.log('hit')
            step_button.click();
            return;
          }
        });
      }
    }
  });
  $('#modal_failure').modal({
    ready: function(modal, trigger){
      $(document).keypress((e) => {
        return;
      });
    },
    complete: function(){
      if (no_bind){
        console.log('BINDING')
        no_bind = false;
        $(document).keypress((e) => {
          if (e.charCode == enter_char){
            console.log('hit')
            step_button.click();
            return;
          }
        });
      }
    }
  });
  $('#modal_enigma').modal('open');
  $('#modal_hello_2').modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
    }
  );
}

$.getScript('rotor.js', function(){
  Rotor.test_rotor();
  initialize_rotors();
  initialize_reflector();
});

if (document.title.includes('Sandbox')){
  //Turn off validations while in the Sandbox
  validate = false;
  $(document).keypress((e) => {
    if (e.charCode == enter_char){
      step_button.click();
    }
  });
} else {
  setTimeout(run_start_modal, 500);  
}

jQuery.get('rotor.py', function(data) {
  var python_function = convert_to_HTML(data);
  encrypt_code.innerHTML = python_function;
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});

encrypt.addEventListener("click", function(){step_mode=false; next_step_function();});
