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
            water: { name: "Hydrapak SoftFlask 500ml x2", weight: 70, rating: "A", mileage: 800, notes: "BPA-free collapsible flasks." }
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
            water: { name: "CamelBak Crux 3L Reservoir", weight: 230, rating: "A", mileage: 1400, notes: "Hydration tube access." }
        }
    },
    japan: {
        id: "loadout_japan",
        name: "Japan Urban & Shrine Quest",
        description: "Versatile urban mobility and temple exploration loadout.",
        gear: {
            head: { name: "Snow Peak Tech Beanie", weight: 65, rating: "A", mileage: 180, notes: "Warm for high-altitude shrines." },
            body: { name: "Arc'teryx Atom LT Hoody", weight: 375, rating: "S", mileage: 920, notes: "Midlayer for unpredictable weather." },
            backpack: { name: "Peak Design Everyday Backpack 20L", weight: 1500, rating: "A+", mileage: 650, notes: "Quick camera side access." },
            watch: { name: "Apple Watch Ultra 2", weight: 61, rating: "A+", mileage: 720, notes: "Suica integration & city guide." },
            "trekking-pole": { name: "Helinox Passport Tension Pole", weight: 250, rating: "B+", mileage: 120, notes: "Ultra-compact for Kyoto trails." },
            shoes: { name: "On Cloudtilte Urban Walking Shoes", weight: 540, rating: "A", mileage: 400, notes: "Slip-on for frequent temple entry." },
            socks: { name: "Tabi Split Toe Socks", weight: 40, rating: "A", mileage: 250, notes: "Traditional comfort." },
            phone: { name: "iPhone 15 Pro", weight: 187, rating: "A", mileage: 1500, notes: "Translation & train routes." },
            "power-bank": { name: "Anker MagGo Magnetic 10000mAh", weight: 250, rating: "A+", mileage: 450, notes: "Wireless snap charging." },
            water: { name: "Kinto Travel Tumbler 500ml", weight: 310, rating: "S", mileage: 500, notes: "Keeps matcha tea hot all day." }
        }
    },
    thailand: {
        id: "loadout_thailand",
        name: "Thailand Tropical Expedition",
        description: "Ultra-breathable monsoon and tropical heat gear.",
        gear: {
            head: { name: "Columbia Breeze UV Cap", weight: 55, rating: "A", mileage: 310, notes: "Breathable mesh venting." },
            body: { name: "Uniqlo AIRism Seamless Mesh Shirt", weight: 90, rating: "S", mileage: 600, notes: "Maximum ventilation in humidity." },
            backpack: { name: "Matador FreeFly16 Dry Pack", weight: 190, rating: "A+", mileage: 280, notes: "Waterproof dry pack for boat trips." },
            watch: { name: "Casio G-Shock Mudmaster", weight: 92, rating: "S", mileage: 1800, notes: "Indestructible tropical companion." },
            "trekking-pole": { name: "Decathlon Forclaz Compact Stick", weight: 320, rating: "B", mileage: 90, notes: "Jungle trail stability." },
            shoes: { name: "Teva Hurricane XLT2 Sandals", weight: 580, rating: "A+", mileage: 530, notes: "Water-friendly grip." },
            socks: { name: "DeFeet Aireator Thin Socks", weight: 30, rating: "A", mileage: 350, notes: "Ultra thin mesh." },
            phone: { name: "iPhone 15 Pro (Waterproof Case)", weight: 210, rating: "A", mileage: 1500, notes: "Grab app & tropical photography." },
            "power-bank": { name: "Anker 10000mAh Slim", weight: 180, rating: "A", mileage: 750, notes: "Lightweight pocket power." },
            water: { name: "Nalgene Wide Mouth 1L Bottle", weight: 180, rating: "S", mileage: 1600, notes: "Unbreakable water storage." }
        }
    }
};

// Application State Management
let currentLoadout = 'running';
let activeModalTab = 'running';
let selectedGearList = [];

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
 * Renders gear items into the central character paperdoll slots.
 */
function renderEquipmentSlots() {
    const activeGear = INVENTORY_DATA[currentLoadout]?.gear || {};

    Object.keys(activeGear).forEach(slotKey => {
        const slotEl = document.getElementById(`slot-${slotKey}`);
        if (slotEl) {
            const contentEl = slotEl.querySelector('.slot-content');
            const item = activeGear[slotKey];
            if (contentEl && item) {
                contentEl.innerHTML = `<span class="slot-item-name">${item.name}</span>`;
            }
        }
    });
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
            pace: document.getElementById('run-pace')?.value || '',
            cadence: document.getElementById('run-cadence')?.value || '',
            heartRate: document.getElementById('run-hr')?.value || '',
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
    return `# 🛡️ Don Quijote OS - 遠征戰報錄入（跑步紀錄）

請 Gemini 系統架構師分析以下騎士遠征數據，並給予騎士精神點評與裝備磨損經驗點數建議：

- **📅 遠征日期**：${data.date}
- **🏃 科目 / 課表**：${data.subject || '無'} (${data.workout || '自由跑'})
- **📍 遠征地點**：${data.location || '未標示'}
- **🌤️ 天氣與氣溫**：${data.weather || '未記錄'}
- **📏 跑量距離**：${data.distance} KM
- **⏱️ 總時間 / 配速**：${data.duration || 'N/A'} (平均配速 ${data.pace || 'N/A'})
- **🦶 平均步頻**：${data.cadence || 'N/A'} SPM
- **❤️ 心率區間**：${data.heartRate || 'N/A'}
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
    return `# 🛡️ Don Quijote OS - 遠征戰報錄入（CityWalk 台北微旅行）

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
