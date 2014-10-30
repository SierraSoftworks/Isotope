/**
 * Isotope Node.js Library
 * Provides a Node.js interface between the Isotope emulation chip
 * and the local system, as well as a number of useful command
 * wrappers.
 *
 * Copyright © Benjamin Pannell 2014
 */

var SerialPort = require('serialport').SerialPort,
	EventEmitter = require('events').EventEmitter,
	util = require('util');

var Keyboard = require('./helpers/Keyboard'),
	Mouse = require('./helpers/Mouse');

module.exports = Isotope;

function Isotope(device) {
	this.open = false;
	this.buffer = [];
	this.maxRate = 500;

	this.lastWrite = 0;
	this.writeInterval = null;

	if(typeof device == "string")
		this.uart = new SerialPort(device, {
			baudrate: 115200,
			parity: 'even'
		});
	else this.uart = device;

	this.keyboard = new Keyboard(this);
	this.mouse = new Mouse(this);

	this.uart.on('open', (function() {
		this.open = true;
		if(!this.writeInterval) {
			this.writeInterval = setInterval(this.send.bind(this), 1);
			this.writeInterval.unref();
		}
		this.emit('open');
	}).bind(this));

	this.uart.on('data', (function(data) {
		this.emit('data', data);
	}).bind(this));

	this.uart.on('close', (function() {
		this.emit('close');
		if(this.writeInterval) {
			clearInterval(this.writeInterval);
			this.writeInterval = null;
		}
	}).bind(this));

	this.uart.on('error', (function(err) {
		this.emit('error', err);
	}).bind(this));
}

util.inherits(Isotope, EventEmitter);

Isotope.keyboard = require('./keycodes/keyboard');
Isotope.mouse = require('./keycodes/mouse');

Isotope.prototype.send = function(packet) {
	if(packet) this.buffer.push(packet);
	if(!this.buffer.length) return;
	if(new Date().getTime() - this.lastWrite < 1/this.maxRate) return;
	this.lastWrite = new Date().getTime();
	packet = this.buffer.shift();
	for(var i = 0; i < packet.length; i++)
		if(typeof packet[i] != 'number') {
			this.emit('error', new Error("All packet elements should be numbers, but we were given a '"
				+ (typeof packet[i]) + "' instead."));
			return;
		}
	this.uart.write(packet);
};

Isotope.prototype.mouseRaw = function(buttons, deltaX, deltaY, deltaScroll) {
	var packet = zeros(5), length = 4;
	packet[0] = 0x40;
	packet[1] = 0xff & (buttons || 0);
	packet[2] = 0xff & (deltaX || 0);
	packet[3] = 0xff & (deltaY || 0);
	packet[4] = 0xff & (deltaScroll || 0);

	if(!deltaScroll) {
		length--;
		if(!deltaY) {
			length--;
			if(!deltaX) {
				length--;
				if(!buttons) length--;
			}
		}
	}

	packet[0] |= length;
	this.send(packet.slice(0, length + 1));
};

Isotope.prototype.keyboardRaw = function(modifiers, keys) {
	var packet = zeros(8), length = 0;
	packet[0] = 0x20;
	if(!modifiers && (!keys || keys.length == 0)) return this.send(packet.slice(0, 1));

	if(!Array.isArray(keys)) throw new Error("Keys should be an array");
	if(keys.length > 6) throw new Error("A maximum of 6 keys can be pressed at any time.");

	packet[1] = modifiers & 0xff;
	for(var i = 0; i < keys.length; i++)
		packet[i + 2] = 0xff & (keys[i] || 0);

	packet[0] |= keys.length + 1;
	this.send(packet.slice(0, 2 + keys.length));
};

Isotope.prototype.close = function() {
	this.uart.close();
};

function zeros(n) {
	var o = [];
	for(var i = 0; i < n; i++)
		o.push(0);
	return o;
}