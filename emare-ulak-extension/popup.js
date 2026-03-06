// Emare Ulak - Popup UI
console.log('Emare Ulak popup yüklendi');

document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.getElementById('status');
    const dataContainer = document.getElementById('data-container');
    
    // Başlangıç durumu
    statusDiv.textContent = 'Sayfa verileri toplanıyor...';
    statusDiv.style.color = '#1a73e8';
    
    // Arka plan script'inden gelen verileri işle
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('Emare Ulak - Popup mesaj alındı:', message.type);
        
        if (message.type === 'PAGE_DATA') {
            updateUI(message.data);
        }
    });
    
    // UI'ı güncelle
    function updateUI(data) {
        if (!data) {
            statusDiv.textContent = 'Henüz veri toplanmadı';
            statusDiv.style.color = '#666';
            return;
        }
        
        statusDiv.textContent = 'Son Güncelleme: ' + new Date().toLocaleTimeString();
        statusDiv.style.color = '#1a73e8';
        
        // Sayfa bilgilerini göster
        dataContainer.innerHTML = `
            <div class="data-section">
                <h3>${data.pageInfo.title || 'Başlık Yok'}</h3>
                <p>URL: <a href="${data.pageInfo.url}" target="_blank">${data.pageInfo.url}</a></p>
                <p>Toplam Metin: ${data.text.length} karakter</p>
                <p>Toplam Bağlantı: ${data.links.length}</p>
                <p>Toplam Görsel: ${data.images.length}</p>
            </div>
            <div class="data-section">
                <h4>Sayfa Açıklaması:</h4>
                <p>${data.pageInfo.description || 'Açıklama yok'}</p>
            </div>
        `;
    }
    
    // Sayfa verilerini iste
    function requestPageData() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {type: 'REQUEST_PAGE_DATA'});
            }
        });
    }
    
    // Sayfa yüklendiğinde veri iste
    requestPageData();
    
    // Yenile butonu
    document.getElementById('refreshBtn')?.addEventListener('click', requestPageData);
});
