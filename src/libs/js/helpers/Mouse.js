var mouse = require('../keycodes/mouse');

module.exports = Mouse;

function Mouse(isotope) {
	this.isotope = isotope;

	this.buttons = 0;
	this.deltaX = 0;
	this.deltaY = 0;
	this.deltaScroll = 0;

	this.updateTimeout = null;
}

Mouse.prototype.queueUpdate = function() {
	if(!this.updateTimeout)
		this.updateTimeout = setTimeout((function() {
			this.updateTimeout = null;
			this.now();
		}).bind(this), 0);
};

Mouse.prototype.now = Mouse.prototype.then = function() {
	if(this.updateTimeout) {
		clearTimeout(this.updateTimeout);
		this.updateTimeout = null;
	}

	this.isotope.mouseRaw(this.buttons | this.tempButtons, this.deltaX, this.deltaY, this.deltaScroll);
	this.tempButtons = 0;
	this.deltaX = 0;
	this.deltaY = 0;
	this.deltaScroll = 0;
	this.updateTimeout = null;

	return this;
};

Mouse.prototype.press = function(buttons) {
	if(!Array.isArray(buttons))
		buttons = Array.prototype.slice.call(arguments, 0);
	for(var i = 0; i < buttons.length; i++)
		this.buttons |= buttons[i];

	this.queueUpdate();
	return this;
};

Mouse.prototype.release = function(buttons) {
	if(!Array.isArray(buttons))
		buttons = Array.prototype.slice.call(arguments, 0);
	for(var i = 0; i < buttons.length; i++) {
		var compliment = 0xff ^ buttons[i];
		this.buttons &= compliment;
	}

	this.queueUpdate();
	return this;
};

Mouse.prototype.left = function() {
	this.tempButtons |= mouse.left;
	this.queueUpdate();
	return this;
};

Mouse.prototype.right = function() {
	this.tempButtons |= mouse.right;
	this.queueUpdate();
	return this;
};

Mouse.prototype.middle = function() {
	this.tempButtons |= mouse.middle;
	this.queueUpdate();
	return this;
};

Mouse.prototype.scroll = function(delta) {
	this.deltaScroll += delta;
	this.queueUpdate();
	return this;
};

Mouse.prototype.move = function(deltaX, deltaY) {
	this.deltaX += deltaX;
	this.deltaY += deltaY;
	this.queueUpdate();
	return this;
};