/*
  Jordan Stapinski
  rotor.js
  Backend Logic for the Enigma Machine Rotors
  Accompanies enigma.js, overall logic for Enigma Machine exercise
*/

class Rotor {
  constructor(position, seed, ctx, rotor){
    this.next_rotor = rotor;
    this.position = position;
    this.seed = seed;
    this.ctx = ctx;
    this.num_rotations = 0;
    this.num_notches = 26;
    this.inner_array = [];
    this.outer_array = [];
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

  draw_rotor(){
    //draw on canvas represented by this.ctx
    // use num_rotations times an angle
  }

  rotate(clockwise=true){
    //Add to number of rotations
    //Shift outer array by 1
    if (clockwise){
      const initial_element = this.outer_array[0];
      this.outer_array = this.outer_array.splice(1);
      this.outer_array.push(initial_element);
      this.num_rotations++;
    } else {
      const arr_length = this.outer_array.length - 1;
      const final_element = this.outer_array[arr_length];
      this.outer_array = [final_element].concat(this.outer_array.splice(0, arr_length));
      this.num_rotations--;
    }
    //if number of rotations == number of notches, push next one
    if (this.num_rotations == this.num_notches){
      if (this.next_rotor){
        this.next_rotor.rotate();
      }
      this.num_rotations = 0;
    }
    //animate
  }

  static test_rotor(){
    var test_rotor = new Rotor('Left', 0);
    assert(!test_rotor.next_rotor, "Expected next_rotor to be undefined");
    assert(test_rotor.num_rotations == 0, "Expected initial number of rotations\
                                                                  to be zero");
    assert(array_equal(test_rotor.initialize_alphabet_array(), 
      test_rotor.outer_array),
            "Expected outer array to be the array [a-z]");
    assert(!array_equal(test_rotor.inner_array, test_rotor.outer_array), 
                  "Expected the inner and outer arrays of the rotor to differ");
    test_rotor.rotate();
    assert(test_rotor.outer_array[0] === 'b', "Expected first element of outer\
       array of rotor to be 'b' after first rotation");
    assert(test_rotor.outer_array[25] === 'a', "Expected last element of outer\
       array of rotor to be 'a' after first rotation");
    test_rotor.rotate(false);
    assert(array_equal(test_rotor.outer_array, test_rotor.initialize_alphabet_array()),
      "Expected rotor array position to be reset after opposite rotations");

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