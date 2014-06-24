# UART Protocol Specification
**Version 1.0**

## Requirements
This protocol is required to include support for Mouse, Keyboard and Joystick emulation in a robust and high efficiency manner. In addition to this, the protocol should aim to be as understandable as possible and avoid complex behaviour which complicates implementations wherever possible.

For performance reasons this requires that the protocol be binary in nature, reducing (and in many cases removing) the need for packet parsing. In addition to this, attempts will be made to reduce the amount of data which will be transmitted over the UART connection to improve performance as much as possible.

## Design Decisions
There are two approaches to the protocol which we are able to take. The first is to attempt to design a protocol which is as faithful to the USB HID specification as possible - effectively causing the ATmega to act as a relay device, however while this will certainly minimize packet size to a large degree and faithfully allow emulation of any USB HID device it also has the distinct disadvantage of requring the master implementation to handle the creation of all HID packets - a complex task which is prone to errors.

The simpler alternative is to rely on the included HID emulation libraries and instead declare a protocol which acts to perform RPC (remote procedure calls) on the ATmega chip. This, if well designed, could result in smaller packets for most common operations and would significantly simplify protocol implementations. The obvious disadvantage of this approach is that in order to emulate additional devices it would be necessary to extend the functionality of the ATmega's firmware as well as (possibly) adding additional op-codes to the protocol.

Version 1.0 of this protocol will adopt the second approach, attempting to implement a very specific RPC system built around USB HID emulation on the ATmega chip. Packets will consist of an op-code, packet length field and a number of 8-bit arguments to be passed to the corresponding functions. If needed, these 8-bit arguments can be combined to create 16-bit or 32-bit values where those are necessary.

## Protocol

### Packet
All protocol operations are wrapped in a packet structure similar to the following. Packets consist of a 3-bit **OP_CODE** field, a 5-bit **ARG_COUNT** field as well as a number of 8-bit arguments. There is a protocol imposed limit of 15 arguments, limiting the total packet size to 16-bytes.

---------------------------
|   OP_CODE   | ARG_COUNT |
---------------------------
|           ARG_1         |
---------------------------
|            ...          |
---------------------------
|           ARG_N         |
---------------------------

### OP Codes
There are a number of basic op codes which cover the spectrum of available functions which may be performed by the emulation layer. These codes define the way in which their received arguments are treated and allow future extensions to the protocol through the use of the **000** op code.

---------------------------------
| OP_CODE | Description         |
---------------------------------
|     000 | Custom Operation    |
---------------------------------
|     001 | Keyboard            |
---------------------------------
|     010 | Mouse               |
---------------------------------
|     011 | Joystick            |
---------------------------------
|     100 | Reserved            |
---------------------------------
|     101 | Reserved            |
---------------------------------
|     110 | Reserved            |
---------------------------------
|     111 | Reserved            |
---------------------------------

### Expected Arguments
Each op code expects a certain set of arguments to be provided, and their presence dictates the behaviour undertaken by the emulation layer when the op code is recieved. In all cases, transmission of a packet with *ARG_COUNT=0* will be used to release all active keys or buttons.

#### Keyboard
The keyboard operation is used to trigger the emulation of KeyDown operations. It is important to note that unlike platform native emulation libraries like SendKey() or Win32 API calls it is not necessary to send a KeyUp message when performing USB emulation, rather the KeyUp state will be detected when a packet is sent without the key listed as depressed. This is an important distinction and one which will in many ways dictate the way this protocol is designed.

In addition to this, the ATmega32u4's keyboard emulation is limited to 6 keys + 4 modifiers at any one time, and due to the way that HID emulation is performed it is impossible to "trick" the operating system into believing that more than that number are depressed at any one time.

As a result of these restrictions, the Keyboard (*0x20* flag) opcode requires the following argument structure.

 - **ARG_1** MODIFIERS : uint8
 - **ARG_2..7** KEY : uint8

It is important to note that the protocol and implementation allow the transmission of partial packets - meaning that it is not necessary to send additional arguments for keys which are not in use. Therefore to send the 'A' key it is simply necessary to send 2 arguments.

##### Example Packets
The following are hexadecimal representations of packets for performing some basic operations.
 - **Press A** 22 00 04
 - **Press Shift+A** 22 02 04
 - **Press Ctrl+Shift+A+B+C** 24 03 04 05 06
 - **Release All Keys** 20

##### Known Issues
Because of the way emulation is implemented in the Teensy firmware, it is impossible to send the full uint16_t keycodes to the emulation layer. This means that it is not possible to emulate certain special keys like VOLUME_UP, MUTE etc at this time. In the future, if this functionality becomes available it may be possible to tweak this implementation to support sending the full keycodes in which case modifiers and keys will need to be handled differently.

#### Mouse
The mouse operation type is used to emulate mouse button presses, movement and scrolling. As with the keyboard operation type, transmitting a Mouse packet with no arguments has the effect of releasing all pressed buttons.

Button presses are encoded into the first argument using a set of flags, namely the following. The button flags are ORed together to give the resulting button code.
 - **Left** 0x1
 - **Right** 0x2
 - **Middle** 0x4

- **ARG_1** BUTTONS : uint8 flags
- **ARG_2** DELTA_X : uint8
- **ARG_3** DELTA_Y : uint8
- **ARG_4** DELTA_SCROLL : uint8

It is important to note that it is possible to send "partial" packets, in which case the subsequent values will be assigned a default value of 0. This means that a mouse button press emulation doesn't need to send the DELTA_X, DELTA_Y or DELTA_SCROLL components. Similarly, a Y movement doesn't need to send the DELTA_SCROLL component.

##### Example Packets
- **LMB Down** 41 01
- **Right 8px** 42 00 08
- **Scroll Up 2 Lines** 44 00 00 00 02
- **Reset Buttons** 40

##### Known Limitations
Due to the USB HID specification not supporting Mouse Button 4 or 5 (used commonly to provide Forward/Backward navigation) it is not possible to emulate these. In addition to this, the HID specification provides no way to move the mouse to an absolute position on the display (given a set of X, Y coordinates). This behaviour can be emulated by moving the mouse to the bottom left corner (repeated -127, -127 movements) followed by movements to the desired location. The number of movements required to move the mouse to (0,0) will depend on the target display's resolution.

#### Joystick
The joystick emulation layer is slightly more complex than that of the mouse or keyboard - as it is necessary to pack relatively more information into the packet than would otherwise be necessary. The ATmega32u4 is capable of emulating a joystick with 32 buttons, 6 axes and a single 8-way hat switch. In order to provide full accuracy (10-bit axis reporting) it is necessary to "pack" sets of 3 axes together such that one 4-byte integer contains axis information for 3 axes.

Packing is achieved by applying the following algorithm. Take note that 2-bits are lost for each set of 3 packed axes, resulting in a packed efficiency of 93.75%, compared to an efficiency of 62.5% if packing is not used.
```c
int32_t pack(int16_t axis1, int16_t axis2, int16_t axis3) {
	return (((axis1 << 10) | axis2) << 10) | axis3;
}
```

In addition to this, the hat switch is handled differently to the standard Arduino implementation to allow its data to be contained within a single 8-bit argument. The special value 0xff is used to represent center, while all other values are multiplied by 45 to give the number of degrees from north.

The resulting packet is in the form
 - **ARG_1..4** BUTTONS : int32_t
 - **ARG_5..8** pack(X, Y, Z) : int32_t
 - **ARG_9..12** pack(rZ, sL, sR) : int32_t
 - **ARG_13** HAT : int8_t

It is important to note that as with all other op-codes it is possible to send empty packets, however due to the way in which axes are handled this is not recommended under any circumstances as strange values will be reported. In future, the upper bit of a pack may be used to indicate that it is a valid value and should be updated, however that is currently beyond the scope of this implementation.