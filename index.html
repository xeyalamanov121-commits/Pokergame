const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Masaların vəziyyəti
const pokerTables = {
    low: [],
    high: []
};

io.on('connection', (socket) => {
    console.log(`🟢 Yeni bağlantı: ${socket.id}`);

    socket.on('joinTable', ({ tableId, playerName }) => {
        // Əgər masa yoxdursa, təhlükəsizlik üçün yarat
        if (!pokerTables[tableId]) pokerTables[tableId] = [];

        // Oyunçu artıq masadadırsa, əlavə etmə
        if (pokerTables[tableId].find(p => p.id === socket.id)) return;

        // Oyunçunu masaya qoş
        socket.join(tableId);
        pokerTables[tableId].push({ id: socket.id, name: playerName });

        console.log(`👤 ${playerName} -> [${tableId}] masasına oturdu.`);

        // Masadakı hər kəsə yenilənmiş siyahını göndər
        io.to(tableId).emit('tableUpdated', pokerTables[tableId]);
    });

    socket.on('disconnect', () => {
        console.log(`🔴 Oyunçu ayrıldı: ${socket.id}`);
        
        // Bütün masaları yoxla və oyunçunu siyahıdan təmizlə
        Object.keys(pokerTables).forEach(tableId => {
            const initialLength = pokerTables[tableId].length;
            pokerTables[tableId] = pokerTables[tableId].filter(p => p.id !== socket.id);
            
            // Əgər siyahı dəyişibsə, masadakılara xəbər ver
            if (pokerTables[tableId].length !== initialLength) {
                io.to(tableId).emit('tableUpdated', pokerTables[tableId]);
            }
        });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Poker Serveri ${PORT} portunda aktivdir!`);
});
