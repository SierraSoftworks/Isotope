/**
 * Isotope Mouse Emulation Command Line Applet
 * This command line executable allows emulation of
 * basic mouse functions through an easy to understand
 * command line syntax.
 */

/**
 * Examples:
 * Hold left button and move 10 left, release
 * > isomouse -L X10
 */

#include "../libs/c/isotope.h"

#include "cmdline.h"

#include <stdio.h>
#include <string.h>

int main(int argc, const char** argv) {
    int isotope;
    char buttons = 0;
    char x = 0, y = 0, scroll = 0;
    const char* value;
    int val;
    char release = 1;
    
    
    cmd_init(argc, argv);
    
    if(cmd_hasFlag('?', "help")) {
        printf("Isotope Keyboard Emulator\n");
        printf("Usage: %s -L -right -M X10 Y0 S-1\n", cmd_application());
        return -1;
    }
    
    if(cmd_hasFlag('L', "left")) buttons |= 0x1;
    if(cmd_hasFlag('R', "right")) buttons |= 0x2;
    if(cmd_hasFlag('M', "middle")) buttons |= 0x4;
    if(cmd_hasFlag('H', "hold")) release = 0;
    
    while(value = cmd_nextValue()) {
        sscanf(value + 1, "%d", &val);
        
        if(val > 127 || val < -127) {
            if(val > 127) val = 127;
            else val = -127;
            printf("WARN: %c value was outside maximum bounds (-127 to 127), used %d instead.\n", value[0], val);
        }
        switch(value[0]) {
            case 'X':
            case 'x':
                x = (char)val;
                break;
            case 'Y':
            case 'y':
                y = (char)val;
                break;
            case 'S':
            case 's':
                scroll = (char)val;
                break;
        }
    }
    
    if(isotope = isotope_open("/dev/ttyAMA0")) {
        isotope_mouse(isotope, buttons, x, y, scroll);
        if(release) isotope_mouse(isotope, 0, 0, 0, 0);
        isotope_close(isotope);
    } else {
        printf("Error: Unable to connect to Isotope device, please ensure the UART is available.\n");
        return -2;
    }
}