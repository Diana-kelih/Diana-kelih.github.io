const usersTable = document.getElementById("usersTable");

// CHECK IF USER IS COD
firebase.auth().onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "signin.html";
        return;
    }

    firebase.database().ref("users/" + user.uid).once("value")
    .then((snap) => {

        const currentUser = snap.val();

        if (!currentUser || currentUser.role !== "cod") {
            alert("Access denied");
            window.location.href = "dashboard.html";
            return;
        }

        // LOAD USERS
        firebase.database().ref("users").on("value", (snapshot) => {

            usersTable.innerHTML = "";

            snapshot.forEach((child) => {

                const user = child.val();
                const uid = child.key;

                const row = `
                    <tr>
                        <td>${user.email || ""}</td>
                        <td>${user.role || "student"}</td>
                        <td>
                            <button onclick="setRole('${uid}', 'student')">
                                Student
                            </button>

                            <button onclick="setRole('${uid}', 'technician')">
                                Technician
                            </button>

                            <button onclick="setRole('${uid}', 'cod')">
                                COD
                            </button>
                        </td>
                    </tr>
                `;

                usersTable.innerHTML += row;
            });

        });

    });

});


// CHANGE ROLE
function setRole(uid, role) {

    firebase.database().ref("users/" + uid).update({
        role: role
    })
    .then(() => {
        alert("Role updated to " + role);
    })
    .catch((error) => {
        console.log(error);
        alert("Failed to update role");
    });

}

// MAKE FUNCTION AVAILABLE TO BUTTONS
window.setRole = setRole;