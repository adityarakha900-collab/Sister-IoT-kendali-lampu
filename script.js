
// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAVCiFCyJPQ4sNyIkzmb7lV78p5-JsbFb8",
    authDomain: "kendali-lampu-iot-fd69d.firebaseapp.com",
    databaseURL: "https://kendali-lampu-iot-fd69d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kendali-lampu-iot-fd69d",
    storageBucket: "kendali-lampu-iot-fd69d.firebasestorage.app",
    messagingSenderId: "850281354046",
    appId: "1:850281354046:web:becb87e76dfd71269c126f"
};

// ==========================================
// INISIALISASI FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ==========================================
// STATUS KONEKSI WEBSITE DAN WEMOS
// ==========================================

const koneksi = document.getElementById("koneksi");

function ubahStatusKoneksi(status) {
    koneksi.innerText = status;
}

// ==========================================
// LOGIN ANONYMOUS FIREBASE
// ==========================================

async function mulaiFirebase() {
    try {
        await signInAnonymously(auth);

        console.log("Login Firebase berhasil!");

        ubahStatusKoneksi("● Firebase Terhubung");

        // Mulai membaca status lampu
        pantauLampu();

        // Mulai membaca status Wemos
        pantauWemos();

    } catch (error) {
        console.error("Firebase error:", error);

        ubahStatusKoneksi("● Gagal terhubung ke Firebase");
    }
}

// ==========================================
// MEMBACA STATUS 3 LAMPU
// ==========================================

function pantauLampu() {

    const lampuRef = ref(db, "lampu");

    onValue(lampuRef, (snapshot) => {

        const data = snapshot.val() || {};

        document.getElementById("status1").innerText =
            data.lampu1 === true ? "MENYALA" : "MATI";

        document.getElementById("status2").innerText =
            data.lampu2 === true ? "MENYALA" : "MATI";

        document.getElementById("status3").innerText =
            data.lampu3 === true ? "MENYALA" : "MATI";

    }, (error) => {
        console.error("Gagal membaca lampu:", error);
    });
}

// ==========================================
// MEMBACA STATUS WEMOS
// ==========================================

function pantauWemos() {

    const wemosRef = ref(db, "wemos/online");

    onValue(wemosRef, (snapshot) => {

        const online = snapshot.val();

        if (online === true) {
            ubahStatusKoneksi("● Wemos Terhubung");
        } else {
            ubahStatusKoneksi("● Wemos Tidak Terhubung");
        }

    }, (error) => {
        console.error("Gagal membaca status Wemos:", error);
    });
}

// ==========================================
// FUNGSI KENDALI LAMPU
// ==========================================

window.kendali = async function(lampu, aksi) {

    try {

        if (!auth.currentUser) {
            throw new Error("Firebase belum login");
        }

        const perintah = aksi === "on";

        if (lampu === "semua") {

            await update(ref(db, "lampu"), {
                lampu1: perintah,
                lampu2: perintah,
                lampu3: perintah
            });

        } else {

            await update(ref(db, "lampu"), {
                [lampu]: perintah
            });

        }

        console.log(lampu + " berhasil diubah menjadi " + aksi);

    } catch (error) {

        console.error("Gagal mengirim perintah:", error);

        alert("Gagal mengirim perintah ke Firebase. Periksa koneksi dan Rules database.");

    }
};

// ==========================================
// JALANKAN FIREBASE
// ==========================================

mulaiFirebase();
