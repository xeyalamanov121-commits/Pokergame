const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');

app.use(express.static(path.join(__dirname, '/')));

// Oyun məntiqi (Kartlar, qiymətləndirmə və s.)
// ... (Faylında olan createDeck, shuffle və evaluateHand funksiyaları bura daxildir)

const tables = {}; // Masaların siyahısı

io.on('connection', (socket) => {
    console.log("Yeni istifadəçi qoşuldu:", socket.id);

    socket.on('joinTable', ({ tableId, playerName }) => {
        if (!tables[tableId]) {
            tables[tableId] = { players: [], phase: 'waiting', actionHistory: [] };
        }
        
        const table = tables[tableId];
        table.players.push({ id: socket.id, name: playerName, balance: 1000 });
        socket.join(tableId);
        
        // Bütün oyunçulara masanı göndər
        io.to(tableId).emit('tableUpdated', table);
    });

    // Oyun hərəkətləri (action) və digər məntiq burada idarə olunur
});

const PORT = process.env.PORT || 3001;
http.listen(PORT, () => console.log(`Server ${PORT} portunda aktivdir!`));
