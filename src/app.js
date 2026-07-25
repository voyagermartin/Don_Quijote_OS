/**
 * Don Quijote OS - Core Application Script
 * MVP Inventory & Loadout Management System + Expedition Log Entry Module
 */

// Configuration for GAS Web App Endpoint (Will be populated upon deployment)
const GAS_WEBAPP_URL = ""; 

// ==========================================================================
// 1. MVP Test Inventory Data (JSON Specification)
// ==========================================================================
const INVENTORY_DATA = {
    running: {
        id: "loadout_running",
        name: "Running / Speed Expedition",
        description: "Lightweight gear optimized for urban and trail running speed.",
        gear: {
            head: { name: "Buff Reflective Headband", weight: 35, rating: "A+", mileage: 120, notes: "Absorbs sweat during intense battles." },
            body: { name: "Salomon Bonatti Waterproof Jacket", weight: 200, rating: "S", mileage: 340, notes: "Windproof shield against harsh gusts." },
            backpack: { name: "Salomon Active Skin 8 Vest", weight: 210, rating: "S", mileage: 450, notes: "Zero bounce, holds dual flasks." },
            watch: { name: "Garmin Forerunner 955", weight: 52, rating: "S", mileage: 1280, notes: "GPS tracking for windmill encounters." },
            "trekking-pole": { name: "Leki Trail Running Carbon Poles", weight: 280, rating: "A", mileage: 210, notes: "Foldable speed poles." },
            shoes: { name: "Hoka Speedgoat 5", weight: 580, rating: "S", mileage: 520, notes: "Maximum cushion for rough paths." },
            socks: { name: "Darn Tough Run Ultra-Light", weight: 45, rating: "A+", mileage: 300, notes: "Blister-proof guarantee." },
            phone: { name: "iPhone 15 Pro (Strava Mode)", weight: 187, rating: "A", mileage: 1500, notes: "Primary navigation & camera." },
            "power-bank": { name: "Nitecore NB10000 Ultra Lightweight", weight: 150, rating: "S", mileage: 600, notes: "Carbon fiber casing." },
            water: { name: "Hydrapak SoftFlask 500ml x2 (水壺)", weight: 70, rating: "A", mileage: 800, notes: "BPA-free collapsible flasks." }
        }
    },
    camino: {
        id: "loadout_camino",
        name: "Camino de Santiago Pilgrimage",
        description: "Endurance gear for long-distance pilgrimage across Spain.",
        gear: {
            head: { name: "Tilley Broad Brim Sun Hat", weight: 95, rating: "A+", mileage: 600, notes: "UV protection under Spanish sun." },
            body: { name: "Patagonia Capilene Cool Daily Tee", weight: 135, rating: "S", mileage: 850, notes: "Quick drying, odor control." },
            backpack: { name: "Osprey Talon 33 Backpack", weight: 1090, rating: "S", mileage: 1200, notes: "The reliable pack of the Knight." },
            watch: { name: "Garmin Fenix 7X Solar", weight: 89, rating: "S", mileage: 2100, notes: "Solar charged navigation." },
            "trekking-pole": { name: "Black Diamond Trail Pro Shock", weight: 560, rating: "A+", mileage: 980, notes: "Absorbs descent impacts." },
            shoes: { name: "Altra Lone Peak 7 Trail", weight: 620, rating: "S", mileage: 750, notes: "Wide toe box for long days." },
            socks: { name: "Darn Tough Hiker Boot Full Cushion", weight: 90, rating: "S", mileage: 900, notes: "Merino wool warmth & cushion." },
            phone: { name: "iPhone 15 Pro", weight: 187, rating: "A", mileage: 1500, notes: "Buen Camino guide & offline maps." },
            "power-bank": { name: "Anker 325 Power Bank 20000mAh", weight: 465, rating: "A+", mileage: 1100, notes: "Multi-day continuous power." },
            water: { name: "CamelBak Crux 3L Reservoir (水壺)", weight: 230, rating: "A", mileage: 1400, notes: "Hydration tube access." }
        }
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
let selectedSlotKey = null;

// ==========================================================================
// 2. Initialization & Event Binding (Browser Environment Only)
// ==========================================================================
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log("🛡️ Don Quijote OS initialized.");
        
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
                contentEl.innerHTML = `<span class="slot-item-name">${item.name}</span>`;
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

            <div class="inspector-notes-box">
                <div class="notes-box-title">📜 遠征負重說明</div>
                <div class="notes-box-text">${loadoutInfo.description || '戰術配備全數就緒，隨時可出擊對抗現代風車。'}</div>
            </div>
        </div>
    `;
}

/**
 * Sets today's date in form inputs by default.
 */
function setTodayDates() {
    const today = new Date().toISOString().split('T')[0];
    const runDate = document.getElementById('run-date');
    const walkDate = document.getElementById('walk-date');
    if (runDate) runDate.value = today;
    if (walkDate) walkDate.value = today;
}

// ==========================================================================
// 3. Expedition Log Modal Module
// ==========================================================================
function initExpeditionModal() {
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

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            activeModalTab = tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (tab === 'running') {
                formRunning.classList.remove('hidden');
                formCitywalk.classList.add('hidden');
            } else {
                formCitywalk.classList.remove('hidden');
                formRunning.classList.add('hidden');
            }
        });
    });

    // Save & Copy Prompt Handler
    if (btnSaveCopy) {
        btnSaveCopy.addEventListener('click', handleSaveAndCopyPrompt);
    }
}

/**
 * Renders gear selector chips dynamically based on current loadout.
 */
function renderGearChips() {
    const container = document.getElementById('modal-gear-chips');
    if (!container) return;

    container.innerHTML = '';
    selectedGearList = [];

    const activeGear = INVENTORY_DATA[currentLoadout]?.gear || {};

    Object.values(activeGear).forEach(item => {
        const chip = document.createElement('div');
        chip.className = 'gear-chip selected'; // Selected by default
        chip.setAttribute('data-gear-name', item.name);
        chip.innerHTML = `<span>🛡️</span> <span>${item.name}</span>`;

        selectedGearList.push(item.name);

        chip.addEventListener('click', () => {
            if (chip.classList.contains('selected')) {
                chip.classList.remove('selected');
                selectedGearList = selectedGearList.filter(g => g !== item.name);
            } else {
                chip.classList.add('selected');
                selectedGearList.push(item.name);
            }
        });

        container.appendChild(chip);
    });
}

/**
 * Range slider numerical display synchronization
 */
function initSliders() {
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
}

/**
 * Star Rating Picker Component Handler
 */
function initStarRatings() {
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
            gear: selectedGearList,
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
    } else {
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
            gear: selectedGearList,
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
    }

    // Attempt backend save via GAS Web App API if configured
    if (GAS_WEBAPP_URL) {
        try {
            await fetch(GAS_WEBAPP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: activeModalTab, data: payload })
            });
            console.log(" Log saved to GAS Database successfully.");
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
    const z1 = data.z1Pct ? `${data.z1Pct}%` : 'N/A';
    const z2 = data.z2Pct ? `${data.z2Pct}%` : 'N/A';
    const z3 = data.z3Pct ? `${data.z3Pct}%` : 'N/A';
    const z4 = data.z4Pct ? `${data.z4Pct}%` : 'N/A';
    const z5 = data.z5Pct ? `${data.z5Pct}%` : 'N/A';

    return `# 🛡️ Don Quijote OS - 遠征戰報錄入（Run）

請 Gemini 系統架構師分析以下騎士遠征數據，並給予騎士精神點評與裝備磨損經驗點數建議：

- **📅 遠征日期**：${data.date}
- **🏃 科目 / 課表**：${data.subject || '無'} (${data.workout || '自由跑'})
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
- **🎒 本次穿戴裝備**：${data.gear.length > 0 ? data.gear.join('、') : '無'}
- **💥 體感疲勞度**：${data.fatigue} / 10
- **🎯 技術專注點**：${data.techFocus || '無'}
- **🩺 身體狀況**：${data.bodyState || '正常'}
- **📝 對抗風車感想**：${data.notes || '今日順利完成遠征，準備迎戰下一次風車！'}

---
請提供：
1. ⚔️ **騎士精神點評**（以 Don Quijote 冒險風格激勵騎士）
2. 🛡️ **裝備保養與經驗點數 (XP) 計算建議**
3. 🏃 **下一次遠征恢復與訓練策略**
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
