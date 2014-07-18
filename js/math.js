var Complex = function(rl, im) {
    this.rl = rl;
    this.im = im;
}

Complex.prototype.add = function(other) {
    return new Complex(this.rl + other.rl, this.im + other.im);
}

Complex.prototype.mul = function(other) {
    return new Complex(this.rl * other.rl - this.im * other.im, this.rl * other.im + this.im * other.rl);
}

Complex.prototype.ladd = function(other) {
    this.rl += other.rl;
    this.im += other.im;
    return this;
}

Complex.prototype.lmul = function(other) {
    var rl = this.rl * other.rl - this.im * other.im;
    var im = this.rl * other.im + this.im * other.rl;

    this.rl = rl;
    this.im = im;
    return this;
}

Complex.prototype.absSquare = function() {
    return this.rl * this.rl + this.im * this.im;
}

Complex.prototype.abs = function() {
    return Math.sqrt(this.absSquare());
}
