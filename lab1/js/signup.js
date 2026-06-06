// Firebase auth is loaded globally from config.js
const signupForm = document.getElementById("signupForm");
const messageDiv = document.getElementById("message");

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    if (type === "error" || type === "warning") {
        messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const submitBtn = e.target.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.textContent = "Creating account...";

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validate inputs
        if (!email || !password || !confirmPassword) {
            showMessage("Please fill in all fields!", "warning");
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign Up";
            return;
        }

        // Check password match
        if (password !== confirmPassword) {
            showMessage("Passwords do not match!", "error");
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign Up";
            return;
        }

        if (password.length < 6) {
            showMessage("Password must be at least 6 characters!", "warning");
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign Up";
            return;
        }

        // Create user
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // SUCCESS → redirect to login page
                console.log("Account created:", userCredential.user.email);
                showMessage("Account created successfully! Redirecting to sign in...", "success");
                setTimeout(() => {
                    window.location.replace("signin.html");
                }, 1500);
            })
            .catch((error) => {
                showMessage("Error: " + error.message, "error");
                console.error(error);
                submitBtn.disabled = false;
                submitBtn.textContent = "Sign Up";
            });
    });
} else {
    console.error("signupForm element not found!");
}