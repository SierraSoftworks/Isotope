CC=gcc
CFLAGS=-c -Wall
LDFLAGS=
SOURCES=isotope.c

all: rpi file
	
rpi:
	mkdir -p ../../../build/libs/c/rpi 
	$(CC) -c $(SOURCES) -DRPI -o ../../../build/libs/c/rpi/isotope.o

file:
	mkdir -p ../../../build/libs/c/file 
	$(CC) -c $(SOURCES) -o ../../../build/libs/c/file/isotope.o