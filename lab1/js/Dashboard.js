// This runs automatically as soon as Dashboard.html loads
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        // If not logged in at all, boot them back to login page
        window.location.replace("signin.html");
        return;
    }

    // Look up the role in the database safely
    firebase.database().ref("Users/" + user.uid).once("value")
        .then((snapshot) => {
            const userData = snapshot.val();
            const role = userData && userData.role ? userData.role.toLowerCase() : "student";

            console.log("Current user role:", role);

            const adminLink = document.getElementById("adminLink");

            if (role === "cod") {
                // If they are an Admin/COD, automatically forward them to the admin panel
                window.location.replace("admin.html");
            } 
            else if (role === "technician") {
                // Technicians stay here, hide admin panel link
                if (adminLink) adminLink.style.display = "none";
            } 
            else {
                // Students stay here, hide admin panel link
                if (adminLink) adminLink.style.display = "none";
            }
        })
        .catch((error) => {
            console.error("Error checking role on dashboard:", error);
            // Fallback: If database fails, default to hiding the admin link for safety
            const adminLink = document.getElementById("adminLink");
            if (adminLink) adminLink.style.display = "none";
        });
});