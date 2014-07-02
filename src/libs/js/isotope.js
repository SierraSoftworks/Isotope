var SerialPort = require('serialport').SerialPort,
	EventEmitter = require('events').EventEmitter,
	util = require('util');

var Keyboard = require('./helpers/Keyboard');

module.exports = Isotope;

function Isotope(device) {
	if(typeof device == "string")
		this.uart = new SerialPort(device, {
			baudrate: 115200,
			parity: 'even'
		});
	else this.uart = device;

	this.keyboard = new Keyboard(this);

	this.uart.on('open', (function() {
		this.emit('open');
	}).bind(this));

	this.uart.on('data', (function(data) {
		this.emit('data', data);
	}).bind(this));

	this.uart.on('close', (function() {
		this.emit('close');
	}).bind(this));

	this.uart.on('error', (function(err) {
		this.emit('error', err);
	}).bind(this));
}

util.inherits(Isotope, EventEmitter);

Isotope.keyboard = require('./keycodes/keyboard');
Isotope.mouse = require('./keycodes/mouse');

Isotope.prototype.send = function(packet) {
	var hex = packet.map(function(x) { return x.toString(16); });
	console.log('Sent: %s', hex);
	this.uart.write(packet);
};

Isotope.prototype.mouseRaw = function(buttons, deltaX, deltaY, deltaScroll) {
	var packet = new Buffer(5), length = 4;
	packet[0] = 0x40;
	packet[1] = buttons;
	packet[2] = deltaX;
	packet[3] = deltaY;
	packet[4] = deltaScroll;

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
	var packet = new Buffer(8), length = 0;
	packet[0] = 0x20;
	if(!modifiers && (!keys || keys.length == 0)) return this.uart.write(packet);

	if(!Array.isArray(keys)) throw new Error("Keys should be an array");
	if(keys.length > 6) throw new Error("A maximum of 6 keys can be pressed at any time.");

	packet[1] = modifiers;
	for(var i = 0; i < keys.length; i++)
		packet[i + 2] = keys[i];

	this.send(packet.slice(0, 2 + keys.length));
};