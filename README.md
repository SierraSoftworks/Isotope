# Isotope
**Powerful USB HID emulation toolkit**

Isotope is a toolkit designed to enable USB HID emulation (Keyboard, Mouse, Joystick etc.) for the Raspberry Pi (and in theory, the BeagleBone Black or other Linux micro-devices) through the use of a paired ATmega32u4 over a UART connection. It aims to simplify the task of emulation by providing a bundled firmware for the ATmega32u4 as well as pre-built libraries for emulation operations.

## Features
 - **High Performance** is guarunteed through the use of the ATmega32u4, who's integrated USB controller allows full speed USB communication with the host computer. 
 - **Unversal Compatibility** through the use of the USB HID standard, allowing input emulation to be achieved without the use of custom drivers on a wide range of popular operating systems.
 - **Ease to Use** is achieved through the inclusion of simple wrapper libraries for a variety of languages, allowing custom applications to easily integrate emulation functionality.

## How it Works
Emulation is achieved through the use of the ATmega 32u4 processor which includes an integrated USB controller capable of HID emulation. By pairing this processor with a Raspberry Pi/BeagleBone Black/any other Linux device with an available UART we are able to provide an easy to use, packaged, emulation toolkit for embedded devices.
Commands are sent from the master device (Raspberry Pi for example) to the emulation controller (Arduino Micro, Teensy etc.) over the UART connection by using a custom binary protocol developed for this exact purpose. This allows us to ensure reliable command execution, good performance and compatibility with a wide range of embedded devices including the Raspberry Pi, BeagleBone Black and even FPGAs.

More information on the protocol used can be found in the docs/protocol folder.