/**
 * Isotope Node.js Library
 * Provides a Node.js interface between the Isotope emulation chip
 * and the local system, as well as a number of useful command
 * wrappers.
 *
 * Copyright © Benjamin Pannell 2014
 */

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

Mouse.prototype = {
	get then() {
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
	},
	get left() {
		this.tempButtons |= mouse.left;
		return this.queueUpdate();
	},
	get right() {
		this.tempButtons |= mouse.right;
		return this.queueUpdate();
	},
	get middle() {
		this.tempButtons |= mouse.middle;
		return this.queueUpdate();
	}
};

Mouse.prototype.queueUpdate = function() {
	if(!this.updateTimeout)
		this.updateTimeout = process.nextTick((function() {
			this.updateTimeout = null;
			this.now();
		}).bind(this));
	return this;
};

Mouse.prototype.now = function() {
	return this.then;
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