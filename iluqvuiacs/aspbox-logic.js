import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// --- CONFIG FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDakz3NtOAmQxeSG9IK5DNdu5qnbE3-nsA",
    authDomain: "my-beautiful-web-f1db1.firebaseapp.com",
    projectId: "my-beautiful-web-f1db1",
    storageBucket: "my-beautiful-web-f1db1.firebasestorage.app",
    messagingSenderId: "298660851006",
    appId: "1:298660851006:web:8e726864086de22eadd06f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const inboxDiv = document.getElementById('inbox');
const btnRefresh = document.getElementById('btnRefresh');

// FUNGSI LOAD DATA
async function muatPesan() {
    inboxDiv.innerHTML = "<p class='status-text' style='grid-column: 1/-1; text-align: center;'>⏳ Memeriksa kotak surat...</p>";
    
    try {
        const q = query(collection(db, "aspirasi_masuk"), orderBy("waktu", "desc"));
        const snapshot = await getDocs(q);
        inboxDiv.innerHTML = ""; 

        if (snapshot.empty) {
            inboxDiv.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Kotak surat kosong.</p>";
            return;
        }

        snapshot.forEach((messageDoc) => {
            const data = messageDoc.data();
            const id = messageDoc.id;
            const dateObj = data.waktu ? data.waktu.toDate() : new Date();
            const tgl = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            const jam = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

            const card = document.createElement('div');
            card.className = 'mail-card';
            card.innerHTML = `
                <div class="postcard" id="capture-${id}">
                    <div class="airmail-strip"></div>
                    <div class="postcard-body">
                        <div class="stamp-mark"><i class="fa-solid fa-paper-plane"></i><span>${tgl}</span><span>${jam}</span></div>
                        <div class="message-content"><p class="message-text">"${data.pesan}"</p></div>
                        <div class="postcard-footer">
                            <div class="branding"><i class="fa-solid fa-bolt"></i> AspirasiBox</div>
                            <div>#Rahasia</div>
                        </div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="action-btn btn-download" data-id="${id}"><i class="fa-solid fa-camera"></i> Simpan</button>
                    <button class="action-btn btn-delete" data-id="${id}"><i class="fa-solid fa-trash"></i>Hapus</button>
                </div>
            `;
            inboxDiv.appendChild(card);
        });

        // Event Listener untuk tombol di dalam kartu
        tambahEventListenerTombol();

    } catch (e) {
        console.error(e);
        inboxDiv.innerHTML = "<p>Gagal memuat data.</p>";
    }
}

function tambahEventListenerTombol() {
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.onclick = () => unduhPesan(btn.getAttribute('data-id'));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = () => hapusPesan(btn.getAttribute('data-id'));
    });
}

// FUNGSI DOWNLOAD
window.unduhPesan = (id) => {
    const element = document.getElementById(`capture-${id}`);
    html2canvas(element, { scale: 3, backgroundColor: "#ffffff" }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Surat-${id}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
};

// FUNGSI HAPUS
window.hapusPesan = async (id) => {
    if (confirm("Hapus surat ini?")) {
        await deleteDoc(doc(db, "aspirasi_masuk", id));
        muatPesan();
    }
};

btnRefresh.onclick = muatPesan;
muatPesan();
