/**
 * Alphabet Example using Isotope
 * This is a quick demonstration program showing how Isotope can be used
 * to quickly and easily emulate the pressing the key combination necessary
 * to type the alphabet a number of times.
 *
 * IMPORTANT
 * Ensure that you are using the RPi build of the isotope library or
 * you may encounter issues with the UART not being configured correctly.
 * 
 * Object Linking
 * > gcc -o alphabet ../build/libs/c/rpi/isotope.o alphabet.c
 * Static Linking
 * > gcc -static -L../build/libs/c/rpi/ -lisotope -o alphabet alphabet.c
 * Dynamic Linking
 * > gcc -L../build/libs/c/rpi/ -lisotope -o alphabet alphabet.c
 */

#include "../../src/libs/c/keylayouts.h"
#include "../../src/libs/c/isotope.h"
#include <unistd.h>

int main() {
	int isotope, i;
	char key;
	char keys[] = { KEY_A };

	isotope = isotope_open("/dev/ttyAMA0");
	if(!isotope) return 1;

	for(i = 0; i < 5; i++) {
		for(key = KEY_A; key < KEY_Z; key++) {
			keys[0] = key;
			isotope_keyboard(isotope, 0, keys, 1);
		}
	}

	sleep(1000);
	isotope_keyboard(isotope, 0, keys, 0);

	isotope_close(isotope);

	return 0;
}
