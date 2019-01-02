`use strict`;

var exec = require('child_process').exec;

var re = {
  connected : /^(\S+) connected (?:(\d+)x(\d+))\S* (\S+)?/,
  mode : /^\s+(\d+)x([0-9i]+)\s+((?:\d+\.)?\d+)([* ]?)([+ ]?)/
};


var xrandrParse = function (src) {
  var lines = src.split('\n');
  var query = {};
  var last = null;
  lines.forEach(function (line) {
    if(re.connected.test(line)) {
      let m = re.connected.exec(line);
      query = {connected : true};
      query['orientation'] = SCREEN_ORIENTATION[m[4]] || '0';
      query['Size']        = {};      
      if(m[2] && m[3]) {
        if(['0', '2'].indexOf(query['orientation']) !== -1) {
          query['Size']['Width'] = m[2];
          query['Size']['Height'] = m[3];
        } else {
          query['Size']['Width'] = m[3];
          query['Size']['Height'] = m[2];
        }
      }
      query['DeviceName'] = { [m[1]] : {}};
      last = m[1];
    } else if(last && (re.mode.test(line))) {
      let m = re.mode.exec(line);
      query["DeviceName"][last][`${m[1]}x${m[2]}`] = {[parseFloat(m[3]) || ''] : `${m[1]}x${m[2]}`};
    }
    else {
      last = null;
    }
  });
  return query;
};


const SCREEN_ORIENTATION = {"normal" : "0", "right" : "1", "inverted" : "2", "left" : "3"};



const GetDisplaySettings = function(chain) {
  exec('xrandr', function (err, stdout) {
    chain(err, xrandrParse(stdout));
  });
};


const ReOrientDisplay = function(orientation, chain) {
  if(oriantation == undefined)
    return chain(`bad argument`);
  exec(`xrandr -o ${oriantation}`, chain); 
};



module.exports = {GetDisplaySettings, ReOrientDisplay};


