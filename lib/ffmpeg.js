const ffmpeg = require('fluent-ffmpeg');
const shared = require('./shared.js');
const config = require('./config.js');

module.exports = function () {

  ffmpeg.setFfmpegPath(shared.pathFfmpeg);

  shared.ffmpeg = ffmpeg(config.uri)
    .videoCodec('mpeg1video')
    .size(config.resolution)
    .format('mpegts')
    .audioCodec('mp2')
    .outputOptions([`-q ${config.quality}`, '-bf 0'])
    .on('end', function () {
      console.log('file has been converted succesfully');
    })
    .on('error', function (err) {
      console.log('an error happened: ' + err.message);
    })
    .on('stderr', function (stderrLine) {
      if (config.log) console.log('Stderr output: ' + stderrLine);
    })
    .save('http://127.0.0.1:8081/123456/');

}
