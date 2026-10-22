
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");
    const inputUsername = document.getElementById("username");
    const inputPassword = document.getElementById("password");
    const tombolLogin = document.getElementById("tombolLogin");
    const tombolToggle = document.getElementById("togglePassword");
    const pesanError = document.getElementById("pesanError");

    const notifikasi = document.getElementById("notifikasiLogin");
    const ikonNotifikasi = document.getElementById("ikonLogin");
    const teksNotifikasi = document.getElementById("teksNotifikasiLogin");
    const tombolTutup = document.getElementById("tutupNotifikasiLogin");

    const usernamePetugas = "petugas";
    const passwordPetugas = "libriora123";

    let timerNotifikasi;

    document.getElementById("tahunLogin").textContent =
        new Date().getFullYear();
    tombolToggle.addEventListener("click", () => {
        const sedangTersembunyi = inputPassword.type === "password";

        inputPassword.type = sedangTersembunyi ? "text" : "password";

        tombolToggle.innerHTML = sedangTersembunyi
            ? '<i class="bi bi-eye-slash"></i>'
            : '<i class="bi bi-eye"></i>';

        tombolToggle.setAttribute(
            "aria-label",
            sedangTersembunyi ? "Sembunyikan password" : "Tampilkan password"
        );
    });

    function tampilkanNotifikasi(pesan, berhasil = true) {
        teksNotifikasi.textContent = pesan;

        ikonNotifikasi.className = berhasil
            ? "bi bi-check-circle-fill"
            : "bi bi-exclamation-circle-fill";

        notifikasi.classList.toggle("error", !berhasil);
        notifikasi.classList.add("show");

        clearTimeout(timerNotifikasi);

        timerNotifikasi = setTimeout(() => {
            notifikasi.classList.remove("show");
        }, 3500);
    }

    tombolTutup.addEventListener("click", () => {
        notifikasi.classList.remove("show");
        clearTimeout(timerNotifikasi);
    });

    function tampilkanError(pesan) {
        pesanError.textContent = pesan;
        pesanError.classList.add("show");
    }

    function bersihkanError() {
        pesanError.textContent = "";
        pesanError.classList.remove("show");

        inputUsername.classList.remove("is-invalid");
        inputPassword.classList.remove("is-invalid");
    }

    inputUsername.addEventListener("input", bersihkanError);
    inputPassword.addEventListener("input", bersihkanError);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        bersihkanError();

        const username = inputUsername.value.trim();
        const password = inputPassword.value;

        if (!username || !password) {
            if (!username) {
                inputUsername.classList.add("is-invalid");
            }

            if (!password) {
                inputPassword.classList.add("is-invalid");
            }

            tampilkanError("Username dan password wajib diisi.");

            tampilkanNotifikasi(
                "Login gagal. Lengkapi username dan password.",
                false
            );

            return;
        }

        tombolLogin.disabled = true;
        tombolLogin.innerHTML =
            'Memeriksa akun... <i class="bi bi-arrow-repeat"></i>';
        const loginBerhasil =
            username === usernamePetugas &&
            password === passwordPetugas;

        if (loginBerhasil) {
            tampilkanNotifikasi("Login berhasil! Selamat datang, Petugas.");

            try {
                sessionStorage.setItem("libriora_login_petugas", "true");
            } catch (error) {
                console.warn("Status sesi tidak dapat disimpan.", error);
            }

            tombolLogin.innerHTML =
                'Login berhasil <i class="bi bi-check-lg"></i>';
            setTimeout(() => {
                window.location.href = "daftar-anggota.html";
            }, 900);
        } else {
            tombolLogin.disabled = false;
            tombolLogin.innerHTML =
                'Masuk sebagai Petugas <i class="bi bi-arrow-right"></i>';

            inputUsername.classList.add("is-invalid");
            inputPassword.classList.add("is-invalid");

            tampilkanError(
                "Username atau password salah. Silakan coba lagi."
            );

            tampilkanNotifikasi(
                "Login gagal. Periksa kembali akun petugas.",
                false
            );

            localStorage.setItem("libriora_petugas_login", "true");
            window.location.href = "daftar-anggota.html";
        }
    });
});
