/* ==========================================================================
   GLOBAL VARIABLES & AUTHENTICATION STATE
   ========================================================================== */
let isDoctorAuthenticated = false;

// Doctor Database Objects for Profile Modals
const doctorData = {
    sharma: {
        name: "Dr. Sharma",
        gender: "Male",
        dept: "General Allopathic Medicine / Cardiology",
        qual: "MBBS, MD (General Medicine)",
        exp: "14 Years Clinical Experience",
        schedule: "Mon - Fri (9:00 AM - 2:00 PM)",
        img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
    },
    priyanka: {
        name: "Dr. Priyanka",
        gender: "Female",
        dept: "AYUSH & Integrative Medicine Specialist",
        qual: "BAMS, MD (Ayurveda - Kayachikitsa)",
        exp: "9 Years Experience",
        schedule: "Mon - Sat (10:00 AM - 4:00 PM)",
        img: "https://cdn-icons-png.flaticon.com/512/3774/3774320.png"
    }
};

/* ==========================================================================
   STEP NAVIGATION LOGIC (KIOSK VIEW)
   ========================================================================== */
function goToStep(stepNumber) {
    // Hide all step cards
    document.querySelectorAll('.card-step').forEach(card => card.classList.remove('active-card'));
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));

    // Show selected step card
    const targetCard = document.getElementById(`step${stepNumber}Card`);
    const targetIndicator = document.getElementById(`step${stepNumber}-indicator`);

    if (targetCard && targetIndicator) {
        targetCard.classList.add('active-card');
        targetIndicator.classList.add('active');
    }
}

/* ==========================================================================
   DPDP ACT 2023 CONSENT CHECKBOX HANDLER
   ========================================================================== */
function toggleConsent() {
    const consentCheckBox = document.getElementById('dpdpConsent');
    const nextBtn = document.getElementById('step1NextBtn');
    
    // Enable/Disable "Next" button based on Checkbox tick
    if (consentCheckBox && nextBtn) {
        nextBtn.disabled = !consentCheckBox.checked;
    }
}

/* ==========================================================================
   TAB SWITCHER FOR ALLOPATHIC & AYUSH INTAKE
   ========================================================================== */
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
}

/* ==========================================================================
   BHASHINI SPEECH-TO-TEXT VOICE INTAKE
   ========================================================================== */
let recognition;
function toggleSpeech() {
    const micBtn = document.getElementById('micBtn');
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    const langSelect = document.getElementById('langSelect').value;
    recognition.lang = langSelect === 'hi' ? 'hi-IN' : (langSelect === 'bh' ? 'hi-IN' : 'en-US');

    recognition.onstart = function() {
        micBtn.style.background = "#2ed573";
        micBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Listening... Speak now`;
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('socratesInput').value += " " + transcript;
        micBtn.style.background = "#ff4757";
        micBtn.innerHTML = `<i class="fa-solid fa-microphone"></i> Speak Answer (Bhashini Speech-to-Text)`;
    };

    recognition.onerror = function() {
        micBtn.style.background = "#ff4757";
        micBtn.innerHTML = `<i class="fa-solid fa-microphone"></i> Retry Voice Input`;
    };

    recognition.start();
}

/* ==========================================================================
   CAMERA QR CODE SCANNER LOGIC
   ========================================================================== */
let html5QrcodeScanner;

function openQRScanner() {
    document.getElementById('qrModal').style.display = 'block';

    html5QrcodeScanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 220, height: 220 } 
    });

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

function onScanSuccess(decodedText) {
    document.getElementById('abhaId').value = decodedText;
    closeQRScanner();
    alert("ABHA QR Code Scanned Successfully!");
}

function onScanFailure(error) {
    // Silent fail during scanning frame checks
}

function closeQRScanner() {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear();
    }
    document.getElementById('qrModal').style.display = 'none';
}

/* ==========================================================================
   DOCTOR AUTHENTICATION & RESTRICTED ACCESS
   ========================================================================== */
function requestDoctorAccess() {
    if (isDoctorAuthenticated) {
        switchViewToDoctor();
    } else {
        document.getElementById('authModal').style.display = 'block';
    }
}

function verifyDoctorPin() {
    const pinInput = document.getElementById('doctorPin').value;
    if (pinInput === '1234') { // Security PIN
        isDoctorAuthenticated = true;
        closeAuthModal();
        switchViewToDoctor();
        document.getElementById('doctorPin').value = '';
    } else {
        alert("Invalid Doctor Security PIN! Access Denied.");
    }
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function switchViewToDoctor() {
    document.getElementById('patientKiosk').classList.remove('active');
    document.getElementById('doctorDashboard').classList.add('active');
    document.getElementById('viewToggleBtn').innerHTML = `<i class="fa-solid fa-desktop"></i> Switch to Kiosk View`;
}

function logoutDoctor() {
    isDoctorAuthenticated = false;
    document.getElementById('doctorDashboard').classList.remove('active');
    document.getElementById('patientKiosk').classList.add('active');
    document.getElementById('viewToggleBtn').innerHTML = `<i class="fa-solid fa-user-lock"></i> Switch to Doctor Dashboard`;
    alert("Doctor session locked successfully.");
}

/* ==========================================================================
   DOCTOR PROFILE POPUP MODAL LOGIC
   ========================================================================== */
function openDoctorProfile(docKey) {
    const doc = doctorData[docKey];
    if (doc) {
        document.getElementById('docProfileName').innerHTML = `<i class="fa-solid fa-user-doctor"></i> ${doc.name}`;
        document.getElementById('docProfileImg').src = doc.img;
        document.getElementById('docDept').innerText = doc.dept;
        document.getElementById('docQual').innerText = doc.qual;
        document.getElementById('docExp').innerText = doc.exp;
        document.getElementById('docSchedule').innerText = doc.schedule;

        document.getElementById('docProfileModal').style.display = 'block';
    }
}

function closeDocProfileModal() {
    document.getElementById('docProfileModal').style.display = 'none';
}

/* ==========================================================================
   FILE UPLOAD & OCR SCANNING SIMULATION
   ========================================================================== */
function triggerFileUpload() {
    document.getElementById('fileInput').click();
}

function handleOCRScan(event) {
    const file = event.target.files[0];
    if (file) {
        const ocrStatus = document.getElementById('ocrStatus');
        ocrStatus.style.display = 'block';
        ocrStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing & scanning record with OCR...`;

        setTimeout(() => {
            ocrStatus.innerHTML = `<i class="fa-solid fa-circle-check" style="color:green;"></i> <strong>OCR Scan Complete:</strong> Record attached successfully.`;
            
            // Append newly uploaded file into previous reports UI list
            const reportList = document.getElementById('uploadedReportsList');
            const newItem = document.createElement('li');
            newItem.innerHTML = `<span><i class="fa-solid fa-file-medical"></i> ${file.name}</span> <span class="report-date">Just Now</span>`;
            reportList.appendChild(newItem);
        }, 1500);
    }
}

function submitKioskData() {
    alert("Case Taking Complete! Form submitted securely under DPDP Act 2023 guidelines.");
    requestDoctorAccess();
}

function pushToABDM() {
    alert("Clinical Summary converted to FHIR JSON format and pushed to ABDM & Hospital Information System (HIS)!");
}
