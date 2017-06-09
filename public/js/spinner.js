var numbers = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
var startIndex = 4
var selectedIndex = 5

var spinUp = document.getElementById('spinUp');
var spinDown = document.getElementById('spinDown');
var show_code = document.getElementById('show_code');
var encrypt = document.getElementById('encrypt');
var plaintext_value = document.getElementById('plaintext_value');
var black_box_text = document.getElementById('black_box_text');

function drawWheel(){
  var canvas = document.getElementById("canvas");
  if (canvas.getContext){
    var boxWidth = 50
    var boxHeight = 50
    var numSections = 4
    ctx = canvas.getContext("2d")

    ctx.clearRect(0, 0, 500, 200)

    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 2;

    var colors = ["#F5E5C0", "#FFFFFF", "#F5E5C0", "#F5E5C0"]

    for (var i = 0; i < numSections; i++) {
      // ctx.clearRect(0, i * 25, 25, 25)
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

function redraw(step, direction){
    var boxWidth = 50
    var boxHeight = 50
    var numSections = 4
    var colors = ["#F5E5C0", "#FFFFFF", "#F5E5C0", "#F5E5C0"]
    ctx = canvas.getContext("2d")
      for (var i = 0; i < numSections + 1; i++) {
        ctx = canvas.getContext("2d")
        // console.log(colors)
        // console.log(i)
        if (i < colors.length){
          // console.log(colors[i])
          ctx.fillStyle = colors[i];

          // console.log(ctx.fillStyle)
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
          console.log((startIndex + i - 1))
          ctx.fillText(numbers[numStart].toString(), 25, 30 + i * 50 - (step))
        } else {
          console.log("step")
          // console.log(step)
          // console.log(30 + i * 50 + (step))
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

function spinWheelUp(){
  var canvas = document.getElementById("canvas");
  if (canvas.getContext){
    var boxWidth = 50
    var boxHeight = 50
    var numSections = 4
    ctx = canvas.getContext("2d")

    // ctx.clearRect(0, 0, 500, 200)

    var colors = ["#F5E5C0", "#FFFFFF", "#F5E5C0", "#F5E5C0"]
    for (var step = 0; step < boxHeight; step++){
      // ctx.clearRect(0, 0, 500, 200)
      //redraw
      // redraw(step);
      setTimeout(redraw, 100, step, "up");
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
    var numSections = 4
    ctx = canvas.getContext("2d")

    // ctx.clearRect(0, 0, 500, 200)

    var colors = ["#F5E5C0", "#FFFFFF", "#F5E5C0", "#F5E5C0"]
    for (var step = 0; step < boxHeight; step++){
      // ctx.clearRect(0, 0, 500, 200)
      //redraw
      // redraw(step);
      setTimeout(redraw, 100, step, "down");
      //setTimeout and pass step

    }
    //Move for correctness
    startIndex--;
    if (startIndex == -1){
      startIndex = numbers.length - 1;
    }
    // startIndex %= numbers.length;
    console.log("new start index");
    console.log(startIndex);
    // drawWheel()
  }
}

function runEncryption(){
  var passed_text_value = plaintext_value.value;
  // TODO rewrite below more cleanly
  var selected_value = (startIndex + 1) % numbers.length;
  var shifting_value = numbers[selected_value];//.toString();
  //Get space locations
  // black_box_text.innerHTML = passed_text_value + shifting_value;
  // var canvas = document.getElementById("black_box_canvas");
  var parentNode = document.getElementById("black-box-parent");
  var button_parent_node = document.getElementById('button-container');
  var canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 200;
  canvas.id = "black_box_canvas";

  // if (black_box_text.style.display === 'none'){
  //   black_box_text.style.display = 'block';
  // } else {
    // var parent = document.getElementById('middle-box');
    // console.log(parent);
    console.log(black_box_text.parentNode);
    parentNode.appendChild(canvas);
    black_box_text.parentNode.removeChild(black_box_text);
    button_parent_node.removeChild(encrypt);
    // return;
    // black_box_text.style.display = 'none';
    if (canvas.getContext){
      var boxWidth = 50
      var boxHeight = 50
      var numSections = 4
      ctx = canvas.getContext("2d")
      var offsets = [0, 100];

      ctx.clearRect(0, 0, 500, 200)

      // ctx.strokeStyle = "black";
      // ctx.lineWidth = 2;

      var colors = ["#F5E5C0", "#FFFFFF", "#F5E5C0", "#F5E5C0"]
      for (var offset = 0; offset < offsets.length; offset++){
        for (var i = 0; i < passed_text_value.length; i++) {
          // ctx.clearRect(0, i * 25, 25, 25)
          ctx = canvas.getContext("2d")
          console.log(colors)
          console.log(i)
          console.log(colors[i])
          ctx.fillStyle = "#FFFFFF";

          console.log(ctx.fillStyle)
          ctx.fillRect(i * boxWidth, offsets[offset], boxWidth, boxHeight);
          ctx.fillStyle = "#000000";
          ctx.font = "30px Arial";
          ctx.textAlign = "center";
          // TODO fix below value
          if (offset == 0){
            ctx.fillText(passed_text_value[i], 25 + i * 50, offsets[offset] + 30)            
          } else {
            //Write a method for encryption
            ctx.fillText(String.fromCharCode(passed_text_value[i].charCodeAt(0) + shifting_value), 25 + i * 50, offsets[offset] + 30)
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
      }
    }    
  // }
}

drawWheel()

spinUp.addEventListener("click", spinWheelUp)
spinDown.addEventListener("click", spinWheelDown)
encrypt.addEventListener("click", runEncryption)