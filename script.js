// 0. SERVICE WORKER & NOTIFICATIONS
// FORCING A PERMISSION CHECK
document.body.addEventListener('click', () => {
    Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
            new Notification("Sub Killer", {
                body: "System Active! This is a manual trigger test.",
            });
        } else {
            alert("Permission was: " + perm);
        }
    });
}, { once: true }); // This runs only the first time you click the page
// 1. SELECTORS
const adderForm = document.getElementById('adder-form');
const displayArea = document.getElementById('display-area');
const totalLeakDisplay = document.getElementById('total-leak');

// 2. ACTION DATABASE (Redirects)
const cancelLinks = {
    "netflix": "https://www.netflix.com/cancelplan",
    "spotify": "http://googleusercontent.com/spotify.com/3",
    "youtube": "https://www.youtube.com/paid_memberships",
    "amazon": "https://www.amazon.in/mc/pipelines/subscriptions"
};

// 3. LOAD DATA FROM MEMORY
let subs = JSON.parse(localStorage.getItem('subKillerData')) || [];

// INITIAL RENDER
renderAll();

// 4. ADD NEW SUBSCRIPTION
adderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newSub = {
        id: Date.now(),
        name: document.getElementById('sub-name').value,
        price: parseFloat(document.getElementById('sub-price').value),
        date: document.getElementById('sub-date').value
    };

    subs.push(newSub);
    saveAndSync();
    adderForm.reset();
});

// 5. RENDER CARDS
function renderAll() {
    displayArea.innerHTML = '';
    let total = 0;

    subs.forEach(item => {
        total += item.price;
        
        // 1. SET YOUR GPAY ID HERE
        const myUPI = "akaswinkarthick@okaxis"; 

        const card = document.createElement('div');
        card.className = 'sub-card';
        
        // We add a unique ID to the people input so we can read it later
        const peopleInputId = `people-${item.id}`;

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <strong>${item.name}</strong>
                    <div style="font-size: 0.8rem; opacity: 0.7;">Total: ₹${item.price}</div>
                </div>
                <div style="text-align: right;">
                    <div style="color: var(--primary); font-weight: bold;">₹${item.price}</div>
                    <div style="font-size: 0.7rem; margin-top: 5px;">
                        Split with <input type="number" id="${peopleInputId}" value="2" min="1" style="width: 35px; padding: 2px; background: #334155; border: none; color: white; border-radius: 4px; text-align: center;"> people
                    </div>
                </div>
            </div>
            
            <div class="card-actions">
                <button onclick="shareToWhatsapp('${item.name}', ${item.price}, '${peopleInputId}', '${myUPI}')" class="action-btn" style="background: #25D366; border: none; cursor: pointer;">
                   Split & Share
                </button>
                <a href="upi://pay?pa=${myUPI}&pn=${item.name}&am=${item.price}&cu=INR" class="action-btn" style="background: var(--success)">
                   Pay Full
                </a>
                <button onclick="deleteItem(${item.id})" class="action-btn" style="background: var(--danger); border:none;">
                   Kill
                </button>
            </div>
        `;
        displayArea.appendChild(card);
    });

    totalLeakDisplay.innerText = `₹${total.toFixed(2)}`;
}

// 2. THE DYNAMIC SHARE FUNCTION
function shareToWhatsapp(name, price, inputId, upi) {
    const people = document.getElementById(inputId).value || 1;
    const splitAmount = (price / people).toFixed(2);
    
    // Construct the Deep Link
    const payLink = `upi://pay?pa=${upi}&pn=SubSplit&am=${splitAmount}&cu=INR`;
    
    const text = `Hey! Our ${name} subscription is due. Your 1/${people} share is ₹${splitAmount}. \n\nYou can pay me directly on GPay here: ${payLink}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}
// 6. MEMORY FUNCTIONS
function saveAndSync() {
    localStorage.setItem('subKillerData', JSON.stringify(subs));
    renderAll();
}

function deleteItem(id) {
    if(confirm("Are you sure you want to kill this subscription?")) {
        subs = subs.filter(s => s.id !== id);
        saveAndSync();
    }
}
function checkDeadlines() {
    const today = new Date();
    
    subs.forEach(sub => {
        const subDate = new Date(sub.date);
        const diffTime = subDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If a subscription is due tomorrow (1 day left)
        if (diffDays === 1) {
            if (Notification.permission === 'granted') {
                new Notification("Sub Killer Alert!", {
                    body: `${sub.name} is due tomorrow! Pay or Kill it now.`,
                    icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968302.png' // Generic money icon
                });
            }
        }
    });
}

// Run the check every time the page loads
checkDeadlines();
// FOR TESTING ONLY: This will fire a notification immediately when you save/refresh
setTimeout(() => {
    if (Notification.permission === 'granted') {
        new Notification("Test Alert", { body: "If you see this, the system is working!" });
    } else {
        console.log("Permission is currently:", Notification.permission);
    }
}, 2000);