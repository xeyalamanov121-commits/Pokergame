const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const pokerTables = {};

io.on('connection', (socket) => {
    console.log(`🟢 Yeni oyunçu qoşuldu! ID: ${socket.id}`);

    socket.on('joinTable', ({ tableId, playerName }) => {
        socket.join(tableId);
        
        if (!pokerTables[tableId]) {
            pokerTables[tableId] = [];
        }
        
        pokerTables[tableId].push({ id: socket.id, name: playerName });
        io.to(tableId).emit('tableUpdated', pokerTables[tableId]);
        console.log(`👤 ${playerName} -> [${tableId}] masasına əyləşdi.`);
    });

    socket.on('disconnect', () => {
        console.log(`🔴 Oyunçu ayrıldı. ID: ${socket.id}`);
        for (const tableId in pokerTables) {
            pokerTables[tableId] = pokerTables[tableId].filter(player => player.id !== socket.id);
            io.to(tableId).emit('tableUpdated', pokerTables[tableId]);
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Canlı Poker Serveri ${PORT} portunda aktivdir!`);
});

