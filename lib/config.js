
module.exports = {
  uri: 'rtsp://192.168.1.30:554/onvif1',
  resolution: '640x?',
  quality: 5,
  log: true
};

  /****************** 

  Définition :
  
  1- uri : adresse complète du flux RTSP, de la forme :

      rtsp://user:password@ip:port/chemin_du_flux

      A tester dans VLC pour être sûr qu'elle fonctionne ! Si vous ne la connaissez pas,
      cherchez sur les sites suivants:
        * https://www.ispyconnect.com/sources.aspx
        * https://www.soleratec.com/support/rtsp/

      Si la caméra expose plusieurs flux (souvent un haute résolution et un basse résolution),
      choisissez le plus proche de la résolution de sortie définie au point 2.
  
  2- resolution: résolution en sortie, largeur x hauteur ;
      vous pouvez mettre 640x? et le code calculera la hauteur pour ne pas déformer la vidéo.
  
  3- quality : de 1 (plus haute qualité) à 30 (plus basse qualité)
  
  4- log : si true, affiche en console les log de ffmpeg lors du décodage/encodage, de la forme :

      Stderr output: frame= 2821 fps=8.1 q=5.0 size=   14703kB time=00:05:52.84 bitrate= 341.4kbits/s speed=1.01x

      Il faut que speed soit le plus proche de 1.

  *********************/

  /********************************************************************************************
  la charge du processeur et la bande passante augmentent avec la résolution et la qualité.
  Donc à réduire si trop saccadé ! Evidemment, celà joue également sur le temps de latence.
  *********************************************************************************************/