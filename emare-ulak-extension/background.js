// Emare Ulak - Background Service Worker
console.log('Emare Ulak background service worker yüklendi');

// WebSocket bağlantısı için
let ws = null;
const WS_SERVER = 'ws://localhost:3001';

// WebSocket bağlantısı kur
function connectWebSocket() {
    try {
        ws = new WebSocket(WS_SERVER);
        
        ws.onopen = () => {
            console.log('Emare Ulak - WebSocket sunucuya bağlandı');
        };
        
        ws.onclose = () => {
            console.log('Emare Ulak - WebSocket bağlantısı koptu, yeniden bağlanılıyor...');
            setTimeout(connectWebSocket, 5000);
        };
        
        ws.onerror = (error) => {
            console.error('Emare Ulak - WebSocket hatası:', error);
        };
    } catch (error) {
        console.error('Emare Ulak - WebSocket bağlantı hatası:', error);
        setTimeout(connectWebSocket, 5000);
    }
}

// Service worker başladığında WebSocket'i bağla
connectWebSocket();

// Content script'ten gelen mesajları işle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Emare Ulak - Background mesaj alındı:', message.type);
    
    if (message.type === 'PAGE_DATA') {
        console.log('Emare Ulak - Sayfa verisi işleniyor:', {
            url: message.data.pageInfo?.url,
            title: message.data.pageInfo?.title,
            textLength: message.data.text?.length,
            linkCount: message.data.links?.length,
            imageCount: message.data.images?.length
        });
        
        // WebSocket üzerinden sunucuya gönder
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'PAGE_DATA',
                data: message.data
            }));
            console.log('Emare Ulak - Veri WebSocket ile gönderildi');
        } else {
            console.warn('Emare Ulak - WebSocket bağlantısı yok, veri gönderilemedi');
            // WebSocket bağlantısı yoksa yeniden bağlanmaya çalış
            connectWebSocket();
        }
        
        // Popup'a da bildirim gönder
        chrome.runtime.sendMessage({
            type: 'PAGE_DATA',
            data: message.data
        }).catch(() => {
            // Popup açık değilse hata verir, bu normal
        });
        
        sendResponse({ success: true });
    }
    
    return true; // Asenkron response için
});

// Extension yüklendiğinde
chrome.runtime.onInstalled.addListener(() => {
    console.log('Emare Ulak extension yüklendi');
});

// Tab değişikliklerini izle
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log('Emare Ulak - Sayfa yüklendi:', tab.url);
    }
});

// Alarm ile periyodik kontrol
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'websocket-check') {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.log('Emare Ulak - WebSocket yeniden bağlanılıyor...');
            connectWebSocket();
        }
    }
});

// Her 30 saniyede WebSocket durumunu kontrol et
chrome.alarms.create('websocket-check', { periodInMinutes: 0.5 });
