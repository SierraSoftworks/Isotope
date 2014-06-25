/**
 * Hello Emulation using Isotope
 * This is a quick demonstration program showing how Isotope can be used
 * to quickly and easily emulate the pressing the key combination necessary
 * to type Hello.
 *
 * IMPORTANT
 * Ensure that you are using the RPi build of the isotope library or
 * you may encounter issues with the UART not being configured correctly.
 * 
 * Object Linking
 * > gcc -o hello ../build/libs/c/rpi/isotope.o hello.c
 * Static Linking
 * > gcc -static -L../build/libs/c/rpi/ -lisotope -o hello hello.c
 * Dynamic Linking
 * > gcc -L../build/libs/c/rpi/ -lisotope -o hello hello.c
 */

#include "../src/libs/c/keylayouts.h"
#include "../src/libs/c/isotope.h"
#include <unistd.h>

int main() {
	int isotope, i;
	char sequence[] = { KEY_H, KEY_E, KEY_L, KEY_L, KEY_O };
	char keys[] = { KEY_H };

	isotope = isotope_open("/dev/ttyAMA0");
	if(!isotope) return 1;

	for(i = 0; i < 5; i++) {
		keys[0] = sequence[i];
		isotope_keyboard(isotope, 0, keys, 1);
		usleep(5000);
		isotope_keyboard(isotope, 0, 0, 0);
	}

	isotope_close(isotope);

	return 0;
}
