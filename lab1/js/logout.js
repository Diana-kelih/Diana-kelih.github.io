// Logout function
function logout() {
    const auth = firebase.auth();

    auth.signOut()
        .then(() => {
            console.log("User logged out successfully");
            
            // Clear any local storage data if you're using it
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirect to signin page after 2 seconds
            setTimeout(() => {
                window.location.replace("signin.html");
            }, 2000);
        })
        .catch((error) => {
            console.error("Logout error:", error);
            alert("Error logging out: " + error.message);
            
            // Force redirect even if there's an error
            setTimeout(() => {
                window.location.replace("signin.html");
            }, 2000);
        });
}

// Execute logout when page loads
window.addEventListener("load", () => {
    logout();
});
