document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPendaftaran");
    const inputNama = document.getElementById("namaLengkap");
    const inputNim = document.getElementById("nomorInduk");
    function validasiNomorInduk(nim) {
    return nim.trim().length > 0;
    }
    const inputProdi = document.getElementById("programStudi");
    const inputAlamat = document.getElementById("alamat");
    const inputTelepon = document.getElementById("nomorTelepon");
    const pesanTelepon = inputTelepon.nextElementSibling;
    function cekTeleponLangsung() {
        const nilai = inputTelepon.value.trim();
        if (nilai === "") {
            inputTelepon.setCustomValidity("");
            inputTelepon.classList.remove("is-invalid");
            if (pesanTelepon) {
                pesanTelepon.textContent =
                    "Masukkan nomor telepon yang valid.";
            }
            return;
        }
        if (!validasiTelepon(nilai)) {
            inputTelepon.setCustomValidity(
                "Gunakan 8–15 digit angka untuk nomor telepon."
            );
            inputTelepon.classList.add("is-invalid");

            if (pesanTelepon) {
                pesanTelepon.textContent =
                    "Format penulisan salah. Gunakan angka, 8–15 digit.";
            }
        } else {
            inputTelepon.setCustomValidity("");
            inputTelepon.classList.remove("is-invalid");
        }
    }
    inputTelepon.addEventListener("input", cekTeleponLangsung);
    inputTelepon.addEventListener("blur", cekTeleponLangsung);

    const inputEmail = document.getElementById("email");
    const pesanEmail = inputEmail.nextElementSibling;
    function validasiEmail(email) {
        const pola = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pola.test(email.trim());
    }
    function cekEmailLangsung() {
        const nilai = inputEmail.value.trim();
        if (nilai === "") {
            inputEmail.setCustomValidity("");
            inputEmail.classList.remove("is-invalid");

            if (pesanEmail) {
                pesanEmail.textContent =
                    "Masukkan alamat email dengan format yang benar.";
            }
            return;
        }
        if (!validasiEmail(nilai)) {
            inputEmail.setCustomValidity(
                "Masukkan email dengan format yang benar."
            );
            inputEmail.classList.add("is-invalid");

            if (pesanEmail) {
                pesanEmail.textContent =
                    "Format email salah. Contoh: nama@email.com";
            }
        } else {
            inputEmail.setCustomValidity("");
            inputEmail.classList.remove("is-invalid");
        }
    }
    
    inputEmail.addEventListener("input", cekEmailLangsung);
    inputEmail.addEventListener("blur", cekEmailLangsung);
    const inputJenis = document.getElementById("jenisKeanggotaan");
    const tombolSubmit = document.getElementById("tombolSubmit");

    const notifikasi = document.getElementById("notifikasiPendaftaran");
    const pesanNotifikasi = document.getElementById("pesanPendaftaran");
    const ikonNotifikasi = document.getElementById("ikonNotifikasi");
    const tombolTutup = document.getElementById("tutupNotifikasi");

    const STORAGE_KEY = "libriora_daftar_anggota";
    let timerNotifikasi;

    function tampilkanNotifikasi(pesan, berhasil = true) {
        pesanNotifikasi.textContent = pesan;
        ikonNotifikasi.className = berhasil
            ? "bi bi-check-circle-fill"
            : "bi bi-exclamation-circle-fill";

        notifikasi.classList.toggle("error", !berhasil);
        notifikasi.classList.add("show");

        clearTimeout(timerNotifikasi);
        timerNotifikasi = setTimeout(() => {
            notifikasi.classList.remove("show");
        }, 4500);
    }

    tombolTutup.addEventListener("click", () => {
        notifikasi.classList.remove("show");
        clearTimeout(timerNotifikasi);
    });

    function bacaAnggota() {
        const tersimpan = localStorage.getItem(STORAGE_KEY);
        if (tersimpan === null) {
            return [];
        }
        const data = JSON.parse(tersimpan);
        if (!Array.isArray(data)) {
            throw new Error("Format data anggota tidak valid.");
        }
        return data;
    }

    function validasiTelepon(telepon) {
        const jumlahAngka = telepon.replace(/\D/g, "").length;
        const pola = /^\+?[0-9()\-\s]+$/;
        return pola.test(telepon.trim()) &&
            jumlahAngka >= 8 &&
            jumlahAngka <= 15;
    }

    form.querySelectorAll("input, select, textarea").forEach((elemen) => {
        elemen.addEventListener("input", () => {
            elemen.setCustomValidity("");
            elemen.classList.remove("is-invalid");
        });
        elemen.addEventListener("change", () => {
            elemen.setCustomValidity("");
            elemen.classList.remove("is-invalid");
        });
    });

    inputJenis.addEventListener("change", () => {
        const label = document.querySelector(
            'label[for="programStudi"]'
        );
        if (inputJenis.value === "mahasiswa") {
            label.innerHTML = 'Program Studi <span>*</span>';
            inputProdi.placeholder = "Contoh: Teknik Informatika";
        } else {
            label.innerHTML = 'Program Studi / Unit Kerja <span>*</span>';
            inputProdi.placeholder = "Masukkan program studi atau unit kerja";
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        form.querySelectorAll(".form-control, .form-select")
            .forEach((elemen) => {
                elemen.classList.remove("is-invalid");
                elemen.setCustomValidity("");
            });

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            form.querySelectorAll(":invalid").forEach((elemen) => {
                elemen.classList.add("is-invalid");
            });

            tampilkanNotifikasi(
                "Pendaftaran gagal. Periksa kembali kolom yang wajib diisi.",
                false
            );

            form.querySelector(":invalid")?.focus();
            return;
        }

        const nama = inputNama.value.trim();
        const nim = inputNim.value.trim();
        const programStudi = inputProdi.value.trim();
        const alamat = inputAlamat.value.trim();
        const telepon = inputTelepon.value.trim();
        const email = inputEmail.value.trim();
        const jenisKeanggotaan = inputJenis.value;

        if (!validasiNomorInduk(nim)) {
            inputNim.setCustomValidity("NIM/NIP wajib diisi.");
            inputNim.classList.add("is-invalid");
            inputNim.reportValidity();
            tampilkanNotifikasi("NIM/NIP wajib diisi.", false);
            return;
        }

        
        if (!validasiTelepon(telepon)) {
            inputTelepon.classList.add("is-invalid");
            const pesan = inputTelepon.nextElementSibling;
            if (pesan && pesan.classList.contains("invalid-feedback")) {
                pesan.textContent =
                    "Format penulisan salah. Nomor telepon harus menggunakan angka (8–15 digit).";
            }
            inputTelepon.setCustomValidity(
                "Nomor telepon harus menggunakan 8–15 digit angka."
            );
            inputTelepon.reportValidity();
            tampilkanNotifikasi(
                "Format nomor telepon tidak valid.",
                false
            );
            return;
        }

        if (!validasiEmail(email)) {
            inputEmail.classList.add("is-invalid");
            inputEmail.setCustomValidity(
                "Masukkan email dengan format yang benar."
            );

            const pesan = inputEmail.nextElementSibling;

            if (pesan && pesan.classList.contains("invalid-feedback")) {
                pesan.textContent =
                    "Format email salah. Contoh: nama@email.com";
            }

            inputEmail.reportValidity();

            tampilkanNotifikasi(
                "Pendaftaran gagal. Periksa format email kamu.",
                false
            );
            return;
        }

        if (!["mahasiswa", "dosen", "tenaga kependidikan"]
            .includes(jenisKeanggotaan)) {
            tampilkanNotifikasi(
                "Pilih jenis keanggotaan yang tersedia.",
                false
            );
            return;
        }

        let anggota;

        try {
            anggota = bacaAnggota();
        } catch (error) {
            console.error("Gagal membaca data anggota:", error);
            tampilkanNotifikasi(
                "Data anggota gagal dibaca. Silakan muat ulang halaman.",
                false
            );
            return;
        }

        const nimSudahAda = anggota.some((item) =>
            String(item.nim || "").trim().toLowerCase() ===
            nim.toLowerCase()
        );

        if (nimSudahAda) {
            inputNim.setCustomValidity(
                "NIM/NIP sudah terdaftar. Periksa kembali nomor induk kamu."
            );
            inputNim.classList.add("is-invalid");
            inputNim.reportValidity();

            tampilkanNotifikasi(
                "Pendaftaran gagal. NIM/NIP sudah terdaftar.",
                false
            );
            return;
        }

        tombolSubmit.disabled = true;

        const idBaru = anggota.reduce(
            (maks, item) => Math.max(maks, Number(item.id) || 0),
            0
        ) + 1;

        const anggotaBaru = {
            id: idBaru,
            nama,
            nim,
            email,
            status: "aktif",
            programStudi,
            alamat,
            telepon,
            jenisKeanggotaan,
            tanggalPendaftaran: new Date().toISOString()
        };

        try {
            anggota.push(anggotaBaru);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(anggota));

            form.reset();
            form.classList.remove("was-validated");

            form.querySelectorAll(".is-invalid").forEach((elemen) => {
                elemen.classList.remove("is-invalid");
            });

            tampilkanNotifikasi(
                "Pendaftaran berhasil! Data kamu sudah masuk ke daftar anggota."
            );
        } catch (error) {
            console.error("Gagal menyimpan pendaftaran:", error);

            tampilkanNotifikasi(
                "Pendaftaran gagal disimpan. Periksa penyimpanan browser dan coba lagi.",
                false
            );
        } finally {
            tombolSubmit.disabled = false;
        }
    });
});
