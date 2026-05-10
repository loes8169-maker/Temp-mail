let currentEmail = "";

// পেজ লোড হলেই মেইল জেনারেট হবে
window.onload = createNew;

function createNew() {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let string = '';
    for(let i=0; i<10; i++) {
        string += chars[Math.floor(Math.random() * chars.length)];
    }
    // ১০টি ডোমেইনের যেকোনো একটি সিলেক্ট করবে
    const domains = ["1secmail.com", "1secmail.org", "1secmail.net"];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    
    currentEmail = string + "@" + randomDomain;
    document.getElementById("email-field").value = currentEmail;
    document.getElementById("inbox-list").innerHTML = '<p class="empty-msg">Waiting for messages...</p>';
}

function copyMail() {
    const field = document.getElementById("email-field");
    field.select();
    document.execCommand("copy");
    alert("Copied to clipboard!");
}

async function refreshInbox() {
    if (!currentEmail) return;
    const [user, domain] = currentEmail.split("@");
    try {
        const res = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${user}&domain=${domain}`);
        const data = await res.json();
        
        const list = document.getElementById("inbox-list");
        if (data.length === 0) {
            list.innerHTML = '<p class="empty-msg">Inbox is empty...</p>';
        } else {
            list.innerHTML = data.map(m => `
                <div style="border-bottom:1px solid #333; padding:10px 0;">
                    <div style="color:#4ecca3; font-size:12px;">From: ${m.from}</div>
                    <div style="font-size:14px;">${m.subject}</div>
                </div>
            `).join("");
        }
    } catch (error) {
        console.error("Error fetching mail:", error);
    }
}
