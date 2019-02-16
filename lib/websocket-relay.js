// Use the websocket-relay to serve a raw MPEG-TS over WebSockets. You can use
// ffmpeg to feed the relay. ffmpeg -> websocket-relay -> browser
// Example:
// node websocket-relay 8081 8082
// ffmpeg -i <some input> -f mpegts https://localhost:8081/

const fs = require('fs');
const https = require('https');
const pem = require('https-pem')
const WebSocket = require('ws');
const ffmpeg = require('./ffmpeg.js');
const shared = require('./shared');
const config = require('./config.js');
var isWebSocketHandshake = require('is-websocket-handshake')

module.exports = function (inputPort, outputPort) {

	const STREAM_PORT = inputPort || 8081;
	const WEBSOCKET_PORT = outputPort || 8082;
	const RECORD_STREAM = false;

	var httpsserver = https.createServer(pem);


	httpsserver.on('upgrade', function (req, socket, head) {
		if (isWebSocketHandshake(req)) {
			console.log('FFmpeg-jsRTSP : received proper WebSocket handshake')
		}
	})

	// Websocket Server
	var socketServer = new WebSocket.Server({ server: httpsserver, perMessageDeflate: false });
	socketServer.connectionCount = 0;

	socketServer.on('connection', function (socket, upgradeReq) {
		if (socketServer.connectionCount === 0) ffmpeg();
		socketServer.connectionCount++;
		console.log(
			'FFmpeg-jsRTSP : New WebSocket Connection: ',
			(upgradeReq || socket.upgradeReq).socket.remoteAddress,
			(upgradeReq || socket.upgradeReq).headers['user-agent'],
			'(' + socketServer.connectionCount + ' total)'
		);
		socket.on('close', function (code, message) {
			socketServer.connectionCount--;
			if (socketServer.connectionCount === 0) shared.ffmpeg.kill()
			console.log(
				'FFmpeg-jsRTSP : Disconnected WebSocket (' + socketServer.connectionCount + ' total)'
			);
		});
		socket.on('message', function(message) {
			let msg = JSON.parse(message)
			if (msg.hasOwnProperty('width')) {
				config.resolution = msg.width+'x?'
				if(shared.ffmpeg) shared.ffmpeg.kill()
				ffmpeg()
			}
			if (msg.hasOwnProperty('url')) {
				config.uri = msg.url
				if(shared.ffmpeg) shared.ffmpeg.kill()
				ffmpeg()
			}
		})
	});

	socketServer.broadcast = function (data) {
		socketServer.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				try {
					client.send(data);
				}
				catch (err) {
					console.log(err)
				}
			}
		});
	};
	httpsserver.listen(WEBSOCKET_PORT);

	// HTTPS Server to accept incomming MPEG-TS Stream from ffmpeg
	var streamServer = https.createServer(pem, function (request, response) {

		response.connection.setTimeout(0);
		console.log(
			'FFmpeg-jsRTSP : Stream Connected: ' +
			request.socket.remoteAddress + ':' +
			request.socket.remotePort
		);
		request.on('data', function (data) {
			socketServer.broadcast(data);
			if (request.socket.recording) {
				request.socket.recording.write(data);
			}
		});
		request.on('end', function () {
			console.log('close');
			if (request.socket.recording) {
				request.socket.recording.close();
			}
		});

		// Record the stream to a local file?
		if (RECORD_STREAM) {
			var path = 'recordings/' + Date.now() + '.ts';
			request.socket.recording = fs.createWriteStream(path);
		}
	}).listen(STREAM_PORT);

	console.log('FFmpeg-jsRTSP : Listening for incomming MPEG-TS Stream on https://127.0.0.1:' + STREAM_PORT);
	console.log('FFmpeg-jsRTSP : Awaiting WebSocket connections on ' + WEBSOCKET_PORT + ' port.');

}
