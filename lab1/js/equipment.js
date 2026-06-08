const equipmentRef = firebase.database().ref("equipment");

const tableBody = document.getElementById("equipmentTableBody");
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

            const row = `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.serialNumber}</td>
                    <td>
                        <span class="status ${statusClass}">
                            ${statusText}
                        </span>
                    </td>
                    <td>
                        <button class="btn-action" onclick="deleteEquipment('${id}')" title="Delete equipment">
                            Delete
                        </button>
                    </td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });
    });
}

document.getElementById("addEquipmentBtn").addEventListener("click", async () => {

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
window.deleteEquipment = async function (id) {

    if (!confirm("Delete this equipment?")) return;

    try {
        await equipmentRef.child(id).remove();
        alert("Equipment deleted successfully");

    } catch (error) {
        console.error(error);
        alert("Failed to delete equipment");
    }
};

loadEquipment();