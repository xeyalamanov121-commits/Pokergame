const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const path = require('path');

// Statik faylların yeri
app.use(express.static(path.join(__dirname, '/')));

const pokerTables = { low: [], high: [] };

io.on('connection', (socket) => {
    console.log("Yeni bağlantı:", socket.id);

    socket.on('joinTable', (data) => {
        console.log("Qoşulma sorğusu gəldi:", data); // BUNU LOGS-DA GÖRMƏLİYİK
        
        const { tableId, playerName } = data;
        if (!pokerTables[tableId]) pokerTables[tableId] = [];
        
        socket.join(tableId);
        pokerTables[tableId].push({ id: socket.id, name: playerName });
        
        // CAVAB GÖNDƏRİRİK
        io.to(tableId).emit('tableUpdated', pokerTables[tableId]);
        console.log("Cavab göndərildi, otaq:", tableId);
    });
});

server.listen(process.env.PORT || 3001, () => console.log("Server aktivdir."));
