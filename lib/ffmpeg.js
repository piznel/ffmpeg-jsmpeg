const ffmpeg = require('fluent-ffmpeg');
const shared = require('./shared.js');
const config = require('./config.js');

module.exports = function () {

  ffmpeg.setFfmpegPath(shared.pathFfmpeg);

  shared.ffmpeg = ffmpeg(config.uri)
    //.inputOptions('-re')
    //.inputOptions('-use_wallclock_as_timestamps 1')
    //.inputOptions('-rtsp_transport tcp')
    .videoCodec('mpeg1video')
    .size(config.resolution)
    .format('mpegts')
    .audioCodec('mp2')
    .fps(30)
    .outputOptions(['-q ' + config.quality, '-bf 0'])
    .on('end', function () {
      console.log('FFmpeg-jsRTSP : end of streaming');
    })
    .on('error', function (err) {
      console.log('an error happened: ' + err.message);
    })
    .on('stderr', function (stderrLine) {
      if (config.log) console.log('Stderr output: ' + stderrLine);
    })
    .on('start', function (commandLine) {
      console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
    .save('https://127.0.0.1:8081/');

}
