const ffbinaries = require('ffbinaries');
const Promise = require('bluebird');


module.exports = function download(path) {

    // on nettoie le cache
    ffbinaries.clearCache();

    // cherche ffmpeg dans ./bin
    return findFFMPEG(path)
        // trouvé !
        .then((answer) => {
            // si tout est bon, on retourne le chemin
            if (answer.ffmpeg.found && answer.ffmpeg.isExecutable) {
                console.log('gladys-rtsp : ffmpeg binary found in ' + answer.ffmpeg.path + ', version : ' + answer.ffmpeg.version);
                return Promise.resolve(answer.ffmpeg.path)
            } else {
                // pas trouvé : on le télécharge dans ./bin
                return downloadFFMPEG(path)
                    .then((data) => {
                        // téléchargement et décompression ok
                        if (data[0].code === 'DONE_CLEAN') {
                            // on contrôle que tout est ok
                            return findFFMPEG(path)
                                // c'est tout bon, on retourn le chemin
                                .then((answer) => {
                                    if (answer.ffmpeg.found && answer.ffmpeg.isExecutable) {
                                        console.log('gladys-rtsp : ffmpeg binary file downloaded to ' + answer.ffmpeg.path + ', version : ' + answer.ffmpeg.version);
                                        return Promise.resolve(answer.ffmpeg.path)
                                    }
                                })
                                .catch((err) => {
                                    return Promise.reject('gladys-rtsp : impossible to find ffmpeg path')
                                })
                        }
                    })
                    .catch((err) => {
                        return Promise.reject('gladys-rtsp : impossible to download ffmpeg')
                    })
            }
        })
}

function findFFMPEG(dest) {
    var options = {
        paths: dest,
        ensureExecutable: true
    };

    return new Promise(function (resolve, reject) {
        resolve(ffbinaries.locateBinariesSync(['ffmpeg'], options))
    })
}

function downloadFFMPEG(dest) {
    var options = {
        quiet: true,
        force: true,
        destination: dest
    };

    return new Promise(function (resolve, reject) {
        ffbinaries.downloadBinaries(['ffmpeg'], options, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data)
            }
        })
    })
}
