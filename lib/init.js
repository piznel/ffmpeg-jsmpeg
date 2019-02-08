
const relay = require('./websocket-relay.js')
const download = require('./download.js')
const shared = require('./shared.js')
const fe = require('path');

module.exports = function init(initDir) {
  
  return download(fe.join(initDir, './bin'))
    .then((path) => {
      // on enregistre le chemin absolu dans shared de ffmpeg
      shared.pathFfmpeg = path
      return relay('123456', 8081, 8082)
    })

}

