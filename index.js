const init = require('./lib/init.js');
const fe = require('path');
const shared = require('./lib/shared.js');

shared.initDir = fe.resolve(__dirname)

init(fe.resolve(__dirname))