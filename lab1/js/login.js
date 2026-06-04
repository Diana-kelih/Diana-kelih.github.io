// Firebase auth is loaded globally from config.js

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        console.log("Login clicked");

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("Login success:", userCredential.user);
                alert("Login successful!");
                window.location.href = "home.html";
            })
            .catch((error) => {
                console.error("Login error:", error.message);
                alert("Error: " + error.message);
            });
    });
} else {
    console.error("loginForm element not found!");
}

// Password Reset
window.resetPassword = function () {
    const email = prompt("Enter your email address:");
    if (email) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                alert("Password reset email sent!");
            })
            .catch((error) => {
                console.error("Reset error:", error.message);
                alert("Error: " + error.message);
            });
    }
};