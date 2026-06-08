const borrowForm = document.getElementById("borrowForm");

borrowForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const borrowData = {
    studentName: document.getElementById("studentName").value.trim(),
    admissionNo: document.getElementById("admissionNo").value.trim(),
    equipmentName: document.getElementById("equipmentName").value.trim(),
    serialNo: document.getElementById("serialNo").value.trim(),
    course: document.getElementById("course").value.trim(),
    borrowDate: document.getElementById("borrowDate").value,
    timestamp: Date.now()
  };

  try {
    const db = firebase.database();

    // 1. Save borrow record
    await db.ref("borrowedEquipment").push({
      ...borrowData,
      status: "borrowed"
    });

    // 2. FIND and UPDATE equipment status
    const equipmentRef = db.ref("equipment");

    await new Promise((resolve) => {
      equipmentRef.once("value", (snapshot) => {
        let updatePromises = [];
        snapshot.forEach((child) => {
          const item = child.val();

          if (item.serialNumber === borrowData.serialNo) {
            updatePromises.push(
              db.ref("equipment/" + child.key).update({
                status: "borrowed"
              })
            );
          }
        });
        Promise.all(updatePromises).then(resolve);
      });
    });

    alert("✅ Equipment borrowed successfully!");
    borrowForm.reset();

  } catch (error) {
    console.error(error);
    alert("Failed to borrow equipment");
  }
});