const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const path = require('path');

app.use(express.static(path.join(__dirname, '/')));

const pokerTables = { low: [], high: [] };

io.on('connection', (socket) => {
    console.log("Yeni oyunçu qoşuldu:", socket.id);

    socket.on('joinTable', (data) => {
        const { tableId, playerName } = data;
        if (!pokerTables[tableId]) pokerTables[tableId] = [];
        
        socket.join(tableId);
        pokerTables[tableId].push({ id: socket.id, name: playerName });
        
        // MÜHİM: Bu hissə bütün masadakılara siyahını göndərir
        io.to(tableId).emit('tableUpdated', pokerTables[tableId]);
    });
});

server.listen(process.env.PORT || 3001, () => console.log("Server aktivdir."));
