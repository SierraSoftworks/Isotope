/**
 * Mouse Emulation using Isotope
 * This is a quick demonstration program which shows how Isotope can be
 * used to emulate a mouse, each time it is run it will move your mouse
 * cursor 10 pixels up, and 10 pixels right.
 *
 * IMPORTANT
 * Ensure that you are using the RPi build of the isotope library or
 * you may encounter issues with the UART not being configured correctly.
 * 
 * Object Linking
 * > gcc -o mouse ../build/libs/c/rpi/isotope.o mouse.c
 * Static Linking
 * > gcc -static -L../build/libs/c/rpi/ -lisotope -o mouse mouse.c
 * Dynamic Linking
 * > gcc -L../build/libs/c/rpi/ -lisotope -o mouse mouse.c
 */

#include "../src/libs/c/keylayouts.h"
#include "../src/libs/c/isotope.h"
#include <stdio.h>

int main() {
	int isotope;

	isotope = isotope_open("/dev/ttyAMA0");
	if(!isotope) return 1;

	// Move the mouse cursor
	isotope_mouse(isotope, 0, 10, 10, 0);

	isotope_close(isotope);

	return 0;
}
