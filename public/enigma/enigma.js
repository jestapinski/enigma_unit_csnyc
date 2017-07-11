/*
  Jordan Stapinski
  Enigma Unit - Enigma Machine module
  enigma.js - Accompanying Javascript to base_enigma_exercise.html/enigma.css
*/

class Rotor {
  //constructor is a seeded RNG which will populate mapping based on shuffle

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

//Sets up two Rotor objects on two HTML canvases
function initialize_rotors(){

}