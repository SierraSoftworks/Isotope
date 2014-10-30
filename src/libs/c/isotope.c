/**
 * Isotope C Library
 * Provides a C interface between the Isotope emulation chip
 * and the local system, as well as a number of useful command
 * wrappers.
 *
 * Copyright © Benjamin Pannell 2014
 */
#ifndef ISOTOPE_C
#define ISOTOPE_C

#include "isotope.h"
#include "keylayouts.h"
#include <stdio.h>
#include <string.h>
#include <time.h>

#ifdef RPI
#define ISOTOPE_IO

#include <fcntl.h>
#include <unistd.h>
#include <termios.h>

#else
#define ISOTOPE_FIO

#endif

/*
 * Internal Functions
 */

/**
 * Packs three separate 10-bit axes into a single 32-bit integer space
 * following the protocol specification.
 * Operates using a combination of OR and LEFT SHIFT operations to offset
 * the relevant axes values, ANDs are used as masks to prevent collisions.
 */
int _isotope_pack(short axis1, short axis2, short axis3) {
	return 0x00000000 | ((axis1 & 0x3ff) << 20) | ((axis2 & 0x3ff) << 10) | (axis3 & 0x3ff);
}

clock_t _isotope_lastwrite = 0;
int isotope_maxRate = 500;

/**
 * Implements a blocking rate-limiter which is responsible for delaying execution
 * of a method until a minimum allowable amount of time has elapsed.
 * This is achieved by storing the last method execution time in _isotope_lastwrite
 * and then computing the time delta between the current time and _isotope_lastwrite.
 * The system method clock() is used to allow greater than 1ms resolution, while usleep()
 * allows for shorter than 1s sleeps - helping to increase throughput for high rates.
 */
void _isotope_ratelimit() {
	clock_t now;
	double delay;
	double minDelay;
	
	if(!isotope_maxRate) return;
	
	now = clock();
	delay = (now - _isotope_lastwrite) * 1.0 / CLOCKS_PER_SEC;
	minDelay = 1.0 / isotope_maxRate;
	
	if(delay < minDelay)
		usleep(1e6 * (minDelay - delay));
	_isotope_lastwrite = clock();
}

/*
 * Public API Functions
 */

int isotope_open(const char* device) {
	int uart;

	/*
	 * There are two primary types of IO operation which can be used,
	 *	- stdio.h provides fopen, fwrite, fread and fclose
	 *	- termios.h provides open, write, read and close
	 * Depending on the device type it may be necessary to use one or the
	 * other, *NIX operating systems will generally provide termios.h and
	 * as a result it is the best option for UART based systems. However,
	 * stdio.h can be used to implement automated tests by writing to files
	 * instead of a TTY (serial) connection.
	 * To allow easy switching, the ISOTOPE_FIO and ISOTOPE_IO flags are used
	 * (mutually exclusively) to switch between stdio and termios respectively.
	 * You will see this influence throught all IO functions, however most logic
	 * makes use of abstraction functions like isotope_write and isotope_read which
	 * simplify this.
	 */

	#ifdef ISOTOPE_FIO // f Prefixed IO operations (fopen, fclose etc.)
	uart = (int)fopen(device, "r+");
	if(!uart) return 0;
	#endif

	#ifdef ISOTOPE_IO // Standard IO operations
	uart = open(device, O_RDWR | O_NOCTTY | O_NDELAY);
	if(-1 == uart) return 0;
	#endif

	/*
	 * Raspberry Pi specific UART configuration
	 * Adapted from http://www.raspberry-projects.com/pi/programming-in-c/uart-serial-port/using-the-uart
	 * Specifically, this makes use of termios.h for serial communications rather
	 * than the standard stdio.h libraries, allowing control over baud rate, parity and so on
	 * on *NIX operating systems.
	 */ 

	#ifdef RPI
	struct termios options;

	tcgetattr(uart, &options);
	// Sets the Baud Rate and Byte Length
	options.c_cflag = B115200 | CS8 | CLOCAL;
	 // Enables Even Parity
	options.c_iflag = PARENB;
	options.c_oflag = 0;
	options.c_lflag = 0;
	tcflush(uart, TCIFLUSH);
	tcsetattr(uart, TCSANOW, &options);
	#endif

	return uart;
}

char isotope_close(int handle) {
	#ifdef ISOTOPE_FIO
	return (char)fclose((FILE*)handle);
	#endif
	#ifdef ISOTOPE_IO
	return close(handle);
	#endif
}

char isotope_write(int isotope, const char* packet, char packet_length) {
	_isotope_ratelimit();
		
	#ifdef ISOTOPE_FIO
	return fwrite(packet, sizeof(char), packet_length, (FILE*)isotope);
	#endif
	#ifdef ISOTOPE_IO
	return write(isotope, packet, packet_length);
	#endif
}

int isotope_read(int isotope, char* buffer, int length) {
		#ifdef ISOTOPE_FIO
		return fread(buffer, sizeof(char), length, (FILE*)isotope);
		#endif
		#ifdef ISOTOPE_IO
		return read(isotope, buffer, length);
		#endif
}

char isotope_mouse(int isotope, char buttons, char deltaX, char deltaY, char deltaScroll) {
	char packet[5] = { 0x40 }, length = 4;

	packet[1] = buttons;
	packet[2] = deltaX;
	packet[3] = deltaY;
	packet[4] = deltaScroll;

	// Compress the packet to only send the required data
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

	// Populate the header's length field
	packet[0] |= length;

	return isotope_write(isotope, packet, length + 1);
}

char isotope_keyboard(int isotope, char modifiers, const char keys[], char keys_count) {
	char packet[8] = { 0x20 }, i = 0;
	packet[1] = modifiers;

	if(keys_count > 6) keys_count = 6;
	if(!keys_count && !modifiers) return isotope_write(isotope, packet, 1);

	for(i = 0; i < keys_count; i++) packet[i + 2] = keys[i];
	packet[0] |= keys_count + 1;

	return isotope_write(isotope, packet, keys_count + 2);
}

char isotope_joystick(int isotope, int buttons, short x, short y, short z, short rz, short sliderLeft, short sliderRight, char hat) {
	char packet[14] = { 0x60 | 13 };
	
	// Copy buttons into packet
	*((int*)(packet + 1)) = buttons;

	// Copy X, Y, Z axis pack into packet
	*((int*)(packet + 5)) = _isotope_pack(x, y, z);

	// Copy rZ, sL, sR axis pack into packet
	*((int*)(packet + 9)) = _isotope_pack(rz, sliderLeft, sliderRight);

	// Copy hat switch position into packet
	packet[13] = hat;

	return isotope_write(isotope, packet, 14);
}


const char* _isotope_immutable = "\n\t ";
const char* _isotope_mutable_normal = "abcdefghijklmnopqrstuvwxyz1234567890-=[]\\;'`,./";
const char* _isotope_mutable_shifted = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:\"~<>?";
const char _isotope_map_immutable[] = {40, 43, 44};
const char _isotope_map_mutable[] = {
	4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,
	30,31,32,33,34,35,36,37,38,39,
	45,46,47,48,49,51,52,53,54,55,56
};

int isotope_text(int isotope, const char* text) {
	int written = 0;
	char current, *index;
	char key = 0, modifiers = 0;
	
	while(current = *text++) {
		modifiers = 0;
		key = 0;
		if(index = strchr(_isotope_immutable, current))
			key = _isotope_map_immutable[index - _isotope_immutable];
		else if(index = strchr(_isotope_mutable_normal, current))
			key = _isotope_map_mutable[index - _isotope_mutable_normal];
		else if(index = strchr(_isotope_mutable_shifted, current)) {
			key = _isotope_map_mutable[index - _isotope_mutable_shifted];
			modifiers = MODIFIERKEY_SHIFT;
		} else continue;
		
		
		written += isotope_keyboard(isotope, modifiers, &key, 1);
		written += isotope_keyboard(isotope, 0, 0, 0);
	}
	written += isotope_keyboard(isotope, 0, 0, 0);
	return written;
}

#endif
