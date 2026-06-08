const signinForm = document.getElementById("signinForm");
const messageDiv = document.getElementById("message");

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    if (type === "error" || type === "warning") {
        messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("signinEmail").value;
        const password = document.getElementById("signinPassword").value;

        if (!email || !password) {
            showMessage("Please fill in all fields!", "warning");
            return;
        }

        const submitBtn = signinForm.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.textContent = "Signing in...";

        console.log("signin clicked");

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("signin success:", userCredential.user);
                showMessage("Sign in successful! Redirecting...", "success");
                window.location.replace("Dashboard.html");
            })
            .catch((error) => {
                console.error("signin error:", error.message);
                showMessage("Error: " + error.message, "error");
                submitBtn.disabled = false;
                submitBtn.textContent = "Sign In";
            });
    });
} else {
    console.error("signinForm element not found!");
}

// Password Reset
window.resetPassword = function () {
    const email = prompt("Enter your email address:");
    if (email) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                showMessage("Password reset email sent! Check your inbox.", "success");
            })
            .catch((error) => {
                console.error("Reset error:", error.message);
                showMessage("Error: " + error.message, "error");
            });
    }
};