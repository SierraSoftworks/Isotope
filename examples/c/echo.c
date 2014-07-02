/**
 * Echo Tester
 * This is a quick tester used to echo back the bytes sent to the ATmega
 * when it is running the echo firmware.
 *
 * EXAMPLE
 * > echo "Hello" | ./echo
 *
 * IMPORTANT
 * Ensure that you are using the RPi build of the isotope library or
 * you may encounter issues with the UART not being configured correctly.
 * 
 * Object Linking
 * > gcc -o echo ../build/libs/c/rpi/isotope.o echo.c
 * Static Linking
 * > gcc -static -L../build/libs/c/rpi/ -lisotope -o echo echo.c
 * Dynamic Linking
 * > gcc -L../build/libs/c/rpi/ -lisotope -o echo echo.c
 */

#include "../../src/libs/c/keylayouts.h"
#include "../../src/libs/c/isotope.h"
#include <stdio.h>
#include <unistd.h>

int main() {
	int isotope;
	char tmp;

	isotope = isotope_open("/dev/ttyAMA0");
	if(!isotope) return 1;

	while(read(STDIN_FILENO, &tmp, 1) > 0) write(isotope, &tmp, 1);
	while(1) { if(read(isotope, &tmp, 1) > 0) printf("%x ", tmp); }

	isotope_close(isotope);

	return 0;
}
