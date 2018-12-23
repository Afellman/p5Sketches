/*
  Module of different p5 sketches. Each on can be plugged into a sketch.js file,
  calling their setupThis and drawThis functions in their respective p5 functions.
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
    let circles;

    function setupThis() {
      circles = [];
      for (var i = 0; i < 100; i++) {
        circles.push(new _Ellipse())
      }
      noFill();
      smooth(1)
    }

    function drawThis(vol) {
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
      if (circles.length > 0) {
        if (circles[0].size > width + 200) {
          circles.splice(0, 1);
          // circles.push(new _Ellipse()); // to make a new one everytime one is removed
        }
      }
      if (vol > 4.5 && circles.length < 100) {
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
      } else if (vol > 0) {
        this.size -= vol;
      } else {
        circles[i].color -= colorMap
      }
      this.size += increase / (i + 1);
    }

    function onMidiNote(note, velocity) {
      if (velocity > 0) {
        switch (note) {
          case 1:
            circles.push(new _Ellipse());
            break;

        }
      }
    }

    function mouseClicked() {
     
    };

    return {
      setupThis: setupThis,
      drawThis: drawThis,
      onMidiNote: onMidiNote,
      mouseClicked : mouseClicked
    }
  }(),

  /*************************************************
   * Random Walker 
  *************************************************/
  walker: function () {
    let walkerArray = [];
    let walkerAmt = 5;
    let scale = 10;
    let pixelOccupiedX = [];
    let pixelOccupiedY = [];

    function setupThis() {
      for (let i = 0; i < walkerAmt; i++) {
        walkerArray.push(new Walker(i));
      }
      background(0);
    }

    function drawThis() {
      background(0)
      let length = walkerArray.length;
      for (let i = 0; i < length; i++) {
        walkerArray[i].display();
        walkerArray[i].checkCollison();
        walkerArray[i].step();
        walkerArray[i].preventOffScreen();
      }
    }

    // Walker constructor

    function Walker(i, x, y, color) {
      this.index = i;
      this.x = x || width / 2;
      this.y = y || height / 2;
      this.color = color || someColor();
      pixelOccupiedX[this.x] = 1;
      pixelOccupiedY[this.y] = 1;
    }

    Walker.prototype.display = function () {
      noStroke();
      fill(this.color[0], this.color[1], this.color[2]);
      // fill(255, 10);
      
      // fill(255);
      ellipse(this.x, this.y, scale);
    }
    // Function to "step" the walker in one random direction 
    // by the same size as the walker.
    Walker.prototype.step = function () {
      let stepX = (int(random(3)) - 1);
      let stepY = (int(random(3)) - 1);

      pixelOccupiedX[this.x] = null;
      pixelOccupiedY[this.y] = null;
      
      this.x += stepX * scale;
      this.y += stepY * scale;
      
      pixelOccupiedX[this.x] = this.index;
      pixelOccupiedY[this.y] = this.index;
    }

    // Function to stop the walker from going off the screen. If the walkers
    Walker.prototype.preventOffScreen = function () {
      if (this.x < 1) {
        this.x += scale;
      } else if (this.x > width - 1) {
        this.x -= scale;
      } else if (this.y < 1) {
        this.y += scale;
      } else if (this.y > height - 1) {
        this.y -= scale;
      }
    }

    Walker.prototype.checkCollison = function() {
      var walkerAtX = pixelOccupiedX[this.x]
      var walkerAtY = pixelOccupiedY[this.y]
      if(walkerAtX != null && walkerAtX !== undefined && walkerAtX == walkerAtY){
        // var gaus = randomGaussian(30, 2);
        // if(gaus )
        var ran = Math.random();
        if(ran < .04){
          walkerArray[walkerAtX].removeWalker();
          this.removeWalker();
        } else {
          this.reproduce();
        }
        // console.log(gaus);
        // this.reproduce();
      }
    }

    Walker.prototype.reproduce = function(){
      var i = walkerArray.length -1;
      walkerArray.push(new Walker(i, this.x, this.y, this.color));
      
    }

    Walker.prototype.removeWalker = function() {
      walkerArray.splice(1, this.index);
      pixelOccupiedX[this.x] = null;
      pixelOccupiedY[this.y] = null;

    }

    function onMidiNote(note, velocity) {

    }

    function mouseClicked() {
     
    };

    return {
      setupThis: setupThis,
      drawThis: drawThis,
      onMidiNote: onMidiNote,
      mouseClicked : mouseClicked
    }
  }(),

  /*************************************************
   * Ball 
  *************************************************/
  ball: function () {

    let lines;
    let lineAmt = 360;
    let timer;
    let angle;
    let xCenter;
    let yCenter;
    let radius;
    let angleMultiplyer = 1.1
    let direction = 1

    function setupThis() {
      timer = 0
      lines = [];
      background(0)
      for (let i = 0; i < lineAmt; i++) {
        // let xMap = map(i, 0, lineAmt, 0, width);
        angle = radians(i);
        xCenter = width / 2;
        yCenter = height;
        radius = height > width ? width / 2 : height / 2;

        let x = xCenter + sin(angle) * radius;
        let y = yCenter + cos(angle) * radius;

        let x2 = xCenter + sin(angle * angleMultiplyer) * radius;
        let y2 = yCenter + cos(angle * angleMultiplyer) * radius;
        lines.push(new Line(x, y, x2, y2));
      }
    }

    function drawThis() {
      timer += .005 * direction;
      background(10, 30)
      for (let i = 0; i < lineAmt; i++) {
        lines[i].display(i);
        lines[i].wave(i)
        
      }
      if (timer > 3) {
        direction = -direction
      } else if (timer < -3) {
        direction = -direction
      }
    }


    function Line(x1, y1, x2, y2) {
      this.x1 = x1
      this.y1 = y1;
      this.x2 = x2
      this.y2 = y2;
      this.color = someColor();
    }

    Line.prototype.display = function(i) {
      stroke(this.color[0], this.color[1], this.color[2], 200)
      line(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2)      

    }

    Line.prototype.wave = function (i) {
      var radi = radians(timer)
      let rad = radians(i)
      this.x2 = xCenter + sin(rad * timer) * radius;
      this.y2 = yCenter + cos(rad * timer) * radius;
      this.x1 = map(i, 0, lineAmt, 0, width)
      this.y1 = 0
    }


    function onMidiNote(note, velocity) {
      let velMap = map(velocity, 0, 127, 0, 100);
      switch (note) {
        case 15:
          angleMultiplyer = velMap;
          break;
        case 14:
          break;
      }
    }

    function mouseClicked() {
     
    };
    return {
      setupThis: setupThis,
      drawThis: drawThis,
      onMidiNote: onMidiNote,
      mouseClicked : mouseClicked
    }
  }(),

  /*************************************************
   * Swarm
  *************************************************/
  swarm: function () {

    let points;
    let pointsAmt;

    function setupThis() {
      points = [];
      pointsAmt = 250;
      background(0)
      for (let i = 0; i < pointsAmt; i++) {
        points.push(new Point())
      }
    }

    function drawThis() {
      background(15, 80);
      for (let i = 0; i < pointsAmt; i++) {
        points[i].walk(i);
        points[i].display();

      }
    }

    function Point() {
      this.color = someColor();
      this.pos = createVector(width / 2, height / 2);
      this.vel = createVector(0);

    }

    Point.prototype.walk = function (i) {
      // Can use i as first argument of sub to have each point follow the previous one
      // i = i + 1;
      // i == pointsAmt ? i = 0 : i = i;
      // let prev = points[i].pos;

      let iMap = map(i, 0, pointsAmt, 0, 360);
      let rand = createVector(random(-4, 4), random(-4, 4));
      if(mouseX < width - 5 && mouseX > 5 && mouseY < height -5 && mouseY > 5){

        let rad = radians(iMap)
        let sine = mouseX + sin(rad) * 75
        let cosine = mouseY + cos(rad) * 75
        let prev = createVector(sine, cosine);
        this.acc = p5.Vector.sub(prev, this.pos);
        this.acc.normalize()
        this.acc.add(rand);
        this.acc.mult(2);
        // this.vel.add(this.acc)
        this.pos.add(this.acc);
      } else {
        this.pos.add(rand);
      }
    }
    Point.prototype.display = function () {

      stroke(this.color[0], this.color[1], this.color[2], 80);
      
      // fill(255, 80);
      ellipse(this.pos.x, this.pos.y, 20);
    }

    function onMidiNote(note, velocity) {

    }

    function mouseClicked() {
     
    };

    return {
      setupThis: setupThis,
      drawThis: drawThis,
      onMidiNote: onMidiNote,
      mouseClicked : mouseClicked
    }
  }(),


  /*************************************************
   * Bouncy Balls
  *************************************************/

  bouncyBalls: function () {

    let particles;
    let particleAmt;

    function setupThis() {
      particles = [];
      particleAmt = 10;
      background(0);

      for (let i = 0; i < particleAmt; i++) {
        let x = map(i, 0, particleAmt, 0, width);
        particles.push(new Particle(i * 5, x, height / 2))
      }

    }

    function drawThis() {
      background(0);

      for (let i = 0; i < particleAmt; i++) {
        let gravity = createVector(0, 0.2 * particles[i].size);
        let wind = createVector(0.5, 0);
        particles[i].applyForce(gravity)
        if (mouseIsPressed) {
          particles[i].applyForce(wind);
        }
        particles[i].update();
        particles[i].edges();
        particles[i].display();
      }
    }
    
    function Particle(_size, x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.size = _size;
    }

    Particle.prototype.applyForce = function (force) {
      force = force.normalize()
      force.div(this.size)
      this.acc = (force);
    }

    Particle.prototype.edges = function () {
      if (this.pos.y > height) {
        this.vel.y *= -1;
        this.pos.y = height;
      }
      if (this.pos.y < 0) {
        this.vel.y *= -1;
        this.pos.y = 0;
      }
      if (this.pos.x > width) {
        this.vel.x *= -1;
        this.pos.x = width;
      }
      if (this.pos.x < 0) {
        this.vel.x *= -1;
        this.pos.x = 0;
      }
    }

    Particle.prototype.update = function () {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
    }

    Particle.prototype.display = function () {
      fill(255);
      ellipse(this.pos.x, this.pos.y, this.size)
    }

    function mouseClicked() {
     
    };

    function onMidiNote(note, velocity) {

    }

    return {
      setupThis: setupThis,
      drawThis: drawThis,
      onMidiNote: onMidiNote,
      mouseClicked : mouseClicked
    }
  }(),



  new: function () {
   
    function setupThis() {

    }

   
    function drawThis() {
   
    }

    

    function mouseClicked() {
     
    };




    function onMidiNote(note, velocity) {

    }

    return {
      setupThis: setupThis,
      drawThis: drawThis,
      onMidiNote: onMidiNote,
      mouseClicked: mouseClicked
    }
  }(),
}