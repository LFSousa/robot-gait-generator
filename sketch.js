let b = 80*4, c = 35*4;
let A = 130, B = 40, C = 0, O = -80;
let h = 150, min = 10, max = 450;
let socket;
let legs = [];
function setup(){
    angleMode(DEGREES)
    createCanvas(window.innerWidth, window.innerHeight);

    socket = io('http://192.168.0.31:5050');
    legs[0] = new Leg((servo, pos) => socket.emit("servo", [servo,pos]), 255, 0, 1, width/2-300);
    legs[1] = new Leg((servo, pos) => socket.emit("servo", [servo,210-pos]), 150, 2, 3, width/2-300);
    legs[2] = new Leg((servo, pos) => socket.emit("servo", [servo,pos]), 255, 5, 4, width/2+300);
    legs[3] = new Leg((servo, pos) => socket.emit("servo", [servo,210-pos]), 150, 7, 6, width/2+300);
}

var steps = [];
let speed = 10;

for(i = 0; i < 4; i++){
    steps[i] = {
        actual: 0,
        get step(){
            if(this.actual < 180) {
                this.actual += speed/2;
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
    'run': [0, 230, 50, 280],
    'walk': [0, 160, 50, 210]
}

let gaitType = 'run';

for(i=0;i<4;i++) steps[i].step = gaitTypes[gaitType][i];

let he = 60;
function makeEllipseGait(step){
    var r = 50;
    let px = 6*r*cos(step) + 2.5*r*cos(step+140);
    let py = height/2+ he+r + r*sin(step) + 0.5*r*sin(step);
    return [px, py];
}

function draw(){
    
    background(50);
    for(i = 3; i >= 0; i--)
        legs[i].draw(...makeEllipseGait(steps[i].step));

    legs.forEach(leg => leg.emitSocket());
}

