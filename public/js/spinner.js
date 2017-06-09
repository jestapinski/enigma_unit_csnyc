var numbers = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
      var startIndex = 4
      var selectedIndex = 5

      var spinUp = document.getElementById('spinUp');

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

      drawWheel()

      spinUp.addEventListener("click", spinWheelUp)
      spinDown.addEventListener("click", spinWheelDown)