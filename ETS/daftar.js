
document.addEventListener("DOMContentLoaded", () => {
    /*elemen halaman*/
    const tabel = document.getElementById("tabelAnggota");
    const form = document.getElementById("formAnggota");
    const modalFormElement = document.getElementById("anggotaModal");
    const modalHapusElement = document.getElementById("hapusModal");
    const tombolTambah = document.getElementById("tambahAnggota");
    const searchInput = document.getElementById("searchAnggota");
    const filterStatus = document.getElementById("filterStatus");
    const emptyState = document.getElementById("emptyState");
    const jumlahHasil = document.getElementById("jumlahHasil");

    /*pastikan elemen utama tersedia*/
    if (!tabel || !form || !modalFormElement || !modalHapusElement) {
        console.error("Elemen daftar anggota tidak ditemukan. Periksa ID HTML.");
        return;
    }

    if (typeof bootstrap === "undefined") {
        console.error("Bootstrap JavaScript belum dimuat.");
        return;
    }

    const modalForm = bootstrap.Modal.getOrCreateInstance(modalFormElement);
    const modalHapus = bootstrap.Modal.getOrCreateInstance(modalHapusElement);

    const inputId = document.getElementById("anggotaId");
    const inputNama = document.getElementById("namaMahasiswa");
    const inputNim = document.getElementById("nrpMahasiswa");
    const inputEmail = document.getElementById("emailMahasiswa");
    const inputStatus = document.getElementById("statusMahasiswa");

    const STORAGE_KEY = "libriora_daftar_anggota";

    /*data contoh awal*/
    const dataAwal = [
        {
            id: 1,
            nama: "Jessica Febiola",
            nim: "5025251001",
            email: "jessica@example.com",
            status: "aktif"
        },
        {
            id: 2,
            nama: "Jonathan Pratama",
            nim: "5025251002",
            email: "jonathan@example.com",
            status: "aktif"
        },
        {
            id: 3,
            nama: "Maria Natalia",
            nim: "5025251003",
            email: "maria@example.com",
            status: "tidak aktif"
        },
        {
            id: 4,
            nama: "Kevin Alexander",
            nim: "5025251004",
            email: "kevin@example.com",
            status: "aktif"
        },
        {
            id: 5,
            nama: "Jessica Amelia",
            nim: "5025251005",
            email: "amelia@example.com",
            status: "tidak aktif"
        },
        {
            id: 6,
            nama: "Rafifah Rahma",
            nim: "5025251006",
            email: "vfahh@example.com",
            status: "aktif"
        },
        {
            id: 7,
            nama: "VijvikaNala",
            nim: "5025251007",
            email: "nalasnrt@example.com",
            status: "aktif"
        },
        {
            id: 8,
            nama: "Kezia Livina",
            nim: "5025251008",
            email: "Liviimut@example.com",
            status: "aktif"
        },
        {
            id: 9,
            nama: "Valencia Wibowo",
            nim: "5025251009",
            email: "Valwib@example.com",
            status: "aktif"
        },
        {
            id: 10,
            nama: "Alinasay",
            nim: "5025251010",
            email: "Alinasay@example.com",
            status: "tidak aktif"
        }
        
    ];

    /*validasi struktur data*/
    function dataValid(data) {
        return Array.isArray(data) && data.every((item) =>
            item &&
            item.id !== undefined &&
            typeof item.nama === "string" &&
            typeof item.nim === "string" &&
            typeof item.email === "string" &&
            ["aktif", "tidak aktif"].includes(item.status)
        );
    }

    /*muat data anggota*/
    function muatData() {
        try {
            const tersimpan = localStorage.getItem(STORAGE_KEY);

            if (tersimpan === null) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dataAwal));
                return dataAwal.map((item) => ({ ...item }));
            }

            const data = JSON.parse(tersimpan);

            if (dataValid(data)) {
                return data;
            }

            console.error("Format data anggota tidak valid.");
            return dataAwal.map((item) => ({ ...item }));
        } catch (error) {
            console.error("Gagal memuat data anggota:", error);
            return dataAwal.map((item) => ({ ...item }));
        }
    }

    let anggota = muatData();
    let idUntukDihapus = null;
    let timerNotifikasi = null;

    /*simpan perubahan*/
    function simpanData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(anggota));
            return true;
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            tampilkanNotifikasi("Gagal menyimpan data. Periksa penyimpanan browser.");
            return false;
        }
    }

    /*amankan teks sebelum ditampilkan*/
    function aman(teks) {
        return String(teks).replace(/[&<>"']/g, (karakter) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[karakter]);
    }

    /*notifikasi*/
    function tampilkanNotifikasi(pesan, berhasil = true) {
        const toast = document.getElementById("notifikasi");
        const teks = document.getElementById("pesanNotifikasi");

        if (!toast || !teks) {
            console.log(pesan);
            return;
        }

        teks.textContent = pesan;

        const ikon = toast.querySelector("i");

        if (ikon) {
            ikon.className = berhasil
                ? "bi bi-check-circle-fill"
                : "bi bi-exclamation-circle-fill";
        }

        toast.classList.toggle("error", !berhasil);
        toast.classList.add("show");

        clearTimeout(timerNotifikasi);

        timerNotifikasi = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    /*perbarui statistik*/
    function perbaruiStatistik() {
        const aktif = anggota.filter(
            (item) => item.status === "aktif"
        ).length;

        const total = document.getElementById("totalAnggota");
        const totalAktif = document.getElementById("totalAktif");
        const totalTidakAktif = document.getElementById("totalTidakAktif");

        if (total) total.textContent = anggota.length;
        if (totalAktif) totalAktif.textContent = aktif;
        if (totalTidakAktif) {
            totalTidakAktif.textContent = anggota.length - aktif;
        }
    }

    /*tampilkan tabel*/
    function renderTabel() {
        const kataKunci = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const statusPilihan = filterStatus
            ? filterStatus.value
            : "semua";

        const hasil = anggota.filter((item) => {
            const cocokKata = item.nama.toLowerCase().includes(kataKunci) ||
                item.nim.toLowerCase().includes(kataKunci);

            const cocokStatus = statusPilihan === "semua" ||
                item.status === statusPilihan;

            return cocokKata && cocokStatus;
        });

        tabel.innerHTML = hasil.map((item, index) => {
            const aktif = item.status === "aktif";

            return `
                <tr>
                    <td class="member-number">${index + 1}</td>
                    <td><span class="member-name">${aman(item.nama)}</span></td>
                    <td>${aman(item.nim)}</td>
                    <td class="member-email">${aman(item.email)}</td>
                    <td>
                        <span class="member-status ${aktif ? "active" : "inactive"}">
                            ${aktif ? "Aktif" : "Tidak Aktif"}
                        </span>
                    </td>
                    <td>
                        <div class="member-actions">
                            <button type="button"
                                class="member-action-button"
                                data-action="detail"
                                data-id="${item.id}"
                                title="Lihat detail"
                                aria-label="Lihat detail anggota">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button type="button"
                                class="member-action-button"
                                data-action="edit"
                                data-id="${item.id}"
                                title="Edit anggota"
                                aria-label="Edit anggota">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            <button type="button"
                                class="member-action-button delete"
                                data-action="hapus"
                                data-id="${item.id}"
                                title="Hapus anggota"
                                aria-label="Hapus anggota">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        if (emptyState) {
            emptyState.classList.toggle("d-none", hasil.length > 0);
        }

        if (jumlahHasil) {
            jumlahHasil.textContent =
                `Menampilkan ${hasil.length} dari ${anggota.length} anggota`;
        }

        perbaruiStatistik();
    }

    /*reset form*/
    function resetForm() {
        form.reset();
        inputId.value = "";
        inputStatus.value = "aktif";

        document.getElementById("anggotaModalLabel").textContent =
            "Tambah Anggota";

        inputNim.setCustomValidity("");
        inputEmail.setCustomValidity("");
    }


    /*tampilkan detail anggota*/
    function lihatDetail(item) {
        let detailModal = document.getElementById("detailAnggotaModal");

        if (!detailModal) {
            detailModal = document.createElement("div");
            detailModal.id = "detailAnggotaModal";
            detailModal.className = "modal fade";
            detailModal.tabIndex = -1;
            detailModal.setAttribute("aria-labelledby", "detailAnggotaLabel");
            detailModal.setAttribute("aria-hidden", "true");

            detailModal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content member-modal">
                        <div class="modal-header">
                            <div>
                                <p class="member-eyebrow">member information</p>
                                <h2 class="modal-title" id="detailAnggotaLabel">Detail Anggota</h2>
                            </div>
                            <button type="button" class="btn-close"
                                data-bs-dismiss="modal" aria-label="Tutup"></button>
                        </div>
                        <div class="modal-body" id="detailAnggotaIsi"></div>
                        <div class="modal-footer">
                            <button type="button" class="member-cancel-button"
                                data-bs-dismiss="modal">Tutup</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(detailModal);
        }

        const isi = detailModal.querySelector("#detailAnggotaIsi");

        isi.innerHTML = `
            <div class="mb-3">
                <small class="text-secondary">Nama mahasiswa</small>
                <div class="fw-semibold">${aman(item.nama)}</div>
            </div>
            <div class="mb-3">
                <small class="text-secondary">NIM/NIP</small>
                <div class="fw-semibold">${aman(item.nim)}</div>
            </div>
            <div class="mb-3">
                <small class="text-secondary">Email</small>
                <div class="fw-semibold text-break">${aman(item.email)}</div>
            </div>
            <div>
                <small class="text-secondary">Status anggota</small>
                <div>
                    <span class="member-status ${item.status === "aktif" ? "active" : "inactive"}">
                        ${item.status === "aktif" ? "Aktif" : "Tidak Aktif"}
                    </span>
                </div>
            </div>
        `;

        bootstrap.Modal.getOrCreateInstance(detailModal).show();
    }

    /*aksi detail, edit, dan hapus*/
    tabel.addEventListener("click", (event) => {
        const tombol = event.target.closest("button[data-action]");

        if (!tombol) return;

        const id = tombol.dataset.id;
        const item = anggota.find(
            (data) => String(data.id) === String(id)
        );

        if (!item) {
            tampilkanNotifikasi("Data anggota tidak ditemukan.", false);
            return;
        }

        if (tombol.dataset.action === "detail") {
            lihatDetail(item);
        }

        if (tombol.dataset.action === "edit") {
            resetForm();

            inputId.value = item.id;
            inputNama.value = item.nama;
            inputNim.value = item.nim;
            inputEmail.value = item.email;
            inputStatus.value = item.status;

            document.getElementById("anggotaModalLabel").textContent =
                "Edit Anggota";

            modalForm.show();
        }

        if (tombol.dataset.action === "hapus") {
            idUntukDihapus = item.id;

            document.getElementById("hapusPesan").textContent =
                `Data ${item.nama} akan dihapus dari daftar anggota.`;

            modalHapus.show();
        }
    });

    /*validasi nomor dan email duplikat*/
    inputNim.addEventListener("input", () => {
        inputNim.setCustomValidity("");
    });

    inputEmail.addEventListener("input", () => {
        inputEmail.setCustomValidity("");
    });

    /*tambah atau edit anggota*/
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const id = inputId.value;
        const nama = inputNama.value.trim();
        const nim = inputNim.value.trim();
        const email = inputEmail.value.trim();
        const status = inputStatus.value;

        if (!nama || !nim || !email) {
            tampilkanNotifikasi("Semua kolom wajib diisi.", false);
            return;
        }

        const nimDuplikat = anggota.some((item) =>
            item.nim.toLowerCase() === nim.toLowerCase() &&
            String(item.id) !== id
        );

        if (nimDuplikat) {
            inputNim.setCustomValidity("NIM/NIP ini sudah terdaftar.");
            inputNim.reportValidity();
            tampilkanNotifikasi("NIM/NIP sudah digunakan.", false);
            return;
        }

        const emailDuplikat = anggota.some((item) =>
            item.email.toLowerCase() === email.toLowerCase() &&
            String(item.id) !== id
        );

        if (emailDuplikat) {
            inputEmail.setCustomValidity("Email ini sudah terdaftar.");
            inputEmail.reportValidity();
            tampilkanNotifikasi("Email sudah digunakan.", false);
            return;
        }

        let dataSebelum = anggota.map((item) => ({ ...item }));

        if (id) {
            anggota = anggota.map((item) =>
                String(item.id) === id
                    ? { ...item, nama, nim, email, status }
                    : item
            );
        } else {
            const idBaru = anggota.reduce(
                (maks, item) => Math.max(maks, Number(item.id) || 0),
                0
            ) + 1;

            anggota.push({
                id: idBaru,
                nama,
                nim,
                email,
                status
            });
        }

        if (!simpanData()) {
            anggota = dataSebelum;
            return;
        }

        modalForm.hide();
        renderTabel();

        tampilkanNotifikasi(
            id ? "Data anggota berhasil diperbarui." : "Anggota baru berhasil ditambahkan."
        );
    });

    /*konfirmasi hapus*/
    document.getElementById("konfirmasiHapus").addEventListener("click", () => {
        if (idUntukDihapus === null) return;

        const dataSebelum = anggota.map((item) => ({ ...item }));

        anggota = anggota.filter(
            (item) => String(item.id) !== String(idUntukDihapus)
        );

        if (!simpanData()) {
            anggota = dataSebelum;
            return;
        }

        idUntukDihapus = null;
        modalHapus.hide();
        renderTabel();

        tampilkanNotifikasi("Data anggota berhasil dihapus.");
    });

    /*pencarian dan filter*/
    if (searchInput) {
        searchInput.addEventListener("input", renderTabel);
    }

    if (filterStatus) {
        filterStatus.addEventListener("change", renderTabel);
    }

    /*tahun footer*/
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    /*tampilkan data saat halaman dibuka*/
    renderTabel();
});
