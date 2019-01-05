let sound;
let devices;
let deviceIndex;
let song;
let isSong = false;
let imagePath = "./images/20181218_111712.jpg";
let maxPal = 512;
let numPal = 0;
let goodColor = [];

let currentSketch = "new1";

let alphaNum = 0;

let sketchArray = Object.keys(sketches);


/*************************************************
 * P5 Functions
 *************************************************/

function preload() {
  if (location.href.indexOf('file') !== -1 || location.href.indexOf('http://127.0.0.1') !== -1) {
    // Load sound instead of using mic
    // song = loadSound('./pieces.mp3');
    // isSong = true;
  }
  img = loadImage(imagePath);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  takeColor(imagePath);
  /* Uncomment all this to use the mic */

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
  sketches[currentSketch].setupThis();
}


function draw() {
  
  /* Uncomment this to use the mic */
  // let vol = amp.getLevel();
  let vol = 0; 
  // Calling sketch specific draw function.
  // Need to scale down volume...
  let volMapped = map(vol, 0, 1, 0, 100);
  sketches[currentSketch].drawThis(volMapped / 4);
  fadeOutz();
}



/*************************************************
 * Other Functions
 *************************************************/

function switchDeviceDom(prevIndex, newIndex) {
  let deviceChildren = document.getElementById('deviceSelect').childNodes;
  deviceChildren[prevIndex].setAttribute('id', '');
  deviceChildren[newIndex].setAttribute('id', 'selectedDevice');
  showDeviceSelect()
}

function showDeviceSelect() {
  let div = document.getElementById('deviceSelectDiv');
  div.className = "showMe";
  setTimeout(function () {
    div.className = 'hideMe';
  }, 1000)
}

function fadeOutz() {
  fill(0, alphaNum);
  rect(0, 0, width, height);
}

function sketchTransitionMidi(velocity){
  let velMapped = map(velocity, 1, 127, 0, 255);
  alphaNum = velMapped;
}

function mouseClicked(){
  sketches[currentSketch].mouseClicked();
};
// USE THESE TWO TO INITIATE A SMOOTH TRANSITION
function sketchTransition() {
  let color;
  let trans = setInterval(function () {
    alphaNum++
    if (alphaNum == 255) {
      switchSketch();
      sketchTransition2(trans);
    }
  }, 10);
}

function sketchTransition2(trans) {
  clearInterval(trans);
  let trans2 = setInterval(function () {
    alphaNum--
    if (alphaNum == 0) {
      clearInterval(trans2);
    }
  }, 10)
}

function switchSketch() {
  let nextPos = sketchArray.indexOf(currentSketch) + 1;
  if (nextPos < sketchArray.length){
    currentSketch = sketchArray[nextPos];
  } else {
    currentSketch = sketchArray[0];
  }
  sketches[currentSketch].setupThis();
}

function devicesToDom(devices) {
  let div = document.getElementById('deviceSelectDiv');
  let ul = document.createElement('ul');
  ul.setAttribute('id', 'deviceSelect');
  for (let i = 0; i < devices.length; i++) {
    let li = document.createElement('li');
    let text = document.createTextNode('Device: ' + devices[i].deviceId);
    li.appendChild(text);
    ul.appendChild(li);
  }
  ul.childNodes[deviceIndex].setAttribute('id', 'selectedDevice');
  div.appendChild(ul);
}


(function sketchesToDom(){
  console.log(sketchArray)
  let ul = document.getElementById('sketchSelectDiv');
  for(let i = 0; i < sketchArray.lenth; i++){
    let li = document.createElement('li');
    let text = document.createTextNode('Sketch:' + sketchArray[i])
    li.setAttribute('id', sketchArray[i]);
    li.appendChild(text)
    ul.appendChild(li)  
  }
})();

/*************************************************
 * Colors
 *************************************************/

function someColor() {
  // pick some random good color
  return goodColor[int(random(numPal))];
}

function getPixel(context, x, y) {
  return context.getImageData(x, y, 1, 1).data;
}

function takeColor(path) {
  let canvas = document.getElementById('defaultCanvas0');
  let context = canvas.getContext('2d');
  image(img,0,0);
  for (let x = 0; x < img.width; x+=10) {
    for (let y = 0; y < img.height; y+=10) {
      let c = getPixel(context, x, y);
      let exists = false;
      for (let n = 0; n < numPal; n++) {
        if (c == goodColor[n]) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        // add color to pal
        if (numPal < maxPal) {
          goodColor[numPal] = c;
          numPal++;
        } else {
          break;
        }
      }
      if (random(10000) < 100) {
        if (numPal < maxPal) {
          // pump black or white into palette
          if (random(100) < 50) {
            goodColor[numPal] = '#FFFFFF';
            print("w");
          } else {
            goodColor[numPal] = '#000000';
            print("b");
          }
          numPal++;
        }
      }
    }
  }
}

/*************************************************
 * Dom Listeners
 *************************************************/

document.addEventListener('keydown', function (event) {
  let prevIndex = deviceIndex;

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
  } else if(event.keyCode == 32){
    switchSketch();
  }
})


/*************************************************
 * MIDI Stuff
 *************************************************/

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
  for (let input of midiAccess.inputs.values()) {
    input.onmidimessage = getMIDIMessage;
  }
}

function getMIDIMessage(midiMessage) {
  let command = midiMessage.data[0];
  let note = midiMessage.data[1];
  let velocity = (midiMessage.data.length > 2) ? midiMessage.data[2] : 0;
  console.log(note, velocity, command)
  if(velocity > 0){
    switch(note){
      case 1:
      switchSketch();
      break;
      case 10:
      sketchTransitionMidi(velocity)
      break;
      default:
      sketches[currentSketch].onMidiNote(note, velocity);
    } 
  }
}

function onMIDIFailure() {
  console.log('Could not access your MIDI devices.');
}