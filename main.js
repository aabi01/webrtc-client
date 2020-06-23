'use strict';
var peerConn;
var dataChannel;

// var socket = io.connect('https://ec2-3-125-38-186.eu-central-1.compute.amazonaws.com:8085');
var socket = io.connect('ws://localhost:8085');

socket.on('peers', function(peers) {
	console.log('got peers from signaling server', peers);
});

peerConn = new RTCPeerConnection({});
peerConn.onicecandidate = function (event) {
	if (event.candidate) {
		var ip = event.candidate.address;
		console.log('CANDIDATE: ', event.candidate);
		console.log('GOT IP ADDRESS: ', ip);
		const _span = document.querySelector('#localip');
		_span.innerHTML = ip;
		socket.send('publish_ip', ip);
	}
};
dataChannel = peerConn.createDataChannel('photos');
peerConn.createOffer(onLocalSessionCreated, logError);

function onLocalSessionCreated(desc) {
	peerConn.setLocalDescription(desc, function () {}, logError);
}

function logError(err) {
	if (!err) return;
	if (typeof err === 'string') {
		console.warn(err);
	} else {
		console.warn(err.toString(), err);
	}
}