/**
 * Isotope Keyboard Emulation Command Line Applet
 * This command line executable allows emulation of
 * basic keyboard commands through a shell terminal
 * or the system() function and its equivalents in
 * other frameworks.
 */

/**
 * Examples
 * Type "Hello World!"
 * > isowrite Hello World!
 */

#include "../libs/c/isotope.h"
#include "../libs/c/keylayouts.h"

#include "cmdline.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(int argc, const char** argv) {
    int isotope;
    char* text;
    char hasWritten = 0;
    
    cmd_init(argc, argv);
    
    if(cmd_hasFlag('?', "help")) {
        printf("Isotope Keyboard Writer\n");
        printf("Usage: %s Hello World!\n", cmd_application());
        return -1;
    }
    
    if(isotope = isotope_open("/dev/ttyAMA0")) {
        if(cmd_length())
            while(text = (char*)cmd_nextArgument()) {
                if(hasWritten) isotope_text(isotope, " ");
                isotope_text(isotope, text);
                hasWritten = 1;
            }
        else {
            text = (char*)malloc(sizeof(char) * 512);
            memset(text, 0, 512);
            while(fgets(text, 511, stdin))
                isotope_text(isotope, text);
        }
        isotope_close(isotope);
        return 0;
    } else {
        printf("Error: Unable to connect to Isotope device, please ensure the UART is available.\n");
        return -2;
    }
}