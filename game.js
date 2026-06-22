const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const screenWidth = canvas.width;
const screenHeight = canvas.height;

// UI Elements
const uiLayer = document.getElementById('ui-layer');
const ammoDisplay = document.getElementById('ammo-display');
const heartsDisplay = document.getElementById('hearts-display');
const levelDisplay = document.getElementById('level-display');
const scoreDisplay = document.getElementById('score-display');
const trapTimerContainer = document.getElementById('trap-timer-container');
const trapTimerText = document.getElementById('trap-timer');
const gameOverScreen = document.getElementById('game-over-screen');
const mainMenu = document.getElementById('main-menu');
const levelClearedScreen = document.getElementById('level-cleared-screen');
const highscoreScreen = document.getElementById('highscore-screen');
const aboutScreen = document.getElementById('about-screen');

// --- AUDIO SYSTEM ---
let zzfx, zzfxV, zzfxX;
zzfxV = 0.3;
zzfx = (p = 1, k = .05, b = 220, e = 0, r = 0, t = .1, q = 0, D = 1, u = 0, y = 0, v = 0, z = 0, l = 0, E = 0, A = 0, F = 0, c = 0, w = 1, m = 0, B = 0) => { let M = Math, R = 44100, d = 2 * M.PI, G = u *= 500 * d / R / R, C = b *= (1 - k + 2 * k * M.random(k = [])) * d / R, g = 0, H = 0, a = 0, n = 1, I = 0, J = 0, f = 0, x, h; e = R * e + 9; m *= R; r *= R; t *= R; c *= R; y *= 500 * d / R ** 3; A *= d / R; v *= d / R; z *= R; l = R * l | 0; for (h = e + m + r + t + c | 0; a < h; k[a++] = f)++J % (100 * F | 0) || (f = q ? 1 < q ? 2 < q ? 3 < q ? M.sin((g % d) ** 3) : M.max(M.min(M.tan(g), 1), -1) : 1 - (2 * g / d % 2 + 2) % 2 : 1 - 4 * M.abs(M.round(g / d) - g / d) : M.sin(g)), f = (l ? 1 - B + B * M.sin(d * a / l) : 1) * (0 < f ? 1 : -1) * M.abs(f) ** D * p * zzfxV * (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - w) : a < e + m + r ? w : a < h - c ? (h - a - c) / t * w : 0), f = c ? f / 2 + (c > a ? 0 : (a < h - c ? 1 : (h - a) / c) * k[a - c | 0] / 2) : f, x = (b += u += y) * M.cos(A * H++), g += x - x * E * (1 - 1E9 * (M.sin(a) + 1) % 2), n && ++n > z && (b += v, C += v, n = 0), !l || ++I % l || (b = C, u = G, n = n || 1); p = zzfxX.createBuffer(1, h, R); p.getChannelData(0).set(k); b = zzfxX.createBufferSource(); b.buffer = p; b.connect(zzfxX.destination); b.start(); return b };

let audioInit = false;
const audioAssets = {
    gunshot: new Audio('asset/9mm Single.mp3'),
    enemyDeath: new Audio('asset/Enemy_Robot_Death-009.wav'),
    footstep: new Audio('asset/Footstep_Boot_Concrete-005.wav'),
    bgmMenu: new Audio('asset/mainmenu.mp3'),
    bgmGame: new Audio('asset/ingame.mp3')
};
audioAssets.bgmMenu.loop = true;
audioAssets.bgmGame.loop = true;
audioAssets.bgmGame.volume = 0.5;
audioAssets.footstep.playbackRate = 1.5;

function initAudio() {
    if (audioInit) {
        if (zzfxX && zzfxX.state === 'suspended') zzfxX.resume();
        return;
    }
    audioInit = true;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    zzfxX = new AudioContext();
    
    // Unlock all assets on first interaction
    for(let key in audioAssets) {
        audioAssets[key].load();
        if (key === 'bgmMenu') {
            audioAssets[key].play().catch(e => { });
        } else {
            // Play then immediately pause to unlock them
            audioAssets[key].play().then(() => {
                audioAssets[key].pause();
                audioAssets[key].currentTime = 0;
            }).catch(e => { });
        }
    }
}

function playSound(name) {
    if (!audioInit) return;
    if (audioAssets[name]) {
        audioAssets[name].currentTime = 0;
        audioAssets[name].play().catch(e => { });
    }
}

const sfx = {
    btnClick: () => { if (audioInit) zzfx(0.5, 0.1, 1200, 0, 0.01, 0.01, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0); },
    enemyHit: () => { if (audioInit) zzfx(1, 0.05, 200, 0, 0.1, 0.1, 1, 1.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0.02, 0); },
    itemPickup: () => { if (audioInit) zzfx(1, 0.05, 600, 0.05, 0.1, 0.1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0); },
    playerHit: () => { if (audioInit) zzfx(1, 0.05, 100, 0.05, 0.1, 0.2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0.05, 0); },
    mutate: () => { if (audioInit) zzfx(1, 0.1, 400, 0.1, 0.2, 0.3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0.1, 0); }
};

document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true, passive: true });
document.addEventListener('touchend', initAudio, { once: true, passive: true });

const btnFS = document.getElementById('btn-fullscreen-global');
if (btnFS) {
    btnFS.addEventListener('click', () => {
        initAudio();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(e => {});
                }
            }).catch(e => {});
            btnFS.textContent = '❌';
        } else {
            document.exitFullscreen().then(() => {
                if (screen.orientation && screen.orientation.unlock) {
                    screen.orientation.unlock();
                }
            }).catch(e => {});
            btnFS.textContent = '⛶';
        }
    });
}

// Menu Buttons
document.getElementById('btn-play').addEventListener('click', () => {
    sfx.btnClick();
    startGame(true);
});

document.getElementById('btn-about-menu').addEventListener('click', () => {
    sfx.btnClick();
    mainMenu.classList.add('hidden');
    aboutScreen.classList.remove('hidden');
});

document.getElementById('btn-close-about').addEventListener('click', () => {
    sfx.btnClick();
    aboutScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

document.getElementById('btn-highscore-menu').addEventListener('click', () => {
    sfx.btnClick();
    showHighscoreTable();
});
document.getElementById('btn-close-hs').addEventListener('click', () => {
    sfx.btnClick();
    highscoreScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});
document.getElementById('btn-exit').addEventListener('click', () => {
    sfx.btnClick();
    mainMenu.innerHTML = "<h1 style='color:red;'>SYSTEM OFFLINE</h1>";
});

// Level Cleared Buttons
document.getElementById('btn-continue').addEventListener('click', () => {
    sfx.btnClick();
    currentLevel++;
    startGame(false); // false = don't reset health & score
});
document.getElementById('btn-save-quit').addEventListener('click', () => {
    sfx.btnClick();
    saveHighscore('player-name-lc');
    levelClearedScreen.classList.add('hidden');
    showHighscoreTable();
});
document.getElementById('btn-skip-quit-lc').addEventListener('click', () => {
    sfx.btnClick();
    levelClearedScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    gameState = 'MENU';
    audioAssets.bgmGame.pause();
    if (audioInit) audioAssets.bgmMenu.play().catch(e => { });
});

// Game Over Buttons
document.getElementById('btn-save-go').addEventListener('click', () => {
    sfx.btnClick();
    saveHighscore('player-name-go');
    gameOverScreen.classList.add('hidden');
    showHighscoreTable();
});
document.getElementById('btn-skip-go').addEventListener('click', () => {
    sfx.btnClick();
    gameOverScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    gameState = 'MENU';
    audioAssets.bgmGame.pause();
    if (audioInit) audioAssets.bgmMenu.play().catch(e => { });
});

function saveHighscore(inputId) {
    let nameInput = document.getElementById(inputId).value.toUpperCase();
    if (nameInput.length === 0) nameInput = "UNK";

    let scores = JSON.parse(localStorage.getItem('mathBlasterScores') || '[]');
    scores.push({ name: nameInput, level: currentLevel, score: playerScore });

    // Sort by Score (desc)
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 10); // Keep top 10
    localStorage.setItem('mathBlasterScores', JSON.stringify(scores));
}

function showHighscoreTable() {
    mainMenu.classList.add('hidden');
    highscoreScreen.classList.remove('hidden');

    let tbody = document.getElementById('highscore-body');
    tbody.innerHTML = '';

    let scores = JSON.parse(localStorage.getItem('mathBlasterScores') || '[]');
    if (scores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">NO RECORDS FOUND</td></tr>';
        return;
    }

    scores.forEach((s, index) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>#${index + 1}</td><td>${s.name}</td><td>LVL ${s.level}</td><td>${s.score}</td>`;
        tbody.appendChild(tr);
    });
}

// --- TEXTURES ---
const texWidth = 64;
const texHeight = 64;
let textureCanvas;

function generateTextures() {
    textureCanvas = document.createElement('canvas');
    textureCanvas.width = texWidth * 2;
    textureCanvas.height = texHeight;
    let tCtx = textureCanvas.getContext('2d');

    tCtx.fillStyle = '#6e2c2c';
    tCtx.fillRect(0, 0, texWidth, texHeight);

    tCtx.fillStyle = '#421a1a';
    for (let y = 0; y < texHeight; y += 16) {
        tCtx.fillRect(0, y, texWidth, 2);
        let offset = (y / 16) % 2 === 0 ? 0 : 16;
        for (let x = 0; x < texWidth; x += 32) {
            tCtx.fillRect(x + offset, y, 2, 16);
        }
    }
    for (let i = 0; i < 400; i++) {
        let nx = Math.floor(Math.random() * texWidth);
        let ny = Math.floor(Math.random() * texHeight);
        tCtx.fillStyle = Math.random() > 0.5 ? '#8f3d3d' : '#2b1010';
        tCtx.fillRect(nx, ny, 2, 2);
    }
}
generateTextures();

// --- GAME CONFIG & CONSTANTS ---
const mapWidth = 48;
const mapHeight = 48;
let worldMap = [];

let gameState = 'MENU';
let currentLevel = 1;
let currentAmmo = 1;
let playerHealth = 3;
let playerScore = 0;
let gameTime = 0.0;

// Trap State
let trapActive = false;
let trapTimer = 15.0;
let mutatedEnemiesCount = 0;

// Entities
let enemies = [];
let items = [];
let projectiles = [];
let particles = [];

function generateEquation(level) {
    let x = Math.floor(Math.random() * 9) + 1;
    if (level === 1) {
        let type = Math.random() > 0.5 ? 'add' : 'mult';
        if (type === 'add') {
            let a = Math.floor(Math.random() * 10) + 1;
            let b = x + a;
            return { text: `x + ${a} = ${b}`, answer: x };
        } else {
            let a = Math.floor(Math.random() * 5) + 2;
            let b = a * x;
            return { text: `${a}x = ${b}`, answer: x };
        }
    } else {
        let a = Math.floor(Math.random() * 4) + 2;
        let b = Math.floor(Math.random() * 10) + 1;
        let c = (a * x) + b;
        return { text: `${a}x + ${b} = ${c}`, answer: x };
    }
}

// --- PROCEDURAL GENERATION ---
function generateMap() {
    worldMap = [];
    for (let x = 0; x < mapWidth; x++) {
        worldMap[x] = [];
        for (let y = 0; y < mapHeight; y++) {
            worldMap[x][y] = 1;
        }
    }

    let worms = 4;
    for (let w = 0; w < worms; w++) {
        let wx = Math.floor(mapWidth / 2);
        let wy = Math.floor(mapHeight / 2);
        let life = 300 + (currentLevel * 20);

        while (life > 0) {
            worldMap[wx][wy] = 0;
            if (Math.random() < 0.4) {
                if (wx < mapWidth - 2) worldMap[wx + 1][wy] = 0;
                if (wy < mapHeight - 2) worldMap[wx][wy + 1] = 0;
                if (wx < mapWidth - 2 && wy < mapHeight - 2) worldMap[wx + 1][wy + 1] = 0;
            }
            let dir = Math.floor(Math.random() * 4);
            if (dir === 0 && wx > 3) wx--;
            else if (dir === 1 && wx < mapWidth - 4) wx++;
            else if (dir === 2 && wy > 3) wy--;
            else if (dir === 3 && wy < mapHeight - 4) wy++;
            life--;
        }
    }

    let spawnX = Math.floor(mapWidth / 2);
    let spawnY = Math.floor(mapHeight / 2);
    for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
            worldMap[spawnX + dx][spawnY + dy] = 0;
        }
    }

    enemies = [];
    let enemyCount = 8 + (currentLevel * 2);
    while (enemyCount > 0) {
        let rx = Math.floor(Math.random() * (mapWidth - 4)) + 2;
        let ry = Math.floor(Math.random() * (mapHeight - 4)) + 2;
        let distToSpawn = Math.abs(rx - spawnX) + Math.abs(ry - spawnY);

        if (worldMap[rx][ry] === 0 && distToSpawn > 15) {
            let eq = generateEquation(1);
            enemies.push({
                x: rx + 0.5,
                y: ry + 0.5,
                state: 'IDLE',
                text: eq.text,
                answer: eq.answer,
                active: true,
                radius: 0.3,
                patrolTimer: 0,
                vx: 0,
                vy: 0
            });
            enemyCount--;
        }
    }

    // Spawn 2 Health Pickups
    items = [];
    let itemCount = 2;
    while (itemCount > 0) {
        let rx = Math.floor(Math.random() * (mapWidth - 4)) + 2;
        let ry = Math.floor(Math.random() * (mapHeight - 4)) + 2;
        let distToSpawn = Math.abs(rx - spawnX) + Math.abs(ry - spawnY);

        if (worldMap[rx][ry] === 0 && distToSpawn > 3) {
            items.push({ x: rx + 0.5, y: ry + 0.5, type: 'heart', active: true });
            itemCount--;
        }
    }
}

function getSpawnPoint() {
    return { x: Math.floor(mapWidth / 2) + 0.5, y: Math.floor(mapHeight / 2) + 0.5 };
}

function spawnParticles(x, y, color) {
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: x, y: y, z: 0.0,
            vx: (Math.random() - 0.5) * 2.0,
            vy: (Math.random() - 0.5) * 2.0,
            vz: (Math.random() * 2.0),
            life: 1.0,
            color: color
        });
    }
}

// --- STATE MANAGEMENT ---
let posX = 0, posY = 0;
let dirX = -1.0, dirY = 0.0;
let planeX = 0.0, planeY = 0.66;
let walkTime = 0.0;
let idleTime = 0.0;
let pitch = 0;
let weaponRecoil = 0;

function updateHUD() {
    let hearts = "";
    for (let i = 0; i < playerHealth; i++) hearts += "❤️";
    heartsDisplay.textContent = hearts;
    ammoDisplay.textContent = currentAmmo;
    scoreDisplay.textContent = playerScore;
    levelDisplay.textContent = currentLevel;
}

// --- INPUT HANDLING ---
const keys = { w: false, a: false, s: false, d: false, ArrowLeft: false, ArrowRight: false };

window.addEventListener('keydown', (e) => {
    if (gameState !== 'PLAYING') return;
    if (playerHealth <= 0 || trapActive && trapTimer <= 0) return;

    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;

    if (e.code === 'KeyQ') {
        currentAmmo--;
        if (currentAmmo < 1) currentAmmo = 9;
        updateHUD();
    }
    if (e.code === 'KeyE') {
        currentAmmo++;
        if (currentAmmo > 9) currentAmmo = 1;
        updateHUD();
    }
    if (e.key >= '1' && e.key <= '9') {
        currentAmmo = parseInt(e.key);
        updateHUD();
    }
    if (e.code === 'Space') {
        fireProjectile();
        e.preventDefault();
        pitch += 20;
        weaponRecoil = 30;
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// Mobile Touch Controls
const bindBtn = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; }, {passive: false});
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; }, {passive: false});
    btn.addEventListener('mousedown', (e) => { e.preventDefault(); keys[key] = true; });
    btn.addEventListener('mouseup', (e) => { e.preventDefault(); keys[key] = false; });
    btn.addEventListener('mouseleave', (e) => { e.preventDefault(); keys[key] = false; });
};

bindBtn('mc-w', 'w');
bindBtn('mc-s', 's');
bindBtn('mc-tl', 'ArrowLeft');
bindBtn('mc-tr', 'ArrowRight');

const btnShoot = document.getElementById('mc-space');
if(btnShoot) {
    const doShoot = (e) => {
        e.preventDefault();
        if (gameState !== 'PLAYING') return;
        fireProjectile();
        pitch += 20; 
        weaponRecoil = 30; 
    };
    btnShoot.addEventListener('touchstart', doShoot, {passive: false});
    btnShoot.addEventListener('mousedown', doShoot);
}

const btnQ = document.getElementById('mc-q');
const btnE = document.getElementById('mc-e');
if(btnQ) {
    const doQ = (e) => {
        e.preventDefault();
        if (gameState !== 'PLAYING') return;
        currentAmmo--;
        if (currentAmmo < 1) currentAmmo = 9;
        updateHUD();
    };
    btnQ.addEventListener('touchstart', doQ, {passive: false});
    btnQ.addEventListener('mousedown', doQ);
}
if(btnE) {
    const doE = (e) => {
        e.preventDefault();
        if (gameState !== 'PLAYING') return;
        currentAmmo++;
        if (currentAmmo > 9) currentAmmo = 1;
        updateHUD();
    };
    btnE.addEventListener('touchstart', doE, {passive: false});
    btnE.addEventListener('mousedown', doE);
}

function fireProjectile() {
    playSound('gunshot');
    projectiles.push({
        x: posX, y: posY,
        vx: dirX * 15.0, vy: dirY * 15.0,
        number: currentAmmo,
        life: 0.53 // Range is now ~8 blocks
    });
}

function startGame(fullReset) {
    initAudio();
    audioAssets.bgmMenu.pause();
    audioAssets.bgmGame.currentTime = 0;
    audioAssets.bgmGame.play().catch(e => { });
    mainMenu.classList.add('hidden');
    levelClearedScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    uiLayer.classList.remove('hidden');

    gameState = 'PLAYING';
    if (fullReset) {
        currentLevel = 1;
        gameTime = 0.0;
        playerHealth = 3;
        playerScore = 0;
    }

    updateHUD();

    generateMap();
    let spawn = getSpawnPoint();
    posX = spawn.x;
    posY = spawn.y;
    projectiles = [];
    particles = [];

    trapActive = false;
    trapTimer = 15.0;
    mutatedEnemiesCount = 0;
    trapTimerContainer.classList.add('hidden');

    keys.w = false; keys.a = false; keys.s = false; keys.d = false;
    keys.ArrowLeft = false; keys.ArrowRight = false;
}

function handleLevelCleared() {
    gameState = 'LEVEL_CLEARED';
    playerScore += 500; // Level completion bonus
    updateHUD();

    uiLayer.classList.add('hidden');
    levelClearedScreen.classList.remove('hidden');
    document.getElementById('lc-stats').textContent = `LEVEL: ${currentLevel} | SCORE: ${playerScore}`;
    audioAssets.bgmGame.pause();
    if (audioInit) audioAssets.bgmMenu.play().catch(e => { });
}

function gameOver() {
    gameState = 'GAMEOVER';
    uiLayer.classList.add('hidden');
    trapTimerContainer.classList.add('hidden');

    gameOverScreen.classList.remove('hidden');
    document.getElementById('go-stats').textContent = `LEVEL: ${currentLevel} | FINAL SCORE: ${playerScore}`;
    audioAssets.bgmGame.pause();
    if (audioInit) audioAssets.bgmMenu.play().catch(e => { });
}

// --- GAME LOOP ---
let lastTime = 0;
let zBuffer = new Array(screenWidth);

generateMap();
let initialSpawn = getSpawnPoint();
posX = initialSpawn.x;
posY = initialSpawn.y;

render();

function gameLoop(timestamp) {
    const frameTime = (timestamp - lastTime) / 1000.0;
    lastTime = timestamp;

    if (gameState === 'PLAYING') {
        gameTime += frameTime;
        update(frameTime);
        render();
    } else if (gameState === 'MENU') {
        let rotSpeed = frameTime * 0.5;
        let oldDirX = dirX;
        dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
        dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
        planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);
        render();
    }

    requestAnimationFrame(gameLoop);
}

function update(frameTime) {
    const moveSpeed = frameTime * 5.0;
    const rotSpeed = frameTime * 2.5;

    let moved = false;

    // Movement
    if (keys.w) {
        if (worldMap[Math.floor(posX + dirX * moveSpeed)][Math.floor(posY)] === 0) posX += dirX * moveSpeed;
        if (worldMap[Math.floor(posX)][Math.floor(posY + dirY * moveSpeed)] === 0) posY += dirY * moveSpeed;
        moved = true;
    }
    if (keys.s) {
        if (worldMap[Math.floor(posX - dirX * moveSpeed)][Math.floor(posY)] === 0) posX -= dirX * moveSpeed;
        if (worldMap[Math.floor(posX)][Math.floor(posY - dirY * moveSpeed)] === 0) posY -= dirY * moveSpeed;
        moved = true;
    }
    if (keys.d) {
        let perpDirX = dirY; let perpDirY = -dirX;
        if (worldMap[Math.floor(posX + perpDirX * moveSpeed)][Math.floor(posY)] === 0) posX += perpDirX * moveSpeed;
        if (worldMap[Math.floor(posX)][Math.floor(posY + perpDirY * moveSpeed)] === 0) posY += perpDirY * moveSpeed;
        moved = true;
    }
    if (keys.a) {
        let perpDirX = -dirY; let perpDirY = dirX;
        if (worldMap[Math.floor(posX + perpDirX * moveSpeed)][Math.floor(posY)] === 0) posX += perpDirX * moveSpeed;
        if (worldMap[Math.floor(posX)][Math.floor(posY + perpDirY * moveSpeed)] === 0) posY += perpDirY * moveSpeed;
        moved = true;
    }

    if (keys.ArrowRight) {
        let oldDirX = dirX;
        dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
        dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
        planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);
    }
    if (keys.ArrowLeft) {
        let oldDirX = dirX;
        dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
        dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
        planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);
    }

    if (moved) {
        let oldWalkTime = walkTime;
        walkTime += moveSpeed;
        if (Math.floor(walkTime * 2) > Math.floor(oldWalkTime * 2)) {
            playSound('footstep');
        }
    } else {
        idleTime += frameTime;
    }

    let targetPitch = (moved ? Math.sin(walkTime * 15) * 0.5 : Math.sin(idleTime * 2) * 2);
    pitch = (pitch * 0.9) + targetPitch;
    weaponRecoil *= 0.8;

    // Trap Update
    if (trapActive) {
        trapTimer -= frameTime;
        trapTimerText.textContent = trapTimer.toFixed(2);
        if (trapTimer <= 0) {
            gameOver();
            return;
        }
    }

    // Items collision
    for (let i = 0; i < items.length; i++) {
        let it = items[i];
        if (!it.active) continue;
        let dx = posX - it.x;
        let dy = posY - it.y;
        if (Math.sqrt(dx * dx + dy * dy) < 0.5) {
            it.active = false;
            sfx.itemPickup();
            playerHealth++;
            playerScore += 25;
            updateHUD();
            spawnParticles(it.x, it.y, '#ff0000');
        }
    }

    // AI & Enemy Collision
    let activeEnemies = 0;
    for (let i = 0; i < enemies.length; i++) {
        let e = enemies[i];
        if (!e.active) continue;
        activeEnemies++;

        let dx = posX - e.x;
        let dy = posY - e.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        // Aggro Radius = 8
        if (dist < 8.0 && dist > 0.5) {
            // Chase player (Speed reduced to 1.5)
            let exSpeed = (dx / dist) * frameTime * 1.5;
            let eySpeed = (dy / dist) * frameTime * 1.5;

            if (worldMap[Math.floor(e.x + exSpeed)][Math.floor(e.y)] === 0) e.x += exSpeed;
            if (worldMap[Math.floor(e.x)][Math.floor(e.y + eySpeed)] === 0) e.y += eySpeed;
        } else if (dist >= 8.0) {
            // Idle Patrol
            e.patrolTimer -= frameTime;
            if (e.patrolTimer <= 0) {
                let angle = Math.random() * Math.PI * 2;
                e.vx = Math.cos(angle) * 0.5;
                e.vy = Math.sin(angle) * 0.5;
                e.patrolTimer = 2.0 + Math.random() * 2.0;
            }
            let pxSpeed = e.vx * frameTime;
            let pySpeed = e.vy * frameTime;
            if (worldMap[Math.floor(e.x + pxSpeed)][Math.floor(e.y)] === 0) e.x += pxSpeed;
            if (worldMap[Math.floor(e.x)][Math.floor(e.y + pySpeed)] === 0) e.y += pySpeed;
        }

        // Hit player
        if (dist < 0.5) {
            e.active = false;
            sfx.playerHit();
            if (e.state === 'MUTATED') mutatedEnemiesCount--;
            playerHealth--;
            updateHUD();
            spawnParticles(e.x, e.y, '#ff0000');
            if (playerHealth <= 0) {
                gameOver();
                return;
            }

            if (trapActive && mutatedEnemiesCount <= 0) {
                trapActive = false;
                trapTimerContainer.classList.add('hidden');
            }
        }
    }

    if (activeEnemies === 0) {
        handleLevelCleared();
        return;
    }

    // Update Projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        let nextX = p.x + p.vx * frameTime;
        let nextY = p.y + p.vy * frameTime;
        let mapX = Math.floor(nextX);
        let mapY = Math.floor(nextY);

        let hitWall = false;
        if (mapX >= 0 && mapX < mapWidth && mapY >= 0 && mapY < mapHeight && worldMap[mapX][mapY] > 0) {
            hitWall = true;
        }

        let hitEnemy = null;
        for (let e of enemies) {
            if (e.active) {
                let dx = e.x - nextX;
                let dy = e.y - nextY;
                if (dx * dx + dy * dy < e.radius * e.radius) {
                    hitEnemy = e;
                    break;
                }
            }
        }

        if (hitEnemy) {
            if (p.number === hitEnemy.answer) {
                hitEnemy.active = false;
                playSound('enemyDeath');

                // Add Score
                if (hitEnemy.state === 'MUTATED') {
                    playerScore += 50;
                    mutatedEnemiesCount--;
                    if (mutatedEnemiesCount <= 0) {
                        trapActive = false;
                        trapTimerContainer.classList.add('hidden');
                    }
                } else {
                    playerScore += 100;
                }
                updateHUD();

                spawnParticles(hitEnemy.x, hitEnemy.y, hitEnemy.state === 'MUTATED' ? '#ff5555' : '#00ffff');
            } else {
                if (hitEnemy.state === 'IDLE') {
                    sfx.mutate();
                    hitEnemy.state = 'MUTATED';
                    let newEq = generateEquation(2);
                    hitEnemy.text = newEq.text;
                    hitEnemy.answer = newEq.answer;
                    mutatedEnemiesCount++;
                    trapActive = true;
                    trapTimer = 15.0;
                    trapTimerContainer.classList.remove('hidden');
                    spawnParticles(hitEnemy.x, hitEnemy.y, '#ffff00');
                } else {
                    sfx.enemyHit();
                    spawnParticles(hitEnemy.x, hitEnemy.y, '#ffffff');
                }
            }
            projectiles.splice(i, 1);
        } else if (hitWall) {
            projectiles.splice(i, 1);
        } else {
            p.x = nextX;
            p.y = nextY;
            p.life -= frameTime;
            if (p.life <= 0) projectiles.splice(i, 1);
        }
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx * frameTime;
        p.y += p.vy * frameTime;
        p.z -= p.vz * frameTime;
        p.vz -= 9.8 * frameTime;

        if (p.z > 0.5) {
            p.z = 0.5;
            p.vz *= -0.5;
            p.vx *= 0.5;
            p.vy *= 0.5;
        }

        p.life -= frameTime;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function renderWeapon() {
    let wX = screenWidth / 2;
    let wY = screenHeight;

    let bobX = Math.cos(walkTime * 7.5) * 5;
    let bobY = Math.abs(Math.sin(walkTime * 15)) * 2;

    wX += bobX;
    wY += bobY + weaponRecoil;

    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(wX - 20, wY);
    ctx.lineTo(wX - 10, wY - 150);
    ctx.lineTo(wX + 10, wY - 150);
    ctx.lineTo(wX + 20, wY);
    ctx.fill();

    ctx.fillStyle = '#222';
    ctx.fillRect(wX - 5, wY - 150, 10, 150);

    ctx.fillStyle = '#0ff';
    ctx.fillRect(wX - 2, wY - 120, 4, 80);

    if (weaponRecoil > 20) {
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(wX, wY - 160, 30 + Math.random() * 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

function render() {
    let squeeze = 0;
    if (trapActive) {
        squeeze = (15.0 - trapTimer) / 15.0;
        squeeze = squeeze * (screenHeight / 3);
    }

    ctx.fillStyle = trapActive ? '#200000' : '#050302';
    ctx.fillRect(0, squeeze, screenWidth, screenHeight / 2 - squeeze + pitch);
    ctx.fillStyle = trapActive ? '#300000' : '#100a05';
    ctx.fillRect(0, screenHeight / 2 + pitch, screenWidth, screenHeight / 2 - squeeze - pitch);

    if (trapActive) {
        ctx.fillStyle = '#110000';
        ctx.fillRect(0, 0, screenWidth, squeeze);
        ctx.fillRect(0, screenHeight - squeeze, screenWidth, squeeze);
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    let horizon = screenHeight / 2 + pitch;
    for (let y = horizon + 10; y < screenHeight - squeeze; y += Math.pow((y - horizon) / 10, 1.5)) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(screenWidth, y); ctx.stroke();
    }

    for (let x = 0; x < screenWidth; x++) {
        let cameraX = 2 * x / screenWidth - 1;
        let rayDirX = dirX + planeX * cameraX;
        let rayDirY = dirY + planeY * cameraX;

        let mapX = Math.floor(posX);
        let mapY = Math.floor(posY);
        let sideDistX, sideDistY;
        let deltaDistX = (rayDirX === 0) ? 1e30 : Math.abs(1 / rayDirX);
        let deltaDistY = (rayDirY === 0) ? 1e30 : Math.abs(1 / rayDirY);
        let perpWallDist;
        let stepX, stepY;
        let hit = 0, side;

        if (rayDirX < 0) { stepX = -1; sideDistX = (posX - mapX) * deltaDistX; }
        else { stepX = 1; sideDistX = (mapX + 1.0 - posX) * deltaDistX; }
        if (rayDirY < 0) { stepY = -1; sideDistY = (posY - mapY) * deltaDistY; }
        else { stepY = 1; sideDistY = (mapY + 1.0 - posY) * deltaDistY; }

        while (hit === 0) {
            if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; side = 0; }
            else { sideDistY += deltaDistY; mapY += stepY; side = 1; }

            if (mapX < 0 || mapX >= mapWidth || mapY < 0 || mapY >= mapHeight) {
                hit = 1;
                break;
            } else if (worldMap[mapX][mapY] > 0) {
                hit = 1;
            }
        }

        if (side === 0) perpWallDist = (sideDistX - deltaDistX);
        else perpWallDist = (sideDistY - deltaDistY);

        zBuffer[x] = perpWallDist;

        let lineHeight = Math.floor(screenHeight / perpWallDist);
        let drawStart = -lineHeight / 2 + screenHeight / 2 + pitch;
        let drawEnd = lineHeight / 2 + screenHeight / 2 + pitch;

        let wallX;
        if (side === 0) wallX = posY + perpWallDist * rayDirY;
        else wallX = posX + perpWallDist * rayDirX;
        wallX -= Math.floor(wallX);

        let texX = Math.floor(wallX * texWidth);
        if (side === 0 && rayDirX > 0) texX = texWidth - texX - 1;
        if (side === 1 && rayDirY < 0) texX = texWidth - texX - 1;

        let clipStart = Math.max(squeeze, drawStart);
        let clipEnd = Math.min(screenHeight - squeeze, drawEnd);

        if (clipStart <= clipEnd) {
            ctx.drawImage(
                textureCanvas,
                texX, 0, 1, texHeight,
                x, clipStart, 1, clipEnd - clipStart
            );
        }

        let alpha = Math.min(1.0, perpWallDist / 10.0);
        if (side === 1) alpha = Math.min(1.0, alpha + 0.3);
        if (trapActive) alpha = Math.min(1.0, alpha - 0.2);

        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        if (clipStart <= clipEnd) {
            ctx.fillRect(x, clipStart, 1, clipEnd - clipStart);
        }
    }

    let sprites = [];
    for (let e of enemies) {
        if (e.active) sprites.push({ x: e.x, y: e.y, type: 'enemy', data: e });
    }
    for (let it of items) {
        if (it.active) sprites.push({ x: it.x, y: it.y, type: 'item', data: it });
    }
    for (let p of projectiles) {
        sprites.push({ x: p.x, y: p.y, type: 'projectile', data: p });
    }
    for (let p of particles) {
        sprites.push({ x: p.x, y: p.y, type: 'particle', data: p });
    }

    sprites.forEach(s => {
        let dx = s.x - posX;
        let dy = s.y - posY;
        s.dist = dx * dx + dy * dy;
    });
    sprites.sort((a, b) => b.dist - a.dist);

    for (let i = 0; i < sprites.length; i++) {
        let s = sprites[i];
        let spriteX = s.x - posX;
        let spriteY = s.y - posY;

        let invDet = 1.0 / (planeX * dirY - dirX * planeY);
        let transformX = invDet * (dirY * spriteX - dirX * spriteY);
        let transformY = invDet * (-planeY * spriteX + planeX * spriteY);

        if (transformY <= 0) continue;

        let spriteScreenX = Math.floor((screenWidth / 2) * (1 + transformX / transformY));
        let spriteHeight = Math.abs(Math.floor(screenHeight / transformY));
        let drawStartY = -spriteHeight / 2 + screenHeight / 2 + pitch;

        let alpha = Math.max(0, 1.0 - (transformY / 10.0));

        if (s.type === 'enemy') {
            let e = s.data;
            if (transformY < 15) {
                let fontSize = Math.floor(screenHeight / transformY / 1.5);
                if (fontSize > 60) fontSize = 60;
                if (fontSize >= 10) {
                    ctx.font = `${fontSize}px 'Press Start 2P'`;
                    ctx.fillStyle = `rgba(${e.state === 'MUTATED' ? '255,85,85' : '255,255,255'}, ${alpha})`;
                    ctx.textAlign = 'center';
                    let textY = drawStartY - 10;
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
                    ctx.strokeText(e.text, spriteScreenX, textY);
                    ctx.fillText(e.text, spriteScreenX, textY);
                }

                let radius = (spriteHeight * e.radius);
                let drawStartX = spriteScreenX - radius;
                let drawEndX = spriteScreenX + radius;

                if (drawStartX < screenWidth && drawEndX > 0 && transformY < zBuffer[spriteScreenX]) {
                    ctx.fillStyle = e.state === 'MUTATED' ? `rgba(255,0,0,${alpha})` : `rgba(0,255,255,${alpha})`;
                    ctx.beginPath();
                    ctx.arc(spriteScreenX, drawStartY + spriteHeight / 2, radius, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                    ctx.beginPath();
                    ctx.arc(spriteScreenX, drawStartY + spriteHeight / 2, radius * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        else if (s.type === 'item') {
            if (transformY < zBuffer[spriteScreenX]) {
                let size = spriteHeight * 0.3;
                ctx.fillStyle = `rgba(255,50,50,${alpha})`;
                let cx = spriteScreenX;
                let cy = drawStartY + spriteHeight / 2;

                ctx.fillRect(cx - size / 6, cy - size / 2, size / 3, size);
                ctx.fillRect(cx - size / 2, cy - size / 6, size, size / 3);
            }
        }
        else if (s.type === 'projectile') {
            let p = s.data;
            let fontSize = Math.floor(spriteHeight * 0.5);
            if (fontSize > 100) fontSize = 100;
            if (fontSize > 5 && transformY < zBuffer[spriteScreenX]) {
                ctx.font = `${fontSize}px 'Press Start 2P'`;
                ctx.fillStyle = '#ffff00';
                ctx.textAlign = 'center';
                ctx.fillText(p.number, spriteScreenX, drawStartY + spriteHeight / 2);
            }
        }
        else if (s.type === 'particle') {
            let p = s.data;
            let pSize = Math.max(2, Math.floor(spriteHeight * 0.05));
            let pY = drawStartY + spriteHeight / 2 + (p.z * spriteHeight);

            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            if (spriteScreenX > 0 && spriteScreenX < screenWidth && transformY < zBuffer[spriteScreenX]) {
                ctx.fillRect(spriteScreenX - pSize / 2, pY - pSize / 2, pSize, pSize);
            }
            ctx.globalAlpha = 1.0;
        }
    }

    if (gameState === 'PLAYING') {
        renderWeapon();
    }
}

function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? (R > 0 ? R : 0) : 255;
    G = (G < 255) ? (G > 0 ? G : 0) : 255;
    B = (B < 255) ? (B > 0 ? B : 0) : 255;

    let RR = ((Math.round(R).toString(16).length == 1) ? "0" + Math.round(R).toString(16) : Math.round(R).toString(16));
    let GG = ((Math.round(G).toString(16).length == 1) ? "0" + Math.round(G).toString(16) : Math.round(G).toString(16));
    let BB = ((Math.round(B).toString(16).length == 1) ? "0" + Math.round(B).toString(16) : Math.round(B).toString(16));

    return "#" + RR + GG + BB;
}

requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    requestAnimationFrame(gameLoop);
});
