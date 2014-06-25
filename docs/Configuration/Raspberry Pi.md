# Raspberry Pi Configuration
There are a number of minor configuration changes required to allow the Raspberry Pi to communicate with the Teensy. Specifically, this involves disabling the use of the UART as a TTY console.

## Disabling UART ttyAMA0
 - Remove `console=ttyAMA0,115200` and `kgdboc=ttyAMA0,115200` from `/boot/cmdline.txt`
 - Comment out the `T0:23:respawn:/sbin/getty -L ttyAMA0 115200 vt100` line in `/etc/inittab`
 - Reboot the Raspberry Pi with `sudo reboot`