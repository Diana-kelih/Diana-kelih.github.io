firebase.auth().onAuthStateChanged((user) => {
    if (!user) { window.location.replace("signin.html"); return; }
    
    firebase.database().ref("Users/" + user.uid).once("value").then((snapshot) => {
        const role = snapshot.val() && snapshot.val().role ? snapshot.val().role.toLowerCase() : "student";
        if (role !== "cod") {
            alert("Access Denied! Only the COD can manage roles.");
            window.location.replace("Dashboard.html");
        }
    });
});
const usersRef = firebase.database().ref("Users");
const usersTable = document.getElementById("usersTable");

// 2. LOAD & RENDER USERS
function loadUsers() {
    usersRef.on('value', (snapshot) => {
        usersTable.innerHTML = "";

        const data = snapshot.val();

        if (!data) {
            usersTable.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; color: red; font-weight: bold; padding: 15px;">
                        No users found. Please verify the 'Users' node exists in Firebase.
                    </td>
                </tr>
            `;
            return;
        }

        Object.entries(data).forEach(([uid, userVal]) => {
            const email = userVal.email || "No Email Provided";
            const role = userVal.role ? userVal.role.toLowerCase() : "student";
            const displayRole = role.toUpperCase(); 

            const row = `
                <tr>
                    <td>${email}</td>
                    <td><strong>${displayRole}</strong></td>
                    <td>
                        <button class="btn-action" onclick="setRole('${uid}', 'student')">Student</button>
                        <button class="btn-action" onclick="setRole('${uid}', 'technician')">Technician</button>
                        <button class="btn-action" onclick="setRole('${uid}', 'cod')">COD</button>
                    </td>
                </tr>
            `;

            usersTable.innerHTML += row;
        });
    });
}

// 3. CHANGE ROLE FUNCTION 
window.setRole = async function (uid, newRole) {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;

    try {
        await usersRef.child(uid).update({
            role: newRole.toLowerCase()
        });
        alert("User role updated successfully");
    } catch (error) {
        console.error(error);
        alert("Failed to update user role: " + error.message);
    }
};

// 4. RUN INITIALIZATION
loadUsers();