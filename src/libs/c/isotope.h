/**
 * Isotope C Library
 * Provides a C interface between the Isotope emulation chip
 * and the local system, as well as a number of useful command
 * wrappers.
 *
 * Copyright © Benjamin Pannell 2014
 */

#ifndef ISOTOPE_H
#define ISOTOPE_H

/**
 * Configures the maximum transmission rate in commands per second (Hz)
 * to be used by this library. By default this is 500Hz to prevent issues
 * with the USB HID protocol.
 * May be set to 0 to disable rate limiting.
 */
int isotope_maxRate;

/**
 * Opens a new Isotope using the specified device to communicate, e.g. /dev/ttyUART0
 * @param device The device to open for interaction between the Isotope and this library
 * @returns isotope The unique Isotope ID used for submission of emulation requests
 */
int isotope_open(const char* device);
/**
 * Closes an Isotope connection given the Isotope's ID, this should be done before closing your application.
 * @param isotope The ID of the connection to terminate
 * @returns status Returns 0 if the connection was terminated successfully
 */
char isotope_close(int isotope);

/**
 * Sends a mouse emulation request using the given Isotope.
 * @param isotope The opened Isotope connection to send the emulation request over.
 * @param buttons The depressed mouse buttons to emulate, a set of MOUSE_ flags.
 * @param deltaX The x-axis movement of the mouse -127 to 127.
 * @param deltaY The y-axis movement of the mouse -127 to 127.
 * @param deltaScroll The scroll delta, usually +/- 3 to emulate a standard scroll wheel.
 */
char isotope_mouse(int isotope, char buttons, char deltaX, char deltaY, char deltaScroll);

/**
 * Sends a keyboard emulation request using the given Isotope.
 * @param isotope The opened Isotope connection to send the emulation request over.
 * @param modifiers A combination of modifier keys to be transmitted
 * @param keys[] The physical keyboard keys who's depression should be emulated.
 * @param keys_count The number of physical keyboard keys to be emulated (max of 6).
 */
char isotope_keyboard(int isotope, char modifiers, const char keys[], char keys_count);

/**
 * Converts the given text into a series of keyboard emulation requests for transmission
 * to a remote Isotope.
 * @param isotope The opened Isotope connection to send the emulation requests over.
 * @param text The null terminated string to send to the remote machine.
 */
int isotope_text(int isotope, const char* text);

/**
 * Sends a joystick emulation request using the given Isotope.
 * @param isotope The opened Isotope connection to send the emulation request over.
 * @param buttons The 32 button's depression states to emulate 0x1, 0x2 etc.
 * @param x The x-axis reporting value (from 0 to 1023), 512 represents center.
 * @param y The y-axis reporting value (from 0 to 1023), 512 represents center.
 * @param z The z-axis reporting value (from 0 to 1023), 512 represents center.
 * @param rz The z-axis rotation reporting value (from 0 to 1023), 512 represents center.
 * @param sliderLeft The left slider reporting value (from 0 to 1023), 512 represents center.
 * @param sliderRight The right slider reporting value (from 0 to 1023), 512 represents center.
 * @param hat The hat switch position. 0xff represents center, 0 to 7 represent angles in multiples of 45 degrees.
 */
char isotope_joystick(int isotope, int buttons, short x, short y, short z, short rz, short sliderLeft, short sliderRight, char hat);

/**
 * Writes a packet to the given Isotope, used for low level commands
 * @param isotope The Isotope connection over which to send the packet
 * @param packet The packet to transmit to the given Isotope
 * @param length The number of bytes in the packet
 */
char isotope_write(int isotope, const char* packet, char length);

/**
 * Reads a number of bytes from the remote device into the given buffer
 * @param isotope The Isotope connection over which to retrieve data
 * @param packet The buffer into which data will be read
 * @param length The number of bytes available within the buffer for writing
 * @returns The number of bytes read into the buffer
 */
int isotope_read(int isotope, char* buffer, int length);

#endif