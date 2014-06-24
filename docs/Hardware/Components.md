# Components
The Isotope prototype board makes use of a Raspberry Pi and a PJRC Teensy 2.0 to provide the ATmega32u4 used for USB HID emulation. In theory, the library can be adapted to serve any device with a UART, and emulation can be provided by any device with an ATmega32u4 chip.

## Compatible Host Devices
 - Raspberry Pi
 - BeagleBone Black
 - FTDI USB Serial Chip (with a compatible host machine)

## Compatible Emulation Devices
 - Arduino Micro
 - Teensy 2.0
 - Teensy 3.0

## Interconnect Devices
As the Raspberry Pi and ATmega32u4 run at different voltage levels it is necessary to perform level conversion on the RXD and TXD ports when connecting the chips. Level conversion may be accomplished using a voltage divider on the ATmega32u4 -> Pi lane, and an Op-Amp or pair of BJT transistors on the Pi -> ATmega32u4 lane; or alternatively by using a dedicated level switching chip.

For the prototype device I have opted to use a level switching chip as it doesn't cause the transient response issues seen with a resistor ladder at higher baud rates, allowing for a higher throughput and faster response to commands.

The interconnect chip I am using is the **TXB0104** bi-directional level shifter, as it is able to perform level shifting from 3.3V -> 5V and vice versa.

## Wiring
Wiring between the various devices is limited to the following connections. Please note that *PI* represents the Raspberry Pi, *ATM* represents the ATmega32u4 and *TXB* represents the level switching chip. For safety reasons, the 5V supplies on the Pi and ATmega32u4 are never connected, preventing the Pi from drawing it's power through the ATmega32u4 (as the Pi can draw between 700mA and 1.2A, while the ATmega is limited to 500mA).

 - PI.TXD TXB.A1
 - TXB.B1 ATM.D2
 - ATM.D3 TXB.B2
 - TXB.B2 PI.RXD
 - PI.33V TXB.LV
 - ATM.5V TXB.HV
 - ATM.GND PI.GND TXB.GND