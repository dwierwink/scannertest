/**
 * ========================================================
 * SIMULATOR CEK SALDO E-MONEY (NFC) - JAVASCRIPT ENGINE
 * Web Audio POS Beep, Drag & Drop Tap, APDU Protocol Inspector
 * ========================================================
 */

// Preset cards matching Indonesian e-Money specs
const PRESET_CARDS = [
  {
    id: "mandiri-1",
    bankName: "Mandiri e-Money",
    cardNumber: "6032 •••• •••• 8192",
    fullNumber: "6032 0182 9381 8192",
    uid: "04:A2:38:B1:92:44:80",
    balance: 85000,
    isEncrypted: false,
    technology: "ISO-DEP (ISO 14443-4)",
    aid: "A0000000038698",
    themeClass: "bg-mandiri",
    expiry: "11/29"
  },
  {
    id: "bca-flazz",
    bankName: "BCA Flazz (Gen 2)",
    cardNumber: "5241 •••• •••• 1042",
    fullNumber: "5241 8802 4491 1042",
    uid: "04:88:E1:C2:55:12:30",
    balance: 124500,
    isEncrypted: false,
    technology: "ISO-DEP (DESFire EV2)",
    aid: "A0000000041010",
    themeClass: "bg-bca",
    expiry: "08/30"
  },
  {
    id: "bni-tapcash",
    bankName: "BNI TapCash",
    cardNumber: "7001 •••• •••• 4409",
    fullNumber: "7001 5521 8932 4409",
    uid: "04:3F:19:9A:88:71:15",
    balance: 50000,
    isEncrypted: false,
    technology: "ISO-DEP (ISO 14443-4)",
    aid: "A0000000042020",
    themeClass: "bg-bni",
    expiry: "05/28"
  },
  {
    id: "bri-brizzi",
    bankName: "BRI Brizzi",
    cardNumber: "5379 •••• •••• 6231",
    fullNumber: "5379 7210 3394 6231",
    uid: "04:B4:77:2D:10:99:64",
    balance: 37000,
    isEncrypted: false,
    technology: "MIFARE (ISO 14443-3A)",
    aid: "A0000000043030",
    themeClass: "bg-bri",
    expiry: "12/27"
  },
  {
    id: "dki-jakcard",
    bankName: "Bank DKI JakCard",
    cardNumber: "6019 •••• •••• 8472",
    fullNumber: "6019 3320 1192 8472",
    uid: "04:C5:11:39:77:20:91",
    balance: 18500,
    isEncrypted: false,
    technology: "ISO-DEP (ISO 14443-4)",
    aid: "A0000000044040",
    themeClass: "bg-dki",
    expiry: "03/29"
  },
  {
    id: "sam-encrypted",
    bankName: "Mandiri e-Money (SAM Lock)",
    cardNumber: "6032 •••• •••• 9999",
    fullNumber: "6032 9999 8888 9999",
    uid: "04:55:66:77:88:99:AA",
    balance: 0,
    isEncrypted: true,
    technology: "DESFire EV3 (SAM Protected)",
    aid: "A0000000038698",
    themeClass: "bg-sam",
    expiry: "01/32"
  }
];

// Application State
let appState = {
  nfcHardwareEnabled: true,
  soundEnabled: true,
  vibrateEnabled: true,
  activeCard: null,
  scanHistory: [],
  cards: [...PRESET_CARDS]
};

// Web Audio API Context
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play authentic POS NFC terminal beep sound
 */
function playNfcBeepSound() {
  if (!appState.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Tone 1: 1950Hz
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1950, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.05);

    // Tone 2: 2400Hz (Chime up)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2450, now + 0.04);
    gain2.gain.setValueAtTime(0.18, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.04);
    osc2.stop(now + 0.16);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

/**
 * Play Error / Warning buzzer
 */
function playErrorBuzzer() {
  if (!appState.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

/**
 * Trigger Haptic Vibration if supported
 */
function triggerVibration(pattern = [40, 60, 100]) {
  if (!appState.vibrateEnabled) return;
  if ("vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore vibration error
    }
  }
}

/**
 * Format currency to Indonesian Rupiah
 */
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('IDR', 'Rp');
}

/**
 * Format date time
 */
function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format full date & time
 */
function formatDateTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) + ' ' +
         d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// ========================================================
// DOM ELEMENTS
// ========================================================
const el = {
  // Header controls
  btnToggleSound: document.getElementById('btnToggleSound'),
  btnToggleVibrate: document.getElementById('btnToggleVibrate'),
  btnToggleNfcHardware: document.getElementById('btnToggleNfcHardware'),
  lblNfcHardware: document.getElementById('lblNfcHardware'),

  // Phone components
  phoneCase: document.getElementById('phoneCase'),
  phoneNfcChip: document.getElementById('phoneNfcChip'),
  phoneNfcChipText: document.getElementById('phoneNfcChipText'),
  nfcDisabledBanner: document.getElementById('nfcDisabledBanner'),
  btnEnableNfcInPhone: document.getElementById('btnEnableNfcInPhone'),
  statusClock: document.getElementById('statusClock'),
  phoneDropTarget: document.getElementById('phoneDropTarget'),

  // Phone States
  viewScanPrompt: document.getElementById('viewScanPrompt'),
  viewCardResult: document.getElementById('viewCardResult'),
  radarTriggerZone: document.getElementById('radarTriggerZone'),
  btnQuickSimulate: document.getElementById('btnQuickSimulate'),

  // Card Result Elements
  cardGraphic: document.getElementById('cardGraphic'),
  resCardIssuer: document.getElementById('resCardIssuer'),
  resCardBalance: document.getElementById('resCardBalance'),
  resCardNumber: document.getElementById('resCardNumber'),
  resCardTech: document.getElementById('resCardTech'),
  btnCopyCardNumber: document.getElementById('btnCopyCardNumber'),
  lblCopyNumber: document.getElementById('lblCopyNumber'),
  btnScanAgain: document.getElementById('btnScanAgain'),
  resSecurityBanner: document.getElementById('resSecurityBanner'),

  // Card Operation buttons
  btnSimToll: document.getElementById('btnSimToll'),
  btnSimTransit: document.getElementById('btnSimTransit'),
  btnSimTopUp: document.getElementById('btnSimTopUp'),

  // History list
  historyListContainer: document.getElementById('historyListContainer'),
  btnClearHistory: document.getElementById('btnClearHistory'),

  // Wallet Deck
  cardsRack: document.getElementById('cardsRack'),

  // Custom Form
  btnToggleCustomForm: document.getElementById('btnToggleCustomForm'),
  formCustomCard: document.getElementById('formCustomCard'),
  inpCardBank: document.getElementById('inpCardBank'),
  inpCardBalance: document.getElementById('inpCardBalance'),
  inpCardNumber: document.getElementById('inpCardNumber'),
  inpCardUid: document.getElementById('inpCardUid'),
  inpCardEncrypted: document.getElementById('inpCardEncrypted'),

  // Web NFC
  webNfcBadge: document.getElementById('webNfcBadge'),
  webNfcStatusText: document.getElementById('webNfcStatusText'),
  btnRealWebNfcScan: document.getElementById('btnRealWebNfcScan'),
  webNfcDesc: document.getElementById('webNfcDesc'),

  // Terminal
  terminalBody: document.getElementById('terminalBody'),
  btnClearConsole: document.getElementById('btnClearConsole'),
  btnCopyConsole: document.getElementById('btnCopyConsole'),

  // Toast
  toastContainer: document.getElementById('toastContainer')
};

// ========================================================
// INITIALIZATION
// ========================================================
function init() {
  updateClock();
  setInterval(updateClock, 1000);

  renderWalletRack();
  renderHistory();
  setupEventListeners();
  checkWebNfcSupport();

  // Load initial initial card into history if empty
  if (appState.scanHistory.length === 0) {
    appState.scanHistory.push({
      ...PRESET_CARDS[0],
      scannedAt: Date.now() - 3600000
    });
    renderHistory();
  }
}

function updateClock() {
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  if (el.statusClock) {
    el.statusClock.textContent = `${hrs}:${mins}`;
  }
}

// ========================================================
// TOAST NOTIFICATIONS
// ========================================================
function showToast(message, icon = "ℹ️") {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  el.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

// ========================================================
// TERMINAL LOGGING (APDU PROTOCOL SIMULATION)
// ========================================================
function logTerminal(message, type = "info") {
  const line = document.createElement('div');
  line.className = `term-line ${type}`;
  line.textContent = message;
  el.terminalBody.appendChild(line);
  el.terminalBody.scrollTop = el.terminalBody.scrollHeight;
}

/**
 * Simulate live APDU handshake when card is tapped
 */
function simulateApduHandshake(card, callback) {
  const steps = [
    { text: `[NFC-POLL] ISO 14443 Type-A RF field tag detected. UID: ${card.uid}`, type: "cyan", delay: 80 },
    { text: `[APDU-TX] 00 A4 04 00 07 ${card.aid} (SELECT AID: ${card.bankName})`, type: "amber", delay: 180 },
    { text: `[APDU-RX] 90 00 (SW_OK: AID Selected Successfully)`, type: "green", delay: 280 },
    { 
      text: card.isEncrypted 
        ? `[APDU-TX] 90 6C 00 00 01 01 00 (GET_BALANCE / Read Record)` 
        : `[APDU-TX] 90 6C 00 00 01 01 00 (GET_BALANCE File ID 0x01)`, 
      type: "amber", 
      delay: 380 
    },
    { 
      text: card.isEncrypted 
        ? `[APDU-RX] 69 82 (SW_SECURITY_STATUS_NOT_SATISFIED: SAM Encryption Active)` 
        : `[APDU-RX] ${toHexBalance(card.balance)} 90 00 (SW_OK: Balance parsed: ${formatRupiah(card.balance)})`, 
      type: card.isEncrypted ? "red" : "green", 
      delay: 480 
    },
    { 
      text: `[SYS] Kartu sukses dibaca! Haptic & Audio feedback dipicu.`, 
      type: "info", 
      delay: 550 
    }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      logTerminal(step.text, step.type);
    }, step.delay);
  });

  setTimeout(() => {
    if (callback) callback();
  }, 560);
}

function toHexBalance(balance) {
  const hex = balance.toString(16).padStart(8, '0').toUpperCase();
  return `${hex.slice(6,8)} ${hex.slice(4,6)} ${hex.slice(2,4)} ${hex.slice(0,2)}`;
}

// ========================================================
// CORE TAP OPERATION (CARD TO PHONE)
// ========================================================
function tapCard(card) {
  // Check if NFC hardware is enabled
  if (!appState.nfcHardwareEnabled) {
    playErrorBuzzer();
    triggerVibration([200]);
    logTerminal(`[ERROR] Pemindaian gagal! Fitur NFC smartphone dinonaktifkan.`, "red");
    showToast("NFC Smartphone sedang mati! Harap nyalakan NFC terlebih dahulu.", "⚠️");
    return;
  }

  // Animation on phone chassis
  el.phoneCase.classList.add('drag-target-active');
  setTimeout(() => el.phoneCase.classList.remove('drag-target-active'), 400);

  // Handshake simulation
  simulateApduHandshake(card, () => {
    // Play NFC POS beep & vibrate
    playNfcBeepSound();
    triggerVibration([40, 60, 100]);

    // Update active card
    appState.activeCard = { ...card };

    // Record into scan history
    appState.scanHistory.unshift({
      ...card,
      scannedAt: Date.now()
    });
    renderHistory();

    // Render result on phone screen
    displayCardOnPhone(appState.activeCard);
    showToast(`Kartu ${card.bankName} berhasil dibaca!`, "💳");
  });
}

/**
 * Display Card Result on Phone Screen
 */
function displayCardOnPhone(card) {
  // Hide scan prompt, show card result
  el.viewScanPrompt.style.display = 'none';
  el.viewCardResult.style.display = 'flex';

  // Apply bank metadata
  el.resCardIssuer.textContent = card.bankName;
  el.resCardNumber.textContent = card.cardNumber;
  el.resCardTech.textContent = card.technology;

  // Handle balance & encryption state
  if (card.isEncrypted) {
    el.resCardBalance.textContent = "Terkunci";
    el.resCardBalance.style.color = "#FDE68A";
    el.resSecurityBanner.style.display = 'flex';
  } else {
    el.resCardBalance.textContent = formatRupiah(card.balance);
    el.resCardBalance.style.color = "#FFFFFF";
    el.resSecurityBanner.style.display = 'none';
  }

  // Update card graphic background gradient
  el.cardGraphic.className = `card-graphic-container ${card.themeClass}`;
}

/**
 * Reset phone display back to radar scanning mode
 */
function resetScanUi() {
  appState.activeCard = null;
  el.viewCardResult.style.display = 'none';
  el.viewScanPrompt.style.display = 'flex';
  logTerminal(`[SYS] Sensor NFC kembali siap memindai kartu baru.`, "info");
}

// ========================================================
// RENDER WALLET DECK RACK
// ========================================================
function renderWalletRack() {
  el.cardsRack.innerHTML = '';

  appState.cards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = `deck-card ${card.themeClass}`;
    cardDiv.setAttribute('draggable', 'true');
    cardDiv.dataset.cardId = card.id;

    cardDiv.innerHTML = `
      <div class="deck-card-top">
        <span class="deck-card-bank">${card.bankName}</span>
        <div class="deck-card-chip"></div>
      </div>
      <div>
        <div class="deck-card-balance-sub">${card.isEncrypted ? 'STATUS SALDO' : 'SALDO SAAT INI'}</div>
        <div class="deck-card-balance">${card.isEncrypted ? 'Terkunci SAM' : formatRupiah(card.balance)}</div>
      </div>
      <div class="deck-card-bottom">
        <span class="deck-card-num">${card.cardNumber}</span>
        <button class="btn-tap-deck" data-action="tap">Tap ke HP</button>
      </div>
    `;

    // Click on "Tap ke HP" button
    const tapBtn = cardDiv.querySelector('.btn-tap-deck');
    tapBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tapCard(card);
    });

    // Click whole card to tap
    cardDiv.addEventListener('click', () => {
      tapCard(card);
    });

    // Drag and Drop support
    cardDiv.addEventListener('dragstart', (e) => {
      cardDiv.classList.add('dragging');
      e.dataTransfer.setData('text/plain', JSON.stringify(card));
      logTerminal(`[DRAG] Menyeret kartu ${card.bankName}... Dekatkan ke HP.`, "info");
    });

    cardDiv.addEventListener('dragend', () => {
      cardDiv.classList.remove('dragging');
    });

    el.cardsRack.appendChild(cardDiv);
  });
}

// ========================================================
// RENDER SCAN HISTORY LIST
// ========================================================
function renderHistory() {
  el.historyListContainer.innerHTML = '';

  if (appState.scanHistory.length === 0) {
    el.historyListContainer.innerHTML = `
      <div class="history-empty-text">Belum ada riwayat pengecekan kartu.</div>
    `;
    return;
  }

  appState.scanHistory.slice(0, 10).forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'history-card-item';
    itemDiv.innerHTML = `
      <div class="history-item-left">
        <span class="hist-bank-name">${item.bankName}</span>
        <span class="hist-card-sub">${item.cardNumber}</span>
      </div>
      <div class="history-item-right">
        <span class="hist-card-balance">${item.isEncrypted ? 'Terkunci' : formatRupiah(item.balance)}</span>
        <span class="hist-time">${formatTime(item.scannedAt)}</span>
      </div>
    `;

    itemDiv.addEventListener('click', () => {
      appState.activeCard = { ...item };
      displayCardOnPhone(appState.activeCard);
      showToast(`Membuka detail riwayat: ${item.bankName}`, "📂");
    });

    el.historyListContainer.appendChild(itemDiv);
  });
}

// ========================================================
// SIMULATE CARD TRANSACTIONS (TOLL, TRANSIT, TOP UP)
// ========================================================
function executeTransaction(amountDelta, desc) {
  if (!appState.activeCard) return;

  if (appState.activeCard.isEncrypted) {
    playErrorBuzzer();
    showToast("Kartu ini terproteksi SAM bank, transaksi tidak dapat diubah.", "🔒");
    return;
  }

  const newBalance = appState.activeCard.balance + amountDelta;
  if (newBalance < 0) {
    playErrorBuzzer();
    triggerVibration([200]);
    logTerminal(`[TX-FAIL] Transaksi ditolak! Saldo tidak mencukupi (Sisa: ${formatRupiah(appState.activeCard.balance)}).`, "red");
    showToast("Transaksi gagal! Saldo tidak mencukupi.", "❌");
    return;
  }

  // Update balance
  appState.activeCard.balance = newBalance;
  el.resCardBalance.textContent = formatRupiah(newBalance);

  // Update preset card in rack too
  const original = appState.cards.find(c => c.id === appState.activeCard.id);
  if (original) {
    original.balance = newBalance;
    renderWalletRack();
  }

  // Sound & Haptic
  playNfcBeepSound();
  triggerVibration([30, 40]);

  // Terminal log
  const sign = amountDelta >= 0 ? `+${formatRupiah(amountDelta)}` : formatRupiah(amountDelta);
  logTerminal(`[TX-DEBIT] ${desc}: ${sign} -> Sisa Saldo Baru: ${formatRupiah(newBalance)}`, "cyan");
  showToast(`${desc} berhasil! Saldo baru: ${formatRupiah(newBalance)}`, "✅");
}

// ========================================================
// HARDWARE TOGGLE & EVENT LISTENERS
// ========================================================
function setupEventListeners() {
  // Toggle Audio Beep
  el.btnToggleSound.addEventListener('click', () => {
    appState.soundEnabled = !appState.soundEnabled;
    el.btnToggleSound.classList.toggle('active', appState.soundEnabled);
    el.btnToggleSound.querySelector('.label').textContent = `Bip POS: ${appState.soundEnabled ? 'ON' : 'OFF'}`;
    if (appState.soundEnabled) playNfcBeepSound();
    showToast(`Suara Bip POS: ${appState.soundEnabled ? 'Aktif' : 'Mati'}`);
  });

  // Toggle Vibration
  el.btnToggleVibrate.addEventListener('click', () => {
    appState.vibrateEnabled = !appState.vibrateEnabled;
    el.btnToggleVibrate.classList.toggle('active', appState.vibrateEnabled);
    el.btnToggleVibrate.querySelector('.label').textContent = `Getar: ${appState.vibrateEnabled ? 'ON' : 'OFF'}`;
    if (appState.vibrateEnabled) triggerVibration([80]);
    showToast(`Efek Getar: ${appState.vibrateEnabled ? 'Aktif' : 'Mati'}`);
  });

  // Toggle Phone NFC Hardware
  const toggleNfcState = () => {
    appState.nfcHardwareEnabled = !appState.nfcHardwareEnabled;
    updateNfcHardwareUi();
  };

  el.btnToggleNfcHardware.addEventListener('click', toggleNfcState);
  el.phoneNfcChip.addEventListener('click', toggleNfcState);
  el.btnEnableNfcInPhone.addEventListener('click', () => {
    appState.nfcHardwareEnabled = true;
    updateNfcHardwareUi();
    showToast("NFC smartphone berhasil diaktifkan kembali!", "📡");
  });

  // Quick Random Simulation Tap button inside phone
  el.btnQuickSimulate.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * appState.cards.length);
    tapCard(appState.cards[randomIndex]);
  });

  // Radar container click -> Tap first card
  el.radarTriggerZone.addEventListener('click', () => {
    tapCard(appState.cards[0]);
  });

  // Rescan / Scan Again button
  el.btnScanAgain.addEventListener('click', resetScanUi);

  // Copy Card Number to clipboard
  el.btnCopyCardNumber.addEventListener('click', () => {
    if (!appState.activeCard) return;
    const numToCopy = appState.activeCard.fullNumber || appState.activeCard.cardNumber;
    navigator.clipboard.writeText(numToCopy.replace(/\s+/g, '')).then(() => {
      el.lblCopyNumber.textContent = "Tersalin!";
      showToast("Nomor kartu berhasil disalin ke clipboard!", "📋");
      setTimeout(() => {
        el.lblCopyNumber.textContent = "Salin Nomor";
      }, 2000);
    }).catch(() => {
      showToast("Gagal menyalin nomor kartu.", "❌");
    });
  });

  // Simulation operations
  el.btnSimToll.addEventListener('click', () => executeTransaction(-10500, "Tap Gerbang Tol"));
  el.btnSimTransit.addEventListener('click', () => executeTransaction(-3000, "Tap Gerbang KRL"));
  el.btnSimTopUp.addEventListener('click', () => executeTransaction(50000, "Top Up Saldo"));

  // Clear Scan History
  el.btnClearHistory.addEventListener('click', () => {
    if (appState.scanHistory.length === 0) return;
    appState.scanHistory = [];
    renderHistory();
    showToast("Riwayat pemindaian telah dibersihkan.", "🗑️");
  });

  // Drag & Drop to Phone Screen Target
  el.phoneDropTarget.addEventListener('dragover', (e) => {
    e.preventDefault();
    el.phoneCase.classList.add('drag-target-active');
  });

  el.phoneDropTarget.addEventListener('dragleave', (e) => {
    el.phoneCase.classList.remove('drag-target-active');
  });

  el.phoneDropTarget.addEventListener('drop', (e) => {
    e.preventDefault();
    el.phoneCase.classList.remove('drag-target-active');
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const card = JSON.parse(dataStr);
        tapCard(card);
      }
    } catch (err) {
      console.warn("Drop parse error:", err);
    }
  });

  // Toggle Custom Card Form
  el.btnToggleCustomForm.addEventListener('click', () => {
    const isHidden = el.formCustomCard.style.display === 'none';
    el.formCustomCard.style.display = isHidden ? 'flex' : 'none';
    el.btnToggleCustomForm.textContent = isHidden ? 'Tutup Form ▴' : 'Buka Form ▾';
  });

  // Submit Custom Card Form
  el.formCustomCard.addEventListener('submit', (e) => {
    e.preventDefault();
    const bank = el.inpCardBank.value;
    const balance = parseInt(el.inpCardBalance.value, 10) || 0;
    const cardNum = el.inpCardNumber.value.trim() || "6032 •••• •••• 1234";
    const uid = el.inpCardUid.value.trim() || "04:11:22:33:44:55:66";
    const isEncrypted = el.inpCardEncrypted.checked;

    let theme = "bg-mandiri";
    if (bank.includes("BCA")) theme = "bg-bca";
    else if (bank.includes("BNI")) theme = "bg-bni";
    else if (bank.includes("BRI")) theme = "bg-bri";
    else if (bank.includes("DKI")) theme = "bg-dki";
    else if (isEncrypted) theme = "bg-sam";

    const customCard = {
      id: "custom-" + Date.now(),
      bankName: bank,
      cardNumber: cardNum.length > 8 ? cardNum.slice(0, 4) + " •••• •••• " + cardNum.slice(-4) : cardNum,
      fullNumber: cardNum,
      uid: uid,
      balance: balance,
      isEncrypted: isEncrypted,
      technology: "ISO-DEP (ISO 14443-4)",
      aid: "A0000000038698",
      themeClass: theme,
      expiry: "12/30"
    };

    appState.cards.unshift(customCard);
    renderWalletRack();
    tapCard(customCard);
    showToast(`Kartu kustom ${bank} dibuat dan langsung di-tap!`, "🎉");
  });

  // Terminal actions
  el.btnClearConsole.addEventListener('click', () => {
    el.terminalBody.innerHTML = '';
    logTerminal(`[SYS] Terminal log dibersihkan.`, "info");
  });

  el.btnCopyConsole.addEventListener('click', () => {
    const text = el.terminalBody.innerText;
    navigator.clipboard.writeText(text).then(() => {
      showToast("Log terminal berhasil disalin!", "📋");
    });
  });
}

function updateNfcHardwareUi() {
  if (appState.nfcHardwareEnabled) {
    el.btnToggleNfcHardware.classList.remove('disabled-state');
    el.btnToggleNfcHardware.classList.add('active');
    el.lblNfcHardware.textContent = "NFC HP: ON";

    el.phoneNfcChip.className = "nfc-status-chip chip-active";
    el.phoneNfcChipText.textContent = "NFC Aktif";
    el.nfcDisabledBanner.style.display = 'none';
    logTerminal(`[SYS] Pengaturan NFC Smartphone: Diaktifkan (ON)`, "green");
  } else {
    el.btnToggleNfcHardware.classList.remove('active');
    el.btnToggleNfcHardware.classList.add('disabled-state');
    el.lblNfcHardware.textContent = "NFC HP: OFF";

    el.phoneNfcChip.className = "nfc-status-chip chip-inactive";
    el.phoneNfcChipText.textContent = "NFC Mati";
    el.nfcDisabledBanner.style.display = 'flex';
    logTerminal(`[SYS] Pengaturan NFC Smartphone: Dinonaktifkan (OFF)`, "red");
  }
}

// ========================================================
// REAL HARDWARE WEB NFC SUPPORT CHECK (Chrome Android)
// ========================================================
function checkWebNfcSupport() {
  if ("NDEFReader" in window) {
    el.webNfcBadge.querySelector('.badge-dot').classList.add('supported');
    el.webNfcStatusText.textContent = "Web NFC Didukung! Siap Baca Kartu Fisik";
    el.webNfcDesc.textContent = "Browser Anda mendukung Web NFC API! Klik tombol di samping lalu tempelkan kartu e-money fisik ke belakang smartphone Android Anda.";
    el.btnRealWebNfcScan.disabled = false;

    el.btnRealWebNfcScan.addEventListener('click', async () => {
      try {
        const ndef = new window.NDEFReader();
        await ndef.scan();
        showToast("Web NFC aktif! Tempelkan kartu fisik sekarang.", "📡");
        logTerminal(`[WEB-NFC] NDEFReader aktif. Menunggu deteksi kartu fisik di belakang perangkat...`, "cyan");

        ndef.addEventListener("reading", ({ serialNumber }) => {
          logTerminal(`[WEB-NFC] Kartu fisik terdeteksi! Serial Number / UID: ${serialNumber}`, "green");
          playNfcBeepSound();
          triggerVibration([40, 60, 100]);

          const physicalCard = {
            id: "real-nfc-" + Date.now(),
            bankName: "Kartu NFC Fisik",
            cardNumber: `UID: ${serialNumber}`,
            fullNumber: serialNumber,
            uid: serialNumber,
            balance: 50000,
            isEncrypted: false,
            technology: "NFC Forum Tag / ISO 14443",
            aid: "00000000000000",
            themeClass: "bg-mandiri",
            expiry: "--/--"
          };

          tapCard(physicalCard);
        });

        ndef.addEventListener("readingerror", () => {
          playErrorBuzzer();
          logTerminal(`[WEB-NFC-ERROR] Gagal membaca tag NFC. Coba tempelkan ulang secara stabil.`, "red");
          showToast("Gagal membaca tag NFC fisik.", "❌");
        });

      } catch (error) {
        logTerminal(`[WEB-NFC-ERROR] ${error.message}`, "red");
        showToast(`Web NFC Error: ${error.message}`, "❌");
      }
    });

  } else {
    el.webNfcStatusText.textContent = "Mode Simulasi Aktif (Web NFC Khusus Chrome Android)";
    el.webNfcDesc.textContent = "Web NFC API hanya tersedia di Google Chrome pada smartphone Android ber-NFC. Di desktop atau browser lain, Anda dapat menggunakan simulator interaktif di atas secara penuh dengan visualisasi APDU lengkap!";
  }
}

// Run on load
document.addEventListener('DOMContentLoaded', init);
