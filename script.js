const apiURL = "https://www.1secmail.com/api/v1/";
let userEmail = "";

// পেজ লোড হলে অটো মেইল তৈরি হবে
window.onload = generateNewEmail;

async function generateNewEmail() {
    const res = await fetch(`${apiURL}?action=genEmail&count=1`);
    const data = await res.json();
    userEmail = data[0];
    document.getElementById("mail-address").value = userEmail;
    checkInbox(); // ইনবক্স রিফ্রেশ
}

function copyEmail() {
    const copyText = document.getElementById("mail-address");
    copyText.select();
    document.execCommand("copy");
    alert("Email Copied!");
}

async function checkInbox() {
    if(!userEmail) return;
    const [user, domain] = userEmail.split("@");
    const res = await fetch(`${apiURL}?action=getMessages&login=${user}&domain=${domain}`);
    const emails = await res.json();
    
    const inboxList = document.getElementById("inbox-list");
    if(emails.length === 0) {
        inboxList.innerHTML = '<div class="empty-state">No messages yet...</div>';
    } else {
        inboxList.innerHTML = emails.map(msg => `
            <div style="background:#0f172a; padding:10px; border-radius:10px; margin-bottom:10px; border-left:4px solid #6366f1">
                <strong>From:</strong> ${msg.from}<br>
                <strong>Subject:</strong> ${msg.subject}
            </div>
        `).join("");
    }
}

function deleteMail() {
    userEmail = "";
    document.getElementById("mail-address").value = "Deleting...";
    setTimeout(generateNewEmail, 500);
}