const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto'); // UUID üretimi için

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });
const clients = new Set();
const pageData = new Map();
const MAX_DATA_ENTRIES = 1000;

// Heartbeat interval
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Handle WebSocket upgrade requests
server.on('upgrade', (request, socket, head) => {
    // You can add authentication here if needed
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Handle WebSocket connections
wss.on('connection', (ws, request) => {
    const clientId = Date.now();
    const clientIp = request.socket.remoteAddress;
    
    console.log(`🔌 Yeni WebSocket bağlantısı (${clientIp})`);
    clients.add(ws);
    console.log(`✅ Aktif bağlantı sayısı: ${clients.size}`);

    // Send initial data to new client
    if (pageData.size > 0) {
        const data = Array.from(pageData.values()).slice(-50); // Last 50 entries
        ws.send(JSON.stringify({ type: 'INITIAL_DATA', data }));
    }

    // Heartbeat mechanism
    const heartbeatInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, HEARTBEAT_INTERVAL);

    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`📨 ${clientIp}'den gelen mesaj:`, data);
            
            if (data.type === 'PAGE_DATA') {
                const pageId = data.data.pageInfo?.url || Date.now().toString();
                const timestamp = new Date().toISOString();
                
                const entry = {
                    ...data.data,
                    id: pageId,
                    timestamp: timestamp,
                    receivedAt: new Date().toISOString()
                };

                // Store the data
                pageData.set(pageId, entry);

                // Clean up old entries if needed
                if (pageData.size > MAX_DATA_ENTRIES) {
                    const oldestKey = [...pageData.entries()]
                        .sort((a, b) => new Date(a[1].timestamp) - new Date(b[1].timestamp))[0][0];
                    pageData.delete(oldestKey);
                }

                // Broadcast to all clients
                broadcast({ type: 'NEW_PAGE_DATA', data: entry });
            }
        } catch (err) {
            console.error('Mesaj işlenirken hata:', err);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        clearInterval(heartbeatInterval);
        clients.delete(ws);
        console.log(`❌ Bağlantı kapandı. Aktif bağlantı sayısı: ${clients.size}`);
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket hatası:', error);
        clearInterval(heartbeatInterval);
        clients.delete(ws);
    });
});

// Broadcast to all clients
function broadcast(message) {
    const messageString = JSON.stringify(message);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messageString, (error) => {
                if (error) {
                    console.error('Mesaj gönderilirken hata:', error);
                    clients.delete(client);
                }
            });
        }
    });
}

// API Endpoint: Tüm verileri getir
app.get('/api/data', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const allData = Array.from(pageData.values())
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
        
        res.json(allData);
    } catch (err) {
        console.error('API hatası (GET /api/data):', err);
        res.status(500).json({ error: 'Veri alınırken bir hata oluştu' });
    }
});

// API Endpoint: Yeni veri ekle
app.post('/api/data', (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).json({ error: 'Geçersiz veri' });
        }

        const entry = {
            ...data,
            id: randomUUID(),
            timestamp: new Date().toISOString()
        };

        pageData.set(entry.id, entry);

        // Bellek sınırı kontrolü
        if (pageData.size > MAX_DATA_ENTRIES) {
            const oldestKey = [...pageData.entries()]
                .sort((a, b) => new Date(a[1].timestamp) - new Date(b[1].timestamp))[0][0];
            pageData.delete(oldestKey);
        }

        // Tüm bağlı istemcilere yeni veriyi gönder
        broadcast({ type: 'NEW_PAGE_DATA', data: entry });

        res.status(201).json(entry);
    } catch (err) {
        console.error('API hatası (POST /api/data):', err);
        res.status(500).json({ error: 'Veri kaydedilirken bir hata oluştu' });
    }
});

// Dashboard sayfası
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Ana sayfa
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Emare Ulak Sunucusu</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
                    h1 { color: #1a73e8; }
                    .info { background: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    a { color: #1a73e8; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h1>Emare Ulak Sunucusu Çalışıyor 🚀</h1>
                <div class="info">
                    <p>Bu sunucu, Emare Ulak Chrome eklentisi için veri toplama ve yönetim paneli sunar.</p>
                    <p>Toplam kayıtlı veri sayısı: <strong>${pageData.size}</strong></p>
                    <p>Aktif WebSocket bağlantıları: <strong>${clients.size}</strong></p>
                </div>
                <p><a href="/dashboard" target="_blank">Yönetim Paneli'ni Aç</a></p>
                <p>API Dokümantasyonu:</p>
                <ul>
                    <li><code>GET /api/data</code> - Tüm verileri getir</li>
                    <li><code>POST /api/data</code> - Yeni veri ekle</li>
                </ul>
            </body>
        </html>
    `);
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`\n🚀 Emare Ulak sunucusu çalışıyor:`);
    console.log(`   - Ana sayfa: http://localhost:${PORT}`);
    console.log(`   - API: http://localhost:${PORT}/api/data`);
    console.log(`   - Dashboard: http://localhost:${PORT}/dashboard\n`);
    console.log('Aktif WebSocket bağlantıları:', clients.size, '\n');
});

// Hata yönetimi
process.on('uncaughtException', (err) => {
    console.error('Yakalanmamış hata:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('İşlenmemiş Promise reddi:', reason);
});

console.log('Sunucu çalışmaya devam ediyor...\n');
