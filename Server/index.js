const PORT = 8443;

const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('message', (data) => {
        const { username, message } = data;
        console.log(`${username} sent => ${message}`);
        io.emit('message', `${username} sent => ${message}`);
    });
});

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});