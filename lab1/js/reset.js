const form = document.getElementById("resetForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("resetEmail").value;

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("Password reset link sent to your email!");
        })
        .catch((error) => {
            alert(error.message);
        });
});