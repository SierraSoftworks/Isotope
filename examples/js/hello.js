var Isotope = require('isotope');
var isotope = new Isotope("/dev/ttyAMA0");
isotope.on('open', function() {
	isotope.keyboard.write("Hello").now();
	isotope.close();
});