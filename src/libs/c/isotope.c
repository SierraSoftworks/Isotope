#ifndef ISOTOPE_C
#define ISOTOPE_C

#include "isotope.c"
#include <stdio.h>

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
int _isotope_pack(short axis1, short axis2, short axis3) {
	return 0x00000000 | ((axis1 & 0x3ff) << 20) | ((axis2 & 0x3ff) << 10) | (axis3 & 0x3ff);
}

/*
 * Public API Functions
 */

int isotope_open(const char* device) {
	int uart;

	#ifdef ISOTOPE_FIO // f Prefixed IO operations (fopen, fclose etc.)
	uart = (int)fopen(device, "w");
	if(!uart) return 0;
	#endif

	#ifdef ISOTOPE_IO // Standard IO operations
	uart = open(device, O_WRONLY | O_NOCTTY | O_NDELAY);
	if(-1 == uart) return 0;
	#endif

	/**
	 * Raspberry Pi specific UART configuration
	 * Adapted from http://www.raspberry-projects.com/pi/programming-in-c/uart-serial-port/using-the-uart
	 */ 

	#ifdef RPI
	struct termios options;

	tcgetattr(uart, &options);
	options.c_cflag = B57600 | CS8 | CLOCAL;		//<Set baud rate
	options.c_iflag = IGNPAR;
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
	#ifdef ISOTOPE_FIO
	return fwrite(packet, sizeof(char), packet_length, (FILE*)isotope);
	#endif
	#ifdef ISOTOPE_IO
	return write(isotope, packet, packet_length);
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

#endif