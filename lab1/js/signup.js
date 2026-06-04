// Firebase auth is loaded globally from config.js
const signupForm = document.getElementById("signupForm");

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
            alert("Please fill in all fields!");
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign Up";
            return;
        }

        // Check password match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign Up";
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters!");
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign Up";
            return;
        }

        // Create user
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // SUCCESS → redirect to login page
                console.log("Account created:", userCredential.user.email);
                setTimeout(() => {
                    window.location.replace("login.html");
                }, 300);
            })
            .catch((error) => {
                alert("Error: " + error.message);
                console.error(error);
                submitBtn.disabled = false;
                submitBtn.textContent = "Sign Up";
            });
    });
} else {
    console.error("signupForm element not found!");
}