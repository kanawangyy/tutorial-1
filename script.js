// File: script.js (Revisi untuk konfirmasi Logout)

// Simpan status login di Session Storage untuk sesi browser
const IS_LOGGED_IN = 'isLoggedIn';
const VALID_USERNAME = 'Wangsit Bagus Satriatama'; // Ganti ini jika Anda ingin user/password yang berbeda
const VALID_PASSWORD = 'mahiru shiina'; // Ganti ini jika Anda ingin user/password yang berbeda

// Fungsi untuk mengecek otentikasi dan mengarahkan pengguna
const checkAuthenticationAndRedirect = () => {
    // Ambil path file saat ini (misal: index.html, login.html)
    const path = window.location.pathname.split('/').pop();
    const isLoggedIn = sessionStorage.getItem(IS_LOGGED_IN) === 'true';

    // 1. Jika user TIDAK login dan mencoba mengakses halaman yang diproteksi
    if (!isLoggedIn && path !== 'login.html' && path !== '') {
        // Redirect ke login.html
        window.location.href = 'login.html';
        return true; // Menghentikan eksekusi script selanjutnya
    } 
    
    // 2. Jika user SUDAH login dan mencoba mengakses login.html
    else if (isLoggedIn && path === 'login.html') {
        // Redirect ke index.html
        window.location.href = 'index.html';
        return true; // Menghentikan eksekusi script selanjutnya
    }
    
    return false; // Lanjutkan eksekusi script
};

// Panggil check autentikasi segera. Jika redirect terjadi, hentikan script.
if (checkAuthenticationAndRedirect()) {
    // Hentikan eksekusi script pada saat redirect.
} else {
    // Jika tidak ada redirect, jalankan semua script interaktif setelah DOM dimuat.
    document.addEventListener('DOMContentLoaded', () => {
        
        // --- Setup Variabel ---
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const loginForm = document.getElementById('login-form');
        const logoutButton = document.getElementById('logout-button');

        // === A. MODE TERANG/GELAP (Theme Toggle) ===
        const applyTheme = (theme) => {
            body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);

            if (themeToggle) { // Cek apakah tombol ada (tidak ada di login.html)
                themeToggle.textContent = (theme === 'dark' ? '☀️' : '🌙');
                themeToggle.setAttribute('aria-label', `Ubah ke Tema ${theme === 'dark' ? 'Terang' : 'Gelap'}`);
            }
        };

        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = body.getAttribute('data-theme');
                const newTheme = (currentTheme === 'light' ? 'dark' : 'light');
                applyTheme(newTheme);
            });
        }
        
        // --- LOGIKA LOGOUT BARU DENGAN KONFIRMASI ---
        if (logoutButton) {
            const isLoggedIn = sessionStorage.getItem(IS_LOGGED_IN) === 'true';
            logoutButton.style.display = isLoggedIn ? 'inline-block' : 'none';
            
            logoutButton.addEventListener('click', () => {
                // Tampilkan pop-up konfirmasi
                const isConfirmed = confirm('Apakah Anda yakin ingin keluar (Logout)? Anda harus login lagi untuk mengakses konten.');
                
                if (isConfirmed) {
                    // Jika pengguna menekan OK (true)
                    sessionStorage.removeItem(IS_LOGGED_IN);
                    window.location.href = 'login.html';
                }
                // Jika pengguna menekan Batal (false), tidak terjadi apa-apa
            });
        }


        // === B. LOGIKA LOGIN (Hanya di halaman login.html) ===
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const feedbackElement = document.getElementById('login-feedback');

                feedbackElement.textContent = ''; // Hapus pesan lama

                if (username === VALID_USERNAME && password === VALID_PASSWORD) {
                    // Login Berhasil
                    sessionStorage.setItem(IS_LOGGED_IN, 'true');
                    // Tunggu sebentar untuk memberi kesan loading (opsional)
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 500);
                } else {
                    // Login Gagal
                    feedbackElement.textContent = '❌ Nama pengguna atau kata sandi salah. (Coba: user/password)';
                }
            });
        }


        // === C. Animasi Mulus (Intersection Observer) ===
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        const animatedElements = document.querySelectorAll(
            '.fade-in-up, .slide-in-left, .slide-in-right, .scale-in, .shift-left, .slide-in-up, .delay-1, .delay-2, .delay-3, .delay-4, .delay-5, .delay-6, .delay-7'
        );

        animatedElements.forEach(el => {
            observer.observe(el);
        });

        // === D. Logika Formulir Newsletter ===
        const forms = document.querySelectorAll('.newsletter-form');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const emailInput = form.querySelector('input[type="email"]');
                const submitButton = form.querySelector('.submit-button');

                let feedback = form.querySelector('.form-feedback');
                if (feedback) {
                    feedback.remove();
                }
                
                if (!emailRegex.test(emailInput.value)) {
                    feedback = document.createElement('p');
                    feedback.className = 'form-feedback error';
                    feedback.textContent = '❌ Masukkan alamat email yang valid!';
                    form.appendChild(feedback);
                    emailInput.focus();
                    return;
                }

                submitButton.textContent = 'Mengirim...';
                submitButton.disabled = true;

                setTimeout(() => {
                    feedback = document.createElement('p');
                    feedback.className = 'form-feedback success';
                    feedback.textContent = '✅ Berhasil! Anda telah terdaftar di Newsletter.';
                    
                    form.innerHTML = ''; 
                    form.appendChild(feedback);

                }, 1500);
            });
        });
    });
}
