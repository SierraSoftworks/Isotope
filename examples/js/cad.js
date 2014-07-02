var Isotope = require('isotope');
var isotope = new Isotope("/dev/ttyAMA0");
isotope.on('open', function() {
	isotope.keyboard.ctrl.alt.press(Isotope.keyboard.keys.delete).then.releaseAll.now();
	isotope.close();
});