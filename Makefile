all: clean libisotope_c

clean:
	rm -Rf build/

libisotope_c: libisotope_c_file libisotope_c_rpi

libisotope_c_rpi:
	@echo "Building libisotope.c for Raspberry Pi UART"
	@cd src/libs/c/; make rpi

libisotope_c_file:
	@echo "Building libisotope.c for File IO"
	@cd src/libs/c/; make file