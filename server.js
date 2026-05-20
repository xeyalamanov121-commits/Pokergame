const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let databaseMock = {};

app.post('/api/user/sync', (req, res) => {
    const { user_id, honey, ton_balance, deposit_balance } = req.body;
    
    if (user_id) {
        databaseMock[user_id] = {
            honey: parseInt(honey) || 0,
            ton_balance: parseFloat(ton_balance) || 0.0,
            deposit_balance: parseFloat(deposit_balance) || 0.0
        };
        console.log(`✅ İstifadəçi ${user_id} məlumatları sinxronlaşdırıldı.`);
    }
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda aktivdir!`));
