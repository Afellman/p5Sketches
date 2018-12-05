var sound;
var fft;
var devices;
var deviceIndex;
var song;
var isSong = false;

var currentSketch = "walker";
var alphaNum = 0;

var sketchArray = ["rings", "walker", "lines"];


/*************************************************
 * P5 Functions
 *************************************************/

// function preload() {
//   if (location.href.indexOf('file') !== -1 || location.href.indexOf('http://127.0.0.1') !== -1) {
//     // Load sound instead of using mic
//     song = loadSound('./pieces.mp3');
//     isSong = true;
//   }
// }

function setup() {
  createCanvas(windowWidth, windowHeight);
  // sound = new p5.AudioIn();
  // amp = new p5.Amplitude();

  // sound.getSources(function (deviceList) {
  //   //print out the array of available sources
  //   console.log('Devices available: ', deviceList);
  //   devices = deviceList;
  //   deviceIndex = 0
  //   //set the source to the first item in the deviceList array
  //   console.log(song, isSong)
  //   sound.setSource(deviceIndex);

  //   sound.amp(1);
  //   sound.start();
  //   // setting the input to the fft object.
  //   if (isSong) {
  //     song.loop();
  //     amp.setInput(song)
  //   } else {
  //     amp.setInput(sound);
  //   }

  //   devicesToDom(devices);

  //   showDeviceSelect();
  // });
  background(0);
  // Switching to first sketch to initialize 
  switchSketch();
}


function draw() {
  // var vol = amp.getLevel();
  var vol = 0;
  // Calling sketch specific draw function.
  // Need to scale down volume...
  var volMapped = map(vol, 0, 1, 0, 100);
  sketches[currentSketch].draw(volMapped / 4);
  fadeOutz();
}



/*************************************************
 * Other Functions
 *************************************************/

function switchDeviceDom(prevIndex, newIndex) {
  var deviceChildren = document.getElementById('deviceSelect').childNodes;
  deviceChildren[prevIndex].setAttribute('id', '');
  deviceChildren[newIndex].setAttribute('id', 'selectedDevice');
  showDeviceSelect()
}

function showDeviceSelect() {
  var div = document.getElementById('deviceSelectDiv');
  div.className = "showMe";
  setTimeout(function () {
    div.className = 'hideMe';
  }, 1000)
}

function fadeOutz() {
  fill(0, alphaNum);
  rect(0, 0, width, height)
}

function sketchTransition(velocity){
  var velMapped = map(velocity, 1, 127, 0, 255);
  alphaNum = velMapped;
}

// USE THESE TWO TO INITIATE A SMOOTH TRANSITION
// function sketchTransition() {
//   var color;
//   var trans = setInterval(function () {
//     alphaNum++
//     if (alphaNum == 255) {
//       switchSketch();
//       sketchTransition2(trans);
//     }
//   }, 10);
// }

// function sketchTransition2(trans) {
//   clearInterval(trans);
//   var trans2 = setInterval(function () {
//     alphaNum--
//     if (alphaNum == 0) {
//       clearInterval(trans2);
//     }
//   }, 10)
// }

function switchSketch() {
  var nextPos = sketchArray.indexOf(currentSketch) + 1;
  if (nextPos < sketchArray.length){
    currentSketch = sketchArray[nextPos];
  } else {
    currentSketch = sketchArray[0];
  }
  sketches[currentSketch].setup();
}

function devicesToDom(devices) {
  var div = document.getElementById('deviceSelectDiv');
  var ul = document.createElement('ul');
  ul.setAttribute('id', 'deviceSelect');
  for (var i = 0; i < devices.length; i++) {
    var li = document.createElement('li');
    var text = document.createTextNode('Device: ' + devices[i].deviceId);
    li.appendChild(text);
    ul.appendChild(li);
  }
  ul.childNodes[deviceIndex].setAttribute('id', 'selectedDevice');
  div.appendChild(ul);
}


/*************************************************
 * Dom Listeners
 *************************************************/

document.addEventListener('keydown', function (event) {
  var prevIndex = deviceIndex;

  // Switch to next device on "T" Keypress
  if (event.keyCode == 84) {
    deviceIndex = deviceIndex + 1;
    if (deviceIndex >= devices.length) {
      deviceIndex = 0;
    }
    sound.setSource(deviceIndex);
    switchDeviceDom(prevIndex, deviceIndex);

    // Start transition on "Enter" key press
  } else if (event.keyCode == 13) {
    sketchTransition();
  }
})

document.addEventListener('keydown', function(event){
   if(event.keyCode == 32){
     switchSketch();
   }
})

/*************************************************
 * MIDI Stuff
 *************************************************/

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
  for (var input of midiAccess.inputs.values()) {
    input.onmidimessage = getMIDIMessage;
  }
}

function getMIDIMessage(midiMessage) {
  var command = midiMessage.data[0];
  var note = midiMessage.data[1];
  var velocity = (midiMessage.data.length > 2) ? midiMessage.data[2] : 0;
  console.log(note, velocity, command)
  switch(note){
    case 40:
      switchSketch();
      break;
    case 8:
      sketchTransition(velocity)
      break;
    default:
      sketches[currentSketch].onMidiNote(note, velocity);
  } 
}

function onMIDIFailure() {
  console.log('Could not access your MIDI devices.');
}