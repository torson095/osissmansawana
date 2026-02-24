// Fungsi untuk memuat navbar
function loadNavbar() {
  fetch('/navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-container').innerHTML = data;
    })
    .catch(error => console.error('Gagal memuat navbar:', error));
}

// Jalankan fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadNavbar);
