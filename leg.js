
function Leg(emit, color, M1ID, M2ID, centerX){
    this.center = createVector(centerX, height/2-h);
    this.points = [];
    this.M1 = 0;
    this.M2 = 0;
    this.lM1 = 0;
    this.lM2 = 0;
    this.emit = emit;
    this.color = color;
    this.M1ID = M1ID;
    this.M2ID = M2ID;
    this.centerX = centerX;
}

Leg.prototype.draw = function(px, py){
    this.point = createVector(this.centerX - px, py);
    let aVec = this.point.sub(this.center).limit(max);
    this.O = -aVec.heading();
    this.a = aVec.mag();
    this.bones = [];

    if (this.a < min) this.a = min;
    if(b > this.a) {
        B = acos((this.a*this.a + c*c - b*b) / (2*this.a*c));
        A = asin( this.a/b * sin(B) );
        C = asin( c/b * sin(B) );
    } else {
        A = acos((b*b + c*c - this.a*this.a) / (2*b*c));
        B = asin( b/this.a * sin(A) );
        C = asin( c/b * sin(B) );
    }

    //Normalizing
    this.M1 = round(-B+this.O+180+90);

    this.bones[0] = new Bone(this.color, this.centerX, height/2-h, -B + this.O, c);
    this.bones[1] = new Bone(this.color, this.centerX, height/2-h, - A + 180 -B + this.O, b);
    this.bones[2] = new Bone(this.color, this.centerX, height/2-h, B + this.O, c);
    this.bones[3] = new Bone(this.color, this.centerX, height/2-h, A + 180 +B + this.O, b);

    //Normalizing
    this.M2 = round(-this.bones[3].ang+90);

    this.bones[0].draw();
    this.bones[1].fix(this.bones[0]);
    this.bones[1].update();
    this.bones[1].draw();
    this.bones[2].draw();
    this.bones[3].fix(this.bones[2]);
    this.bones[3].update();
    this.bones[3].draw();
    this.points.push(this.bones[1].pos2);

    noFill();
    stroke(255);
    strokeWeight(1);

    for(let i=2;i<this.points.length-1;i++) {
        line(this.points[i-1].x, this.points[i-1].y, this.points[i].x,this.points[i].y)
    }
    if(this.points.length > 150) {
        this.points = this.points.slice(Math.max(this.points.length - 150, 1));
    }
}

Leg.prototype.drawLimits = function() {
    
    ellipse(this.centerX, height/2-h, min*2, min*2);
    ellipse(this.centerX, height/2-h, max*2, max*2);
}

Leg.prototype.emitSocket = function() {

    if(this.M1 != this.lM1){
        this.emit(this.M1ID, this.M1);
        this.lM1 = this.M1;
    }
    if(this.M2 != this.lM2){
        this.emit(this.M2ID, this.M2);
        this.lM2 = this.M2;
    }
}