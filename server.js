<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <title>Bearbee Cyber Empire</title>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script src="https://sad.adsgram.ai/js/adsgram-api.js"></script>
    <style>
        body { background: #121212; color: white; text-align: center; font-family: sans-serif; }
        button { padding: 15px; margin: 10px; cursor: pointer; border-radius: 8px; border: none; }
    </style>
</head>
<body>
    <h1>Bearbee Cyber Empire</h1>
    
    <div id="balanceDisplay">Balansınız yoxlanılır...</div>
    
    <button onclick="joinRoom('beginner', 0.50)" style="background: #2196f3;">0.50$ (Beginner)</button>
    <button onclick="joinRoom('pro', 2.00)" style="background: #9c27b0;">2.00$ (Pro)</button>

    <script>
        const socket = io(); // Render-də avtomatik işləyəcək
        const userId = "user_" + Date.now(); 
        const playerName = "Oyunçu";

        socket.on('balanceUpdated', (data) => {
            document.getElementById('balanceDisplay').innerText = `Balansınız: ${data.balance}$`;
        });

        function joinRoom(tableId, buyIn) {
            socket.emit('joinTable', { tableId, userId, playerName, buyIn });
        }
    </script>
</body>
</html>
