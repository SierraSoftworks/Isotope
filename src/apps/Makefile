CC=gcc
AR=ar
CFLAGS=-O2
TARGET=
OUTPUT_DIR=../../build/apps/
LIBS_DIR=../../build/libs/c/

all: file rpi

rpi: TARGET = rpi
rpi: CFLAGS += -DRPI
rpi: isokey isomouse

file: TARGET = file
file: isokey isomouse

prebuild:
	@mkdir -p $(OUTPUT_DIR)$(TARGET)

isokey isomouse: prebuild
	@echo " - Building $@ Example"
	@$(CC) -o $(OUTPUT_DIR)$(TARGET)/$@ $(LIBS_DIR)$(TARGET)/isotope.o cmdline.c $@.c 

clean:
	@rm -Rf $(OUTPUT_DIR)