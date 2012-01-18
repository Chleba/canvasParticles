Particle = JAK.ClassMaker.makeClass({
	VERSION : '1.0',
	NAME : 'Particle'
});
Particle.prototype.$constructor = function(opt){
	this.opt = {
        angle : 0,
        speed : 0,
		posX : 0,
		posY : 0,
		velX : 0,
		velY : 0,
		size : 0,
		maxSize : 1,
		alpha: 0.2,
		gravity : 1,
		drag : 1,
		shrink : 1,
		fade : 0,
		img : null,
		canvas : null,
        rect : false,
        arc : false,
        sprites : false
	}
	for(var p in opt){
		this.opt[p] = opt[p];
	}
    this.posX = this.opt.posX+numRange(this.opt.velX*-1, this.opt.velX);
    this.posY = this.opt.posY+numRange(this.opt.velY*-1, this.opt.velY);
    if(this.opt.sprites){
        this.sprite = new Sprite(this.opt.canvas, SPRITE.img, SPRITE);
    }
    
    var a = this.posX + this.opt.speed * Math.cos(this.opt.angle);
    var b = this.posY + this.opt.speed * Math.sin(this.opt.angle);

	this.x = a-this.posX;
	this.y = b-this.posY;
};
Particle.prototype.update = function(){
    this.posX += this.x;
    this.posY += this.y;
    
    this.opt.size *= this.opt.shrink;
	if(this.opt.maxSize > 0 && this.opt.size > this.opt.maxSize){
		this.opt.size = this.opt.maxSize;
	}
	this.opt.alpha -= this.opt.fade;
	if(this.opt.alpha < 0){
		this.opt.alpha = 0;
	}
};
Particle.prototype._drawRect = function(){
    var c = this.opt.canvas;
    var sw = 50*this.opt.size;
	var sh = 50*this.opt.size;
    var px = this.posX-(sw*0.5);
    var py = this.posY-(sh*0.5);
    c.fillStyle = '#fff';
    c.fillRect(px, py, sw, sh);
};
Particle.prototype._drawArc = function(){
    var c = this.opt.canvas;
    c.beginPath();
    //c.fillStyle = '#FFF';
    c.strokeStyle = '#fff';
    c.lineWidth = 1;
    c.globalAlpha = this.opt.alpha;
    var sw = 50*this.opt.size;
	var sh = 50*this.opt.size;
    var px = this.posX-(sw*0.5);
    var py = this.posY-(sh*0.5);
    c.arc(px, py, sw, 0, Math.PI*2, true);
    c.stroke();
    //c.fill();
};
Particle.prototype._drawSprites = function(){
    this.sprite.draw({
        x : this.posX,
        y : this.posY
    });
};
Particle.prototype.draw = function(){ 
	var c = this.opt.canvas;
	c.save();
	
    //c.scale(this.size, this.size);
	c.globalAlpha = this.opt.alpha;
    
	var sw = this.opt.img.width*this.opt.size;
	var sh = this.opt.img.height*this.opt.size;
    
    var px = this.posX-(sw*0.5);
    var py = this.posY-(sh*0.5);
    
    if(this.opt.rect === true){ this._drawRect(); }
    else if(this.opt.arc === true){ this._drawArc(); }
    else if(this.opt.sprites === true){ this._drawSprites(); }/*- NEED UTIL.JS -*/
    else {
       c.drawImage(this.opt.img, px, py, sw, sh);
    }
    c.restore();
};

function numRange(min, max){
	return ((Math.random()*(max-min)) + min);
}
