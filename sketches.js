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
          circles.push(new _Ellipse()); // to make a new one everytime one is removed
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
      circles.push(new _Ellipse());
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
    let walkers = {};
    let walkerAmt = 500;
    let scale = 5;
    let pixelOccupiedX = {};
    let pixelOccupiedY = {};
    let reproductionRate = .60;

    function setupThis() {
      // frameRate(10)
      for (let i = 1; i < walkerAmt +1; i++) {
        var rand = Math.round(Math.random() * 999999999);
        walkers[rand] = new Walker(rand);
      }
      background(0);
    }

    function drawThis() {
      // background(0)
      for (let i in walkers) {
        walkers[i].display();
        walkers[i].step();
        if(walkers[i]) {
          walkers[i].preventOffScreen();
        }
      }
    }

    // Walker constructor

    function Walker(name, x, y, color) {
      this.name = name;
      this.x = x || width / 2;
      this.y = y || height / 2;
      this.color = color || someColor();
    
    }

    Walker.prototype.display = function () {
      noStroke();
      fill(this.color[0], this.color[1], this.color[2], 10);
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
      this.checkCollison();
      
      pixelOccupiedX[this.x] = this.name;
      pixelOccupiedY[this.y] = this.name;
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
      if(walkerAtX !== null && walkerAtX !== undefined && walkerAtX == walkerAtY){
        // var gaus = randomGaussian(30, 2);
        // if(gaus )
        var ran = Math.random();
        if(ran < reproductionRate){
          this.reproduce();
        } else {
          this.removeWalker();
        }
        // console.log(gaus);
        // this.reproduce();
      }
    }

    Walker.prototype.reproduce = function(){
      var rand = Math.round(Math.random() * 999999999);
      walkers[rand] = new Walker(rand, this.x, this.y, this.color);
      updateCount(1);
    }

    Walker.prototype.removeWalker = function() {
      delete walkers[this.name]
      pixelOccupiedX[this.x] = null;
      pixelOccupiedY[this.y] = null;
      updateCount(-1);
    }


    function updateCount(upDown) {
      walkerAmt += upDown;
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
    let inc = 0;
    let goNuts = 1;

    function setupThis() {
      points = [];
      pointsAmt = 250;
      background(0)
      for (let i = 0; i < pointsAmt; i++) {
        points.push(new Point())
      }
    }

    function drawThis() {
      inc += 0.02
      // background(15, 80);
      for (let i = 0; i < pointsAmt; i++) {
        points[i].walk(i);
        points[i].display();
        if(goNuts == -1){
          points[i].goNuts();
        }
      }
    }

    function Point() {
      this.color = someColor();
      this.pos = createVector(width / 2, height / 2);
      this.vel = createVector(0);
      this.size = 20
    }

    Point.prototype.walk = function (i) {
      // Can use i as first argument of sub to have each point follow the previous one
      // i = i + 1;
      // i == pointsAmt ? i = 0 : i = i;
      // let prev = points[i].pos;

      let iMap = map(i, 0, pointsAmt, 0, 360);
      let rand = createVector(random(-4, 4), random(-4, 4));
      if(mouseX < width - 5 && mouseX > 5 && mouseY < height -5 && mouseY > 5){

        // let rad = radians(iMap)
        let sine = mouseX + sin(iMap + inc) * this.size
        let cosine = mouseY + cos(iMap + inc) * this.size
        let prev = createVector(sine, cosine);
        this.acc = p5.Vector.sub(prev, this.pos);
        this.acc.normalize()
        this.acc.mult(2);
        this.pos.add(this.acc);
      } else {
        this.pos.add(rand);
      }
      this.size = dist(mouseX, mouseY, this.pos.x, this.pos.y) + i
    }

    Point.prototype.display = function () {
      stroke(this.color[0], this.color[1], this.color[2], 80);
      point(this.pos.x, this.pos.y, this.size);
    }

    Point.prototype.goNuts = function() {
      let rand = random(0, 50)
      let randVector = createVector(rand);
      this.pos.add(randVector);
    };

    function onMidiNote(note, velocity) {
    }
    
    function mouseClicked() {
      goNuts *= -1;
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

  /*************************************************
   * fft
  *************************************************/

  fft: function () {
    let fft
    let osc;
    let angle = 0;
    let colorSwitch = 0;
    let vertexes
    function setupThis() {
      noFill()
      vertexes = [];
      fft = new p5.FFT(.99);
      // osc = new p5.Oscillator();
      // osc.setType('triangle');
      // osc.freq(440);
      // osc.amp(1);
      // osc.start();
      color = someColor();
      // song.play()
      for(let i = 0; i < 100; i ++){
        vertexes.push(new V())
      }
    }

    function V() {
      this.color = someColor();
    }

    V.prototype.display = function(x, y){
      fill(0, 10, 30, 10)
      stroke(this.color[0], this.color[1], this.color[2])
      rect(x, y, width /2, height /2)
    }
   
    function drawThis() {
      background(200, 75)
      let mouseMap = map(mouseY, 0, height, 100, 580)
      // osc.freq(mouseMap);
      let spectrum = fft.analyze();
      let length = vertexes.length;
      beginShape()
      for(let i = 0; i < length; i++){
        let specAvg = fft.linAverages(500)
        let specMap = map(specAvg[i], 0, 255, 0, 360);
        let x = (width /4) + sin( + i)  * (specMap * 1.5);
        let y = (height /4) + cos( + i) * (specMap * 1.5);
        vertexes[i].display(x, y)
      }
      endShape()
      colorSwitch ++
      angle += 0.001
      if(colorSwitch % 25 == 0){
        color = someColor();
      }
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

  /*************************************************
   * Bubbles
  *************************************************/
  bubbles: function () {
    let bubbles;
    let bubblesAmt = 100;
    let maxSize = 350;

    function setupThis() {
      bubbles = []
      for(let i = 0; i < bubblesAmt; i ++){
        let s = random(100, maxSize);
        bubbles.push(new Bubble(s, random(width), random(height), someColor()))
      }
    }

   
    function drawThis() {
      background(0)
      let length = bubbles.length;
      for(let i = 0; i < length; i ++){
        bubbles[i].p0p(i);
        bubbles[i].display();
        bubbles[i].avoidMouse();
      }
    }

    
    function Bubble(size, x, y, color){
      this.pos = createVector(x, y);
      this.size = size;
      this.color = color;
      this.alpha = 50;
      this.growSpeed = .5;
      this.vel = createVector(0, 0)
    }

    Bubble.prototype.display = function(){
      stroke(100, this.alpha);
      fill(this.color[0],this.color[1],this.color[2], this.alpha);
      ellipse(this.pos.x, this.pos.y, this.size)
    }

    Bubble.prototype.p0p = function (i) {
      if(this.size > maxSize){
        this.alpha --
      }
      if(this.alpha == 0){
        bubbles.splice(i, 1)
        bubbles.push(new Bubble(0, random(width), random(height), someColor()))
      }
      // this.growSpeed += .05
      this.size += this.growSpeed;
    }

    Bubble.prototype.avoidMouse = function() { 
      let mouse = createVector(mouseX, mouseY);
      if(dist(mouse.x, mouse.y, this.pos.x, this.pos.y) < (this.size /2) + 5){
        let acc = p5.Vector.sub(this.pos, mouse);
        acc.normalize()
        acc.mult(5)
        // this.vel.add(acc);
        this.pos.add(acc);
      }
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

  /*************************************************
   * Lissajous
  *************************************************/
  lissajous: function () {
    let particles;
    let particleAmt = 5000;
    let angle;

    function setupThis() {
      background(0)
      angle = 0;
      particles = [];
      for(let i = 0; i < particleAmt; i ++){
        particles.push(new Particle(i))
      }
    }

   
    function drawThis() {
      background(0, 100);
      let length = particles.length;
      angle += 0.01
      for(let i = 0; i < length; i ++) {
        particles[i].display();
        particles[i].move(i);
      }
    }

    function Particle(i) {
      this.x = width/2 + cos(i * 1) * 100;
      this.y = height / 2 + sin(i * 1) * 100;
    }

    Particle.prototype.display = function(){
      stroke(255);
      point(this.x, this.y);
    }

    Particle.prototype.move = function (i) {
      let mouseMapY = Math.floor(map(mouseY, 0, height, 0, 50));
      let mouseMapX = Math.floor(map(mouseX, 0, width, 0, 100));
      this.x = width/2 + cos(i * mouseMapX + angle) * width /4;
      this.y = height / 2 + sin(i * 1) * height /4;
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

  new1: function () {
    let circles;

    
    function setupThis() {
      circles = [];
      let x = 100
      let y = 100
      for(var i = 0; i < 100; i ++){
        circles.push(new Circle(x, y))
        x += 100
        if(x > width -50){
          y += 100;
          x = 100
        }
      }
    }

   
    function drawThis() {
      for(var i =0; i < circles.length; i++) {
       
          // circles[i].move(xMap, yMap)
          circles[i].display()
      }
    }



    function Circle(x, y) {
      this.x = x || width /2;
      this.y = y || height /2;
      this.color = [];
      this.size = 100;
    }

    Circle.prototype.move = function(x, y) {
      this.x = x;
      this.y = y;
    }

    Circle.prototype.display = function() {
      noFill()
      stroke(255)
      ellipse(this.x, this.y, this.size)
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