let currentEmail = "";
const proxy = "https://api.allorigins.win/get?url="; // এটি ব্রাউজার ব্লক আটকাতে সাহায্য করবে

window.onload = createNewMail;

async function createNewMail() {
    document.getElementById("email-addr").value = "Generating...";
    const apiReq = encodeURIComponent("https://www.1secmail.com/api/v1/?action=genEmail&count=1");
    
    try {
        const response = await fetch(`${proxy}${apiReq}`);
        const data = await response.json();
        const result = JSON.parse(data.contents);
        
        currentEmail = result[0];
        document.getElementById("email-addr").value = currentEmail;
        refreshInbox();
    } catch (err) {
        // যদি প্রক্সি কাজ না করে তবে ব্যাকআপ পদ্ধতি
        const user = Math.random().toString(36).substring(2, 12);
        currentEmail = `${user}@1secmail.com`;
        document.getElementById("email-addr").value = currentEmail;
        refreshInbox();
    }
}

function copyMail() {
    const el = document.getElementById("email-addr");
    navigator.clipboard.writeText(el.value);
    alert("Email Copied!");
}

async function refreshInbox() {
    if (!currentEmail) return;
    const [user, domain] = currentEmail.split("@");
    const inboxUrl = encodeURIComponent(`https://www.1secmail.com/api/v1/?action=getMessages&login=${user}&domain=${domain}`);
    
    const inboxDiv = document.getElementById("messages");
    inboxDiv.innerHTML = '<div class="loader">Checking for mail...</div>';

    try {
        const response = await fetch(`${proxy}${inboxUrl}`);
        const data = await response.json();
        const emails = JSON.parse(data.contents);

        if (emails.length === 0) {
            inboxDiv.innerHTML = '<div class="loader">Inbox is empty</div>';
        } else {
            inboxDiv.innerHTML = emails.map(m => `
                <div class="msg-item">
                    <div class="msg-from">From: ${m.from}</div>
                    <div class="msg-sub">${m.subject}</div>
                </div>
            `).join("");
        }
    } catch (err) {
        inboxDiv.innerHTML = '<div class="loader">Error loading inbox</div>';
    }
}
