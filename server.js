const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

// 1. Məlumat bazası (fayl sistemi)
const DB_FILE = 'data.json';
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ users: {} }));

const loadData = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const saveData = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

const pokerTables = {};

io.on('connection', (socket) => {
    console.log(`🟢 Yeni oyunçu qoşuldu! ID: ${socket.id}`);

    // Masa siyahısı və balans yoxlaması ilə qoşulma
    socket.on('joinTable', ({ tableId, userId, playerName, buyIn }) => {
        let data = loadData();
        
        // Yeni istifadəçidirsə, balans yaradır
        if (!data.users[userId]) {
            data.users[userId] = { balance: 10.00, name: playerName };
            saveData(data);
        }

        // Balans yoxlaması
        if (data.users[userId].balance >= buyIn) {
            data.users[userId].balance -= buyIn;
            saveData(data);
            
            socket.join(tableId);
            if (!pokerTables[tableId]) pokerTables[tableId] = [];
            pokerTables[tableId].push({ id: socket.id, name: playerName, userId });
            
            io.to(tableId).emit('tableUpdated', pokerTables[tableId]);
            socket.emit('balanceUpdated', { balance: data.users[userId].balance });
            console.log(`👤 ${playerName} -> [${tableId}] masasına əyləşdi (Buy-in: ${buyIn})`);
        } else {
            socket.emit('error', 'Balansınız kifayət deyil!');
        }
    });

    socket.on('disconnect', () => {
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
