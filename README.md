# Isotope
**Powerful USB HID emulation toolkit**

Isotope is a toolkit designed to enable USB HID emulation (Keyboard, Mouse, Joystick etc.) for the Raspberry Pi (and in theory, the BeagleBone Black or other Linux micro-devices) through the use of a paired ATmega32u4 over a UART connection. It aims to simplify the task of emulation by providing a bundled firmware for the ATmega32u4 as well as pre-built libraries for emulation operations.

## Features
 - **High Performance** is guarunteed through the use of the ATmega32u4, who's integrated USB controller allows full speed USB communication with the host computer. 
 - **Unversal Compatibility** through the use of the USB HID standard, allowing input emulation to be achieved without the use of custom drivers on a wide range of popular operating systems.
 - **Ease to Use** is achieved through the inclusion of simple wrapper libraries for a variety of languages, allowing custom applications to easily integrate emulation functionality.

## Libraries
 - **C Library** Usable from C and C++ applications, as well as any application which supports C interoperability. This library can be used by grabbing the source code and running `make c`, the resulting library files will be available in `build/libs/c` while the header files are available in `src/libs/c`.
 - **Node.js Library** Awesome for quick prototyping and playing around, can be installed using `npm install libisotope`.
 - **Command Line Executables** These are great for quick shell scripts and demos, you'll find them in the `build/apps` folder after doing a `make c`.

## How it Works
Emulation is achieved through the use of the ATmega 32u4 processor which includes an integrated USB controller capable of HID emulation. By pairing this processor with a Raspberry Pi/BeagleBone Black/any other Linux device with an available UART we are able to provide an easy to use, packaged, emulation toolkit for embedded devices.
Commands are sent from the master device (Raspberry Pi for example) to the emulation controller (Arduino Micro, Teensy etc.) over the UART connection by using a custom binary protocol developed for this exact purpose. This allows us to ensure reliable command execution, good performance and compatibility with a wide range of embedded devices including the Raspberry Pi, BeagleBone Black and even FPGAs.

More information on the protocol used can be found in the docs/protocol folder.

## Performance
There are three limiting factors to performance of the emulator, namely the USB HID maximum polling rate of 1000Hz, the maximum transmission rate over the UART (dictacted by the packet size and configured baud rate) and finally the rate at which the ATmega32u4 is capable of handling requests.

### Single Keypress (with/without modifier keys)
We will consider this, as it is the most common usage scenario due to the limitations of the system (not being able to determine the actual cursor position on the display and so on). There are two aspects which should be investigated, the maximum communications rate, which is dictated by the packet size and baud rate, and the maximum processing rate.

As the command consists of a 3 byte packet (header + modifiers + key), we can calculate the maximum transmission rate as (BAUD/11/PACKET_LENGTH) = 115200/11/3 = 3500 packets/second. Specifically, we can determine the optimum transmission rate to ensure we do not exceed the 1000Hz limit by rearranging the equation - leaving us with 38400 baud as our best general selection.
