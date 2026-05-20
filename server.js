const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Frontend fayllarının xidməti
app.use(express.static(__dirname));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

// Masaların vəziyyətini saxlayan obyekt
const pokerTables = {
    low: [],
    high: []
};

io.on('connection', (socket) => {
    console.log(`🟢 Yeni oyunçu qoşuldu: ${socket.id}`);

    // Oyunçunun masaya qoşulması
    socket.on('joinTable', ({ tableId, playerName }) => {
        if (!pokerTables[tableId]) {
            pokerTables[tableId] = [];
        }

        // Oyunçunu masaya əlavə et
        socket.join(tableId);
        pokerTables[tableId].push({ 
            id: socket.id, 
            name: playerName 
        });

        console.log(`👤 ${playerName} -> [${tableId}] masasına oturdu.`);

        // Masadakı hər kəsə yenilənmiş siyahını göndər
        io.to(tableId).emit('tableUpdated', pokerTables[tableId]);
    });

    // Oyunçu ayrıldıqda
    socket.on('disconnect', () => {
        console.log(`🔴 Oyunçu ayrıldı: ${socket.id}`);
        
        for (const tableId in pokerTables) {
            const initialLength = pokerTables[tableId].length;
            pokerTables[tableId] = pokerTables[tableId].filter(p => p.id !== socket.id);
            
            // Əgər oyunçu bu masada idisə, siyahını yenilə
            if (pokerTables[tableId].length !== initialLength) {
                io.to(tableId).emit('tableUpdated', pokerTables[tableId]);
            }
        }
    });
});

// Serverin portu (Render avtomatik təyin edir)
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Poker Serveri ${PORT} portunda aktivdir!`);
});
