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

void writeChar(int isotope, const char character);

int main(int argc, const char** argv) {
    int isotope;
    const char* text;
    char hasWritten = 0;
    
    cmd_init(argc, argv);
    
    if(cmd_hasFlag('?', "help")) {
        printf("Isotope Keyboard Writer\n");
        printf("Usage: %s Hello World!\n", cmd_application());
        return -1;
    }
    
    if(isotope = isotope_open("/dev/ttyAMA0")) {
        while(text = cmd_nextArgument()) {
            if(hasWritten) writeChar(isotope, ' ');
            while(*text) {
                hasWritten = 1;
                writeChar(isotope, *(text++));
            }
        }
        isotope_close(isotope);
        return 0;
    } else {
        printf("Error: Unable to connect to Isotope device, please ensure the UART is available.\n");
        return -2;
    }
}

const char* immutable = "\n\t ";
const char* mutable_normal = "abcdefghijklmnopqrstuvwxyz1234567890-=[]\\;'`,./";
const char* mutable_shifted = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:\"~<>?";
const char map_immutable[] = {40, 43, 44};
const char map_mutable[] = {
    4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,
    30,31,32,33,34,35,36,37,38,39,
    45,46,47,48,49,51,52,53,54,55,56
};

void writeChar(int isotope, const char character) {
    char keys[1] = {0};
    char modifiers = 0;
    char* index;
    
    if(index = strchr(immutable, character))
        keys[0] = map_immutable[index - keys];
    else if(index = strchr(mutable_normal, character))
        keys[0] = map_mutable[index - keys];
    else if(index = strchr(mutable_shifted, character)) {
        modifiers = MODIFIERKEY_SHIFT;
        keys[0] = map_mutable[index - keys];
    }
    else printf("WARN: Couldn't find a key handler for '%c'\n", character);
    
    isotope_keyboard(isotope, modifiers, keys, 1);
    isotope_keyboard(isotope, 0, keys, 0);
}