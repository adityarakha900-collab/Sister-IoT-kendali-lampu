
// ==================================
// FUNGSI UPDATE STATUS LAMPU
// ==================================

async function updateStatus() {
    try {
        const response = await fetch('/status');

        if (!response.ok) {
            throw new Error('Gagal membaca status');
        }

        const data = await response.json();

        document.getElementById('status1').innerText =
            data.lampu1 ? 'MENYALA' : 'MATI';

        document.getElementById('status2').innerText =
            data.lampu2 ? 'MENYALA' : 'MATI';

        document.getElementById('status3').innerText =
            data.lampu3 ? 'MENYALA' : 'MATI';

        document.getElementById('koneksi').innerText =
            '● Wemos Terhubung';

    } catch (error) {

        document.getElementById('koneksi').innerText =
            '● Wemos Tidak Terhubung';

        document.getElementById('status1').innerText =
            'Tidak terhubung';

        document.getElementById('status2').innerText =
            'Tidak terhubung';

        document.getElementById('status3').innerText =
            'Tidak terhubung';
    }
}


// ==================================
// FUNGSI KENDALI LAMPU
// ==================================

async function kendali(lampu, aksi) {

    try {
        const response = await fetch(
            `/kendali?lampu=${lampu}&aksi=${aksi}`
        );

        if (!response.ok) {
            throw new Error('Perintah gagal');
        }

        await updateStatus();

    } catch (error) {
        alert('Tidak dapat terhubung ke Wemos!');
    }
}


// ==================================
// UPDATE STATUS OTOMATIS
// ==================================

updateStatus();

setInterval(updateStatus, 2000);
