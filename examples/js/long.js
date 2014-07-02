var Isotope = require('libisotope');
var isotope = new Isotope("/dev/ttyAMA0");
isotope.keyboard.write("This is a very long piece of text designed to test the way Isotope handles very long pieces of text, of the kind often handled by software emulators when performing speech recognition, which is entered very quickly (far faster than a human would generally be able to do so).");