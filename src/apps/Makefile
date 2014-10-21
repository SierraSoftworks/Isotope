CC=gcc
AR=ar
CFLAGS=-O2
TARGET=
OUTPUT_DIR=../../build/apps/
LIBS_DIR=../../build/libs/c/

all: test file rpi

rpi: TARGET = rpi
rpi: CFLAGS += -DRPI
rpi: isokey isomouse isowrite

file: TARGET = file
file: isokey isomouse isowrite

prebuild:
	@mkdir -p $(OUTPUT_DIR)$(TARGET)

isokey isomouse isowrite: prebuild
	@echo " - Building $@ Example"
	@$(CC) -o $(OUTPUT_DIR)$(TARGET)/$@ $(LIBS_DIR)$(TARGET)/isotope.o cmdline.c $@.c 

test: prebuild
	@echo " - Building cmdline test"
	@$(CC) -o $(OUTPUT_DIR)cmdline_test cmdline.c cmdline_test.c

clean:
	@rm -Rf $(OUTPUT_DIR)