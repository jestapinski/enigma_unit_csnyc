// Jordan Stapinski
// Enigma Unit Encryption Accompanying JS file

var enableTooltips = true;

var numbers = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]
var startIndex = 3
var selectedIndex = 5

var spinUp = document.getElementById('spinUp');
var spinDown = document.getElementById('spinDown');
var show_code = document.getElementById('show_code');
var encrypt = document.getElementById('encrypt');
var plaintext_value = document.getElementById('plaintext_value');
var black_box_text = document.getElementById('black_box_text');
var output_text = document.getElementById('output_text');
var square_box = document.getElementById('square-box');
var hidden_text = true;
var numSections = 5;

function drawWheel(){
  var canvas = document.getElementById("canvas");
  if (canvas.getContext){
    var boxWidth = 50;
    var boxHeight = 50;
    ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var colors = ["#F5E5C0", "#F5E5C0", "#FFFFFF", "#F5E5C0", "#F5E5C0"]

    for (var i = 0; i < numSections; i++) {
      ctx = canvas.getContext("2d")
      console.log(colors)
      console.log(i)
      console.log(colors[i])
      ctx.fillStyle = colors[i];

      console.log(ctx.fillStyle)
      ctx.fillRect(0, i * boxHeight, boxWidth, boxHeight);
      ctx.fillStyle = "#000000";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      // TODO fix below value
      ctx.fillText(numbers[(startIndex + i) % numbers.length].toString(), 25, 30 + i * 50)

      ctx.beginPath();
      ctx.moveTo(0,(i) * 50);
      ctx.lineTo(50,(i) * 50);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0,(i + 1) * 50);
      ctx.lineTo(50,(i + 1) * 50);
      ctx.stroke();
    }
  }
}

function redraw(step, direction, ctx){
    var boxWidth = 50
    var boxHeight = 50
    var colors = ["#F5E5C0", "#F5E5C0", "#FFFFFF", "#F5E5C0", "#F5E5C0"]
    // ctx = canvas.getContext("2d")
      for (var i = 0; i < numSections + 1; i++) {
        ctx = canvas.getContext("2d")
        if (i < colors.length){
          ctx.fillStyle = colors[i];

          ctx.fillRect(0, i * boxHeight, boxWidth, boxHeight);
        }
        ctx.fillStyle = "#000000";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        // TODO fix below value
        if (direction === "up"){
          var numStart = (startIndex + i - 1) % numbers.length
          if (numStart < 0){
            numStart += numbers.length
          }
          // console.log((startIndex + i - 1))
          ctx.fillText(numbers[numStart].toString(), 25, 30 + i * 50 - (step))
        } else {
          // console.log("step")
          ctx.fillText(numbers[(startIndex + i) % numbers.length].toString(), 25, -20 + i * 50 + step )
        }

        ctx.beginPath();
        ctx.moveTo(0,(i) * 50);
        ctx.lineTo(50,(i) * 50);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0,(i + 1) * 50);
        ctx.lineTo(50,(i + 1) * 50);
        ctx.stroke();
      }
}

function caesar_encrypt_one_letter(initial_char, shift_value){
  // var is_uppercase = 
  var letter_ascii = initial_char.toLowerCase().charCodeAt(0);
  if (!(initial_char.toLowerCase().match(/[a-z]/i))){return initial_char;}
  var new_letter_ascii = letter_ascii + shift_value;
  var z_value = 'z'.charCodeAt(0);
  var a_value = 'a'.charCodeAt(0);
  var letter_difference = 0;
  console.log(z_value);
  console.log(shift_value);
  console.log(new_letter_ascii);
  if (new_letter_ascii > z_value){
    letter_difference = new_letter_ascii - z_value;
    new_letter_ascii = a_value + letter_difference - 1;
  } else if (new_letter_ascii < a_value){
    letter_difference = a_value - new_letter_ascii;
    new_letter_ascii = z_value - (letter_difference - 1);
  }
  return String.fromCharCode(new_letter_ascii);
}

function spinWheelUp(){
  var canvas = document.getElementById("canvas");
  if (canvas.getContext){
    var boxWidth = 50
    var boxHeight = 50
    ctx = canvas.getContext("2d")

    // var colors = ["#F5E5C0", "#FFFFFF", "#F5E5C0", "#F5E5C0"]
    for (var step = 0; step < boxHeight; step++){
      setTimeout(redraw, 100, step, "up", ctx);
      //setTimeout and pass step
    }
    startIndex++;
    startIndex %= numbers.length;
    console.log("new start index");
    console.log(startIndex);
  }
}

function spinWheelDown(){
  var canvas = document.getElementById("canvas");
  if (canvas.getContext){
    var boxWidth = 50
    var boxHeight = 50
    ctx = canvas.getContext("2d")

    for (var step = 0; step < boxHeight; step++){
      setTimeout(redraw, 100, step, "down", ctx);
      //setTimeout and pass step
    }
    //Move for correctness
    startIndex--;
    if (startIndex == -1){
      startIndex = numbers.length - 1;
    }
  }
}

function plaintext_not_valid(text){
  return (text == "");
}

function encryptionRedraw(i, passed_text_value, current_shift_value, shifting_value, step, ctx){
  var canvas_size = square_box.clientWidth;
  var boxHeight = 50
  var boxWidth = canvas_size / passed_text_value.length;
  if (boxWidth > 50){
    boxWidth = 50;
  }
  ctx.clearRect(i * boxWidth, boxHeight, canvas_size, boxHeight);
  var shift_offset = 1;
  if (shifting_value < 0){
    shift_offset = -1;
  }
  if (step === 50){
    if ((shift_offset === -1) && (current_shift_value > shifting_value + 1)){
      setTimeout(encryptionRedraw, 20, i, passed_text_value, current_shift_value + shift_offset, shifting_value, 0, ctx);
      return;      
    }
    if ((shift_offset === 1) && (current_shift_value < shifting_value - 1)){
      setTimeout(encryptionRedraw, 20, i, passed_text_value, current_shift_value + shift_offset, shifting_value, 0, ctx);
      return;
    } 
    if (i == (passed_text_value.length - 1)){
      $("#encrypt").removeClass('disabled');
      ctx.clearRect(0, boxHeight, canvas_size, boxHeight);
      return;       
    } else {
      setTimeout(encryptionRedraw, 20, i + 1, passed_text_value, 0, shifting_value, 0, ctx);
      return;      
    }
  }

  var numSections = 4
  var offsets = [0, 100];
  var offset = 1;

  ctx.clearRect(i * boxWidth, boxHeight, 500, 200);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(i * boxWidth, offsets[offset], boxWidth, boxHeight);
  ctx.fillStyle = "#000000";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText(caesar_encrypt_one_letter(passed_text_value[i], current_shift_value), i * boxWidth + (boxWidth / 2), offsets[offset] + 30 - step)
  ctx.fillText(caesar_encrypt_one_letter(passed_text_value[i], current_shift_value + shift_offset), i * boxWidth + (boxWidth / 2), offsets[offset] + 80 - step);        

  ctx.beginPath();
  ctx.moveTo((i) * boxWidth, offsets[offset]);
  ctx.lineTo((i) * boxWidth, offsets[offset] + boxHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo((i + 1) * boxWidth, offsets[offset]);
  ctx.lineTo((i + 1) * boxWidth, offsets[offset] + boxHeight);
  ctx.stroke();
  setTimeout(encryptionRedraw, 20, i, passed_text_value, current_shift_value, shifting_value, step + 1, ctx);
  // }
}

function runEncryption(){
  remove_tooltip();
  var passed_text_value = plaintext_value.value;
  if (plaintext_not_valid(passed_text_value)){
    alert("Plaintext should not be blank!");
    return;
  }
  // TODO rewrite below more cleanly
  var selected_value = (startIndex + 2) % numbers.length;
  var shifting_value = numbers[selected_value];//.toString();
  //Get space locations

  var parentNode = document.getElementById("black-box-parent");
  var button_parent_node = document.getElementById('button-container');
  if (document.getElementById("black_box_canvas")){
    document.getElementById("black_box_canvas").remove();
  }
  var canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 200;
  canvas.id = "black_box_canvas";

  console.log(black_box_text.parentNode);
  parentNode.appendChild(canvas);
  if (black_box_text.parentNode){
    black_box_text.parentNode.removeChild(black_box_text);
  }
  $("#encrypt").addClass('disabled');

  if (canvas.getContext){
    var canvas_size = square_box.clientWidth;
    var boxHeight = 50
    var boxWidth = canvas_size / passed_text_value.length;
    if (boxWidth > 50){
      boxWidth = 50;
    }
    var numSections = 4
    ctx = canvas.getContext("2d")
    var offsets = [0, 100];

    ctx.clearRect(0, 0, canvas_size, 200)

    var offset = 0; //TODO REMOVE

    var colors = ["#F5E5C0", "#FFFFFF", "#F5E5C0", "#F5E5C0"]
      for (var i = 0; i < passed_text_value.length; i++) {
        ctx = canvas.getContext("2d")
        // console.log(colors)
        console.log(i)
        // console.log(colors[i])
        ctx.fillStyle = "#FFFFFF";

        console.log(ctx.fillStyle)
        ctx.fillRect(i * boxWidth, offsets[offset], boxWidth, boxHeight);
        ctx.fillStyle = "#000000";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        // TODO fix below value
        if (offset == 0){
          ctx.fillText(passed_text_value[i], i * boxWidth + (boxWidth / 2), offsets[offset] + 30)            
        }

        ctx.beginPath();
        ctx.moveTo((i) * boxWidth, offsets[offset]);
        ctx.lineTo((i) * boxWidth, offsets[offset] + boxHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((i + 1) * boxWidth, offsets[offset]);
        ctx.lineTo((i + 1) * boxWidth, offsets[offset] + boxHeight);
        ctx.stroke();
      }
    setTimeout(encryptionRedraw, 20, 0, passed_text_value, 0, shifting_value, 0, ctx, shifting_value);
  }
  //Fix to place at end of animation
  var stringArray = passed_text_value.split("");
  var mappedArray = stringArray.map(function(c){
    return caesar_encrypt_one_letter(c, shifting_value);
  })
  var newText = mappedArray.join("");
  output_text.value = newText;    
}

function modify_instructions(){
  if (hidden_text){
    $('#instruction_set').show(500);
    document.getElementById('instruction_button').text = 'Hide Instructions';
    hidden_text = false;
  } else {
    $('#instruction_set').hide(500);
    document.getElementById('instruction_button').text = 'Show Instructions';
    hidden_text = true;
  }
}

drawWheel()

spinUp.addEventListener("click", spinWheelUp)
spinDown.addEventListener("click", spinWheelDown)
encrypt.addEventListener("click", runEncryption)