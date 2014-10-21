CC=gcc
AR=ar
CFLAGS=-O2
TARGET=
OUTPUT_DIR=../../build/examples/c/
LIBS_DIR=../../build/libs/c/
SOURCES=isotope.c

all: clean file rpi

rpi: TARGET = rpi
rpi: CFLAGS += -DRPI
rpi: hello cad mouse echo alphabet

file: TARGET = file
file: hello cad mouse echo alphabet

prebuild:
	@mkdir -p $(OUTPUT_DIR)$(TARGET)

echo hello mouse cad alphabet: prebuild
	@echo " - Building $@ Example"
	@$(CC) -o $(OUTPUT_DIR)$(TARGET)/$@ $(LIBS_DIR)$(TARGET)/isotope.o $@.c 

clean:
	@rm -Rf $(OUTPUT_DIR)