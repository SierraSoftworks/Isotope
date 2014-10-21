CC=gcc
AR=ar
CFLAGS=-O2
TARGET=
OUTPUT_DIR=../../../build/libs/c/
SOURCES=isotope.c

all: file

rpi: TARGET = rpi
rpi: CFLAGS += -DRPI
rpi: dynamic static

file: TARGET = file
file: dynamic static

prebuild:
	@mkdir -p $(OUTPUT_DIR)$(TARGET)

dynamic: prebuild
	@echo " - Building Dynamic Library - libisotope.a"
	@$(CC) -c $(SOURCES) $(CFLAGS) -o $(OUTPUT_DIR)$(TARGET)/isotope.o
	@$(AR) rcs $(OUTPUT_DIR)$(TARGET)/libisotope.a $(OUTPUT_DIR)$(TARGET)/isotope.o

static: prebuild
	@echo " - Building Static Library - libisotope.so"
	@$(CC) -c -fPIC $(SOURCES) $(CFLAGS) -o $(OUTPUT_DIR)$(TARGET)/isotope.o
	@$(CC) -shared -Wl,-soname,libisotope.so -o $(OUTPUT_DIR)$(TARGET)/libisotope.so $(OUTPUT_DIR)$(TARGET)/isotope.o

clean:
	@rm -Rf $(OUTPUT_DIR)