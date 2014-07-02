var keyCodes = require('../keycodes/keyboard');

var charMap = {
	immutable: "\t ",
	normal: "abcdefghijklmnopqrstuvwxyz1234567890-=[]\\;'`,./",
	shifted: "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:\"~<>?"
}
var codeMap = {
	immutable: [43,44],
	mutable: [
		4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,
		30,31,32,33,34,35,36,37,38,39,
		45,46,47,48,49,50,51,52,53,54,55
	]
};

module.exports = Keyboard;

function Keyboard(isotope) {
	this.isotope = isotope;

	this.updateTimeout = null;

	this.activeKeys = [];
	this.activeModifiers = 0;
	this.temporaryModifiers = 0;
}

Keyboard.prototype = {
	get then() {
		if(this.updateTimeout) {
			clearTimeout(this.updateTimeout);
			this.updateTimeout = null;
		}

		this.isotope.keyboardRaw(this.activeModifiers | this.temporaryModifiers, this.activeKeys);
		this.temporaryModifiers = 0;
		return this;
	},
	get ctrl() {
		this.temporaryModifiers |= keyCodes.modifiers.ctrl;
		return this.queueUpdate();
	},
	get alt() {
		this.temporaryModifiers |= keyCodes.modifiers.alt;
		return this.queueUpdate();
	},
	get shift() {
		this.temporaryModifiers |= keyCodes.modifiers.shift;
		return this.queueUpdate();
	},
	get releaseAll() {
		this.activeKeys = [];
		this.temporaryModifiers = 0;
		this.activeModifiers = 0;
		return this.queueUpdate();
	}
};

Keyboard.prototype.queueUpdate = function() {
	if(!this.updateTimeout)
		this.updateTimeout = setTimeout((function() {
			this.updateTimeout = null;
			this.now();
		}).bind(this), 0);
	return this;
};

Keyboard.prototype.press = function(keys) {
	if(!Array.isArray(keys))
		keys = Array.prototype.slice.call(arguments, 0);
	for(var i = 0; i < keys.length; i++)
		if(!~this.activeKeys.indexOf(keys[i]))
			this.activeKeys.push(keys[i]);
	if(this.activeKeys.length > 6)
		this.activeKeys = this.activeKeys.slice(this.activeKeys.length - 6);

	this.queueUpdate();
	return this;
};

Keyboard.prototype.release = function(keys) {
	if(!Array.isArray(keys))
		keys = Array.prototype.slice.call(arguments, 0);
	for(var i = 0; i < keys.length; i++)
		if(~this.activeKeys.indexOf(keys[i]))
			this.activeKeys.splice(this.activeKeys.indexOf(keys[i]), 1);

	this.queueUpdate();
	return this;
};

Keyboard.prototype.pressModifiers = function(modifiers) {
	if(!Array.isArray(modifiers))
		modifiers = Array.prototype.slice.call(arguments, 0);
	for(var i = 0; i < modifiers.length; i++)
		this.activeModifiers |= modifiers[i];

	this.queueUpdate();
	return this;
};

Keyboard.prototype.releaseModifiers = function(modifiers) {
	if(!Array.isArray(modifiers))
		modifiers = Array.prototype.slice.call(arguments, 0);
	for(var i = 0; i < modifiers.length; i++) {
		var compliment = 0xff ^ modifiers[i];
		this.activeModifiers &= compliment;
	}

	this.queueUpdate();
	return this;
};

Keyboard.prototype.write = function(text) {
	var index, c;
	for(var i = 0; i < text.length; i++) {
		c = text[i];
		if(~(index = charMap.immutable.indexOf(c))) this.isotope.keyboardRaw(0, [codeMap.immutable[index]]);
		else if(~(index = charMap.normal.indexOf(c))) this.isotope.keyboardRaw(0, [codeMap.mutable[index]]);
		else if(~(index = charMap.shifted.indexOf(c))) this.isotope.keyboardRaw(keyCodes.modifiers.shift, [codeMap.mutable[index]]);
		this.isotope.keyboardRaw();
	}
	return this;
};

Keyboard.prototype.now = function() {
	return this.then;
};