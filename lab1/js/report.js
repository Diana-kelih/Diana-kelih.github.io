// Get elements
const reportTableBody = document.getElementById("reportTableBody");
const statusFilter = document.getElementById("statusFilter");
const admissionFilter = document.getElementById("admissionFilter");
const exportBtn = document.getElementById("exportBtn");

let allRecords = [];

// Load all borrowing records
function loadReports() {
    const db = firebase.database();
    const borrowedRef = db.ref("borrowedEquipment");

    borrowedRef.on("value", (snapshot) => {
        allRecords = [];
        const borrowedData = snapshot.val() || {};

        // Convert borrowed records to array
        Object.entries(borrowedData).forEach(([key, item]) => {
            allRecords.push({
                type: "borrow",
                studentName: item.studentName || "N/A",
                admissionNo: item.admissionNo || "N/A",
                equipmentName: item.equipmentName || "N/A",
                serialNo: item.serialNo || "N/A",
                course: item.course || "N/A",
                borrowDate: item.borrowDate || "N/A",
                returnDate: item.returnDate || "-",
                status: item.status || "borrowed",
                condition: item.condition || "-",
                timestamp: item.timestamp || 0
            });
        });

        renderReports();
    });
}

// Render reports with filters
function renderReports() {
    reportTableBody.innerHTML = "";

    // Apply filters
    let filteredRecords = allRecords.filter((record) => {
        const statusMatch = !statusFilter.value || 
                           record.status.toLowerCase() === statusFilter.value.toLowerCase();
        const admissionMatch = !admissionFilter.value || 
                              record.admissionNo.toLowerCase().includes(admissionFilter.value.toLowerCase());
        return statusMatch && admissionMatch;
    });

    if (filteredRecords.length === 0) {
        reportTableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center; padding: 20px;">No records found</td>
            </tr>
        `;
        return;
    }

    // Sort by timestamp (newest first)
    filteredRecords.sort((a, b) => b.timestamp - a.timestamp);

    filteredRecords.forEach((record) => {
        const statusClass = record.status.toLowerCase() === "borrowed" ? "status-borrowed" : "status-available";
        const statusText = record.status.toLowerCase() === "borrowed" ? "Currently Borrowed" : "Returned";

        const row = `
            <tr>
                <td>${record.studentName}</td>
                <td>${record.admissionNo}</td>
                <td>${record.equipmentName}</td>
                <td>${record.serialNo}</td>
                <td>${record.course}</td>
                <td>${new Date(record.borrowDate).toLocaleDateString()}</td>
                <td>${record.returnDate === "-" ? "-" : new Date(record.returnDate).toLocaleDateString()}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>${record.condition}</td>
            </tr>
        `;
        reportTableBody.innerHTML += row;
    });
}

// Filter event listeners
statusFilter.addEventListener("change", renderReports);
admissionFilter.addEventListener("input", renderReports);

// Export to CSV
exportBtn.addEventListener("click", () => {
    const filteredRecords = allRecords.filter((record) => {
        const statusMatch = !statusFilter.value || 
                           record.status.toLowerCase() === statusFilter.value.toLowerCase();
        const admissionMatch = !admissionFilter.value || 
                              record.admissionNo.toLowerCase().includes(admissionFilter.value.toLowerCase());
        return statusMatch && admissionMatch;
    });

    if (filteredRecords.length === 0) {
        alert("No records to export");
        return;
    }

    let csv = "Student Name,Admission No,Equipment Name,Serial Number,Course,Borrow Date,Return Date,Status,Condition\n";

    filteredRecords.forEach((record) => {
        const statusText = record.status.toLowerCase() === "borrowed" ? "Currently Borrowed" : "Returned";
        csv += `"${record.studentName}","${record.admissionNo}","${record.equipmentName}","${record.serialNo}","${record.course}","${new Date(record.borrowDate).toLocaleDateString()}","${record.returnDate === "-" ? "-" : new Date(record.returnDate).toLocaleDateString()}","${statusText}","${record.condition}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `borrowing-report-${new Date().toLocaleDateString()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
});

// Load reports on page load
loadReports();
