const port = 8080,
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: port});

console.log('listening on port: ' + port);

const clients = [];

wss.on('connection', function connection(ws) {
	clients.push(ws);
	ws.on('message', function(message) {
		console.log('message: ' + message);
		for (const client of clients) {
			client.send(message);
		}
	});

	ws.on('close', function() {
		const index = clients.indexOf(ws);
		if (index > -1) {
			clients.splice(index, 1);
		}
	});
	ws.send('Server: connected!');

});
