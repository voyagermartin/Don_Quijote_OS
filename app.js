/**
 * Don Quijote OS - Core Application Script
 * MVP Inventory & Loadout Management System + Expedition Log Entry Module
 */

// Configuration for GAS Web App Endpoint (Will be populated upon deployment)
const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxVNWSL4omtaWcTEpQUwKAOwHBLbtDLky7xw8VNPx_LxvJfbEeC1XG8ABHAKp0DReU-0g/exec"; 

// ==========================================================================
// 1. MVP Test Inventory Data (JSON Specification)
// ==========================================================================
const INVENTORY_DATA = {
    running: {
        id: "loadout_running",
        name: "Running / Speed Expedition",
        description: "Lightweight gear optimized for urban and trail running speed.",
        gear: {}
    },
    camino: {
        id: "loadout_camino",
        name: "Camino de Santiago Pilgrimage",
        description: "Endurance gear for long-distance pilgrimage across Spain.",
        gear: {}
    }
};

const SLOT_CATEGORY_MAP = {
    head: { category: "👕 穿戴裝備", label: "Head (頭部)" },
    body: { category: "👕 穿戴裝備", label: "Body (身體服飾)" },
    shoes: { category: "👕 穿戴裝備", label: "Shoes (鞋款)" },
    socks: { category: "👕 穿戴裝備", label: "Socks (襪款)" },
    watch: { category: "👕 穿戴裝備", label: "Watch (手錶)" },
    backpack: { category: "🧰 其他配備", label: "Backpack (背包)" },
    "trekking-pole": { category: "🧰 其他配備", label: "Trekking Pole (登山杖)" },
    phone: { category: "🧰 其他配備", label: "Phone (手機)" },
    "power-bank": { category: "🧰 其他配備", label: "Power Bank (行動電源)" },
    water: { category: "🧰 其他配備", label: "水壺 (Water)" }
};

// Application State Management
let currentLoadout = 'running';
let activeModalTab = 'running';
let selectedGearList = [];
let selectedRoadConditions = [];
let selectedSlotKey = null;

function loadNicknamesFromStorage() {
    // Deprecated: Nicknames are fetched directly from backend Equipment_DB / INVENTORY_DATA
}

function saveNicknamesToStorage() {
    // Deprecated: Nicknames are managed in backend Equipment_DB / INVENTORY_DATA
}

/**
 * Fetches active equipment dataset from Google Apps Script Web App API (Equipment_DB)
 */
async function fetchEquipmentFromGAS() {
    console.log("💡 [Equipment DB] Clean inventory state active. Awaiting Garmin or custom user entry.");
    renderEquipmentSlots();
    renderGearChips();
}

function normalizeCategoryKey(catStr) {
    if (!catStr) return null;
    const cat = catStr.toString().toLowerCase().trim();
    if (cat.includes('head') || cat.includes('頭')) return 'head';
    if (cat.includes('body') || cat.includes('身') || cat.includes('服飾')) return 'body';
    if (cat.includes('shoe') || cat.includes('鞋')) return 'shoes';
    if (cat.includes('sock') || cat.includes('襪')) return 'socks';
    if (cat.includes('watch') || cat.includes('錶')) return 'watch';
    if (cat.includes('pack') || cat.includes('包')) return 'backpack';
    if (cat.includes('pole') || cat.includes('杖')) return 'trekking-pole';
    if (cat.includes('phone') || cat.includes('機')) return 'phone';
    if (cat.includes('power') || cat.includes('電源') || cat.includes('充')) return 'power-bank';
    if (cat.includes('water') || cat.includes('水')) return 'water';
    return null;
}

// ==========================================================================
// 2. Initialization & Event Binding (Browser Environment Only)
// ==========================================================================
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log("🛡️ Don Quijote OS initialized.");
        
        loadNicknamesFromStorage();
        fetchEquipmentFromGAS();
        initLoadoutButtons();
        initExpeditionModal();
        initSliders();
        initStarRatings();
        initSlotAndMannequinEvents();
        setTodayDates();
    });
}


/**
 * Binds click listeners to Loadout Switcher buttons.
 */
function initLoadoutButtons() {
    if (typeof document === 'undefined') return;
    const loadoutButtons = document.querySelectorAll('.loadout-btn');

    loadoutButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLoadout = btn.getAttribute('data-loadout');

            if (selectedLoadout && selectedLoadout !== currentLoadout) {
                loadoutButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                currentLoadout = selectedLoadout;

                console.log(`[LOADOUT SWITCH] Switched to: ${currentLoadout.toUpperCase()}`);
                renderEquipmentSlots();
                renderGearChips();
            }
        });
    });

    renderEquipmentSlots();
}

/**
 * Binds click events to individual slots and central mannequin avatar.
 */
function initSlotAndMannequinEvents() {
    if (typeof document === 'undefined') return;
    const slots = document.querySelectorAll('.eq-slot');
    slots.forEach(slot => {
        slot.addEventListener('click', () => {
            const slotKey = slot.getAttribute('data-slot');
            slots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedSlotKey = slotKey;
            inspectSlot(slotKey);
        });
    });

    const knightAvatarBtn = document.getElementById('knight-avatar-btn');
    if (knightAvatarBtn) {
        knightAvatarBtn.addEventListener('click', () => {
            slots.forEach(s => s.classList.remove('selected'));
            selectedSlotKey = null;
            inspectKnightOverview();
        });
    }
}

/**
 * Renders gear items into the central character paperdoll slots and updates mannequin badge.
 */
function renderEquipmentSlots() {
    if (typeof document === 'undefined') return;
    const activeGear = INVENTORY_DATA[currentLoadout]?.gear || {};
    let totalWeight = 0;
    let itemHits = 0;

    Object.keys(activeGear).forEach(slotKey => {
        const slotEl = document.getElementById(`slot-${slotKey}`);
        const item = activeGear[slotKey];

        if (item) {
            totalWeight += item.weight || 0;
            itemHits++;
        }

        if (slotEl) {
            const contentEl = slotEl.querySelector('.slot-content');
            if (contentEl && item) {
                const nicknameHtml = item.nickname ? `<span class="slot-item-nickname">「${item.nickname}」</span>` : '';
                contentEl.innerHTML = `
                    ${nicknameHtml}
                    <span class="slot-item-name">${item.name}</span>
                `;
            }
        }
    });

    const badgeEl = document.getElementById('avatar-total-badge');
    if (badgeEl) {
        badgeEl.innerHTML = `
            <span class="badge-weight">🏋️ ${totalWeight.toLocaleString()}g</span>
            <span class="badge-count">🛡️ ${itemHits}/10</span>
        `;
    }

    if (selectedSlotKey) {
        inspectSlot(selectedSlotKey);
    } else {
        inspectKnightOverview();
    }
}

/**
 * Inspector Panel: Render single slot details
 */
function inspectSlot(slotKey) {
    if (typeof document === 'undefined') return;
    const inspectorEl = document.getElementById('equipment-panel');
    if (!inspectorEl) return;

    const gear = INVENTORY_DATA[currentLoadout]?.gear?.[slotKey];
    const info = SLOT_CATEGORY_MAP[slotKey] || { category: "裝備", label: slotKey };

    if (!gear) {
        inspectorEl.innerHTML = `
            <div class="panel-empty-state">
                <div class="empty-icon">🛡️</div>
                <h3 class="empty-title">Empty Slot</h3>
                <p class="empty-desc">Current slot ${info.label} has no equipment assigned.</p>
            </div>`;
        return;
    }

    inspectorEl.innerHTML = `
        <div class="inspector-card">
            <div class="inspector-card-header">
                <div>
                    ${gear.nickname ? `<div class="inspector-item-nickname">「${gear.nickname}」</div>` : ''}
                    <h3 class="inspector-item-name">${gear.name}</h3>
                    <div class="inspector-item-category">${info.category} • ${info.label}</div>
                </div>
                <span class="inspector-badge-rating">${gear.rating || 'A'}</span>
            </div>

            <div class="inspector-stat-grid">
                <div class="inspector-stat-box">
                    <div class="stat-box-label">裝備單重</div>
                    <div class="stat-box-value">${gear.weight} g</div>
                </div>
                <div class="inspector-stat-box">
                    <div class="stat-box-label">累積戰報里程</div>
                    <div class="stat-box-value">${gear.mileage} KM</div>
                </div>
            </div>

            <div class="inspector-notes-box">
                <div class="notes-box-title">⚔️ 騎士戰鬥備註</div>
                <div class="notes-box-text">${gear.notes || '暫無戰鬥經驗備註。'}</div>
            </div>
        </div>
    `;
}

/**
 * Inspector Panel: Render total knight loadout overview when mannequin is clicked
 */
function inspectKnightOverview() {
    if (typeof document === 'undefined') return;
    const inspectorEl = document.getElementById('equipment-panel');
    if (!inspectorEl) return;

    const activeGear = INVENTORY_DATA[currentLoadout]?.gear || {};
    const loadoutInfo = INVENTORY_DATA[currentLoadout] || {};

    const wearableKeys = ['head', 'body', 'shoes', 'socks', 'watch'];
    let wearableWeight = 0;
    let otherWeight = 0;
    let totalItems = 0;

    Object.keys(activeGear).forEach(key => {
        const item = activeGear[key];
        if (item) {
            totalItems++;
            if (wearableKeys.includes(key)) {
                wearableWeight += item.weight || 0;
            } else {
                otherWeight += item.weight || 0;
            }
        }
    });

    const totalWeight = wearableWeight + otherWeight;
    const kgText = (totalWeight / 1000).toFixed(2);

    const quickRowsHtml = Object.keys(activeGear).map(slotKey => {
        const item = activeGear[slotKey];
        const info = SLOT_CATEGORY_MAP[slotKey] || { label: slotKey };
        return `
            <div class="quick-nickname-row">
                <div class="quick-nickname-info">
                    <span class="quick-slot-label">${info.label}</span>
                    <span class="quick-item-name" title="${item.name}">${item.name}</span>
                </div>
                <span class="quick-nickname-tag">${item.nickname ? `「${item.nickname}」` : '—'}</span>
            </div>
        `;
    }).join('');

    inspectorEl.innerHTML = `
        <div class="inspector-card">
            <div class="inspector-card-header">
                <div>
                    <h3 class="inspector-item-name">${loadoutInfo.name || 'Knight Loadout'}</h3>
                    <div class="inspector-item-category">🛡️ Don Quijote OS • 騎士戰備總覽</div>
                </div>
                <span class="inspector-badge-rating">Grade S</span>
            </div>

            <div class="inspector-stat-grid">
                <div class="inspector-stat-box">
                    <div class="stat-box-label">裝備總重量</div>
                    <div class="stat-box-value">${totalWeight.toLocaleString()} g (${kgText} kg)</div>
                </div>
                <div class="inspector-stat-box">
                    <div class="stat-box-label">已裝備數量</div>
                    <div class="stat-box-value">${totalItems} / 10</div>
                </div>
                <div class="inspector-stat-box">
                    <div class="stat-box-label">👕 穿戴裝備重量</div>
                    <div class="stat-box-value">${wearableWeight.toLocaleString()} g</div>
                </div>
                <div class="inspector-stat-box">
                    <div class="stat-box-label">🧰 其他配備重量</div>
                    <div class="stat-box-value">${otherWeight.toLocaleString()} g</div>
                </div>
            </div>

            <div class="inspector-quick-nicknames-box">
                <div class="notes-box-title">🏷️ 全套裝備名稱與暱稱速查 (Equipment List)</div>
                <div class="quick-nicknames-hint">裝備名稱與暱稱由雲端資料庫 \`Equipment_DB\` 統一管理，前台自動連動帶出：</div>
                <div class="quick-nicknames-list">
                    ${quickRowsHtml}
                </div>
            </div>

            <div class="inspector-notes-box">
                <div class="notes-box-title">📜 雲端資料庫連動</div>
                <div class="notes-box-text">
                    ${GAS_WEBAPP_URL ? '✅ 已連動 GAS 雲端資料庫。' : '💡 目前使用展示模式。雲端試算表 \`Equipment_DB\` 設定暱稱後，將自動載入本面板。'}
                </div>
            </div>
        </div>
    `;
}

/**
 * Sets today's date in form inputs by default.
 */
function setTodayDates() {
    if (typeof document === 'undefined') return;
    const today = new Date().toISOString().split('T')[0];
    const runDate = document.getElementById('run-date');
    const walkDate = document.getElementById('walk-date');
    const tgtDate = document.getElementById('tgt-date');
    if (runDate) runDate.value = today;
    if (walkDate) walkDate.value = today;
    if (tgtDate) tgtDate.value = today;
}

// ==========================================================================
// 3. Expedition Log Modal Module
// ==========================================================================
function initExpeditionModal() {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('expedition-modal');
    const btnOpen = document.getElementById('btn-open-expedition');
    const btnClose = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-cancel-modal');
    const btnSaveCopy = document.getElementById('btn-save-copy-prompt');

    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            renderGearChips();
            modal.classList.remove('hidden');
        });
    }

    const closeModal = () => modal.classList.add('hidden');

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Tab Switcher Inside Modal
    const tabBtns = document.querySelectorAll('.modal-tab-btn');
    const formRunning = document.getElementById('form-running');
    const formCitywalk = document.getElementById('form-citywalk');
    const formTaipeigrandtrail = document.getElementById('form-taipeigrandtrail');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            activeModalTab = tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (formRunning) formRunning.classList.toggle('hidden', tab !== 'running');
            if (formCitywalk) formCitywalk.classList.toggle('hidden', tab !== 'citywalk');
            if (formTaipeigrandtrail) formTaipeigrandtrail.classList.toggle('hidden', tab !== 'taipeigrandtrail');
        });
    });

    // Initialize Road Condition Chips selection
    initRoadChips();

    // Save & Copy Prompt Handler
    if (btnSaveCopy) {
        btnSaveCopy.addEventListener('click', handleSaveAndCopyPrompt);
    }

    // Sync Garmin 965 Button Handler
    const btnSyncGarmin = document.getElementById('btn-sync-garmin');
    if (btnSyncGarmin) {
        btnSyncGarmin.addEventListener('click', syncGarminLatestData);
    }
}

/**
 * Switch active modal tab programmatically.
 */
function switchModalTab(tabName) {
    if (typeof document === 'undefined') return;
    const tabBtns = document.querySelectorAll('.modal-tab-btn');
    const formRunning = document.getElementById('form-running');
    const formCitywalk = document.getElementById('form-citywalk');
    const formTaipeigrandtrail = document.getElementById('form-taipeigrandtrail');

    activeModalTab = tabName;

    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (formRunning) formRunning.classList.toggle('hidden', tabName !== 'running');
    if (formCitywalk) formCitywalk.classList.toggle('hidden', tabName !== 'citywalk');
    if (formTaipeigrandtrail) formTaipeigrandtrail.classList.toggle('hidden', tabName !== 'taipeigrandtrail');
}

/**
 * Sync latest Garmin activity from local Python microservice (http://localhost:8000/api/garmin/latest).
 */
async function syncGarminLatestData() {
    if (typeof document === 'undefined') return;
    const syncBtn = document.getElementById('btn-sync-garmin');
    if (!syncBtn) return;

    syncBtn.classList.add('loading');
    syncBtn.innerHTML = '<span class="garmin-spin-icon">⏳</span> 抓取數據中...';

    const endpoints = [
        'http://localhost:8000/api/garmin/latest',
        'https://don-quijote-os.onrender.com/api/garmin/latest'
    ];

    let garminData = null;
    let lastErrorMsg = '';

    for (const url of endpoints) {
        try {
            const controller = new AbortController();
            // 雲端免費版喚醒冷啟動需要時間，設定 35 秒長連線
            const timeoutMs = url.includes('render') ? 35000 : 5000;
            const timer = setTimeout(() => controller.abort(), timeoutMs);

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timer);

            if (!response.ok) {
                const errJson = await response.json().catch(() => ({}));
                lastErrorMsg = errJson.message || `HTTP ${response.status}`;
                continue;
            }

            const result = await response.json();
            if (result.status === 'success' && result.data) {
                garminData = result.data;
                break;
            }
        } catch (err) {
            lastErrorMsg = err.message || '連線逾時或網路錯誤';
        }
    }

    try {
        if (!garminData) {
            throw new Error(lastErrorMsg || '無法取得 Garmin 數據');
        }

        populateGarminDataToForm(garminData);
        let toastMsg = '✅ Garmin 數據已自動帶入！';
        if (Array.isArray(garminData.gear) && garminData.gear.length > 0) {
            const gearLabels = garminData.gear.map(g => (typeof g === 'object' && g !== null) ? g.displayName : g);
            toastMsg += ` 綁定裝備：${gearLabels.join(', ')}`;
        } else {
            toastMsg += ' 請確認今日裝備與填寫心得';
        }
        showToast(toastMsg);
    } catch (err) {
        console.error('Garmin sync error:', err);
        showToast(`❌ 同步失敗: ${err.message || 'Garmin API 服務暫時無法連線'}`);
    } finally {
        syncBtn.classList.remove('loading');
        syncBtn.innerHTML = '<span class="garmin-spin-icon">🔄</span> 同步 Garmin 965 最新活動';
    }
}

/**
 * Populate Garmin activity metrics into expedition log modal forms.
 */
function populateGarminDataToForm(data) {
    if (typeof document === 'undefined') return;

    const actType = (data.activityType || '').toLowerCase();
    let targetTab = 'running';
    if (actType.includes('walk') || actType.includes('citywalk')) {
        targetTab = 'citywalk';
    } else if (actType.includes('hike') || actType.includes('hiking') || actType.includes('trail')) {
        targetTab = 'taipeigrandtrail';
    } else {
        targetTab = 'running';
    }

    switchModalTab(targetTab);

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined && val !== null) {
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    if (targetTab === 'running') {
        if (data.location) setVal('run-location', data.location);
        if (data.weather) setVal('run-weather', data.weather);
        setVal('run-date', data.date);
        setVal('run-subject', data.activityName || '跑步');
        setVal('run-distance', data.distanceKm);
        setVal('run-duration', data.movingDurationFormatted || data.durationFormatted);
        setVal('run-vo2max', data.vo2Max);
        setVal('run-pace-avg', data.avgPace);
        setVal('run-pace-interval', data.intervalPace);
        setVal('run-hr-avg', data.avgHr);
        setVal('run-hr-max', data.maxHr);
        setVal('run-cadence-avg', data.avgCadence);
        setVal('run-cadence-max', data.maxCadence);

        if (data.hrZones) {
            setVal('run-z1-pct', data.hrZones.z1);
            setVal('run-z2-pct', data.hrZones.z2);
            setVal('run-z3-pct', data.hrZones.z3);
            setVal('run-z4-pct', data.hrZones.z4);
            setVal('run-z5-pct', data.hrZones.z5);
        }

        if (data.mechanics) {
            setVal('run-movement-efficiency', data.mechanics.movementEfficiency);
            setVal('run-vertical-oscillation', data.mechanics.verticalOscillation);
            setVal('run-ground-contact-time', data.mechanics.groundContactTime);
        }
    } else if (targetTab === 'citywalk') {
        setVal('walk-date', data.date);
        setVal('walk-theme', data.activityName || 'CityWalk 漫遊');
        setVal('walk-distance', data.distanceKm);
        setVal('walk-duration', data.movingDurationFormatted || data.durationFormatted);
        if (data.avgHr) setVal('walk-hr', `${data.avgHr} bpm`);
    } else if (targetTab === 'taipeigrandtrail') {
        setVal('tgt-date', data.date);
        setVal('tgt-distance', data.distanceKm);
        setVal('tgt-duration', data.movingDurationFormatted || data.durationFormatted);
        setVal('tgt-ascent', data.elevationGain);
        setVal('tgt-descent', data.elevationLoss);
        setVal('tgt-hr-avg', data.avgHr);
        setVal('tgt-hr-max', data.maxHr);
    }

    // 自動勾選/填入 Garmin 活動綁定之裝備與暱稱 (data.gear)
    if (Array.isArray(data.gear) && data.gear.length > 0) {
        syncGarminGearChips(data.gear);
        const inputEl = document.getElementById('modal-equipment-input');
        if (inputEl) {
            const gearLabels = data.gear.map(g => (typeof g === 'object' && g !== null) ? g.displayName : g);
            inputEl.value = gearLabels.join(', ');
        }
    }
}

/**
 * Maps Garmin gear type or gear name to inventory slot key (shoes, watch, backpack, etc.)
 */
function findMatchingSlotKey(gItem) {
    let name = '';
    let type = '';

    if (typeof gItem === 'string') {
        name = gItem.toLowerCase();
    } else if (typeof gItem === 'object' && gItem !== null) {
        name = `${gItem.name || ''} ${gItem.nickname || ''} ${gItem.displayName || ''}`.toLowerCase();
        type = (gItem.gearType || '').toLowerCase();
    }

    if (type.includes('shoe') || type.includes('footwear') || 
        name.includes('mizuno') || name.includes('hoka') || name.includes('nike') || 
        name.includes('adidas') || name.includes('asics') || name.includes('saucony') || 
        name.includes('brooks') || name.includes('altra') || name.includes('puma') || 
        name.includes('revolt') || name.includes('speedgoat') || name.includes('shoe')) {
        return 'shoes';
    }

    if (type.includes('watch') || name.includes('garmin') || name.includes('forerunner') || 
        name.includes('fenix') || name.includes('coros') || name.includes('suunto') || name.includes('watch')) {
        return 'watch';
    }

    if (type.includes('pack') || type.includes('vest') || name.includes('salomon') || 
        name.includes('osprey') || name.includes('gregory') || name.includes('vest') || name.includes('pack')) {
        return 'backpack';
    }

    if (type.includes('head') || name.includes('buff') || name.includes('cap') || name.includes('hat')) {
        return 'head';
    }

    if (type.includes('cloth') || type.includes('jacket') || name.includes('jacket') || name.includes('tee') || name.includes('shirt')) {
        return 'body';
    }

    if (type.includes('pole') || name.includes('leki') || name.includes('black diamond') || name.includes('pole')) {
        return 'trekking-pole';
    }

    if (type.includes('sock') || name.includes('darn tough') || name.includes('injinji') || name.includes('sock')) {
        return 'socks';
    }

    return null;
}

/**
 * Automatically sync and select gear chips according to Garmin activity gear.
 */
function syncGarminGearChips(garminGearList) {
    if (typeof document === 'undefined' || !Array.isArray(garminGearList)) return;

    // 1. 將 Garmin 回傳的裝備動態覆蓋寫入目前 Loadout 的 INVENTORY_DATA 對應欄位
    garminGearList.forEach(gItem => {
        let name = '';
        let nickname = '';
        let displayName = '';

        if (typeof gItem === 'string') {
            displayName = gItem.trim();
            const match = displayName.match(/^[「『]([^」』]+)[」』]\s*(.+)$/);
            if (match) {
                nickname = match[1].trim();
                name = match[2].trim();
            } else {
                name = displayName;
            }
        } else if (typeof gItem === 'object' && gItem !== null) {
            name = (gItem.name || '').trim();
            nickname = (gItem.nickname || '').trim();
            displayName = (gItem.displayName || (nickname ? `「${nickname}」 ${name}` : name)).trim();
        }

        const slotKey = findMatchingSlotKey(gItem) || 'shoes';
        if (slotKey) {
            if (!INVENTORY_DATA[currentLoadout].gear) {
                INVENTORY_DATA[currentLoadout].gear = {};
            }
            INVENTORY_DATA[currentLoadout].gear[slotKey] = {
                name: name || displayName,
                nickname: nickname || null,
                weight: 0,
                rating: 'S',
                mileage: 0
            };
        }
    });

    // 2. 重新渲染介面與裝備 Chips，確保最新裝備與暱稱反映至 UI 上
    renderGearChips();
    renderEquipmentSlots();

    // 3. 勾選與高亮所有 Garmin 回傳對應的裝備 Chips
    const container = document.getElementById('modal-gear-chips');
    if (!container) return;

    const chipElements = Array.from(container.querySelectorAll('.gear-chip'));
    selectedGearList = [];

    chipElements.forEach(chip => chip.classList.remove('selected'));

    garminGearList.forEach(gItem => {
        let gName = '';
        let gNickname = '';
        let gDisplayName = '';

        if (typeof gItem === 'string') {
            gName = gItem.trim();
            gDisplayName = gItem.trim();
        } else if (typeof gItem === 'object' && gItem !== null) {
            gName = (gItem.name || '').trim();
            gNickname = (gItem.nickname || '').trim();
            gDisplayName = (gItem.displayName || gName || '').trim();
        }

        const cleanName = gName.toLowerCase();
        const cleanNickname = gNickname.toLowerCase();
        const cleanDisplayName = gDisplayName.toLowerCase();

        let matched = false;

        chipElements.forEach(chip => {
            const chipText = (chip.getAttribute('data-gear-name') || chip.textContent || '').toLowerCase().trim();
            if (
                (cleanName && chipText.includes(cleanName)) ||
                (cleanNickname && chipText.includes(cleanNickname)) ||
                (cleanDisplayName && chipText.includes(cleanDisplayName)) ||
                (cleanName && cleanName.includes(chipText))
            ) {
                chip.classList.add('selected');
                const fullName = chip.getAttribute('data-gear-name') || chip.textContent.trim();
                if (!selectedGearList.includes(fullName)) {
                    selectedGearList.push(fullName);
                }
                matched = true;
            }
        });

        if (!matched && gDisplayName) {
            const chipLabel = `🛡️ [Garmin] ${gDisplayName}`;
            if (!selectedGearList.includes(chipLabel)) {
                const chip = document.createElement('div');
                chip.className = 'gear-chip selected';
                chip.setAttribute('data-gear-name', chipLabel);
                chip.innerHTML = `<span>🛡️</span> <span>${gDisplayName}</span>`;

                chip.addEventListener('click', () => {
                    if (chip.classList.contains('selected')) {
                        chip.classList.remove('selected');
                        selectedGearList = selectedGearList.filter(g => g !== chipLabel);
                    } else {
                        chip.classList.add('selected');
                        selectedGearList.push(chipLabel);
                    }
                });

                container.appendChild(chip);
                selectedGearList.push(chipLabel);
            }
        }
    });

    if (selectedGearList.length === 0) {
        chipElements.forEach(chip => {
            chip.classList.add('selected');
            const fullName = chip.getAttribute('data-gear-name') || chip.textContent.trim();
            selectedGearList.push(fullName);
        });
    }
}

/**
 * Renders gear selector chips dynamically based on current loadout.
 */
function renderGearChips() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('modal-gear-chips');
    if (!container) return;

    container.innerHTML = '';
    selectedGearList = [];

    const activeGear = INVENTORY_DATA[currentLoadout]?.gear || {};

    Object.values(activeGear).forEach(item => {
        const chipName = item.nickname ? `「${item.nickname}」 ${item.name}` : item.name;
        const chip = document.createElement('div');
        chip.className = 'gear-chip selected'; // Selected by default
        chip.setAttribute('data-gear-name', chipName);
        chip.innerHTML = `<span>🛡️</span> <span>${chipName}</span>`;

        selectedGearList.push(chipName);

        chip.addEventListener('click', () => {
            if (chip.classList.contains('selected')) {
                chip.classList.remove('selected');
                selectedGearList = selectedGearList.filter(g => g !== chipName);
            } else {
                chip.classList.add('selected');
                selectedGearList.push(chipName);
            }
        });

        container.appendChild(chip);
    });
}

/**
 * Range slider numerical display synchronization
 */
function initSliders() {
    if (typeof document === 'undefined') return;
    const runFatigue = document.getElementById('run-fatigue');
    const runVal = document.getElementById('run-fatigue-val');
    if (runFatigue && runVal) {
        runFatigue.addEventListener('input', (e) => runVal.textContent = e.target.value);
    }

    const walkFatigue = document.getElementById('walk-fatigue');
    const walkVal = document.getElementById('walk-fatigue-val');
    if (walkFatigue && walkVal) {
        walkFatigue.addEventListener('input', (e) => walkVal.textContent = e.target.value);
    }

    const tgtFatigue = document.getElementById('tgt-fatigue');
    const tgtFatigueVal = document.getElementById('tgt-fatigue-val');
    if (tgtFatigue && tgtFatigueVal) {
        tgtFatigue.addEventListener('input', (e) => tgtFatigueVal.textContent = e.target.value);
    }

    const tgtDifficulty = document.getElementById('tgt-difficulty');
    const tgtDifficultyVal = document.getElementById('tgt-difficulty-val');
    if (tgtDifficulty && tgtDifficultyVal) {
        tgtDifficulty.addEventListener('input', (e) => tgtDifficultyVal.textContent = e.target.value);
    }
}

/**
 * Initializes road condition chips interactive selector
 */
function initRoadChips() {
    if (typeof document === 'undefined') return;
    const roadChips = document.querySelectorAll('.road-chip');
    selectedRoadConditions = [];

    roadChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const roadVal = chip.getAttribute('data-road');
            if (chip.classList.contains('selected')) {
                chip.classList.remove('selected');
                selectedRoadConditions = selectedRoadConditions.filter(r => r !== roadVal);
            } else {
                chip.classList.add('selected');
                selectedRoadConditions.push(roadVal);
            }
        });
    });
}

/**
 * Star Rating Picker Component Handler
 */
function initStarRatings() {
    if (typeof document === 'undefined') return;
    const starContainers = document.querySelectorAll('.star-rating');

    starContainers.forEach(container => {
        const stars = container.querySelectorAll('span');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const val = parseInt(star.getAttribute('data-val'));
                container.setAttribute('data-value', val);

                stars.forEach(s => {
                    const sVal = parseInt(s.getAttribute('data-val'));
                    if (sVal <= val) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    });
}

function getSelectedGearList() {
    if (typeof document === 'undefined') return selectedGearList;
    const inputEl = document.getElementById('modal-equipment-input');
    if (inputEl && inputEl.value.trim()) {
        return inputEl.value.split(',').map(s => s.trim()).filter(Boolean);
    }
    return selectedGearList;
}

/**
 * Collects form data, attempts GAS API save, formats AI Prompt, and copies to Clipboard.
 */
async function handleSaveAndCopyPrompt() {
    let payload = {};
    let promptMarkdown = "";

    if (activeModalTab === 'running') {
        payload = {
            date: document.getElementById('run-date')?.value || new Date().toISOString().split('T')[0],
            subject: document.getElementById('run-subject')?.value || '',
            workout: document.getElementById('run-workout')?.value || '',
            gear: getSelectedGearList(),
            location: document.getElementById('run-location')?.value || '',
            weather: document.getElementById('run-weather')?.value || '',
            distance: document.getElementById('run-distance')?.value || 0,
            duration: document.getElementById('run-duration')?.value || '',
            paceAvg: document.getElementById('run-pace-avg')?.value || '',
            paceInterval: document.getElementById('run-pace-interval')?.value || '',
            cadenceAvg: document.getElementById('run-cadence-avg')?.value || '',
            cadenceMax: document.getElementById('run-cadence-max')?.value || '',
            movementEfficiency: document.getElementById('run-movement-efficiency')?.value || '',
            verticalOscillation: document.getElementById('run-vertical-oscillation')?.value || '',
            groundContactTime: document.getElementById('run-ground-contact-time')?.value || '',
            hrAvg: document.getElementById('run-hr-avg')?.value || '',
            hrMax: document.getElementById('run-hr-max')?.value || '',
            z1Pct: document.getElementById('run-z1-pct')?.value || '',
            z2Pct: document.getElementById('run-z2-pct')?.value || '',
            z3Pct: document.getElementById('run-z3-pct')?.value || '',
            z4Pct: document.getElementById('run-z4-pct')?.value || '',
            z5Pct: document.getElementById('run-z5-pct')?.value || '',
            vo2max: document.getElementById('run-vo2max')?.value || '',
            techFocus: document.getElementById('run-tech')?.value || '',
            fatigue: document.getElementById('run-fatigue')?.value || 5,
            bodyState: document.getElementById('run-bodystate')?.value || '',
            notes: document.getElementById('run-notes')?.value || ''
        };

        promptMarkdown = generateRunningAIPrompt(payload);
    } else if (activeModalTab === 'citywalk') {
        const caminoContainer = document.querySelector('.star-rating[data-rating="walk-camino"]');
        const exploreContainer = document.querySelector('.star-rating[data-rating="walk-explore"]');
        const revisitContainer = document.querySelector('.star-rating[data-rating="walk-revisit"]');

        payload = {
            date: document.getElementById('walk-date')?.value || new Date().toISOString().split('T')[0],
            theme: document.getElementById('walk-theme')?.value || '',
            route: document.getElementById('walk-route')?.value || '',
            location: document.getElementById('walk-location')?.value || '',
            weather: document.getElementById('walk-weather')?.value || '',
            distance: document.getElementById('walk-distance')?.value || 0,
            duration: document.getElementById('walk-duration')?.value || '',
            steps: document.getElementById('walk-steps')?.value || '',
            gear: getSelectedGearList(),
            heartRate: document.getElementById('walk-hr')?.value || '',
            fatigue: document.getElementById('walk-fatigue')?.value || 4,
            bodyState: document.getElementById('walk-bodystate')?.value || '',
            supply: document.getElementById('walk-supply')?.value || '',
            memorable: document.getElementById('walk-memorable')?.value || '',
            quote: document.getElementById('walk-quote')?.value || '',
            caminoIndex: parseInt(caminoContainer?.getAttribute('data-value') || 4),
            exploreIndex: parseInt(exploreContainer?.getAttribute('data-value') || 5),
            revisitIndex: parseInt(revisitContainer?.getAttribute('data-value') || 5),
            bgm: document.getElementById('walk-bgm')?.value || ''
        };

        promptMarkdown = generateCityWalkAIPrompt(payload);
    } else if (activeModalTab === 'taipeigrandtrail') {
        const caminoContainer = document.querySelector('.star-rating[data-rating="tgt-camino"]');
        const sceneryContainer = document.querySelector('.star-rating[data-rating="tgt-scenery"]');
        const challengeContainer = document.querySelector('.star-rating[data-rating="tgt-challenge"]');
        const revisitContainer = document.querySelector('.star-rating[data-rating="tgt-revisit"]');

        payload = {
            date: document.getElementById('tgt-date')?.value || new Date().toISOString().split('T')[0],
            section: document.getElementById('tgt-section')?.value || '第1段',
            route: document.getElementById('tgt-route')?.value || '',
            startEnd: document.getElementById('tgt-start-end')?.value || '',
            weather: document.getElementById('tgt-weather')?.value || '',
            roadConditions: selectedRoadConditions,
            distance: document.getElementById('tgt-distance')?.value || 0,
            totalTime: document.getElementById('tgt-total-time')?.value || '',
            movingTime: document.getElementById('tgt-moving-time')?.value || '',
            restTime: document.getElementById('tgt-rest-time')?.value || '',
            avgSpeed: document.getElementById('tgt-avg-speed')?.value || '',
            steps: document.getElementById('tgt-steps')?.value || '',
            elevationGain: document.getElementById('tgt-elevation-gain')?.value || '',
            elevationLoss: document.getElementById('tgt-elevation-loss')?.value || '',
            gear: getSelectedGearList(),
            hrAvg: document.getElementById('tgt-hr-avg')?.value || '',
            hrMax: document.getElementById('tgt-hr-max')?.value || '',
            fatigue: document.getElementById('tgt-fatigue')?.value || 6,
            difficulty: document.getElementById('tgt-difficulty')?.value || 7,
            bodyState: document.getElementById('tgt-bodystate')?.value || '',
            supply: document.getElementById('tgt-supply')?.value || '',
            bestPhoto: document.getElementById('tgt-best-photo')?.value || '',
            favoriteSection: document.getElementById('tgt-favorite-section')?.value || '',
            hardestSection: document.getElementById('tgt-hardest-section')?.value || '',
            lessonLearned: document.getElementById('tgt-lesson-learned')?.value || '',
            quote: document.getElementById('tgt-quote')?.value || '',
            caminoIndex: parseInt(caminoContainer?.getAttribute('data-value') || 4),
            sceneryIndex: parseInt(sceneryContainer?.getAttribute('data-value') || 5),
            challengeIndex: parseInt(challengeContainer?.getAttribute('data-value') || 4),
            revisitIndex: parseInt(revisitContainer?.getAttribute('data-value') || 5),
            bgm: document.getElementById('tgt-bgm')?.value || '',
            review: document.getElementById('tgt-review')?.value || ''
        };

        promptMarkdown = generateTaipeiGrandTrailAIPrompt(payload);
    }

    // Attempt backend save via GAS Web App API if configured
    if (GAS_WEBAPP_URL) {
        try {
            await fetch(GAS_WEBAPP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ type: activeModalTab, data: payload })
            });
            console.log("✅ Log saved to GAS Database successfully.");
        } catch (err) {
            console.warn("⚠️ GAS API submit notice: Running offline or endpoint pending deployment.", err);
        }
    }

    // Copy formatted AI Prompt to Clipboard
    try {
        await navigator.clipboard.writeText(promptMarkdown);
        showToast(" 已複製！可直接貼給 Gemini 進行戰報分析與經驗回饋。");
        document.getElementById('expedition-modal')?.classList.add('hidden');
    } catch (err) {
        console.error("Failed to copy clipboard: ", err);
        showToast("⚠️ 複製失敗，請檢查瀏覽器剪貼簿權限。");
    }
}

/**
 * Generates formatted AI prompt markdown for Running Logs
 */
function generateRunningAIPrompt(data) {
    const z1 = (data.z1Pct !== '' && data.z1Pct !== undefined && data.z1Pct !== null) ? `${data.z1Pct}%` : '0%';
    const z2 = (data.z2Pct !== '' && data.z2Pct !== undefined && data.z2Pct !== null) ? `${data.z2Pct}%` : '0%';
    const z3 = (data.z3Pct !== '' && data.z3Pct !== undefined && data.z3Pct !== null) ? `${data.z3Pct}%` : '0%';
    const z4 = (data.z4Pct !== '' && data.z4Pct !== undefined && data.z4Pct !== null) ? `${data.z4Pct}%` : '0%';
    const z5 = (data.z5Pct !== '' && data.z5Pct !== undefined && data.z5Pct !== null) ? `${data.z5Pct}%` : '0%';

    const subjectStr = data.subject || '無';
    const workoutStr = data.workout ? ` (${data.workout})` : '';

    return `# 🛡️ Don Quijote OS - 遠征戰報錄入（Run）

- **📅 遠征日期**：${data.date}
- **🏃 科目 / 課表**：${subjectStr}${workoutStr}
- **📍 遠征地點**：${data.location || '未標示'}
- **🌤️ 天氣與氣溫**：${data.weather || '未記錄'}
- **📏 跑量距離**：${data.distance} KM
- **⏱️ 總時間**：${data.duration || 'N/A'}
- **🏃‍♀️ 跑步配速（平均）**：${data.paceAvg || 'N/A'}
- **🏃‍♀️ 跑步配速（跑段）**：${data.paceInterval || 'N/A'}
- **🏃🏻‍♂️ 平均步頻**：${data.cadenceAvg ? data.cadenceAvg + ' spm' : 'N/A'}
- **🏃🏼 最大步頻**：${data.cadenceMax ? data.cadenceMax + ' spm' : 'N/A'}
- **🏃🏼 平均移動效率**：${data.movementEfficiency ? data.movementEfficiency + ' %' : 'N/A'}
- **🏃🏼 平均垂直振幅**：${data.verticalOscillation ? data.verticalOscillation + ' cm' : 'N/A'}
- **🏃🏼 平均觸地時間**：${data.groundContactTime ? data.groundContactTime + ' 毫秒' : 'N/A'}
- **❤️ 平均心率**：${data.hrAvg ? data.hrAvg + ' bpm' : 'N/A'}
- **💖 最大心率**：${data.hrMax ? data.hrMax + ' bpm' : 'N/A'}
- **💞 心率區間時間占比**：
  - Z1 (141-160 bpm)：${z1}
  - Z2 (161-174 bpm)：${z2}
  - Z3 (175-179 bpm)：${z3}
  - Z4 (180-188 bpm)：${z4}
  - Z5 (188+ bpm)：${z5}
  *(註：其餘未記錄時間即為心率未達 Z1)*
- **🫁 VO2Max 跑力**：${data.vo2max || 'N/A'}
- **🎒 本次穿戴裝備**：${data.gear && data.gear.length > 0 ? data.gear.join('、') : '無'}
- **💥 體感疲勞度**：${data.fatigue} / 10
- **🎯 技術專注點**：${data.techFocus || '無'}
- **🩺 身體狀況**：${data.bodyState || '正常'}
- **📝 對抗風車感想**：${data.notes || '今日順利完成遠征，準備迎戰下一次風車！'}
`;
}

/**
 * Generates formatted AI prompt markdown for CityWalk Logs
 */
function generateCityWalkAIPrompt(data) {
    return `# 🛡️ Don Quijote OS - 遠征戰報錄入（CityWalk）

請 Gemini 系統架構師分析以下城市騎士漫遊戰報，並撰寫一段荒繆又浪漫的遠征日誌摘要：

- **📅 遠征日期**：${data.date}
- **🗺️ 微旅行主題**：${data.theme || '城市漫遊'}
- **🚶 漫遊路線**：${data.route || '自由散步'}
- **📍 地點 / 區域**：${data.location || '台北城'}
- **🌤️ 天氣狀態**：${data.weather || '舒適'}
- **📏 步行距離 / 時間**：${data.distance} KM (${data.duration || 'N/A'})
- **👟 總步數 / 心率**：${data.steps || 'N/A'} 步 (平均 ${data.heartRate || 'N/A'})
- **🎒 本次穿戴裝備**：${data.gear.length > 0 ? data.gear.join('、') : '無'}
- **🥤 途中補給**：${data.supply || '無'}
- **🎵 背景 BGM**：${data.bgm || '無'}
- **💥 體感疲勞度**：${data.fatigue} / 10
- **✨ 印象最深刻的事**：${data.memorable || '探索了城市的隱密小巷'}
- **💡 今日一句話**：${data.quote || '騎士不需要名駒，只需要探索的雙腳'}
- **⭐ 遠征評分**：
  - Camino 朝聖指數：${'★'.repeat(data.caminoIndex)} (${data.caminoIndex}/5)
  - 探索驚喜指數：${'★'.repeat(data.exploreIndex)} (${data.exploreIndex}/5)
  - 想再訪指數：${'★'.repeat(data.revisitIndex)} (${data.revisitIndex}/5)

---
請提供：
1. 📜 **騎士典藏遠征摘要**（將本次 CityWalk 寫成一段西班牙騎士浪漫冒險日誌）
2. 🎒 **裝備探索經驗值評估**
`;
}

/**
 * Generates formatted AI prompt markdown for Taipei Grand Trail Logs
 */
function generateTaipeiGrandTrailAIPrompt(data) {
    const roads = data.roadConditions && data.roadConditions.length > 0 ? data.roadConditions.join('、') : '未標示';
    const gears = data.gear && data.gear.length > 0 ? data.gear.join('、') : '無';

    return `# 🛡️ Don Quijote OS - 遠征戰報錄入（Taipei Grand Trail 台北大縱走）

請 Gemini 系統架構師分析以下台北大縱走遠征戰報，針對 Camino 朝聖預備訓練評估、裝備表現與騎士復盤給予深度指導與經驗點數：

- **📅 遠征日期**：${data.date}
- **🥾 縱走段數**：${data.section || '未選擇'}
- **🗺️ 路線與路段**：${data.route || '未填寫'} (${data.startEnd || '起點➜終點'})
- **🌤️ 天氣與氣溫**：${data.weather || '未記錄'}
- **⛰️ 路況特徵**：${roads}
- **📏 遠征里程**：${data.distance} KM
- **⏱️ 總時間 / 移動 / 停留**：${data.totalTime || 'N/A'} (移動: ${data.movingTime || 'N/A'} / 停留: ${data.restTime || 'N/A'})
- **⚡ 平均速度 / 步數**：${data.avgSpeed || 'N/A'} (${data.steps ? data.steps + ' 步' : 'N/A'})
- **📈 爬升 / 下降**：+${data.elevationGain || 0} m / -${data.elevationLoss || 0} m
- **🎒 本次穿戴裝備**：${gears}
- **❤️ 心率數據**：平均 ${data.hrAvg ? data.hrAvg + ' bpm' : 'N/A'} (最高 ${data.hrMax ? data.hrMax + ' bpm' : 'N/A'})
- **💥 體感疲勞 / 路線難度**：疲勞 ${data.fatigue}/10 | 難度 ${data.difficulty}/10
- **🩺 身體狀況**：${data.bodyState || '良好'}
- **🥪 補給紀錄**：${data.supply || '無'}
- **📸 最佳照片描述**：${data.bestPhoto || '無'}
- **💚 最喜歡的一段**：${data.favoriteSection || '無'}
- **🔥 最痛苦的一段**：${data.hardestSection || '無'}
- **💡 今天學到的一件事**：${data.lessonLearned || '無'}
- **💬 今日一句話**：${data.quote || '台北大縱走是遠征西班牙朝聖之路最佳前哨站！'}
- **🎵 背景 BGM**：${data.bgm || '無'}
- **⭐ 遠征指數評分**：
  - Camino 相似度：${'★'.repeat(data.caminoIndex)} (${data.caminoIndex}/5)
  - 景觀指數：${'★'.repeat(data.sceneryIndex)} (${data.sceneryIndex}/5)
  - 挑戰指數：${'★'.repeat(data.challengeIndex)} (${data.challengeIndex}/5)
  - 再訪指數：${'★'.repeat(data.revisitIndex)} (${data.revisitIndex}/5)
- **📝 騎士復盤與改善檢討**：${data.review || '無'}

---
請提供：
1. 🥾 **Camino 朝聖訓練備戰點評**（針對步頻、坡度、負重與體能做 Camino 戰力轉換評估）
2. 🛡️ **裝備磨損與經驗值 (XP) 點數發放**
3. ⚔️ **騎士復盤檢討建議與下一次縱走準備策略**
`;
}

/**
 * Toast Notification Popup
 */
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    toast.innerHTML = `<span>🛡️</span> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}
