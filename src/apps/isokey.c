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
 * > isokey -S H
 * > isokey e
 * > isokey l
 * > isokey l
 * > isokey o
 * > isokey SPACE
 * > isokey -S w
 * > isokey o
 * > isokey r
 * > isokey l
 * > isokey d
 * > isokey -S 1
 */

#include "../libs/c/isotope.h"
#include "../libs/c/keylayouts.h"

#include "cmdline.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

char parseKey(char* keys, int* keysCount);

int main(int argc, const char** argv) {
    int isotope;
    char modifiers = 0;
    char keys[6] = {0};
    int keysCount = 0;
    char release = 1;
    
    cmd_init(argc, argv);
    
    if(cmd_hasFlag('?', "help")) {
        printf("Isotope Keyboard Emulator\n");
        printf("Usage: %s -C -shift -A -win A SPACE BACKSPACE DEL F11 NUM7\n", cmd_application());
        return -1;
    }
    
    if(cmd_hasFlag('H', "hold")) release = 0;
    
    if(cmd_hasFlag('C', "ctrl")) modifiers |= MODIFIERKEY_CTRL;
    if(cmd_hasFlag(0, "lctrl")) modifiers |= MODIFIERKEY_LEFT_CTRL;
    if(cmd_hasFlag(0, "rctrl")) modifiers |= MODIFIERKEY_RIGHT_CTRL;
    
    if(cmd_hasFlag('A', "alt")) modifiers |= MODIFIERKEY_ALT;
    if(cmd_hasFlag(0, "lalt")) modifiers |= MODIFIERKEY_LEFT_ALT;
    if(cmd_hasFlag(0, "ralt")) modifiers |= MODIFIERKEY_RIGHT_ALT;
    
    if(cmd_hasFlag('S', "shift")) modifiers |= MODIFIERKEY_SHIFT;
    if(cmd_hasFlag(0, "lshift")) modifiers |= MODIFIERKEY_LEFT_SHIFT;
    if(cmd_hasFlag(0, "rshift")) modifiers |= MODIFIERKEY_RIGHT_SHIFT;
    
    if(cmd_hasFlag('W', "win")) modifiers |= MODIFIERKEY_GUI;
    if(cmd_hasFlag(0, "lwin")) modifiers |= MODIFIERKEY_LEFT_GUI;
    if(cmd_hasFlag(0, "rwin")) modifiers |= MODIFIERKEY_RIGHT_GUI;
    
    while(parseKey(keys, &keysCount));
    
    if(isotope = isotope_open("/dev/ttyAMA0")) {
        isotope_keyboard(isotope, modifiers, keys, keysCount);
        if(release) isotope_keyboard(isotope, 0, 0, 0);
        isotope_close(isotope);
        return 0;
    } else {
        printf("Error: Unable to connect to Isotope device, please ensure the UART is available.\n");
        return -2;
    }
}

typedef struct KEYBIND {
    char shortcut[15];
    int code;
} KEYBIND;

KEYBIND keymap[] = {
    { "0", KEY_0 },
    { "1", KEY_1 },
    { "2", KEY_2 },
    { "3", KEY_3 },
    { "4", KEY_4 },
    { "5", KEY_5 },
    { "6", KEY_6 },
    { "7", KEY_7 },
    { "8", KEY_8 },
    { "9", KEY_9 },
    
    { "A", KEY_A },
    { "B", KEY_B },
    { "C", KEY_C },
    { "D", KEY_D },
    { "E", KEY_E },
    { "F", KEY_F },
    { "G", KEY_G },
    { "H", KEY_H },
    { "I", KEY_I },
    { "J", KEY_J },
    { "K", KEY_K },
    { "L", KEY_L },
    { "M", KEY_M },
    { "N", KEY_N },
    { "O", KEY_O },
    { "P", KEY_P },
    { "Q", KEY_Q },
    { "R", KEY_R },
    { "S", KEY_S },
    { "T", KEY_T },
    { "U", KEY_U },
    { "V", KEY_V },
    { "W", KEY_W },
    { "X", KEY_X },
    { "Y", KEY_Y },
    { "Z", KEY_Z },
    
    { "F1", KEY_F1 },
    { "F2", KEY_F2 },
    { "F3", KEY_F3 },
    { "F4", KEY_F4 },
    { "F5", KEY_F5 },
    { "F6", KEY_F6 },
    { "F7", KEY_F7 },
    { "F8", KEY_F8 },
    { "F9", KEY_F9 },
    { "F10", KEY_F10 },
    { "F11", KEY_F11 },
    { "F12", KEY_F12 },
    { "F13", KEY_F13 },
    { "F14", KEY_F14 },
    { "F15", KEY_F15 },
    { "F16", KEY_F16 },
    { "F17", KEY_F17 },
    { "F18", KEY_F18 },
    { "F19", KEY_F19 },
    { "F20", KEY_F20 },
    { "F21", KEY_F21 },
    { "F22", KEY_F22 },
    { "F23", KEY_F23 },
    { "F24", KEY_F24 },
    
    { ",", KEY_COMMA },
    { ".", KEY_PERIOD },
    { "/", KEY_SLASH },
    { "\\", KEY_BACKSLASH },
    { "[", KEY_LEFT_BRACE },
    { "]", KEY_RIGHT_BRACE },
    { "'", KEY_QUOTE },
    { ";", KEY_SEMICOLON },
    { "`", KEY_TILDE },
    
    { "SPACE", KEY_SPACE },
    { "BACKSPACE", KEY_BACKSPACE },
    { "ENTER", KEY_ENTER },
    { "ESCAPE", KEY_ESC },
    { "ESC", KEY_ESC },
    { "NUMLOCK", KEY_NUM_LOCK },
    { "CAPSLOCK", KEY_CAPS_LOCK },
    { "DEL", KEY_DELETE },
    { "DELETE", KEY_DELETE },
    { "END", KEY_END },
    { "MINUS", KEY_MINUS },
    { "EQUALS", KEY_EQUAL },
    { "EQUAL", KEY_EQUAL },
    { "DOWN", KEY_DOWN },
    { "LEFT", KEY_LEFT },
    { "RIGHT", KEY_RIGHT },
    { "UP", KEY_UP },
    { "HOME", KEY_HOME },
    { "INSERT", KEY_INSERT },
    { "MENU", KEY_MENU },
    { "TAB", KEY_TAB },
    { "PGUP", KEY_PAGE_UP },
    { "PGDN", KEY_PAGE_DOWN },
    
    { "NUM0", KEYPAD_0 },
    { "NUM1", KEYPAD_1 },
    { "NUM2", KEYPAD_2 },
    { "NUM3", KEYPAD_3 },
    { "NUM4", KEYPAD_4 },
    { "NUM5", KEYPAD_5 },
    { "NUM6", KEYPAD_6 },
    { "NUM7", KEYPAD_7 },
    { "NUM8", KEYPAD_8 },
    { "NUM9", KEYPAD_9 },
    { "NUMENTER", KEYPAD_ENTER },
    { "NUM/", KEYPAD_SLASH },
    { "NUMSLASH", KEYPAD_SLASH },
    { "NUM*", KEYPAD_ASTERIX },
    { "NUMASTERIX", KEYPAD_ASTERIX },
    { "NUM+", KEYPAD_PLUS },
    { "NUMPLUS", KEYPAD_PLUS },
    { "NUM-", KEYPAD_MINUS },
    { "NUMMINUS", KEYPAD_MINUS },
    { "NUM.", KEYPAD_PERIOD },
    { "NUMPERIOD", KEYPAD_PERIOD },
};

char parseKey(char* keys, int* keysCount) {
    const char* key;
    char* keyUpper;
    int i;
    
    key = cmd_nextValue();
    if(!key) return 0;
    keyUpper = cmd_strupr(key);
    
    for(i = 0; i < sizeof(keymap)/sizeof(KEYBIND); i++) {
        if(!strcmp(keyUpper, keymap[i].shortcut)) {
            keys[(*keysCount)++] = keymap[i].code;
            return 1;
        }
    }
    
    printf("WARN: Failed to find a binding for key '%s'\n", keyUpper);
    return 1;
}