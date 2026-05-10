const apiURL = "https://www.1secmail.com/api/v1/";
let currentEmail = "";

// ১. পেজ লোড হলেই নতুন মেইল তৈরি হবে
window.onload = () => {
    generateNewEmail();
};

// ২. নতুন ইমেইল জেনারেট করার ফাংশন
async function generateNewEmail() {
    const response = await fetch(`${apiURL}?action=genEmail&count=1`);
    const data = await response.json();
    currentEmail = data[0];
    document.getElementById("mail-address").value = currentEmail;
    
    // ইনবক্স পরিষ্কার করা এবং নতুন মেইল চেক করা
    document.querySelector(".inbox-table tbody").innerHTML = '<tr><td colspan="3" style="text-align:center;">Checking for new messages...</td></tr>';
    startCheckingInbox();
}

// ৩. কপি ফাংশন
function copyEmail() {
    const emailField = document.getElementById("mail-address");
    emailField.select();
    document.execCommand("copy");
    alert("Email copied: " + currentEmail);
}

// ৪. ইনবক্স চেক করার ফাংশন
async function startCheckingInbox() {
    const [user, domain] = currentEmail.split('@');
    const response = await fetch(`${apiURL}?action=getMessages&login=${user}&domain=${domain}`);
    const emails = await response.json();
    
    const tbody = document.querySelector(".inbox-table tbody");
    tbody.innerHTML = ""; // আগের মেইলগুলো মুছে ফেলা

    if (emails.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Waiting for emails...</td></tr>';
    } else {
        emails.forEach(email => {
            const row = `<tr>
                <td>${email.from}</td>
                <td>${email.subject}</td>
                <td>Just now</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }
}

// ৫. বাটনগুলোর সাথে ফাংশন কানেক্ট করা
document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', function() {
        const text = this.innerText.trim();
        if (text === "Copy") copyEmail();
        if (text === "Refresh") startCheckingInbox();
        if (text === "New") generateNewEmail();
        if (text === "Delete") {
            document.getElementById("mail-address").value = "Deleted...";
            setTimeout(generateNewEmail, 1000);
        }
    });
});
