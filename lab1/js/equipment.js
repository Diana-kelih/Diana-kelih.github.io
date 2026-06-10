const equipmentRef = firebase.database().ref("equipment");
const tableBody = document.getElementById("equipmentTableBody");

// Global variable to keep track of the current user's role
let currentUserRole = "student"; 

// 1. GATEKEEPER & ROLE SELECTOR
firebase.auth().onAuthStateChanged((user) => {
    if (!user) { 
        window.location.replace("signin.html"); 
        return; 
    }
    
    firebase.database().ref("Users/" + user.uid).once("value").then((snapshot) => {
        const userData = snapshot.val();
        currentUserRole = userData && userData.role ? userData.role.toLowerCase() : "student";
        
        console.log("Current role verified:", currentUserRole);

        // Hide or show the add button container from students
        const addBtn = document.getElementById("addEquipmentBtn");
        if (currentUserRole === "student") {
            if (addBtn) addBtn.style.display = "none";
        } else {
            if (addBtn) addBtn.style.display = "block";
        }

        // Run or refresh the table view now that we know the user's role
        loadEquipment();
    });
});

// 2. DATA LOAD WITH INTEGRATED SECURITY CHECKS
function loadEquipment() {
    equipmentRef.on('value', (snapshot) => {
        tableBody.innerHTML = "";
        const data = snapshot.val();

        if (!data) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4">No equipment found</td>
                </tr>
            `;
            return;
        }

        Object.entries(data).forEach(([id, item]) => {
            const status = item.status ? item.status.toLowerCase() : "available";
            const statusClass = status === "borrowed" ? "status-borrowed" : "status-available";
            const statusText = status === "borrowed" ? "Borrowed" : "Available";

            // CRITICAL FIX: Only generate the delete button HTML string if user is not a student
            let actionCellContent = `<span class="badge-view">View Only</span>`;
            if (currentUserRole === "cod" || currentUserRole === "technician") {
                actionCellContent = `
                    <button class="btn-action" onclick="deleteEquipment('${id}')" title="Delete equipment">
                        Delete
                    </button>
                `;
            }

            const row = `
                <tr>
                    <td>${item.name || "Unnamed"}</td>
                    <td>${item.serialNumber || "N/A"}</td>
                    <td>
                        <span class="status ${statusClass}">
                            ${statusText}
                        </span>
                    </td>
                    <td>
                        ${actionCellContent}
                    </td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });
    });
}

// 3. ADD EQUIPMENT SECURE TRIGGER
document.getElementById("addEquipmentBtn").addEventListener("click", async () => {
    // Block action right away if a student somehow triggers the click
    if (currentUserRole === "student") {
        alert("Action Denied: Students cannot add assets.");
        return;
    }

    const name = prompt("Enter equipment name:");
    const serial = prompt("Enter serial number:");

    if (!name || !serial) {
        alert("Please fill all fields");
        return;
    }

    try {
        await equipmentRef.push({
            name: name,
            serialNumber: serial,
            status: "Available"
        });
        alert("Equipment added successfully");
    } catch (error) {
        console.error(error);
        alert("Failed to add equipment");
    }
});

// 4. SECURE DELETE CONTROLLER
window.deleteEquipment = function(equipmentId) {
    const user = firebase.auth().currentUser;

    if (!user) {
        alert("You must be logged in to perform this action.");
        return;
    }

    firebase.database().ref("Users/" + user.uid).once("value").then((snapshot) => {
        const userData = snapshot.val();
        const role = userData && userData.role ? userData.role.toLowerCase() : "student";

        if (role === "student") {
            alert("Security Violation: Students are not authorized to delete equipment!");
            return; 
        }

        if (confirm("Are you sure you want to delete this equipment?")) {
            // FIXED PATH: Changed from capital 'Equipment' to lowercase 'equipment' to match your global reference
            firebase.database().ref("equipment/" + equipmentId).remove()
                .then(() => {
                    alert("Equipment deleted successfully.");
                })
                .catch((error) => {
                    console.error("Delete failed: ", error);
                });
        }
    });
};