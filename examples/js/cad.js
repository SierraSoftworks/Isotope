var Isotope = require('libisotope');
var isotope = new Isotope("/dev/ttyAMA0");
isotope.keyboard.ctrl.alt.press(Isotope.keyboard.keys.delete).then.releaseAll;