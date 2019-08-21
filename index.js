'use strict';

const isWin = process.platform === "win32";

if(isWin)
  module.exports = require('winapi');
else
  module.exports = require('./xrandr');
