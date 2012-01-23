
cUtil = JAK.ClassMaker.makeClass({
	NAME : 'JSDungeon.cUtil',
	VERSION : '1.0'
});

cUtil.prototype.$constructor = function(canvas, opt){
	this.canvas = canvas;
	this.color = '#666';
	this.Lopt = {
	    lwidth : 1,
	    part : 5,
	    color : '#0000cc',
	    lastDist : 10
	};
	for(i in opt){
	    this.Lopt[i] = opt[i];
	}
};

cUtil.prototype.randRange = function(min, max){
	var rand = (Math.floor(Math.random() * (min-max+1))+min)*-1;
	//var rand = Math.floor(Math.random() * (max - min + 1) + min)
	return rand;
};

cUtil.prototype.makeLine = function(f, t){
	this.canvas.save();
	this.canvas.beginPath();
	this.canvas.moveTo(f.x, f.y);
	this.canvas.lineTo(t.x, t.y);
	this.canvas.stroke();
	this.canvas.closePath();
	this.canvas.restore();
};

cUtil.prototype.makeLight = function(f, t){
	this.canvas.save();
	this.canvas.beginPath();
	this.canvas.strokeStyle = this.Lopt.color;
	this.canvas.lineWidth = 2;
	this.canvas.moveTo(f.x, f.y);
	/*- pocatek -*/
	var tx = t.x-f.x;
	var ty = t.y-f.y;
	var ta = Math.atan2(ty, tx);
	var dist = Math.sqrt(((f.x-t.x)*(f.x-t.x))+((f.y-t.y)*(f.y-t.y)));
	var trans = 0;
	var partx = f.x;
	var party = f.y;
	var tn = ta;
	var i = 0;
	while( trans < dist ){
		var ra = Math.random();
	    ra = ra < 0.5 ? ra*-1 : ra;
		tn = Math.atan2((t.y-party), (t.x-partx));
	    partx = partx + this.Lopt.part * Math.cos(tn);
		party = party + this.Lopt.part * Math.sin(tn);
	    if(ra < 0.8){
	        tn = ta + ra;
	        partx = partx + this.Lopt.part * Math.cos(tn);
			party = party + this.Lopt.part * Math.sin(tn);
	    }
		lineDist = Math.sqrt(((partx-t.x)*(partx-t.x))+((party-t.y)*(party-t.y)));
		trans = dist - lineDist;
	    this.canvas.lineTo(partx, party);
		this.canvas.moveTo(partx, party);
		this.canvas.stroke();
		if(lineDist < this.Lopt.lastDist){ this.makeLine({ x : partx, y : party}, t); return; }
	}
	this.canvas.stroke();
	this.canvas.closePath();
	this.canvas.restore();
};

cUtil.prototype.makeCircleLight = function(f, r){
	var a = 0;
	var tx = 0;
	var ty = 0;
	do{
		tx = f.x + r * Math.cos(a);
		ty = f.y + r * Math.sin(a);
		this.makeLight(f, {x:tx, y:ty});
		a += (Math.PI*6/100);
	} while( a <= 6.1 );
};

/**
 * sprite animation
 */
Sprite = JAK.ClassMaker.makeClass({
	NAME : 'Sprite',
	VERSION : '1.0'
});

Sprite.prototype.$constructor = function(canvas, img, opt){
	this.opt = opt || {};
    this.canvas = canvas;
	this.img = img;
    this.start = this.opt.start;
	this.interval = this.opt.interval;
	this.step = this.interval/this.opt.steps;
	this.stepw = this.opt.step;
	this.direction = RPG.S;
	//this.timekeeper = JAK.Timekeeper.getInstance();
	//this.tick = this.timekeeper.addListener(this, 'draw', 2);
};

Sprite.prototype.draw = function(pos){
    var sy = this.opt[this.direction].top; /* vyskovy zacatek */
	var height = this.opt[this.direction].height; /* vyska vyrezu */

	var delta = new Date().getTime() - this.start; /* jak dlouho uz bezi animace */
	var index = Math.floor(delta / this.interval) % 3;
	var sx = index*this.step; /* sirkovy zacatek zleva */
    if(this.img){
	   this.canvas.drawImage(this.img, sx, sy, this.stepw, height, pos.x, pos.y, this.stepw, height);
    }
    /*-
	var dt = new Date().getTime();
	if(this.time > dt){
	    var sy = this.opt[this.direction].top;
        console.log(this.opt);
	    var height = this.opt[this.direction].height;
	    this.canvas.clearRect(0, 0, 1500, 1000);
	    var fl = this.interval - (this.time-dt);
	    var step = Math.floor(fl/this.step);
	    this.canvas.drawImage(this.img, step*this.stepw, sy, this.stepw, height, pos.x, pos.y, this.stepw, height);
	} else {
	    this.time = dt+this.interval;
	}-*/
};

var Tail = JAK.ClassMaker.makeClass({
	NAME : 'Tail',
	VERSION : '1.0'
});
Tail.prototype.$constructor = function(canvas, img){
	this.ec = [];
	this.img = img;
	this.canvas = JAK.gel(canvas).getContext('2d');
	this.ec.push( JAK.Events.addListener(window, 'mousemove', this, 'tail') );
	this.coords = { x : 0, y : 0 };
	this.particles = [];
	//this.timekeeper = JAK.Timekeeper.getInstance();
	//this.timekeeper.addListener(this, 'draw', 2);
};
Tail.prototype.tail = function(e, elm){
	var coords = { x : e.clientX, y : e.clientY };
	var particle = new Particle({
		posX : coords.x,
		posY : coords.y,
		alpha : 1,
		startSize : 1.2,
		shrink : 0.96,
		img : this.img,
		gravity : -1,
		life : 2000,
		//rect : true,
		//arc : true,
		canvas : this.canvas
	});
	this.particles.push(particle);
};
Tail.prototype.draw = function(){
	//this.canvas.clearRect(0, 0, 1500, 1000);
	for(var i=0;i<this.particles.length;i++){
		if(this.particles[i].opt == null){
			this.particles.splice(i, 1);
		} else {
			this.particles[i].draw();
			this.particles[i].update();
		}
	}
};
