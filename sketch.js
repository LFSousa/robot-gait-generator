let b = 80*4, c = 35*4;
let A = 130, B = 40, C = 0, O = -80;
let h = 150, min = 10, max = 450;
let socket;
let legs = [];
function setup(){
    angleMode(DEGREES)
    createCanvas(window.innerWidth, window.innerHeight);

    socket = io('http://192.168.0.31:5050');
    // legs[0] = new Leg((servo, pos) => socket.emit("servo", [servo,90]), 255, 1, 0, width/2-300);
    // legs[1] = new Leg((servo, pos) => socket.emit("servo", [servo,90]), 150, 3, 2, width/2-300);
    // legs[2] = new Leg((servo, pos) => socket.emit("servo", [servo,90]), 255, 6, 7, width/2+300);
    // legs[3] = new Leg((servo, pos) => socket.emit("servo", [servo,pos]), 150, 4, 5, width/2+300);
    legs[0] = new Leg((servo, pos) => socket.emit("servo", [servo,pos]), 255, 1, 0, width/2-300);
    legs[1] = new Leg((servo, pos) => socket.emit("servo", [servo,180-pos]), 150, 3, 2, width/2-300);
    legs[2] = new Leg((servo, pos) => socket.emit("servo", [servo,180-pos]), 255, 6, 7, width/2+300);
    legs[3] = new Leg((servo, pos) => socket.emit("servo", [servo,pos+(servo==5?0:20)]), 150, 4, 5, width/2+300);
}

var steps = [];
let speed = 15;

for(i = 0; i < 4; i++){
    steps[i] = {
        actual: 0,
        mult: 1,
        get step(){
            if(this.actual < 180) {
                this.actual += speed/this.mult;
            } else {
                this.actual += speed;
            }
            if(this.actual > 360) this.actual = 0;
            return this.actual;
        },
        set step(s){
            this.actual = s;
        }
    }
}

let gaitTypes = {
    'run': [3, 0, 230, 50, 280],
    'amble': [1, 0, 180, 40, 220],
    'walk': [1, 0, 160, 80, 240],
    'pace': [3, 0, 180, 0, 180],
    'trot': [1.7, 0, 180, 180, 0],
    'canter': [3, 0, 180, 0, 50]
}

let gaitType = 'trot';

let legSpeeds = [6, 6, 6, 6];

for(i=0;i<4;i++)steps[i].mult = gaitTypes[gaitType][0], steps[i].step = gaitTypes[gaitType][i+1];

let he = 60;
function makeEllipseGait(step, id){
    var r = 50;
    let px = legSpeeds[id]*r*cos(step) + 2.5*r*cos(step+140);
    let py = height/2+ he+r + r*sin(step) + 0.5*r*sin(step);
    return [px + (id < 2? 100 : -100), py];
}

function draw(){
    
    background(50);
    for(i = legs.length-1; i >= 0; i--){
        legs[i].draw(...makeEllipseGait(steps[i].step, i));
    }

    legs.forEach(leg => leg.emitSocket());
}

