/**
 * Ctrl+Alt+Del Emulation using Isotope
 * This is a quick demonstration program showing how Isotope can be used
 * to quickly and easily emulate the pressing of the Ctrl+Alt+Delete
 * keyboard combo on Windows machines.
 *
 * IMPORTANT
 * Ensure that you are using the RPi build of the isotope library or
 * you may encounter issues with the UART not being configured correctly.
 * 
 * > gcc ../builds/libs/c/rpi/isotope.o cad.c -o cad
 * > chmod +x cad
 * > ./cad
 */

#include "../src/libs/c/keys.h"
#include "../src/libs/c/isotope.h"

int main() {
	int isotope;
	char[] keys = { KEY_DELETE };

	isotope = isotope_open("/dev/ttyAMA0");
	if(!isotope) return 1;

	// Send the Ctrl+Alt+Del combo
	isotope_keyboard(isotope, MODIFIERKEY_CTRL | MODIFIERKEY_ALT, keys, 1);
	// Release the keys
	isotope_keyboard(isotope, 0, 0, 0);

	return 0;
}