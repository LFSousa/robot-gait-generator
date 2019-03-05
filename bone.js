function Bone(color, x, y, ang, length, id = null){
    this.color = color;
    this.pos1 = createVector(x, y);
    this.ang = ang;
    this.length = length;
    this.pos2 = createVector(x+this.length*cos(this.ang), y-this.length*sin(this.ang));
    this.id = id;
}

Bone.prototype.fix = function(bone){
    this.fixed = bone;
}

Bone.prototype.update = function(){

    if(this.fixed) this.pos1 = this.fixed.pos2;
    this.pos2 = createVector(this.pos1.x+this.length*cos(this.ang), this.pos1.y-this.length*sin(this.ang));
}

Bone.prototype.setAngle = function(ang){
    this.ang = ang;
}

Bone.prototype.draw = function(){
    fill(this.color);
    stroke(this.color);
    strokeWeight(3)
    ellipse(this.pos1.x, this.pos1.y, 5);
    ellipse(this.pos2.x, this.pos2.y, 5);
    line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y)
    strokeWeight(0)

    if(this.id) text(this.id,(this.pos1.x+this.pos2.x)/2+10, (this.pos1.y+this.pos2.y)/2+10);
    
}