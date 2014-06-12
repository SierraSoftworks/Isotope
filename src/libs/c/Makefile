CC=gcc
AR=ar
CFLAGS=-O2
TARGET=
OUTPUT_DIR=../../../build/libs/c/
SOURCES=isotope.c

all: clean file

rpi: TARGET = rpi
rpi: CFLAGS += -DRPI
rpi: dynamic static

file: TARGET = file
file: dynamic static

prebuild:
	mkdir -p $(OUTPUT_DIR)$(TARGET)

dynamic: prebuild
	$(CC) -c $(SOURCES) $(CFLAGS) -o $(OUTPUT_DIR)$(TARGET)/isotope.o
	$(AR) rcs $(OUTPUT_DIR)$(TARGET)/libisotope.a $(OUTPUT_DIR)$(TARGET)/isotope.o

static: prebuild
	$(CC) -c -fPIC $(SOURCES) $(CFLAGS) -o $(OUTPUT_DIR)$(TARGET)/isotope.o
	$(CC) -shared -Wl,-soname,libisotope.so.1 -o $(OUTPUT_DIR)$(TARGET)/libisotope.so.1.0.1 $(OUTPUT_DIR)$(TARGET)/isotope.o

clean:
	rm -R ../../../build/libs/c/