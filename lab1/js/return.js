// Get elements
const returnForm = document.getElementById("returnForm");
const returnMessage = document.getElementById("returnMessage");
const returnTableBody = document.getElementById("returnTableBody");

function showMessage(text, type) {
    returnMessage.textContent = text;
    returnMessage.className = `message ${type}`;
    if (type === "success") {
        setTimeout(() => {
            returnForm.reset();
            returnMessage.textContent = "";
        }, 2000);
    }
}

// Handle return form submission
returnForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const db = firebase.database();

    const returnData = {
        admissionNo: document.getElementById("admissionNo").value.trim(),
        serialNo: document.getElementById("serialNo").value.trim(),
        returnDate: document.getElementById("returnDate").value,
        condition: document.getElementById("condition").value || "Not specified",
        notes: document.getElementById("notes").value.trim(),
        timestamp: Date.now()
    };

    try {
        // 1. Find the borrowed equipment by admission number and serial number
        const borrowedRef = db.ref("borrowedEquipment");
        let borrowRecordFound = false;
        let borrowRecordKey = null;
        let borrowedEquipmentData = null;

        await borrowedRef.once("value", (snapshot) => {
            snapshot.forEach((child) => {
                const item = child.val();
                console.log("Checking borrow record:", item);
                if (
                    item.admissionNo === returnData.admissionNo &&
                    item.serialNo === returnData.serialNo &&
                    (item.status === "borrowed" || item.status === "Borrowed")
                ) {
                    borrowRecordFound = true;
                    borrowRecordKey = child.key;
                    borrowedEquipmentData = item;
                }
            });
        });

        if (!borrowRecordFound) {
            showMessage("❌ No active borrow record found for this admission and serial number!", "error");
            return;
        }

        // 2. Update borrow record status to returned
        await db.ref("borrowedEquipment/" + borrowRecordKey).update({
            status: "returned",
            returnDate: returnData.returnDate,
            condition: returnData.condition,
            notes: returnData.notes,
            returnTimestamp: returnData.timestamp
        });

        // 3. Update equipment status back to Available
        const equipmentRef = db.ref("equipment");
        await new Promise((resolve) => {
            equipmentRef.once("value", (snapshot) => {
                let updatePromises = [];
                snapshot.forEach((child) => {
                    const item = child.val();
                    if (item.serialNumber === returnData.serialNo) {
                        updatePromises.push(
                            db.ref("equipment/" + child.key).update({
                                status: "Available"
                            })
                        );
                    }
                });
                Promise.all(updatePromises).then(resolve);
            });
        });

        // 4. Save return record
        await db.ref("returnedEquipment").push({
            ...returnData,
            equipmentName: borrowedEquipmentData.equipmentName,
            studentName: borrowedEquipmentData.studentName
        });

        showMessage("✅ Equipment returned successfully!", "success");

    } catch (error) {
        console.error("Return Error:", error);
        showMessage("❌ Failed to return equipment. Try again.", "error");
    }
});

// Load and display return history
function loadReturnHistory() {
    const db = firebase.database();
    const returnRef = db.ref("returnedEquipment");

    returnRef.on("value", (snapshot) => {
        returnTableBody.innerHTML = "";

        const data = snapshot.val();

        if (!data) {
            returnTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; padding: 20px;">No returns recorded yet</td>
                </tr>
            `;
            return;
        }

        Object.entries(data)
            .sort((a, b) => b[1].timestamp - a[1].timestamp)
            .forEach(([id, item]) => {
                const returnDate = new Date(item.returnDate).toLocaleDateString();
                const row = `
                    <tr>
                        <td>${item.admissionNo}</td>
                        <td>${item.equipmentName || "N/A"}</td>
                        <td>${item.serialNo}</td>
                        <td>${returnDate}</td>
                        <td>${item.condition}</td>
                    </tr>
                `;
                returnTableBody.innerHTML += row;
            });
    });
}

// Load returns on page load
loadReturnHistory();
