const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Statik faylları (index.html) göstərmək üçün
app.use(express.static(__dirname));

// Məlumatların saxlanacağı faylın adı
const DB_FILE = 'data.json';

// Fayl mövcud deyilsə, boş bazanı yarat
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: {} }));
}

// Bazanı oxuyan funksiya
const loadData = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

// Bazaya yazan funksiya
const saveData = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const pokerTables = {};

io.on('connection', (socket) => {
    console.log(`🟢 Yeni oyunçu qoşuldu! ID: ${socket.id}`);

    // Masa sisteminə qoşulma və balans yoxlaması
    socket.on('joinTable', ({ tableId, userId, playerName, buyIn }) => {
        let data = loadData();

        // İstifadəçi bazada yoxdursa, yeni yarad (Başlanğıc 10$ balans ilə)
        if (!data.users[userId]) {
            data.users[userId] = { balance: 10.00, name: playerName };
            saveData(data);
        }

        // Balansı yoxla
        if (data.users[userId].balance >= buyIn) {
            // Balansdan girişi çıx
            data.users[userId].balance -= buyIn;
            saveData(data);

            // Masaya qoşul
            socket.join(tableId);
            if (!pokerTables[tableId]) pokerTables[tableId] = [];
            pokerTables[tableId].push({ id: socket.id, name: playerName, userId });

            // Yenilənmiş məlumatları göndər
            io.to(tableId).emit('tableUpdated', pokerTables[tableId]);
            socket.emit('balanceUpdated', { balance: data.users[userId].balance });

            console.log(`👤 ${playerName} -> [${tableId}] masasına əyləşdi (Giriş: ${buyIn})`);
        } else {
            socket.emit('error', 'Balansınız kifayət deyil!');
        }
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
    console.log(`🚀 Poker Serveri ${PORT} portunda aktivdir!`);
});
