/*
  Jordan Stapinski
  rotor.js
  Backend Logic for the Enigma Machine Rotors
  Accompanies enigma.js, overall logic for Enigma Machine exercise
*/

var outer_radius_offset = 90;
var middle_radius_offset = outer_radius_offset + 30;
var inner_radius_offset = middle_radius_offset + 30;

function corrected_mod(n, m){
  return ((((n) % m) + m) % m);
}

function draw_spinning_gears(cx, cy, rotor, spin_angle=0, count=0){
    var rect_radius = 15;
    var ovr_radius = cy - outer_radius_offset;
    var i, theta;
    var angle_difference = (2 * Math.PI) / rotor.num_notches;
    if (count == 50 * rotor.num_notches){
      rotor.next_rotor.rotate();
      count = 0;
    }
    rotor.ctx.clearRect(rotor.offset, 0, rotor.canvas_width / 2 - 20, rotor.canvas_height);
    rotor.draw_gears(cx, cy, spin_angle);
    rotor.ctx.beginPath();
    rotor.ctx.arc(cx, cy, cy - outer_radius_offset, 0, 2 * Math.PI, false);
    rotor.ctx.fillStyle = '#EA6045';
    rotor.ctx.fill();

    rotor.ctx.beginPath();
    rotor.ctx.arc(cx, cy, cy - middle_radius_offset, 0, 2 * Math.PI, false);
    rotor.ctx.fillStyle = '#F8CA4D';
    rotor.ctx.fill();

    rotor.ctx.beginPath();
    rotor.ctx.arc(cx, cy, cy - inner_radius_offset, 0, 2 * Math.PI, false);
    rotor.ctx.fillStyle = '#888888';
    rotor.ctx.fill();

    rotor.draw_outer_text(cx, cy, spin_angle);
    rotor.draw_inner_text(cx, cy, spin_angle);

    setTimeout(this.draw_spinning_gears, 5, cx, cy, rotor, spin_angle + angle_difference / 50, count + 1);
  }

function animate_rotation(rotor, clockwise, steps=0, chain=false){
    const max_steps = 50;
    if (steps == max_steps){
      if (clockwise){
        const initial_element = rotor.outer_array[0];
        rotor.outer_array = rotor.outer_array.splice(1);
        rotor.outer_array.push(initial_element);
        rotor.num_rotations++;
      } else {
        const arr_length = rotor.outer_array.length - 1;
        const final_element = rotor.outer_array[arr_length];
        rotor.outer_array = [final_element].concat(rotor.outer_array.splice(0, arr_length));
        rotor.num_rotations--;
      }
      rotor.draw_rotor();

      //If this causes a chained rotation, draw the effects of such rotation after completing
      //the animation for the initial rotor
      if (chain){
        setTimeout(animate_rotation, 5, rotor.next_rotor, !clockwise, 0, false);
      }
      return;
    }
    var angle = (2 * Math.PI) / (50 * rotor.num_notches);
    if (clockwise){
      angle = -angle;
    }
    rotor.draw_rotor(angle * steps);
    setTimeout(animate_rotation, 5, rotor, clockwise, steps + 1, chain);
  }

class Rotor {
  constructor(position, seed, ctx, rotor){
    this.next_rotor = rotor;
    this.position = position;
    this.seed = seed;
    this.ctx = ctx;
    if (ctx){
      this.canvas_height = ctx.canvas.height;
      this.canvas_width = ctx.canvas.width;      
    }
    this.num_rotations = 0;
    this.offset = 0;
    this.num_notches = 26;
    this.inner_array = [];
    this.outer_array = [];
    this.previous_rotor;
    if (position === "Right"){
      this.offset = 6 * (this.canvas_width / 16);;
    }
    this.initialize_arrays();
  }

  /*
  initialize_arrays

  No inputs
  No return value

  Creates the inner and outer arrays for the Rotor
  */
  initialize_arrays(){
    this.initialize_outer_array();
    this.initialize_inner_array();
  }

  /*
  initialize_alphabet_array

  starting_letter: The letter of the alphabet to start on
  returns an array consisting of the values represented by:
    [ASCII of the starting letter, ASCII of the starting letter + 26]
  
  Thus, if the user wishes to start at a letter other than 'a', they
  must perform additional processing outside of this function
  */
  initialize_alphabet_array(starting_letter='a'){
    const letters_in_alphabet = 26;
    var i, final_array = [];
    for (i = 0; i < letters_in_alphabet; i++){
      final_array.push(convert_to_letter(starting_letter, i));
    }
    return final_array;
  }

  /*
  initialize_outer_array

  No inputs
  No return value

  Creates the outer array for the Rotor as the array [a-z]
  */
  initialize_outer_array(){
    this.outer_array = this.initialize_alphabet_array();
  }

  /*
  initialize_inner_array

  No inputs
  No return value

  Creates the inner array for the Rotor as the array [b-z].concat(['a'])
  */
  initialize_inner_array(){
    //shuffle based on seed TBD
    var temp_array = this.initialize_alphabet_array('b');
    temp_array[25] = 'a';
    this.inner_array = temp_array;
  }

  process_letter(letter){
    return this.inner_array[this.outer_array.indexOf(letter)];
  }

  inverse_process_letter(letter){
    return this.outer_array[this.inner_array.indexOf(letter)];
  }

  draw_gears(cx, cy, spin_angle=0){
    var rect_radius = 15;
    var ovr_radius = cy - outer_radius_offset;
    var i, theta;
    const angle_difference = (2 * Math.PI) / this.num_notches;
    this.ctx.translate(cx, cy);
    this.ctx.rotate(spin_angle);
    for (i = 0; i < this.num_notches; i++){
      theta = i * angle_difference + spin_angle;
      
      this.ctx.rotate(angle_difference);
      var x = cx + ovr_radius * (Math.cos(theta)) - rect_radius;
      var y = cy + ovr_radius * (Math.sin(theta)) - rect_radius;
      var notch_num = corrected_mod(4 - this.num_rotations, this.num_notches);
      this.ctx.fillStyle = '#888888';
      this.ctx.fillRect(0, -(ovr_radius + rect_radius), 2 * rect_radius, 2 * rect_radius);
      if (i == notch_num){
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, -(ovr_radius + 3 * rect_radius), 2 * rect_radius, 4 * rect_radius);
      }
    }
    this.ctx.rotate(-this.num_notches * angle_difference);
    this.ctx.rotate(-spin_angle);
    this.ctx.translate(-cx, -cy);
  }

  draw_outer_text(cx, cy, spin_angle=0){
    var i, theta;
    var angle_difference = (2 * Math.PI) / this.num_notches;
    var ovr_radius = cy - middle_radius_offset;
    for (i = 0; i < this.num_notches; i++){
      theta = i * angle_difference + spin_angle;
      var x = cx + (ovr_radius + 15) * (Math.cos(theta));
      var y = cy + (ovr_radius + 15) * (Math.sin(theta)) + 5;
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#000000';
      this.ctx.font = '1.30rem PT Mono';
      this.ctx.fillText(this.outer_array[i], x, y)
    }
  }

  draw_inner_text(cx, cy, spin_angle=0){
    var i, theta;
    var angle_difference = (2 * Math.PI) / this.num_notches;
    var ovr_radius = cy - inner_radius_offset;
    spin_angle = 0;
    for (i = 0; i < this.num_notches; i++){
      theta = i * angle_difference + spin_angle;
      var x = cx + (ovr_radius + 15) * (Math.cos(theta));
      var y = cy + (ovr_radius + 15) * (Math.sin(theta)) + 5;
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#000000';
      this.ctx.font = '1.30rem PT Mono';
      this.ctx.fillText(this.inner_array[i], x, y)
    }
  }

  draw_rotor(step_angle=0){
    var cx = this.offset + 3 * (this.canvas_width / 16);
    var cy = this.canvas_height / 2;
    if (this.next_rotor){
      this.ctx.clearRect(0, 0, 14 * (this.canvas_width / 16) + 50, this.canvas_height);
      this.next_rotor.draw_rotor();
      this.ctx.translate(50, 0);
    } else {
      this.ctx.translate(50, 0);
      this.ctx.clearRect(this.offset, 0, 8 * (this.canvas_width / 16), this.canvas_height);      
    }
    this.draw_gears(cx, cy, step_angle);
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, cy - outer_radius_offset, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = '#EA6045';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, cy - middle_radius_offset, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = '#F8CA4D';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, cy - inner_radius_offset, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = '#888888';
    this.ctx.fill();

    this.draw_outer_text(cx, cy, step_angle);
    this.draw_inner_text(cx, cy, step_angle);
    this.ctx.translate(-50, 0);
    //draw on canvas represented by this.ctx
    // use num_rotations times an angle

  }

  rotate(clockwise=true, chain=false){
    //Add to number of rotations
    //Shift outer array by 1
    //if number of rotations == number of notches, push next one
    if (Math.abs(this.num_rotations) >= this.num_notches){
      this.num_rotations -= this.num_notches;
      if (this.next_rotor){
        this.next_rotor.rotate(true, true);
        chain = true;
        animate_rotation(this, clockwise, 0, chain);
      }
      this.num_rotations = 0;
    }
    //animate
    if ((this.ctx) && !(chain)){
      //chain parameter sets up concurrency UI fix by chaining draw calls
      animate_rotation(this, clockwise, 0, chain);
    }
  }

  static test_rotor(){
    return true;
    var test_rotor = new Rotor('Left', 0);

    //Testing initializations

    assert(!test_rotor.next_rotor, "Expected next_rotor to be undefined");
    assert(test_rotor.num_rotations == 0, "Expected initial number of rotations\
                                                                  to be zero");
    assert(array_equal(test_rotor.initialize_alphabet_array(), 
      test_rotor.outer_array),
            "Expected outer array to be the array [a-z]");
    assert(!array_equal(test_rotor.inner_array, test_rotor.outer_array), 
                  "Expected the inner and outer arrays of the rotor to differ");

    //Testing mappings

    assert(test_rotor.process_letter('a') === 'b',
                  "Expected 'a' to map to 'b' in the initial rotor processing");
    assert(test_rotor.inverse_process_letter('b') === 'a',
          "Expected 'b' to map back to 'a' in the initial rotor inverse processing");
    assert(test_rotor.inverse_process_letter(test_rotor.process_letter('a')) === 'a',
        "Expected a 1 to 1 mapping between process_letter and inverse_process_letter");

    //Testing rotation effects

    test_rotor.rotate();
    assert(test_rotor.process_letter('a') === 'a',
              "Expected 'a' to map to 'a' post rotation");

    assert(test_rotor.outer_array[0] === 'b', "Expected first element of outer\
       array of rotor to be 'b' after first rotation");
    assert(test_rotor.outer_array[25] === 'a', "Expected last element of outer\
       array of rotor to be 'a' after first rotation");
    assert(test_rotor.inverse_process_letter(test_rotor.process_letter('a')) === 'a',
        "Expected a 1 to 1 mapping between process_letter and inverse_process_letter");

    //Testing opposite direction rotation

    test_rotor.rotate(false);
    assert(test_rotor.process_letter('a') === 'b',
                  "Expected 'a' to map to 'b' after two opposite rotor rotations");
    assert(array_equal(test_rotor.outer_array, test_rotor.initialize_alphabet_array()),
      "Expected rotor array position to be reset after opposite rotations");

    //Testing rotor interactions

    var second_rotor = new Rotor('Right', 0);
    assert(array_equal(second_rotor.outer_array, test_rotor.outer_array),
      "Expected equal outer arrays for both rotors on start");
    test_rotor.next_rotor = second_rotor;

    for (var i = 0; i < test_rotor.num_notches; i++){
      test_rotor.rotate();
    }
    assert(test_rotor.num_rotations == 0);
    assert(!array_equal(second_rotor.outer_array, test_rotor.outer_array),
      "Expected non equal outer arrays for both rotors post-rotate");

    console.log("Rotor tests passed");
  }
/*

Outline for representation of a state Enigma Machine

Attributes
inner_array: Char Array representing the inner circle of a rotor
  - randomized but seedable
outer_array: Char Array representing the outer circle of a rotor
  - A-Z
num_rotations: Int representing the number of rotations on
        the rotor [0, 26)
next_rotor: Rotor representing the next in the chain, can be undefined
- position: considering multiple canvases we 

Methods
- draw_rotor(ctx) - draws scalable rotor in provided canvas
- rotate(clockwise=true) - rotates a rotor and chains effects to
    next rotor if necessary. Rotates either clockwise or 
    counterclockwise
- test_rotor - Tests specs for the Rotor class
*/
}