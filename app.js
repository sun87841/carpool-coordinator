/* ==========================================================================
   RideShare Planner - Core Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // FIREBASE DATABASE CONFIGURATION
    // ==========================================================================
    // TODO: Paste your firebaseConfig block from Firebase Console settings here!
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY_HERE",
        authDomain: "YOUR_PROJECT_ID_HERE.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID_HERE",
        storageBucket: "YOUR_PROJECT_ID_HERE.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID_HERE",
        appId: "YOUR_APP_ID_HERE"
    };

    // Initialize Firebase if config is filled
    let isFirebaseReady = false;
    let db = null;
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            isFirebaseReady = true;
            console.log("Firebase initialized successfully.");
        } catch (e) {
            console.error("Firebase initialization failed:", e);
        }
    }

    // STATE
    let state = {
        participants: []
    };
    let editingId = null;
    let currentLang = 'en';

    const TRANSLATIONS = {
        en: {
            appName: "RideShare Planner",
            appSubtitle: "Interactive Carpool & Travel Coordinator",
            btnDemo: "Load Demo Data",
            btnImport: "Import JSON",
            btnShareLink: "Copy Share Link",
            btnExport: "Export",
            btnExportCsv: "Save CSV (Sheets)",
            btnExportJson: "Save JSON",
            btnPrint: "Print Matching Chart",
            btnReset: "Reset",
            btnLang: "繁中 / EN",
            statTotal: "Total Travelers",
            statDrivers: "Drivers (Cars)",
            statSeats: "Total Seats Open",
            statUnassigned: "Unassigned Passengers",
            statMatchPct: "Match Rate",
            legendFilled: "Filled Seat",
            legendEmpty: "Empty Seat",
            formTitleAdd: "Register Participant",
            formTitleEdit: "Edit Participant",
            lblFullName: "Full Name",
            phFullName: "e.g. Alex Chen",
            errName: "Please enter a name",
            lblRole: "Role",
            rolePassenger: "Passenger",
            rolePassengerSub: "Needs a ride",
            roleDriver: "Driver",
            roleDriverSub: "Has a car",
            lblFood: "Bringing Food?",
            foodYes: "Yes",
            foodNo: "No",
            lblFoodDetails: "What food are you bringing?",
            phFoodDetails: "e.g. Fried rice, cookies",
            lblCarModel: "Car Model / Description",
            phCarModel: "e.g. Blue Honda Civic",
            errCarModel: "Please describe the car",
            lblCarSeats: "Carpool Seats Available",
            phCarSeats: "0 if solo",
            errCarSeats: "Must be 0 - 9",
            lblCarFamily: "Family Riding Along",
            phCarFamily: "0 if none",
            lblCarPlate: "License Plate",
            phCarPlate: "e.g. 7XYZ123",
            lblGroup: "Company / Group Name",
            phGroup: "e.g. Google, DeepMind",
            lblNotes: "Special Notes / Preferences",
            phNotes: "e.g. Staying near downtown, leaving 8am",
            btnAddToList: "Add to List",
            btnSaveChanges: "Save Changes",
            btnCancel: "Cancel",
            unassignedTitle: "Unassigned Passengers",
            unassignedDesc: "Drag passengers to a car on the right, or click assignment buttons.",
            noUnassigned: "No unassigned passengers",
            boardTitle: "Carpool Board",
            boardDesc: "Drag passengers onto cars or click the car seat grid to assign.",
            noActiveVehicles: "No Active Vehicles Registered",
            noActiveVehiclesDesc: "Add a participant with the **Driver** role to set up your first carpool vehicle, or load the **Demo Data** above to test it out instantly.",
            assignCarSelect: "Assign Car...",
            seatsLeft: "seats left",
            foodTitle: "Food Details",
            badgeFood: "Bringing: {details}",
            badgeNoFood: "No food",
            groupTitle: "Company/Group",
            editDetails: "Edit details",
            removeRegistration: "Remove registration",
            soloDriver: "Solo Driver",
            soloPlusFamily: "Solo + {count} Family",
            seatsRatio: "{count}/{capacity} Seats",
            editDriverDetails: "Edit driver and car details",
            removeDriver: "Remove driver and car",
            routeNotes: "Route: {notes}",
            drivingSoloFamily: "Driving Solo with {count} family member(s)",
            drivingSoloNoPassengers: "Driving Solo (No passengers)",
            visualCapacity: "Visual Capacity:",
            emptySeatClick: "Empty Seat (Click to assign)",
            seatFilled: "Seat filled",
            overCapacity: "Over capacity!",
            familyRiding: "Family Riding Along",
            familyPeopleCount: "{count} People",
            noPassengersAssigned: "No passengers assigned",
            editPassengerDetails: "Edit passenger details",
            removePassengerFromCar: "Remove passenger from this car",
            allAssignedAlert: "All passengers are already assigned to cars! Register new passengers first.",
            csvHeader: "Driver Name,Driver Group,Car Model,License Plate,Seats Capacity,Family Members,Passenger Name,Passenger Group,Bringing Food,Food Details,Passenger Notes",
            csvUnassigned: "UNASSIGNED PASSENGERS",
            printTitle: "RideShare Planner - Final Carpool Match Chart",
            printGenerated: "Generated on: {date}",
            printNoDrivers: "No drivers registered.",
            printFamilyRidingAlong: "Family Riding Along: {count} family member(s)",
            printDrivingSolo: "Driving Solo (No extra seats)",
            printSeatsOccupied: "Seats Occupied: {occupied}/{capacity}",
            printSeatsOccupiedSolo: "Seats Occupied: Solo",
            printSeatsOccupiedFamily: " (+ {count} Family)",
            printRouteDetails: "Route details: {notes}",
            lblDriverName: "Driver"
        },
        zh: {
            appName: "福彌寺交通乘車登記",
            appSubtitle: "互動式共乘與車輛安排儀表板",
            btnDemo: "載入示範數據",
            btnImport: "匯入 JSON 檔",
            btnShareLink: "複製分享連結",
            btnExport: "匯出檔案",
            btnExportCsv: "儲存 CSV (試算表)",
            btnExportJson: "儲存 JSON 檔",
            btnPrint: "列印配對圖表",
            btnReset: "重設系統",
            btnLang: "EN / 繁中",
            statTotal: "總旅行人數",
            statDrivers: "司機 (車輛數)",
            statSeats: "剩餘空位總數",
            statUnassigned: "未分配乘客數",
            statMatchPct: "配對率",
            legendFilled: "已佔用座位",
            legendEmpty: "空座位",
            formTitleAdd: "註冊參與者",
            formTitleEdit: "編輯參與者資料",
            lblFullName: "姓名",
            phFullName: "例如：陳小明",
            errName: "請輸入姓名",
            lblRole: "身分角色",
            rolePassenger: "乘客",
            rolePassengerSub: "需要搭車",
            roleDriver: "司機",
            roleDriverSub: "有開車",
            lblFood: "是否攜帶食物？",
            foodYes: "是",
            foodNo: "否",
            lblFoodDetails: "攜帶食物詳情",
            phFoodDetails: "例如：炒麵、水果盤、飲料",
            lblCarModel: "車款 / 車輛描述",
            phCarModel: "例如：藍色 Honda Civic",
            errCarModel: "請輸入車輛描述",
            lblCarSeats: "可提供共乘座位數",
            phCarSeats: "若獨自駕駛則為 0",
            errCarSeats: "必須介於 0 到 9 之間",
            lblCarFamily: "隨行家屬人數",
            phCarFamily: "無則填 0",
            lblCarPlate: "車牌號碼",
            phCarPlate: "例如：7XYZ123",
            lblGroup: "公司 / 團體名稱",
            phGroup: "例如：Google, DeepMind",
            lblNotes: "特別備註 / 偏好",
            phNotes: "例如：住在市中心附近，早上8點出發",
            btnAddToList: "新增至名單",
            btnSaveChanges: "儲存修改",
            btnCancel: "取消",
            unassignedTitle: "未分配乘客",
            unassignedDesc: "將乘客拖曳至右側車輛，或使用下拉選單快速分配。",
            noUnassigned: "所有乘客皆已分配座位",
            boardTitle: "共乘車位看板",
            boardDesc: "將乘客卡拖曳到車輛上，或點擊車位的空圈進行分配。",
            noActiveVehicles: "尚未註冊任何司機或車輛",
            noActiveVehiclesDesc: "在左側新增一位身分為 **司機** 的參與者以啟用車輛，或點擊上方的 **載入示範數據** 來立即體驗。",
            assignCarSelect: "分配車輛...",
            seatsLeft: "個空位",
            foodTitle: "攜帶食物詳情",
            badgeFood: "攜帶：{details}",
            badgeNoFood: "不帶食物",
            groupTitle: "公司/團體",
            editDetails: "編輯詳細資訊",
            removeRegistration: "移除此註冊者",
            soloDriver: "獨自駕駛",
            soloPlusFamily: "獨自駕駛 + {count} 位家屬",
            seatsRatio: "座位 {count}/{capacity}",
            editDriverDetails: "編輯司機與車輛資料",
            removeDriver: "移除此司機與車輛",
            routeNotes: "路線: {notes}",
            drivingSoloFamily: "獨自駕駛，隨行家屬 {count} 人",
            drivingSoloNoPassengers: "獨自駕駛 (不載客)",
            visualCapacity: "座位視覺化:",
            emptySeatClick: "空座位 (點擊直接分配)",
            seatFilled: "座位已佔用",
            overCapacity: "人數已超載！",
            familyRiding: "隨行家屬",
            familyPeopleCount: "{count} 人",
            noPassengersAssigned: "目前無乘客分配",
            editPassengerDetails: "編輯乘客資料",
            removePassengerFromCar: "將乘客從此車輛移出",
            allAssignedAlert: "所有乘客都已經分配到車輛了！請先註冊新乘客。",
            csvHeader: "司機姓名,司機團體,車款描述,車牌號碼,座位容量,隨行家屬人數,乘客姓名,乘客團體,是否攜帶食物,攜帶食物詳情,乘客備註",
            csvUnassigned: "未分配乘客名單",
            printTitle: "福彌寺交通乘車登記 - 最終配對圖表",
            printGenerated: "產生日期的: {date}",
            printNoDrivers: "無註冊司機。",
            printFamilyRidingAlong: "隨行家屬: {count} 位家屬一同搭乘",
            printDrivingSolo: "獨自駕駛 (無多餘座位)",
            printSeatsOccupied: "座位已佔用: {occupied}/{capacity}",
            printSeatsOccupiedSolo: "座位已佔用: 獨自駕駛",
            printSeatsOccupiedFamily: " (+ {count} 位家屬)",
            printRouteDetails: "路線詳情: {notes}",
            lblDriverName: "司機"
        }
    };

    // DOM ELEMENTS - Header & Actions
    const btnLang = document.getElementById('btn-lang');
    const btnDemo = document.getElementById('btn-demo');
    const btnShareLink = document.getElementById('btn-share-link');
    const btnImportTrigger = document.getElementById('btn-import-trigger');
    const fileImport = document.getElementById('file-import');
    const btnExportCsv = document.getElementById('btn-export-csv');
    const btnExportJson = document.getElementById('btn-export-json');
    const btnPrint = document.getElementById('btn-print');
    const btnReset = document.getElementById('btn-reset');

    // DOM ELEMENTS - Stats
    const statTotal = document.getElementById('stat-total');
    const statDrivers = document.getElementById('stat-drivers');
    const statSeats = document.getElementById('stat-seats');
    const statUnassigned = document.getElementById('stat-unassigned');
    const statMatchPct = document.getElementById('stat-match-pct');
    const statProgressFill = document.getElementById('stat-progress-fill');

    // DOM ELEMENTS - Form & Inputs
    const form = document.getElementById('registration-form');
    const formTitle = document.getElementById('form-title');
    const regName = document.getElementById('reg-name');
    const regRoles = document.getElementsByName('reg-role');
    const fieldsPassenger = document.getElementById('fields-passenger');
    const fieldsDriver = document.getElementById('fields-driver');
    const regFoodBringing = document.getElementById('reg-food-bringing');
    const foodDetailsGroup = document.getElementById('food-details-group');
    const regFoodDetails = document.getElementById('reg-food-details');
    const regCarModel = document.getElementById('reg-car-model');
    const regCarSeats = document.getElementById('reg-car-seats');
    const regCarFamily = document.getElementById('reg-car-family');
    const regCarPlate = document.getElementById('reg-car-plate');
    const regGroup = document.getElementById('reg-group');
    const regNotes = document.getElementById('reg-notes');
    const btnFormSubmit = document.getElementById('btn-form-submit');
    const btnFormCancel = document.getElementById('btn-form-cancel');
    
    // Form Errors
    const errName = document.getElementById('err-name');
    const errCarModel = document.getElementById('err-car-model');
    const errCarSeats = document.getElementById('err-car-seats');

    // DOM ELEMENTS - Lists & Board
    const unassignedList = document.getElementById('unassigned-list');
    const badgeUnassigned = document.getElementById('badge-unassigned');
    const carsGrid = document.getElementById('cars-grid');

    // DOM ELEMENTS - Print
    const printLayout = document.getElementById('print-layout');
    const printContent = document.getElementById('print-content');
    const printDate = document.getElementById('print-date');

    // DEMO DATA CONSTANTS
    const DEMO_PARTICIPANTS = [
        // Drivers
        { id: 1, name: 'Sarah Connor', role: 'driver', carModel: 'Black Tesla Model Y', capacity: 4, notes: 'Driving route A, leaving at 8:00 AM', group: 'TechCorp', licensePlate: 'TR-101', familyCount: 0 },
        { id: 2, name: 'Bob Marley', role: 'driver', carModel: 'Yellow VW Microbus', capacity: 7, notes: 'Scenic route, lots of space for gear', group: 'Reggae Records', licensePlate: 'JAM-MIN', familyCount: 2 },
        { id: 3, name: 'Bruce Wayne', role: 'driver', carModel: 'Black Lamborghini Urus', capacity: 3, notes: 'Fast driving, luggage space is tight', group: 'Wayne Enterprises', licensePlate: 'BAT-1', familyCount: 0 },
        { id: 4, name: 'Peter Parker', role: 'driver', carModel: 'Red Vespa Scooter', capacity: 1, notes: 'Only room for one backpack and one passenger!', group: 'Daily Bugle', licensePlate: 'SPIDY-1', familyCount: 0 },
        { id: 15, name: 'Wanda Maximoff', role: 'driver', carModel: 'Red Audi A4 Sedan', capacity: 0, notes: 'Driving solo, meeting at the destination', group: 'Avengers', licensePlate: 'HEX-001', familyCount: 1 },
        
        // Passengers
        { id: 5, name: 'Harry Potter', role: 'passenger', foodBringing: 'yes', foodDetails: 'Pumpkin Juice', notes: 'Bringing a cage with a pet owl', assignedCarId: 1, group: 'Hogwarts' },
        { id: 6, name: 'Hermione Granger', role: 'passenger', foodBringing: 'no', foodDetails: '', notes: 'Heavy bag full of thick textbooks', assignedCarId: 1, group: 'Hogwarts' },
        { id: 7, name: 'Ron Weasley', role: 'passenger', foodBringing: 'yes', foodDetails: 'Chocolate Frogs', notes: 'Prone to car sickness, front seat preferred', assignedCarId: 2, group: 'Hogwarts' },
        { id: 8, name: 'Tony Stark', role: 'passenger', foodBringing: 'no', foodDetails: '', notes: 'Needs room for high-tech laptop setup', assignedCarId: 3, group: 'Stark Industries' },
        { id: 9, name: 'Steve Rogers', role: 'passenger', foodBringing: 'yes', foodDetails: 'Apple Pie', notes: 'Bringing shield, needs legroom', assignedCarId: 2, group: 'S.H.I.E.L.D.' },
        { id: 10, name: 'Natasha Romanoff', role: 'passenger', foodBringing: 'no', foodDetails: '', notes: 'Travels extremely light', assignedCarId: 3, group: 'S.H.I.E.L.D.' },
        { id: 11, name: 'Diana Prince', role: 'passenger', foodBringing: 'yes', foodDetails: 'Greek Salad', notes: 'Heading to the convention center', assignedCarId: 2, group: 'Museum Corp' },
        { id: 12, name: 'Clark Kent', role: 'passenger', foodBringing: 'yes', foodDetails: 'Sandwiches', notes: 'Wearing glasses, very polite passenger', assignedCarId: null, group: 'Daily Bugle' },
        { id: 13, name: 'Bruce Banner', role: 'passenger', foodBringing: 'no', foodDetails: '', notes: 'Enjoys quiet carpools, plays classical music', assignedCarId: null, group: 'Stark Industries' },
        { id: 14, name: 'Selina Kyle', role: 'passenger', foodBringing: 'no', foodDetails: '', notes: 'Needs a pickup near downtown core', assignedCarId: null, group: 'Cat Burglar Co.' }
    ];

    // ==========================================================================
    // INITIALIZATION & STATE MANAGEMENT
    // ==========================================================================
    
    function init() {
        // Parse language query parameter ?lang=zh or ?lang=en
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam === 'zh' || langParam === 'zh-TW' || langParam === 'zh-CN') {
            currentLang = 'zh';
        } else {
            currentLang = 'en';
        }

        // Parse data query parameter ?data=...
        const dataParam = urlParams.get('data');
        if (dataParam) {
            try {
                const decodedJson = decodeURIComponent(escape(atob(dataParam)));
                const importedState = JSON.parse(decodedJson);
                if (importedState && Array.isArray(importedState.participants)) {
                    state = importedState;
                    localStorage.setItem('rideShareState', JSON.stringify(state));
                    // Clean URL parameter so it doesn't stay in address bar
                    urlParams.delete('data');
                    const cleanURL = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
                    window.history.replaceState({}, '', cleanURL);
                }
            } catch (e) {
                console.error("Failed to parse data parameter from URL:", e);
            }
        }

        loadState();
        setupEventListeners();
        applyLanguageUI();
        render();

        // Connect to Cloud Firestore listener if Firebase is configured
        if (isFirebaseReady) {
            db.collection('carpools').doc('active_trip').onSnapshot((doc) => {
                if (doc.exists) {
                    state = doc.data();
                    // Update local storage as offline backup
                    localStorage.setItem('rideShareState', JSON.stringify(state));
                    render();
                }
            }, (err) => {
                console.warn("Firestore snapshot listener failed, using offline local sync:", err);
            });
        }

        // Listen for storage updates in other tabs/windows for real-time synchronization
        window.addEventListener('storage', (e) => {
            if (e.key === 'rideShareState') {
                loadState();
                render();
            }
        });

        // Also reload and render when the tab is focused to guarantee fresh data instantly
        window.addEventListener('focus', () => {
            loadState();
            render();
        });
    }

    function loadState() {
        const saved = localStorage.getItem('rideShareState');
        if (saved) {
            try {
                state = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved state, starting fresh", e);
                state = { participants: [] };
            }
        } else {
            state = { participants: [] };
        }
    }

    function saveState() {
        localStorage.setItem('rideShareState', JSON.stringify(state));

        // Write to Cloud Firestore database if active
        if (isFirebaseReady) {
            db.collection('carpools').doc('active_trip').set(state).catch((err) => {
                console.error("Failed to save state to Cloud Firestore:", err);
            });
        }
    }

    function applyLanguageUI() {
        // Update document title
        document.title = TRANSLATIONS[currentLang].appName + " | " + TRANSLATIONS[currentLang].appSubtitle;
        
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = TRANSLATIONS[currentLang][key];
            if (translation) {
                el.textContent = translation;
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = TRANSLATIONS[currentLang][key];
            if (translation) {
                el.placeholder = translation;
            }
        });

        // Update form title and submit button based on edit state
        if (editingId) {
            formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> ${TRANSLATIONS[currentLang].formTitleEdit}`;
            btnFormSubmit.innerHTML = `<i class="fa-solid fa-check"></i> ${TRANSLATIONS[currentLang].btnSaveChanges}`;
        } else {
            formTitle.innerHTML = `<i class="fa-solid fa-user-plus"></i> ${TRANSLATIONS[currentLang].formTitleAdd}`;
            btnFormSubmit.innerHTML = `<i class="fa-solid fa-plus"></i> ${TRANSLATIONS[currentLang].btnAddToList}`;
        }
    }

    // ==========================================================================
    // EVENT LISTENERS Setup
    // ==========================================================================

    function setupEventListeners() {
        // Toggle role inputs
        regRoles.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'driver') {
                    fieldsPassenger.classList.add('hidden');
                    fieldsDriver.classList.remove('hidden');
                } else {
                    fieldsPassenger.classList.remove('hidden');
                    fieldsDriver.classList.add('hidden');
                }
            });
        });

        // Toggle food details input based on bringing food option
        if (regFoodBringing && foodDetailsGroup) {
            regFoodBringing.addEventListener('change', (e) => {
                if (e.target.value === 'yes') {
                    foodDetailsGroup.classList.remove('hidden');
                } else {
                    foodDetailsGroup.classList.add('hidden');
                    if (regFoodDetails) regFoodDetails.value = '';
                }
            });
        }

        // Form Submit
        form.addEventListener('submit', handleFormSubmit);
        btnFormCancel.addEventListener('click', cancelEdit);

        // Action Buttons
        if (btnLang) {
            btnLang.addEventListener('click', () => {
                const nextLang = currentLang === 'en' ? 'zh' : 'en';
                currentLang = nextLang;

                // Update URL search parameters without page reload
                const url = new URL(window.location.href);
                url.searchParams.set('lang', nextLang);
                window.history.pushState({}, '', url);

                applyLanguageUI();
                render();
            });
        }
        if (btnDemo) btnDemo.addEventListener('click', loadDemoData);
        if (btnShareLink) btnShareLink.addEventListener('click', copyShareableLink);
        if (btnImportTrigger && fileImport) {
            btnImportTrigger.addEventListener('click', () => {
                fileImport.click();
            });
            fileImport.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const importedState = JSON.parse(event.target.result);
                        if (importedState && Array.isArray(importedState.participants)) {
                            state = importedState;
                            saveState();
                            render();
                            alert(currentLang === 'zh' ? '資料匯入成功！' : 'Data imported successfully!');
                        } else {
                            alert(currentLang === 'zh' ? '無效的資料格式！' : 'Invalid data format!');
                        }
                    } catch (err) {
                        console.error("Failed to parse imported file:", err);
                        alert(currentLang === 'zh' ? '解析檔案失敗，請確保它是正確的 JSON 格式。' : 'Failed to parse file. Please make sure it is a valid JSON.');
                    }
                    fileImport.value = '';
                };
                reader.readAsText(file);
            });
        }
        if (btnReset) btnReset.addEventListener('click', resetApp);
        if (btnExportCsv) btnExportCsv.addEventListener('click', exportCSV);
        if (btnExportJson) btnExportJson.addEventListener('click', exportJSON);
        if (btnPrint) btnPrint.addEventListener('click', triggerPrint);

        // Setup Drag & Drop on Unassigned Area
        unassignedList.addEventListener('dragover', (e) => {
            e.preventDefault();
            unassignedList.classList.add('drag-over-active');
        });

        unassignedList.addEventListener('dragleave', () => {
            unassignedList.classList.remove('drag-over-active');
        });

        unassignedList.addEventListener('drop', (e) => {
            e.preventDefault();
            unassignedList.classList.remove('drag-over-active');
            const passengerId = parseInt(e.dataTransfer.getData('text/plain'), 10);
            if (passengerId) {
                unassignPassenger(passengerId);
            }
        });
    }

    // ==========================================================================
    // ACTIONS & STATE MUTATIONS
    // ==========================================================================

    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validation
        let isValid = true;
        
        // Reset styles
        regName.classList.remove('invalid');
        regCarModel.classList.remove('invalid');
        regCarSeats.classList.remove('invalid');

        const nameValue = regName.value.trim();
        const roleValue = document.querySelector('input[name="reg-role"]:checked').value;
        const groupValue = regGroup.value.trim();
        const notesValue = regNotes.value.trim();

        if (!nameValue) {
            regName.classList.add('invalid');
            isValid = false;
        }

        let newParticipant = {
            id: Date.now(),
            name: nameValue,
            role: roleValue,
            notes: notesValue,
            group: groupValue
        };

        if (roleValue === 'driver') {
            const carModelValue = regCarModel.value.trim();
            const carSeatsValue = parseInt(regCarSeats.value, 10);
            const carFamilyValue = parseInt(regCarFamily.value, 10) || 0;
            const carPlateValue = regCarPlate.value.trim();

            if (!carModelValue) {
                regCarModel.classList.add('invalid');
                isValid = false;
            }
            if (isNaN(carSeatsValue) || carSeatsValue < 0 || carSeatsValue > 9) {
                regCarSeats.classList.add('invalid');
                isValid = false;
            }

            newParticipant.carModel = carModelValue;
            newParticipant.capacity = carSeatsValue;
            newParticipant.familyCount = carFamilyValue;
            newParticipant.licensePlate = carPlateValue;
        } else {
            newParticipant.foodBringing = regFoodBringing.value;
            newParticipant.foodDetails = regFoodBringing.value === 'yes' ? regFoodDetails.value.trim() : '';
            newParticipant.assignedCarId = null; // Unassigned initially
        }

        if (isValid) {
            if (editingId !== null) {
                // Update existing participant
                state.participants = state.participants.map(p => {
                    if (p.id === editingId) {
                        const updated = {
                            ...p,
                            name: nameValue,
                            notes: notesValue,
                            group: groupValue
                        };
                        if (roleValue === 'driver') {
                            updated.role = 'driver';
                            updated.carModel = regCarModel.value.trim();
                            updated.capacity = parseInt(regCarSeats.value, 10);
                            updated.familyCount = parseInt(regCarFamily.value, 10) || 0;
                            updated.licensePlate = regCarPlate.value.trim();
                            delete updated.foodBringing;
                            delete updated.foodDetails;
                        } else {
                            updated.role = 'passenger';
                            updated.foodBringing = regFoodBringing.value;
                            updated.foodDetails = regFoodBringing.value === 'yes' ? regFoodDetails.value.trim() : '';
                            delete updated.carModel;
                            delete updated.capacity;
                            delete updated.familyCount;
                            delete updated.licensePlate;
                        }
                        return updated;
                    }
                    return p;
                });
                cancelEdit();
            } else {
                state.participants.push(newParticipant);
            }
            
            saveState();
            render();
            
            if (editingId === null) {
                // Reset form fields
                regName.value = '';
                regGroup.value = '';
                regCarModel.value = '';
                regCarSeats.value = '4';
                regCarFamily.value = '0';
                regCarPlate.value = '';
                regNotes.value = '';
            }
        }
    }

    function loadDemoData() {
        // Deep clone demo data
        state.participants = JSON.parse(JSON.stringify(DEMO_PARTICIPANTS));
        saveState();
        render();
    }

    function resetApp() {
        if (confirm("Are you sure you want to clear all registrations and carpool assignments?")) {
            state.participants = [];
            saveState();
            render();
        }
    }

    function deleteParticipant(id) {
        // Find if this is a driver
        const item = state.participants.find(p => p.id === id);
        if (item && item.role === 'driver') {
            if (confirm(`Deleting driver "${item.name}" will unassign all their passengers. Continue?`)) {
                // Remove driver
                state.participants = state.participants.filter(p => p.id !== id);
                // Unassign their passengers
                state.participants.forEach(p => {
                    if (p.role === 'passenger' && p.assignedCarId === id) {
                        p.assignedCarId = null;
                    }
                });
            } else {
                return;
            }
        } else {
            // Passenger simply deleted
            state.participants = state.participants.filter(p => p.id !== id);
        }
        saveState();
        render();
    }

    function assignPassenger(passengerId, driverId) {
        state.participants = state.participants.map(p => {
            if (p.id === passengerId) {
                return { ...p, assignedCarId: driverId };
            }
            return p;
        });
        saveState();
        render();
    }

    function unassignPassenger(passengerId) {
        state.participants = state.participants.map(p => {
            if (p.id === passengerId) {
                return { ...p, assignedCarId: null };
            }
            return p;
        });
        saveState();
        render();
    }

    // ==========================================================================
    // RENDERING LOGIC
    // ==========================================================================

    function render() {
        const drivers = state.participants.filter(p => p.role === 'driver');
        const passengers = state.participants.filter(p => p.role === 'passenger');
        const unassigned = passengers.filter(p => p.assignedCarId === null);
        
        // Calculate Seat availability
        let totalSeatsOpen = 0;
        drivers.forEach(d => {
            totalSeatsOpen += d.capacity;
        });

        const totalPassengers = passengers.length;
        const assignedCount = totalPassengers - unassigned.length;
        
        // Count family members riding with drivers
        let totalFamilyCount = 0;
        drivers.forEach(d => {
            totalFamilyCount += (d.familyCount || 0);
        });
        const grandTotal = totalPassengers + drivers.length + totalFamilyCount;
        
        // 1. Render Stats Panel
        statTotal.textContent = grandTotal;
        statDrivers.textContent = drivers.length;
        statSeats.textContent = totalSeatsOpen;
        statUnassigned.textContent = unassigned.length;
        
        const matchPct = totalPassengers > 0 ? Math.round((assignedCount / totalPassengers) * 100) : 0;
        statMatchPct.textContent = `${matchPct}%`;
        statProgressFill.style.width = `${matchPct}%`;
        badgeUnassigned.textContent = unassigned.length;

        // 2. Render Unassigned Passengers Column
        renderUnassignedList(unassigned, drivers);

        // 3. Render Cars/Carpools Grid
        renderCarsGrid(drivers, passengers);
    }

    function getFoodBadgeHTML(p) {
        if (p.foodBringing === 'yes') {
            const foodName = p.foodDetails ? escapeHTML(p.foodDetails) : '';
            const title = TRANSLATIONS[currentLang].foodTitle;
            const text = TRANSLATIONS[currentLang].badgeFood.replace('{details}', foodName);
            return `<span class="badge-tag" style="background-color: rgba(16, 185, 129, 0.08); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.2); padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 500; display: inline-flex; align-items: center; gap: 4px;" title="${title}"><i class="fa-solid fa-utensils"></i> ${text}</span>`;
        } else {
            const title = TRANSLATIONS[currentLang].foodTitle;
            const text = TRANSLATIONS[currentLang].badgeNoFood;
            return `<span class="badge-tag" style="background-color: rgba(255, 255, 255, 0.02); color: var(--text-muted); border: 1px solid var(--border-color); padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 500; display: inline-flex; align-items: center; gap: 4px;" title="${title}"><i class="fa-solid fa-circle-xmark"></i> ${text}</span>`;
        }
    }

    function getFoodText(p) {
        if (p.foodBringing === 'yes') {
            return TRANSLATIONS[currentLang].badgeFood.replace('{details}', p.foodDetails || '');
        } else {
            return TRANSLATIONS[currentLang].badgeNoFood;
        }
    }

    function renderUnassignedList(unassigned, drivers) {
        unassignedList.innerHTML = '';
        
        if (unassigned.length === 0) {
            unassignedList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-user-check"></i>
                    <p data-i18n="noUnassigned">${TRANSLATIONS[currentLang].noUnassigned}</p>
                </div>
            `;
            return;
        }

        unassigned.forEach(p => {
            const card = document.createElement('div');
            card.className = 'passenger-card';
            card.setAttribute('draggable', 'true');
            card.dataset.id = p.id;
            
            // Drag listeners
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', p.id);
                card.classList.add('dragging');
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });

            // Quick Assign options HTML
            let optionsHTML = `<option value="" disabled selected>${TRANSLATIONS[currentLang].assignCarSelect}</option>`;
            drivers.forEach(d => {
                if (d.capacity === 0) return; // Skip solo drivers
                // Check current passenger count for this driver
                const curCount = state.participants.filter(item => item.role === 'passenger' && item.assignedCarId === d.id).length;
                const remaining = d.capacity - curCount;
                optionsHTML += `<option value="${d.id}">${d.name}${d.group ? ` (${d.group})` : ''} (${remaining} ${TRANSLATIONS[currentLang].seatsLeft})</option>`;
            });

            card.innerHTML = `
                <div class="passenger-details">
                    <div class="passenger-header">
                        <span class="passenger-name">${escapeHTML(p.name)}</span>
                    </div>
                    <div class="passenger-meta" style="margin-top: 0.15rem; margin-bottom: 0.15rem;">
                        ${getFoodBadgeHTML(p)}
                        ${p.group ? `<span class="badge-tag badge-group" title="${TRANSLATIONS[currentLang].groupTitle}"><i class="fa-solid fa-building"></i> ${escapeHTML(p.group)}</span>` : ''}
                    </div>
                    ${p.notes ? `<p class="passenger-notes" title="${escapeHTML(p.notes)}">${escapeHTML(p.notes)}</p>` : ''}
                </div>
                <div class="passenger-actions">
                    <select class="select-quick-assign" style="width:110px; margin-right:5px;" data-passenger-id="${p.id}">
                        ${optionsHTML}
                    </select>
                    <button class="btn-card-action" data-action="edit" data-id="${p.id}" title="${TRANSLATIONS[currentLang].editDetails}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-card-action danger-hover" data-action="delete" data-id="${p.id}" title="${TRANSLATIONS[currentLang].removeRegistration}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;

            // Listen to select box changes (quick click assignment)
            const select = card.querySelector('.select-quick-assign');
            select.addEventListener('change', (e) => {
                const driverId = parseInt(e.target.value, 10);
                assignPassenger(p.id, driverId);
            });

            // Edit & Delete actions
            card.querySelector('[data-action="edit"]').addEventListener('click', () => startEdit(p.id));
            card.querySelector('[data-action="delete"]').addEventListener('click', () => deleteParticipant(p.id));

            unassignedList.appendChild(card);
        });
    }

    function renderCarsGrid(drivers, passengers) {
        carsGrid.innerHTML = '';

        if (drivers.length === 0) {
            carsGrid.innerHTML = `
                <div class="empty-state-large">
                    <i class="fa-solid fa-car-rear animate-float"></i>
                    <h3 data-i18n="noActiveVehicles">${TRANSLATIONS[currentLang].noActiveVehicles}</h3>
                    <p data-i18n="noActiveVehiclesDesc">${TRANSLATIONS[currentLang].noActiveVehiclesDesc}</p>
                </div>
            `;
            return;
        }

        drivers.forEach(d => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.dataset.driverId = d.id;

            // Get passengers assigned to this driver
            const assignedPassengers = passengers.filter(p => p.assignedCarId === d.id);
            const count = assignedPassengers.length;
            
            // Ratio capacity coloring
            let capacityText = TRANSLATIONS[currentLang].seatsRatio.replace('{count}', count).replace('{capacity}', d.capacity);
            let ratioClass = 'ratio-normal';
            if (d.capacity === 0) {
                capacityText = d.familyCount > 0 
                    ? TRANSLATIONS[currentLang].soloPlusFamily.replace('{count}', d.familyCount) 
                    : TRANSLATIONS[currentLang].soloDriver;
                ratioClass = 'ratio-full';
            } else if (count === d.capacity) {
                ratioClass = 'ratio-full';
            } else if (count > d.capacity) {
                ratioClass = 'ratio-overflow';
            }

            // Create Seat dots
            let seatsDotsHTML = '';
            for (let i = 0; i < Math.max(d.capacity, count); i++) {
                if (i < count) {
                    // Filled seat (or overflow)
                    const isOverflow = i >= d.capacity;
                    const dotTitle = isOverflow ? TRANSLATIONS[currentLang].overCapacity : TRANSLATIONS[currentLang].seatFilled;
                    seatsDotsHTML += `<span class="seat-dot ${isOverflow ? 'overflow' : 'filled'}" title="${dotTitle}" data-index="${i}"></span>`;
                } else {
                    // Empty seat
                    seatsDotsHTML += `<span class="seat-dot empty" title="${TRANSLATIONS[currentLang].emptySeatClick}" data-index="${i}"></span>`;
                }
            }

            // Get Initials for Driver avatar
            const initials = d.name.split(' ').map(n => n[0]).join('').slice(0, 2);

            // Car Card inner HTML
            carCard.innerHTML = `
                <div class="car-header">
                    <div class="driver-info">
                        <div class="driver-avatar">${escapeHTML(initials)}</div>
                        <div class="driver-text">
                            <span class="driver-name">${escapeHTML(d.name)} ${d.group ? `<span style="font-size: 0.75rem; color: var(--accent-blue); font-weight: 500; margin-left: 4px;">(${escapeHTML(d.group)})</span>` : ''}</span>
                            <span class="car-description">${escapeHTML(d.carModel)} ${d.licensePlate ? `• [${escapeHTML(d.licensePlate)}]` : ''}</span>
                        </div>
                    </div>
                    <div class="car-actions">
                        <span class="car-capacity-ratio ${ratioClass}">
                            ${capacityText}
                        </span>
                        <button class="btn-card-action" data-action="edit-driver" data-id="${d.id}" title="${TRANSLATIONS[currentLang].editDriverDetails}" style="margin-left: 5px;">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-card-action danger-hover" data-action="delete-driver" data-id="${d.id}" title="${TRANSLATIONS[currentLang].removeDriver}" style="margin-left: 5px;">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
                
                ${d.notes ? `<div style="font-size: 0.8rem; color: var(--text-secondary); background: rgba(255,255,255,0.02); padding: 5px 8px; border-radius: 4px; border-left: 3px solid var(--accent-purple); font-style: italic;">${TRANSLATIONS[currentLang].routeNotes.replace('{notes}', escapeHTML(d.notes))}</div>` : ''}

                <div class="car-seats-visual">
                    ${d.capacity === 0 
                        ? `<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;"><i class="fa-solid fa-user-slash"></i> ${
                            d.familyCount > 0 
                                ? TRANSLATIONS[currentLang].drivingSoloFamily.replace('{count}', d.familyCount)
                                : TRANSLATIONS[currentLang].drivingSoloNoPassengers
                          }</span>`
                        : `<span style="font-size: 0.75rem; color: var(--text-secondary); margin-right: 5px;">${TRANSLATIONS[currentLang].visualCapacity}</span> ${seatsDotsHTML}`
                    }
                </div>

                <div class="car-passengers">
                    <!-- Assigned Passenger Items -->
                </div>
            `;

            // Append assigned passenger cards
            const passengerListContainer = carCard.querySelector('.car-passengers');
            
            // Render Family members if present
            let familyHTML = '';
            if (d.familyCount > 0) {
                familyHTML = `
                    <div class="assigned-passenger-item" style="border-style: dotted; background-color: rgba(139, 92, 246, 0.03);">
                        <div class="assigned-passenger-info">
                            <span class="bullet-dot" style="background-color: var(--accent-purple);"></span>
                            <span class="assigned-passenger-name" style="color: var(--text-secondary);">${TRANSLATIONS[currentLang].familyRiding}</span>
                        </div>
                        <span class="badge-tag badge-luggage" style="margin-left: auto;">${TRANSLATIONS[currentLang].familyPeopleCount.replace('{count}', d.familyCount)}</span>
                    </div>
                `;
            }

            if (assignedPassengers.length === 0) {
                passengerListContainer.innerHTML = familyHTML || `<p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 10px; font-style: italic;">${TRANSLATIONS[currentLang].noPassengersAssigned}</p>`;
            } else {
                passengerListContainer.innerHTML = familyHTML;
                assignedPassengers.forEach(ap => {
                    const item = document.createElement('div');
                    item.className = 'assigned-passenger-item';
                    item.setAttribute('draggable', 'true');
                    item.dataset.id = ap.id;

                    item.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', ap.id);
                        item.classList.add('dragging');
                    });

                    item.addEventListener('dragend', () => {
                        item.classList.remove('dragging');
                    });

                    item.innerHTML = `
                        <div class="assigned-passenger-info">
                            <span class="bullet-dot"></span>
                            <span class="assigned-passenger-name">${escapeHTML(ap.name)}</span>
                            ${ap.group ? `<span style="font-size: 0.7rem; color: var(--accent-blue); margin-left: 5px; font-weight: 600;">(${escapeHTML(ap.group)})</span>` : ''}
                            ${ap.foodBringing === 'yes' ? `<span style="font-size: 0.7rem; color: var(--accent-emerald); font-weight: 600; margin-left: 5px;" title="${escapeHTML(ap.foodDetails)}"><i class="fa-solid fa-utensils"></i> (${escapeHTML(ap.foodDetails)})</span>` : ''}
                            ${ap.notes ? `<span class="assigned-passenger-notes" title="${escapeHTML(ap.notes)}">(${escapeHTML(ap.notes)})</span>` : ''}
                        </div>
                        <div class="assigned-passenger-actions">
                            <button class="btn-card-action" data-action="edit-passenger" data-id="${ap.id}" title="${TRANSLATIONS[currentLang].editPassengerDetails}">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn-card-action danger-hover" data-action="unassign" data-id="${ap.id}" title="${TRANSLATIONS[currentLang].removePassengerFromCar}">
                                <i class="fa-solid fa-user-minus"></i>
                            </button>
                        </div>
                    `;

                    // Edit & Remove/unassign action listeners
                    item.querySelector('[data-action="edit-passenger"]').addEventListener('click', () => startEdit(ap.id));
                    item.querySelector('[data-action="unassign"]').addEventListener('click', () => unassignPassenger(ap.id));

                    passengerListContainer.appendChild(item);
                });
            }

            // --- DRAG & DROP HANDLERS FOR THE CAR CARD ---
            carCard.addEventListener('dragover', (e) => {
                if (d.capacity === 0) return; // Prevent dragover for solo drivers
                e.preventDefault();
                carCard.classList.add('drag-over');
            });

            carCard.addEventListener('dragleave', () => {
                carCard.classList.remove('drag-over');
            });

            carCard.addEventListener('drop', (e) => {
                e.preventDefault();
                carCard.classList.remove('drag-over');
                if (d.capacity === 0) return; // Prevent passenger dropping on solo drivers
                const passengerId = parseInt(e.dataTransfer.getData('text/plain'), 10);
                if (passengerId) {
                    // Do not let driver assign to themselves
                    if (passengerId === d.id) return;
                    assignPassenger(passengerId, d.id);
                }
            });

            // Edit & Delete actions for drivers
            carCard.querySelector('[data-action="edit-driver"]').addEventListener('click', () => startEdit(d.id));
            carCard.querySelector('[data-action="delete-driver"]').addEventListener('click', () => deleteParticipant(d.id));

            // Seat Dot Assign Click Handlers
            carCard.querySelectorAll('.seat-dot.empty').forEach(dot => {
                dot.addEventListener('click', () => {
                    // Find first unassigned passenger and assign them to this driver
                    const unassignedList = state.participants.filter(p => p.role === 'passenger' && p.assignedCarId === null);
                    if (unassignedList.length > 0) {
                        assignPassenger(unassignedList[0].id, d.id);
                    } else {
                        alert(TRANSLATIONS[currentLang].allAssignedAlert);
                    }
                });
            });

            carsGrid.appendChild(carCard);
        });
    }

    // ==========================================================================
    // EXPORT & PRINT HANDLERS
    // ==========================================================================

    function exportCSV() {
        const drivers = state.participants.filter(p => p.role === 'driver');
        const passengers = state.participants.filter(p => p.role === 'passenger');
        
        let csvLines = [];
        
        // Header
        csvLines.push(TRANSLATIONS[currentLang].csvHeader);

        drivers.forEach(d => {
            const assigned = passengers.filter(p => p.assignedCarId === d.id);
            if (assigned.length === 0) {
                // Driver with no passengers
                csvLines.push(`"${cleanCSV(d.name)}","${cleanCSV(d.group || '')}","${cleanCSV(d.carModel)}","${cleanCSV(d.licensePlate || '')}",${d.capacity},${d.familyCount || 0},"","","","",""`);
            } else {
                assigned.forEach(ap => {
                    csvLines.push(`"${cleanCSV(d.name)}","${cleanCSV(d.group || '')}","${cleanCSV(d.carModel)}","${cleanCSV(d.licensePlate || '')}",${d.capacity},${d.familyCount || 0},"${cleanCSV(ap.name)}","${cleanCSV(ap.group || '')}","${cleanCSV(ap.foodBringing || 'no')}","${cleanCSV(ap.foodDetails || '')}","${cleanCSV(ap.notes || '')}"`);
                });
            }
        });

        // Add unassigned passengers at the bottom
        const unassigned = passengers.filter(p => p.assignedCarId === null);
        if (unassigned.length > 0) {
            csvLines.push(',,,,,,,,,,'); // spacer
            csvLines.push(`${TRANSLATIONS[currentLang].csvUnassigned},,,,,,,,,,`);
            unassigned.forEach(p => {
                csvLines.push(`"","","","","",0,"${cleanCSV(p.name)}","${cleanCSV(p.group || '')}","${cleanCSV(p.foodBringing || 'no')}","${cleanCSV(p.foodDetails || '')}","${cleanCSV(p.notes || '')}"`);
            });
        }

        const csvContent = "data:text/csv;charset=utf-8," + csvLines.join("\n");
        const encodedUri = encodeURI(csvContent);
        
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "carpool_planner_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportJSON() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", "carpool_planner_state.json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function triggerPrint() {
        const drivers = state.participants.filter(p => p.role === 'driver');
        const passengers = state.participants.filter(p => p.role === 'passenger');
        const unassigned = passengers.filter(p => p.assignedCarId === null);

        printDate.textContent = TRANSLATIONS[currentLang].printGenerated.replace('{date}', new Date().toLocaleDateString());
        printContent.innerHTML = '';

        if (drivers.length === 0) {
            printContent.innerHTML = `<p>${TRANSLATIONS[currentLang].printNoDrivers}</p>`;
        } else {
            drivers.forEach(d => {
                const assigned = passengers.filter(p => p.assignedCarId === d.id);
                
                let passengersHTML = '';
                let printFamilyHTML = d.familyCount > 0 ? `<li style="font-size: 11pt; color: #444; margin-bottom: 5px; list-style-type: square;"><strong>${TRANSLATIONS[currentLang].familyRiding}:</strong> ${TRANSLATIONS[currentLang].familyPeopleCount.replace('{count}', d.familyCount)}</li>` : '';
                
                if (d.capacity === 0) {
                    passengersHTML = `
                        <ul class="print-passenger-list" style="list-style-type: none; margin-left: 0;">
                            ${printFamilyHTML}
                            <li style="font-style: italic; color: #777;"><i class="fa-solid fa-user-slash"></i> ${TRANSLATIONS[currentLang].printDrivingSolo}</li>
                        </ul>
                    `;
                } else if (assigned.length === 0 && d.familyCount === 0) {
                    passengersHTML = `<p style="font-style: italic; color: #555;">${TRANSLATIONS[currentLang].noPassengersAssigned}</p>`;
                } else {
                    passengersHTML = `
                        <ol class="print-passenger-list">
                            ${assigned.map(ap => `
                                <li class="print-passenger-item">
                                    <strong>${escapeHTML(ap.name)}</strong> 
                                    ${ap.group ? `(${escapeHTML(ap.group)})` : ''}
                                    ${ap.notes ? `— <em>Notes: ${escapeHTML(ap.notes)}</em>` : ''} 
                                    (${TRANSLATIONS[currentLang].foodTitle}: ${getFoodText(ap)})
                                </li>
                            `).join('')}
                            ${printFamilyHTML ? `<li class="print-passenger-item" style="list-style-type: square; color: #555;"><strong>${TRANSLATIONS[currentLang].familyRiding}:</strong> ${TRANSLATIONS[currentLang].familyPeopleCount.replace('{count}', d.familyCount)}</li>` : ''}
                        </ol>
                    `;
                }

                const occupiedText = d.capacity === 0 ? TRANSLATIONS[currentLang].printSeatsOccupiedSolo : TRANSLATIONS[currentLang].printSeatsOccupied.replace('{occupied}', assigned.length).replace('{capacity}', d.capacity);
                const printFamilyText = d.familyCount > 0 ? TRANSLATIONS[currentLang].printSeatsOccupiedFamily.replace('{count}', d.familyCount) : '';

                printContent.innerHTML += `
                    <div class="print-car-group">
                        <div class="print-car-title">
                            <span>${TRANSLATIONS[currentLang].lblDriverName}: ${escapeHTML(d.name)} ${d.group ? `(${escapeHTML(d.group)})` : ''} — (${escapeHTML(d.carModel)})${d.licensePlate ? ` [${TRANSLATIONS[currentLang].lblCarPlate}: ${escapeHTML(d.licensePlate)}]` : ''}</span>
                            <span>${occupiedText}${printFamilyText}</span>
                        </div>
                        ${d.notes ? `<p style="margin-bottom: 8px; font-size: 10pt;"><strong>${TRANSLATIONS[currentLang].printRouteDetails.replace('{notes}', escapeHTML(d.notes))}</strong></p>` : ''}
                        ${passengersHTML}
                    </div>
                `;
            });
        }

        if (unassigned.length > 0) {
            printContent.innerHTML += `
                <div class="print-unassigned">
                    <h3>${TRANSLATIONS[currentLang].unassignedTitle} (${unassigned.length})</h3>
                    <ul style="list-style-type: square; margin-left: 20px;">
                        ${unassigned.map(up => `
                            <li>
                                <strong>${escapeHTML(up.name)}</strong> 
                                ${up.group ? `(${escapeHTML(up.group)})` : ''}
                                (${TRANSLATIONS[currentLang].foodTitle}: ${getFoodText(up)}) 
                                ${up.notes ? `— <em>Notes: ${escapeHTML(up.notes)}</em>` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        window.print();
    }

    // ==========================================================================
    // EDIT & FORM HELPERS
    // ==========================================================================

    function startEdit(id) {
        const p = state.participants.find(item => item.id === id);
        if (!p) return;

        editingId = id;

        // Populate common fields
        regName.value = p.name;
        regGroup.value = p.group || '';
        regNotes.value = p.notes || '';

        // Select correct role
        document.querySelector(`input[name="reg-role"][value="${p.role}"]`).checked = true;

        // Populate conditional fields
        if (p.role === 'driver') {
            fieldsPassenger.classList.add('hidden');
            fieldsDriver.classList.remove('hidden');
            regCarModel.value = p.carModel || '';
            regCarSeats.value = p.capacity !== undefined ? p.capacity : '4';
            regCarFamily.value = p.familyCount !== undefined ? p.familyCount : '0';
            regCarPlate.value = p.licensePlate || '';
        } else {
            fieldsPassenger.classList.remove('hidden');
            fieldsDriver.classList.add('hidden');
            regFoodBringing.value = p.foodBringing || 'no';
            if (p.foodBringing === 'yes') {
                foodDetailsGroup.classList.remove('hidden');
                regFoodDetails.value = p.foodDetails || '';
            } else {
                foodDetailsGroup.classList.add('hidden');
                regFoodDetails.value = '';
            }
        }

        // Update Form Title and buttons
        formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Participant`;
        btnFormSubmit.innerHTML = `<i class="fa-solid fa-check"></i> Save Changes`;
        btnFormCancel.classList.remove('hidden');

        // Scroll form card into view smoothly
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    function cancelEdit() {
        editingId = null;

        // Reset form inputs
        regName.value = '';
        regGroup.value = '';
        regNotes.value = '';
        regCarModel.value = '';
        regCarSeats.value = '4';
        regCarFamily.value = '0';
        regCarPlate.value = '';
        regFoodBringing.value = 'no';
        regFoodDetails.value = '';
        foodDetailsGroup.classList.add('hidden');

        // Reset title and submit button
        formTitle.innerHTML = `<i class="fa-solid fa-user-plus"></i> Register Participant`;
        btnFormSubmit.innerHTML = `<i class="fa-solid fa-plus"></i> Add to List`;
        btnFormCancel.classList.add('hidden');
    }

    // ==========================================================================
    // UTILITY HELPERS
    // ==========================================================================

    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function cleanCSV(str) {
        if (!str) return '';
        return str.replace(/"/g, '""');
    }

    function getShareableLink() {
        try {
            const jsonStr = JSON.stringify(state);
            const base64Str = btoa(unescape(encodeURIComponent(jsonStr)));
            const url = new URL(window.location.href);
            url.searchParams.set('data', base64Str);
            return url.toString();
        } catch (e) {
            console.error("Failed to generate shareable link:", e);
            return window.location.href;
        }
    }

    function copyShareableLink() {
        const link = getShareableLink();
        navigator.clipboard.writeText(link).then(() => {
            alert(currentLang === 'zh' ? '分享連結已複製到剪貼簿！您可以將它傳送到手機打開。' : 'Shareable link copied to clipboard! Send it to your phone to open.');
        }).catch(err => {
            console.error("Failed to copy link:", err);
            const tempInput = document.createElement('input');
            tempInput.value = link;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert(currentLang === 'zh' ? '分享連結已複製！您可以將它傳送到手機。' : 'Shareable link copied!');
        });
    }

    // RUN THE APPLICATION
    init();
});
