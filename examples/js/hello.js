var Isotope = require('libisotope');
var isotope = new Isotope("/dev/ttyAMA0");
isotope.keyboard.write("Hello");