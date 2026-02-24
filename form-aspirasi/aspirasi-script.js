// 1. Import Fungsi Firebase (App & Firestore Database)
        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
        import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

        // 2. Config Project Kamu (JANGAN DIUBAH)
        const firebaseConfig = {
            apiKey: "AIzaSyDakz3NtOAmQxeSG9IK5DNdu5qnbE3-nsA",
            authDomain: "my-beautiful-web-f1db1.firebaseapp.com",
            projectId: "my-beautiful-web-f1db1",
            storageBucket: "my-beautiful-web-f1db1.firebasestorage.app",
            messagingSenderId: "298660851006",
            appId: "1:298660851006:web:8e726864086de22eadd06f",
            measurementId: "G-SRFRFYQB9X"
        };

        // 3. Mulai Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app); // Inisialisasi Database

        // 4. Logika Pengiriman Pesan
        const form = document.getElementById('FormAspirasi');
        const inputPesan = document.getElementById('PesanAspirasi');
        const tombol = document.getElementById('KirimAspirasi');

        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Mencegah halaman refresh

            // Cek apakah pesan kosong (validasi ekstra)
            if (!inputPesan.value.trim()) {
                alert("Mohon isi pesan terlebih dahulu!");
                return;
            }

            // Ubah tampilan tombol jadi Loading
            const teksAsli = tombol.innerText;
            tombol.innerText = "Mengirim...";
            tombol.disabled = true; // Tombol mati sementara

            try {
                // KIRIM KE DATABASE (Nama Collection: aspirasi_masuk)
                await addDoc(collection(db, "aspirasi_masuk"), {
                    pesan: inputPesan.value,
                    waktu: serverTimestamp() // Waktu server Google
                });

                // Sukses
                alert("Aspirasi terkirim!");
                form.reset(); // Kosongkan kotak pesan

            } catch (error) {
                // Gagal
                console.error("Error:", error);
                alert("Gagal mengirim: " + error.message);

            } finally {
                // Kembalikan tombol seperti semula
                tombol.innerText = teksAsli;
                tombol.disabled = false;
            }
        });

