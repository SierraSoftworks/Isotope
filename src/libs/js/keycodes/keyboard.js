/**
 * Isotope Node.js Library
 * Provides a Node.js interface between the Isotope emulation chip
 * and the local system, as well as a number of useful command
 * wrappers.
 *
 * Copyright © Benjamin Pannell 2014
 */

module.exports = {
	modifiers: {
		ctrl: 0x01,
		shift: 0x02,
		alt: 0x04,
		gui: 0x08,
		win: 0x08,
		lctrl: 0x01,
		rctrl: 0x10,
		lshift: 0x02,
		rshift: 0x20,
		lalt: 0x04,
		ralt: 0x40,
		lgui: 0x08,
		rgui: 0x80
	},
	keys: {
		a: 4,
		b: 5,
		c: 6,
		d: 7,
		e: 8,
		f: 9,
		g: 10,
		h: 11,
		i: 12,
		j: 13,
		k: 14,
		l: 15,
		m: 16,
		n: 17,
		o: 18,
		p: 19,
		q: 20,
		r: 21,
		s: 22,
		t: 23,
		u: 24,
		v: 25,
		w: 26,
		x: 27,
		y: 28,
		z: 29,
		'1': 30,
		'2': 31,
		'3': 32,
		'4': 33,
		'5': 34,
		'6': 35,
		'7': 36,
		'8': 37,
		'9': 38,
		'0': 39,
		enter: 40,
		esc: 41,
		backspace: 42,
		tab: 43,
		space: 44,
		minus: 45,
		equals: 46,
		lbrace: 47,
		rbrace: 48,
		backslash: 49,
		semicolon: 51,
		quote: 52,
		tilde: 53,
		comma: 54,
		period: 55,
		slash: 56,
		capslock: 57,
		f1: 58,
		f2: 59,
		f3: 60,
		f4: 61,
		f5: 62,
		f6: 63,
		f7: 64,
		f8: 65,
		f9: 66,
		f10: 67,
		f11: 68,
		f12: 69,
		printscreen: 70,
		scrolllock: 71,
		pause: 72,
		insert: 73,
		home: 74,
		pgup: 75,
		delete: 76,
		end: 77,
		pgdown: 78,
		right: 79,
		left: 80,
		down: 81,
		up: 82,
		numlock: 83,
		menu: 101,
		f13: 104,
		f14: 105,
		f15: 106,
		f16: 107,
		f17: 108,
		f18: 109,
		f19: 110,
		f20: 111,
		f21: 112,
		f22: 113,
		f23: 114,
		f24: 115
	},
	numpad: {
		lock: 83,
		slash: 84,
		asterisk: 85,
		star: 85,
		minus: 86,
		plus: 87,
		enter: 88,
		'1': 89,
		'2': 90,
		'3': 91,
		'4': 92,
		'5': 93,
		'6': 94,
		'7': 95,
		'8': 96,
		'9': 97,
		'0': 98,
		period: 99
	}
}