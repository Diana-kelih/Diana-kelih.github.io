import { db } from "./firebase-config.js";
import {
    ref,
    push,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const equipmentRef = ref(db, "equipment");


// ==========================
// TOAST MESSAGE SYSTEM
// ==========================
function showMessage(msg, color = "#28a745") {
    const box = document.createElement("div");

    box.innerText = msg;
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.right = "20px";
    box.style.background = color;
    box.style.color = "white";
    box.style.padding = "12px 16px";
    box.style.borderRadius = "8px";
    box.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    box.style.zIndex = "9999";
    box.style.fontSize = "14px";

    document.body.appendChild(box);

    setTimeout(() => {
        box.remove();
    }, 2000);
}


// ==========================
// ADD EQUIPMENT
// ==========================
export function addEquipment(name, serialNumber) {
    push(equipmentRef, {
        name: name,
        serialNumber: serialNumber,
        condition: "Available"
    });

    showMessage("✅ Equipment added successfully!");
}


// ==========================
// RENDER REALTIME DATA
// ==========================
function renderEquipment() {
    const container = document.getElementById("equipmentContainer");

    onValue(equipmentRef, (snapshot) => {
        container.innerHTML = "";

        const data = snapshot.val();

        if (!data) {
            container.innerHTML = "<p>No equipment found</p>";
            return;
        }

        for (let id in data) {
            const item = data[id];

            const card = document.createElement("div");
            card.classList.add("equipment-card");

            card.innerHTML = `
                <h3>${item.name}</h3>
                <p><strong>Serial:</strong> ${item.serialNumber}</p>
                <p>
                    <strong>Status:</strong> 
                    <span style="color:${item.condition === "Available" ? "green" : "red"}">
                        ${item.condition}
                    </span>
                </p>

                <button onclick="toggleStatus('${id}', '${item.condition}')">
                    ${item.condition === "Available" ? "Borrow" : "Return"}
                </button>

                <button onclick="deleteEquipment('${id}')">
                    Delete
                </button>
            `;

            container.appendChild(card);
        }
    });
}


// ==========================
// BORROW / RETURN
// ==========================
window.toggleStatus = function (id, currentStatus) {
    const itemRef = ref(db, `equipment/${id}`);

    update(itemRef, {
        condition: currentStatus === "Available" ? "Borrowed" : "Available"
    });

    showMessage("Status updated!");
};



window.deleteEquipment = function (id) {
    const itemRef = ref(db, `equipment/${id}`);

    remove(itemRef);

    showMessage("Deleted successfully", "#dc3545");
};


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("equipmentForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const serial = document.getElementById("serialNumber").value;

        addEquipment(name, serial);

        form.reset();
    });

    renderEquipment();
});