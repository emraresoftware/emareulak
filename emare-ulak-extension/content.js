// Emare Ulak - Sayfa Veri Toplayıcı
console.log('Emare Ulak aktif - Sayfa verileri toplanıyor...');

// Sayfadaki tüm verileri çek
function extractAllPageData() {
    console.log('Emare Ulak - Sayfa verileri çıkarılıyor...');
    
    // Tüm metin içeriğini topla
    const allText = document.body.innerText;
    
    // Tüm bağlantıları topla
    const links = Array.from(document.getElementsByTagName('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href
    }));
    
    // Tüm görselleri topla
    const images = Array.from(document.getElementsByTagName('img')).map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height
    }));
    
    // Sayfa bilgilerini topla
    const pageInfo = {
        url: window.location.href,
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || '',
        keywords: document.querySelector('meta[name="keywords"]')?.content || '',
        timestamp: new Date().toISOString()
    };
    
    return {
        pageInfo,
        text: allText,
        links,
        images,
        timestamp: new Date().toISOString()
    };
}

// Sayfa yüklendiğinde tüm verileri gönder
function sendPageData() {
    try {
        const pageData = extractAllPageData();
        console.log('Emare Ulak - Sayfa verileri hazır:', {
            url: pageData.pageInfo.url,
            title: pageData.pageInfo.title,
            textLength: pageData.text.length,
            linkCount: pageData.links.length,
            imageCount: pageData.images.length
        });
        
        // Arka plan script'ine gönder
        chrome.runtime.sendMessage({
            type: 'PAGE_DATA',
            data: pageData
        });
    } catch (error) {
        console.error('Emare Ulak - Veri gönderilirken hata:', error);
    }
}

// Sayfa yüklendiğinde ve DOM değişikliklerinde veri topla
function initializeDataCollection() {
    console.log('Emare Ulak - Veri toplama başlatılıyor...');
    
    // İlk yüklemede veri gönder
    sendPageData();
    
    // Sayfa değişikliklerini izle
    const observer = new MutationObserver((mutations) => {
        console.log('Emare Ulak - Sayfa değişikliği tespit edildi');
        sendPageData();
    });
    
    // Tüm sayfa değişikliklerini izle
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
    
    // URL değişikliklerini dinle (SPA'lar için)
    let lastUrl = location.href;
    setInterval(() => {
        if (lastUrl !== location.href) {
            console.log('Emare Ulak - URL değişikliği tespit edildi');
            lastUrl = location.href;
            sendPageData();
        }
    }, 1000);
}

// Sayfa yüklendikten sonra başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Emare Ulak - DOM yüklendi, başlatılıyor...');
        initializeDataCollection();
    });
} else {
    console.log('Emare Ulak - DOM zaten yüklenmiş, hemen başlatılıyor...');
    initializeDataCollection();
}