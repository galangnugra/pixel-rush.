// ========================================
// CONFIG
// ========================================

const API_URL =
    "MASUKKAN_URL_GOOGLE_APPS_SCRIPT_DI_SINI";


// ========================================
// GLOBAL
// ========================================

let currentUser = null;

let canvas;
let ctx;

let player;
let coin;

let score = 0;
let gameRunning = false;

let keys = {};


// ========================================
// PAGE MANAGEMENT
// ========================================

function hideAllPages() {

    document.querySelectorAll(".page")
        .forEach(page => {
            page.classList.add("hidden");
        });

}

function showLogin() {

    hideAllPages();

    document
        .getElementById("loginPage")
        .classList.remove("hidden");

}

function showRegister() {

    hideAllPages();

    document
        .getElementById("registerPage")
        .classList.remove("hidden");

}

function showMenu() {

    hideAllPages();

    document
        .getElementById("menuPage")
        .classList.remove("hidden");

    if (currentUser) {

        document.getElementById("playerName")
            .textContent = currentUser;

    }

}


// ========================================
// API
// ========================================

async function api(action, data = {}) {

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify({

                action: action,
                ...data

            })

        });

        return await response.json();

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: "Tidak dapat terhubung ke server."
        };

    }

}


// ========================================
// REGISTER
// ========================================

async function register() {

    const username =
        document.getElementById("regUsername")
        .value
        .trim();

    const password =
        document.getElementById("regPassword")
        .value;

    const password2 =
        document.getElementById("regPassword2")
        .value;

    const message =
        document.getElementById("registerMessage");


    if (!username || !password) {

        message.textContent =
            "Username dan password wajib diisi.";

        return;

    }

    if (password !== password2) {

        message.textContent =
            "Password tidak sama.";

        return;

    }

    if (username.length < 3) {

        message.textContent =
            "Username minimal 3 karakter.";

        return;

    }

    if (password.length < 6) {

        message.textContent =
            "Password minimal 6 karakter.";

        return;

    }


    message.textContent = "Mendaftarkan akun...";


    const result = await api("register", {

        username: username,
        password: password

    });


    if (result.success) {

        message.textContent =
            "Akun berhasil dibuat!";

        document.getElementById("regUsername")
            .value = "";

        document.getElementById("regPassword")
            .value = "";

        document.getElementById("regPassword2")
            .value = "";

        setTimeout(showLogin, 1000);

    } else {

        message.textContent =
            result.message;

    }

}


// ========================================
// LOGIN
// ========================================

async function login() {

    const username =
        document.getElementById("username")
        .value
        .trim();

    const password =
        document.getElementById("password")
        .value;

    const message =
        document.getElementById("loginMessage");


    if (!username || !password) {

        message.textContent =
            "Username dan password wajib diisi.";

        return;

    }


    message.textContent =
        "Memeriksa akun...";


    const result = await api("login", {

        username: username,
        password: password

    });


    if (result.success) {

        currentUser = username;

        document.getElementById("playerName")
            .textContent = username;

        showMenu();

    } else {

        message.textContent =
            result.message;

    }

}


// ========================================
// LOGOUT
// ========================================

function logout() {

    currentUser = null;

    score = 0;

    document.getElementById("username")
        .value = "";

    document.getElementById("password")
        .value = "";

    showLogin();

}


// ========================================
// GAME
// ========================================

function startGame() {

    hideAllPages();

    document
        .getElementById("gamePage")
        .classList.remove("hidden");


    document.getElementById("gamePlayer")
        .textContent = currentUser;


    canvas =
        document.getElementById("gameCanvas");

    ctx = canvas.getContext("2d");


    canvas.width = 400;
    canvas.height = 600;


    score = 0;

    document.getElementById("score")
        .textContent = score;


    player = {

        x: 175,
        y: 540,

        width: 50,
        height: 30,

        speed: 6

    };


    createCoin();

    gameRunning = true;

    gameLoop();

}


// ========================================
// CREATE COIN
// ========================================

function createCoin() {

    coin = {

        x: Math.random() *
            (canvas.width - 30),

        y: -30,

        size: 20,

        speed:
            2 +
            Math.random() * 3

    };

}


// ========================================
// GAME LOOP
// ========================================

function gameLoop() {

    if (!gameRunning) {
        return;
    }


    update();

    draw();


    requestAnimationFrame(gameLoop);

}


// ========================================
// UPDATE
// ========================================

function update() {

    if (keys["ArrowLeft"]) {

        player.x -= player.speed;

    }

    if (keys["ArrowRight"]) {

        player.x += player.speed;

    }


    // Batas kiri

    if (player.x < 0) {

        player.x = 0;

    }


    // Batas kanan

    if (
        player.x + player.width >
        canvas.width
    ) {

        player.x =
            canvas.width -
            player.width;

    }


    // Koin turun

    coin.y += coin.speed;


    // Collision

    if (

        coin.x < player.x +
        player.width &&

        coin.x + coin.size >
        player.x &&

        coin.y < player.y +
        player.height &&

        coin.y + coin.size >
        player.y

    ) {

        score++;

        document
            .getElementById("score")
            .textContent = score;

        createCoin();

    }


    // Koin terlewat

    if (coin.y > canvas.height) {

        createCoin();

    }

}


// ========================================
// DRAW
// ========================================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Background

    ctx.fillStyle = "#111";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Stars

    ctx.fillStyle = "#333";

    for (let i = 0; i < 30; i++) {

        let x =
            (i * 73) %
            canvas.width;

        let y =
            (i * 113) %
            canvas.height;

        ctx.fillRect(
            x,
            y,
            2,
            2
        );

    }


    // Coin

    ctx.beginPath();

    ctx.arc(

        coin.x + coin.size / 2,

        coin.y + coin.size / 2,

        coin.size / 2,

        0,

        Math.PI * 2

    );

    ctx.fillStyle = "#f5c542";

    ctx.fill();


    ctx.fillStyle = "#111";

    ctx.font = "bold 14px Arial";

    ctx.textAlign = "center";

    ctx.fillText(

        "$",

        coin.x + coin.size / 2,

        coin.y + 15

    );


    // Player

    ctx.fillStyle = "#4da6ff";

    ctx.fillRect(

        player.x,

        player.y,

        player.width,

        player.height

    );


    // Player top

    ctx.fillStyle = "#79bdff";

    ctx.fillRect(

        player.x + 8,

        player.y - 8,

        player.width - 16,

        8

    );

}


// ========================================
// KEYBOARD
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        keys[event.key] = true;

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        keys[event.key] = false;

    }
);


// ========================================
// TOUCH / MOBILE
// ========================================

let touchStartX = null;

canvasTouchSetup();


function canvasTouchSetup() {

    document.addEventListener(
        "touchstart",
        function(event) {

            if (
                !gameRunning ||
                event.touches.length === 0
            ) {
                return;
            }

            touchStartX =
                event.touches[0].clientX;

        },
        { passive: true }
    );


    document.addEventListener(
        "touchmove",
        function(event) {

            if (
                !gameRunning ||
                touchStartX === null
            ) {
                return;
            }


            const currentX =
                event.touches[0].clientX;

            const difference =
                currentX - touchStartX;


            if (difference > 10) {

                player.x += player.speed;

            }

            if (difference < -10) {

                player.x -= player.speed;

            }


            touchStartX = currentX;

        },
        { passive: true }
    );


    document.addEventListener(
        "touchend",
        function() {

            touchStartX = null;

        }
    );

}


// ========================================
// END GAME
// ========================================

async function endGame() {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;


    // Simpan skor

    const result = await api("saveScore", {

        username: currentUser,

        score: score

    });


    if (!result.success) {

        alert(
            "Skor gagal disimpan: " +
            result.message
        );

    }


    showMenu();

}


// ========================================
// LEADERBOARD
// ========================================

async function showLeaderboard() {

    hideAllPages();

    document
        .getElementById("leaderboardPage")
        .classList.remove("hidden");


    const leaderboard =
        document.getElementById("leaderboard");


    leaderboard.innerHTML =
        "Memuat leaderboard...";


    const result =
        await api("leaderboard");


    if (!result.success) {

        leaderboard.innerHTML =
            "Gagal memuat leaderboard.";

        return;

    }


    if (!result.data ||
        result.data.length === 0) {

        leaderboard.innerHTML =
            "Belum ada skor.";

        return;

    }


    leaderboard.innerHTML = "";


    result.data.forEach(
        (item, index) => {

            const row =
                document.createElement("div");

            row.className = "rank";


            row.innerHTML = `

                <div class="rankNumber">
                    #${index + 1}
                </div>

                <div class="rankName">
                    ${escapeHTML(item.username)}
                </div>

                <div class="rankScore">
                    ${
