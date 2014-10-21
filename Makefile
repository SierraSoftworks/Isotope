all: clean c js

clean:
	rm -Rf build/

c: libisotope_c examples_c apps_c
js: libisotope_js examples_js

rpi: libisotope_c_rpi examples_c_rpi apps_c_rpi libisotope_js examples_js

libisotope_c: libisotope_c_file libisotope_c_rpi

libisotope_c_rpi:
	@echo "Building libisotope.c for Raspberry Pi UART"
	@cd src/libs/c/; make rpi

libisotope_c_file:
	@echo "Building libisotope.c for File IO"
	@cd src/libs/c/; make file

libisotope_js:
	@echo "Setting up libisotope.js"
	@cd src/libs/js/; make deps

examples_c: examples_c_file examples_c_rpi
examples_c_file:
	@echo "Building C Examples"
	@cd examples/c/; make file
examples_c_rpi:
	@echo "Building C Examples"
	@cd examples/c/; make rpi

examples_js:
	@echo "Setting up JS examples"
	@mkdir -p examples/js/node_modules/libisotope
	@cp -R src/libs/js/* examples/js/node_modules/libisotope 

apps_c: apps_c_file apps_c_rpi
apps_c_file:
	@echo "Building Command Line Applications for File IO"
	@cd src/apps/; make file
apps_c_rpi:
	@echo "Building Command Line Applications for UART"
	@cd src/apps/; make rpi

publish:
	@echo "Publishing libraries"
	@cd src/libs/js/; npm publish