Après `npm install`, il faut adapter à votre configuration :

1. Modifier le fichier `./lib/config.js`
2. Modifier le fichier `./public/view-stream.html` en mettant ligne 18 l'adresse IP du serveur qui fera la conversion.
3. Lancer le serveur avec `node index.js`
4. ouvrir la page `./public/view-stream.html` dans un navigateur. Si vous la recopiez, il faut dans le même dossier le fichier `jsmpeg.min.js`.