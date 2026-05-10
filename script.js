let currentSid = "";   // সেশন টোকেন স্টোর করবে
let currentEmail = ""; // ইমেল অ্যাড্রেস স্টোর করবে

// 🔹 নতুন ইমেল জেনারেট করা (Guerrilla Mail API)
async function generateNewEmail() {
    try {
        const response = await fetch('https://api.guerrillamail.com/ajax.php?f=get_email_address&lang=en');
        const data = await response.json();
        
        currentSid = data.sid_token;
        currentEmail = data.email_addr;
        
        document.getElementById('email').value = currentEmail;
        
        // লোকাল স্টোরেজে সেভ করে রাখো
        localStorage.setItem('gm_sid', currentSid);
        localStorage.setItem('gm_email', currentEmail);
        
        // ইনবক্স চেক করা
        await checkInbox();
    } catch (error) {
        console.error("API error:", error);
        document.getElementById('email').value = "API error! Refresh page.";
    }
}

// 🔹 ইনবক্স থেকে মেসেজ আনা
async function checkInbox() {
    if (!currentSid) {
        // আগের সেশন থাকলে লোড করো
        currentSid = localStorage.getItem('gm_sid');
        currentEmail = localStorage.getItem('gm_email');
        if (!currentSid) {
            await generateNewEmail();
            return;
        }
        document.getElementById('email').value = currentEmail;
    }

    try {
        const response = await fetch(`https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${currentSid}`);
        const data = await response.json();
        
        const messageList = document.getElementById('messageList');
        messageList.innerHTML = "";
        
        if (data.list && data.list.length > 0) {
            data.list.forEach(msg => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>📨 From:</strong> ${msg.mail_from} <br>
                                <strong>📝 Subject:</strong> ${msg.mail_subject} <br>
                                <strong>🕒 Time:</strong> ${new Date(msg.mail_timestamp * 1000).toLocaleString()}<br>
                                <button class="viewBtn" data-id="${msg.mail_id}">দেখুন</button>`;
                messageList.appendChild(li);
            });
            
            // প্রতিটি "দেখুন" বাটনে ক্লিক ইভেন্ট লাগানো
            document.querySelectorAll('.viewBtn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const emailId = e.target.getAttribute('data-id');
                    await viewEmail(emailId);
                });
            });
        } else {
            messageList.innerHTML = "<li>📭 কোনো মেইল নেই।</li>";
        }
    } catch (error) {
        console.error("Inbox error:", error);
    }
}

// 🔹 নির্দিষ্ট ইমেল দেখা
async function viewEmail(emailId) {
    try {
        const response = await fetch(`https://api.guerrillamail.com/ajax.php?f=fetch_email&email_id=${emailId}&sid_token=${currentSid}`);
        const data = await response.json();
        
        alert(`📧 সাবজেক্ট: ${data.mail_subject}\n\n📄 মেইল বডি:\n${data.mail_body.substring(0, 500)}`);
    } catch (error) {
        console.error("Fetch email error:", error);
        alert("মেইল দেখানো যাচ্ছে না");
    }
}

// 🔹 ইমেইল কপি করা
function copyEmail() {
    const emailField = document.getElementById('email');
    emailField.select();
    document.execCommand("copy");
    alert("✅ ইমেইল কপি হয়েছে!");
}

// 🔹 পেজ লোড হওয়ার সময় রান হবে
window.onload = () => {
    // এগিয়ে থাকা সেশন চেক করো
    const oldSid = localStorage.getItem('gm_sid');
    if (oldSid) {
        currentSid = oldSid;
        currentEmail = localStorage.getItem('gm_email');
        document.getElementById('email').value = currentEmail;
        checkInbox();
    } else {
        generateNewEmail();
    }
    
    // বাটনগুলোর কাজ বসানো
    document.getElementById('copyBtn').onclick = copyEmail;
    document.getElementById('refreshBtn').onclick = () => checkInbox();
    document.getElementById('newBtn').onclick = () => generateNewEmail();
};