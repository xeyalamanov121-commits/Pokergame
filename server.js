const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');

// BURA ÇOX VACİBDİR: index.html-in olduğu qovluğu dəqiq göstəririk
app.use(express.static(path.join(__dirname, '/')));

const pokerTables = { low: [], high: [] };

io.on('connection', (socket) => {
    console.log("Yeni istifadəçi qoşuldu: " + socket.id);
    
    socket.on('joinTable', (data) => {
        const { tableId, playerName } = data;
        if (!pokerTables[tableId]) pokerTables[tableId] = [];
        
        socket.join(tableId);
        pokerTables[tableId].push({ id: socket.id, name: playerName });
        
        // Mərtəbəyə məlumat göndəririk
        io.to(tableId).emit('tableUpdated', pokerTables[tableId]);
    });
});

const PORT = process.env.PORT || 3001;
http.listen(PORT, () => console.log("Server aktivdir port: " + PORT));
