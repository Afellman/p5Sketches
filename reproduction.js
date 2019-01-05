let walkers = {};
let walkerAmt = 100;
let scale = 10;
let pixelOccupiedX = {};
let pixelOccupiedY = {};
let reproductionRate = .60;

function setupThis() {
    for (let i = 1; i < walkerAmt +1; i++) {
        var rand = Math.round(Math.random() * 999999999);
        walkers[rand] = new Walker(rand);
    }
    background(0);
}

function drawThis() {
    background(0)
    for (let i in walkers) {
    walkers[i].display();
    walkers[i].step();
    if(walkers[i]) {
        walkers[i].preventOffScreen();
    }
    fill(255)
    textSize(25)
    text(walkerAmt, 10, 50);
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
