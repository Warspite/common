function Transform() {
	this.reset();
}

Transform.prototype.reset = function() {
	this.m = [ 1, 0, 0, 1, 0, 0 ];
};

Transform.prototype.clone = function() {
	var t = new Transform();
	t.m = [ this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5] ];
	return t;
};

Transform.prototype.cloneInvert = function() {
	var inv = this.clone();
	inv.invert();
	return inv;
};

Transform.prototype.multiply = function(matrix) {
	var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
	var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

	var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
	var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

	var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
	var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

	this.m[0] = m11;
	this.m[1] = m12;
	this.m[2] = m21;
	this.m[3] = m22;
	this.m[4] = dx;
	this.m[5] = dy;
};

Transform.prototype.invert = function() {
	var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
	var m0 = this.m[3] * d;
	var m1 = -this.m[1] * d;
	var m2 = -this.m[2] * d;
	var m3 = this.m[0] * d;
	var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
	var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
	this.m[0] = m0;
	this.m[1] = m1;
	this.m[2] = m2;
	this.m[3] = m3;
	this.m[4] = m4;
	this.m[5] = m5;
};

Transform.prototype.rotate = function(rad) {
	var c = Math.cos(rad);
	var s = Math.sin(rad);
	var m11 = this.m[0] * c + this.m[2] * s;
	var m12 = this.m[1] * c + this.m[3] * s;
	var m21 = this.m[0] * -s + this.m[2] * c;
	var m22 = this.m[1] * -s + this.m[3] * c;
	this.m[0] = m11;
	this.m[1] = m12;
	this.m[2] = m21;
	this.m[3] = m22;
};

Transform.prototype.translate = function(x, y) {
	this.m[4] += this.m[0] * x + this.m[2] * y;
	this.m[5] += this.m[1] * x + this.m[3] * y;
};

Transform.prototype.scale = function(sx, sy) {
	this.m[0] *= sx;
	this.m[1] *= sx;
	this.m[2] *= sy;
	this.m[3] *= sy;
};

Transform.prototype.transformPoint = function(p) {
	return { 
		x: p.x * this.m[0] + p.y * this.m[2] + this.m[4],
		y: p.x * this.m[1] + p.y * this.m[3] + this.m[5]
	};
};