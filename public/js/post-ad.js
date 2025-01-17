document.getElementById('postAdForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    // Form verilerini kontrol etmek için konsola yazdır
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    fetch('/api/post-ad', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('İlan başarıyla yayınlandı!');
            window.location.href = '/'; // Ana sayfaya yönlendir
        } else {
            alert('İlan yayınlanırken bir hata oluştu: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Hata:', error);
        alert('İlan yayınlanırken bir hata oluştu!');
    });
}); 