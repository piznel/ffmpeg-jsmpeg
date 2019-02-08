
module.exports = {
  uri: 'rtsp://192.168.1.30:554/onvif1',  // a tester dans VLC ! Si votre cam expose plusieurs flux, selon la résolution voulue, choisissez le plus proche.
  resolution: '640x360',  // résolution en sortie qui sera diffusé.
  quality: 5,       // de 1 (plus haute qualité) à 30 (plus basse qualité)
  log: true       // Affiche les logs de ffmpeg, très verbose !
};



  // la charge du processeur et la bande passante augmentent avec la résolution et la qualité.
  // Donc à réduire si trop saccadé ! Evidemment, celà joue également sur le temps de latence.