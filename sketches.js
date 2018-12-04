/*
  Module of different p5 sketches. Each on can be plugged into a sketch.js file,
  calling their setup and draw functions in their respective p5 functions.

*/

let sketches = {

  /*************************************************
   * Hynotic Rings
  *************************************************/
  rings: function () {
    let r = 1;
    let g = 1;
    let b = 1;
    let rDirect = 1
    let gDirect = 1
    let bDirect = 1
    var circles;
    
    function setup() {
      circles = [];
      for (var i = 0; i < 100; i++) {
        circles.push(new _Ellipse())
      }

      noFill();
      strokeWeight(3);
      smooth(1)
    }

    function draw(vol) {
      var circleIncrease = 20;
      r += .3 * rDirect;
      g += .5 * gDirect;
      b += .8 * bDirect;

      if (r >= 50 || r <= 0) {
        rDirect = -rDirect;
      }
      if (g >= 50 || g <= 0) {
        gDirect = -gDirect;
      }
      if (b >= 50 || b <= 0) {
        bDirect = -bDirect;
      }
      background(r, g, b);

      for (let i = 0; i < circles.length; i++) {
        circles[i].grow(i, circleIncrease, vol);
        circles[i].display();
      }
      // Makes a new circle in one goes off the screen
      if(circles.length > 0){
        if (circles[0].size > width + 200) {
          circles.splice(0, 1);
          // circles.push(new _Ellipse()); // to make a new one everytime one is removed
        }
      }
      if(vol > 4.5 && circles.length < 100){
        circles.push(new _Ellipse());
        wait = 5
      }


    }

    var _Ellipse = function () {
      this.x = width / 2;
      this.y = height / 2;
      this.size = 25;
      this.color = 0;
    }

    _Ellipse.prototype.display = function () {
      // var sizeMap = map(this.size, 25, width + 200, 0, 255)
      stroke(this.color, this.color / 2, this.color / 4);
      ellipse(this.x, this.y, this.size);
    }

    _Ellipse.prototype.grow = function (i, increase, vol) {
      let colorMap = map(vol, 0, 100, 0, 255);
      if (vol > 6) {
        this.size += vol;
        circles[i].color += colorMap
      } else if (vol > 0){
        this.size -= vol;
      } else {
        circles[i].color -= colorMap
      }
      this.size += increase / (i + 1);
    }

    function onMidiNote(note, velocity){
      if(velocity > 0){
        switch(note){
          case 1:
          circles.push(new _Ellipse());
          break;
          
        }
      }
    }
    return {
      setup: setup,
      draw: draw,
      onMidiNote: onMidiNote
    }
  }(),


  /*************************************************
   * Random Walker 
  *************************************************/
  walker: function () {
    let w1;
    let w2;
    let w3;
    let w4;
    let sweepPos = 0;
    let sweepPosDirect = 1;
    
    function setup() {
      w1 = new Walker();
      w2 = new Walker();
      w3 = new Walker();
      w4 = new Walker();
      background(0);
    }

    function draw(vol) {
      w1.display(vol);
      w1.step(vol);
      w2.display(vol);
      w2.step(vol);
      w3.display(vol);
      w3.step(vol);
      w4.display(vol);
      w4.step(vol);
      // sweepRefresh();
    }

    // Walker constructor
    function Walker() {
      this.x = width / 2;
      this.y = height / 2;
    }
    Walker.prototype.display = function (vol) {
      noStroke();
      fill(255, 10 + vol);
      ellipse(this.x, this.y, 10);
    }
    Walker.prototype.step = function (vol) {
      let stepX = (int(random(3)) - 1);
      let stepY = (int(random(3)) - 1);
      this.preventOffScreen();
      this.x += stepX * (vol + 10);
      this.y += stepY * (vol + 10);
    }
    Walker.prototype.preventOffScreen = function () {
      if (this.x < 1) {
        this.x += 10
      } else if (this.x > width - 1) {
        this.x -= 10
      } else if (this.y < 1) {
        this.y += 10
      } else if (this.y > height - 1) {
        this.y -= 10
      }
    }

    // Low opacity black line that sweeps left and right to slowying fade out the walker trail.
    function sweepRefresh() {
      if (sweepPos > width) {
        sweepPosDirect = -1
      }
      if (sweepPos < 0) {
        sweepPosDirect = 1;
      }
      stroke(0, 30);
      line(sweepPos, 0, sweepPos, height)
      sweepPos += sweepPosDirect;

    }

    function onMidiNote(note, velocity){

    }

    return {
      setup: setup,
      draw: draw,
      onMidiNote: onMidiNote
    }
  }(),

  lines : function () {
   
    let lines = [];  
    let lines2 = [];  
    let lineAmt = 200;
    let timer = 0;
    function setup() {
      background(255)
      for(let i =0; i < lineAmt; i ++){
        let xMap = map(i, 0, lineAmt, 0, width);
        lines.push(new Line(xMap, height /2, xMap, height));
        lines2.push(new Line(xMap, height, xMap, height /2));
      }  
    }

    function draw() {
      timer++
      background(0, 10)
      let linesLength = lines.length;
      stroke(255, 60)
      for(let i = 0; i < linesLength; i ++){
        // IN future initiate this with midi key
        lines[i].wave(i)
        ellipse(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2)
        // lines2[i].wave(i)
        // line(lines2[i].x1, lines2[i].y1, lines2[i].x2, lines2[i].y2)
      }
    }


    function Line(x1, y1 ,x2, y2){
      this.x1 = x1
      this.y1 = y1;
      this.x2 = x2
      this.y2 = y2;
      this.waveDirection = 1;
    }

    Line.prototype.wave = function(i){
      var rad = radians(timer / 4) + (i / 10)
        this.y1 += sin(rad) 
        // this.x2 = (rad)
        if(timer >1000000){
          timer = 0
        }
      // if(timer % 10 == 0){
      //   this.waveDirection = -this.waveDirection
      // } else if(this.y1 <= 0){
      //   this.waveDirection = -this.waveDirection
      // }
    }

    
    function onMidiNote(note, velocity){

    }

    return {
      setup : setup,
      draw: draw,
      onMidiNode : onMidiNote
    }
  }(),
}